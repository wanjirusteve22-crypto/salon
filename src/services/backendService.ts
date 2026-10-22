import { Appointment, CustomerRecord, Service, StaffMember } from '../types';
import { 
  getSupabaseClient, 
  isSupabaseConfigured, 
  DEFAULT_BUSINESS_ID,
  getActiveBusinessId 
} from './supabaseClient';
import { 
  getStoredAppointments, 
  saveAppointment, 
  updateAppointmentStatus as updateStoredAppointmentStatus,
  generateBookingRef
} from './dataStorage';

export interface TimeSlotInterval {
  start: string; // "10:00 AM" or "10:00:00"
  end: string;   // "11:00 AM" or "11:00:00"
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictingAppointment?: Appointment;
  message?: string;
}

export interface RecordedSaleRecord {
  id: string;
  businessId: string;
  appointmentId?: string;
  serviceId?: string;
  serviceName: string;
  employeeId?: string;
  employeeName: string;
  customerName: string;
  amountKes: number;
  commissionRate: number;
  commissionKes: number;
  netBusinessKes: number;
  paymentMethod: string;
  mpesaReference?: string;
  timestamp: string;
}

/**
 * Converts "10:30 AM" into minutes from midnight for exact overlap math
 */
export const timeToMinutes = (timeStr: string): number => {
  const clean = timeStr.trim().toUpperCase();
  const match = clean.match(/(\d+):(\d+)\s*(AM|PM)?/);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const modifier = match[3];

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

/**
 * Calculates end time string from start time and duration in minutes
 */
export const calculateEndTime = (startTime: string, durationMin: number): string => {
  const startMins = timeToMinutes(startTime);
  const endMins = startMins + durationMin;
  const endHours24 = Math.floor(endMins / 60) % 24;
  const endMinutes = endMins % 60;
  const period = endHours24 >= 12 ? 'PM' : 'AM';
  const endHours12 = endHours24 % 12 || 12;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(endHours12)}:${pad(endMinutes)} ${period}`;
};

/**
 * Detects whether two time intervals overlap
 */
export const doTimesOverlap = (
  startA: string, durationA: number,
  startB: string, durationB: number
): boolean => {
  const aStart = timeToMinutes(startA);
  const aEnd = aStart + durationA;
  const bStart = timeToMinutes(startB);
  const bEnd = bStart + durationB;
  return Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
};

class BackendService {
  /**
   * Check for employee booking conflicts on a given date and time window
   */
  async checkBookingConflict(
    employeeId: string,
    date: string,
    startTime: string,
    durationMin: number,
    excludeAppointmentId?: string
  ): Promise<ConflictCheckResult> {
    const supabase = getSupabaseClient();
    
    // 1. If Supabase is connected, query database
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('employee_id', employeeId)
          .eq('appointment_date', date)
          .in('status', ['scheduled', 'in_chair']);

        if (!error && data) {
          const conflict = data.find(apt => {
            if (excludeAppointmentId && apt.id === excludeAppointmentId) return false;
            return doTimesOverlap(startTime, durationMin, apt.start_time, apt.duration_min);
          });

          if (conflict) {
            return {
              hasConflict: true,
              message: `Stylist already has booking ${conflict.booking_ref} scheduled from ${conflict.start_time} to ${conflict.end_time}.`,
            };
          }
        }
      } catch (err) {
        console.warn('Supabase conflict query failed, falling back to local evaluation', err);
      }
    }

    // 2. Local State validation
    const localAppointments = getStoredAppointments();
    const conflict = localAppointments.find(apt => {
      if (apt.staffId !== employeeId) return false;
      if (apt.date !== date) return false;
      if (apt.status === 'cancelled' || apt.status === 'completed') return false;
      if (excludeAppointmentId && apt.id === excludeAppointmentId) return false;

      // Extract duration (default 60 mins if not stored)
      const aptDuration = 60;
      return doTimesOverlap(startTime, durationMin, apt.timeSlot, aptDuration);
    });

    if (conflict) {
      return {
        hasConflict: true,
        conflictingAppointment: conflict,
        message: `Booking conflict: Master artisan is already reserved at ${conflict.timeSlot} on ${date} (${conflict.serviceName}).`,
      };
    }

    return { hasConflict: false };
  }

  /**
   * Create a new appointment with strict validation and audit logging
   */
  async createAppointment(params: {
    businessId?: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    serviceId: string;
    serviceName: string;
    staffId: string;
    staffName: string;
    date: string;
    timeSlot: string;
    durationMin: number;
    priceKes: number;
    paymentMethod: Appointment['paymentMethod'];
    notes?: string;
  }): Promise<{ success: boolean; appointment?: Appointment; error?: string }> {
    // 1. Conflict Validation
    const conflictCheck = await this.checkBookingConflict(
      params.staffId,
      params.date,
      params.timeSlot,
      params.durationMin
    );

    if (conflictCheck.hasConflict) {
      return {
        success: false,
        error: conflictCheck.message || 'The selected stylist is not available at this time slot.',
      };
    }

    const bookingRef = generateBookingRef();
    const endTime = calculateEndTime(params.timeSlot, params.durationMin);

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      bookingRef,
      customerName: params.customerName.trim(),
      customerPhone: params.customerPhone.trim(),
      customerEmail: params.customerEmail?.trim() || undefined,
      serviceId: params.serviceId,
      serviceName: params.serviceName,
      staffId: params.staffId,
      staffName: params.staffName,
      date: params.date,
      timeSlot: params.timeSlot,
      status: 'scheduled',
      priceKes: params.priceKes,
      paymentMethod: params.paymentMethod,
      paymentStatus: params.paymentMethod === 'mpesa_till' ? 'pending' : 'unpaid',
      notes: params.notes?.trim() || undefined,
      createdAt: new Date().toISOString(),
      isDemo: !isSupabaseConfigured(),
    };

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const resolvedBusinessId = params.businessId || await getActiveBusinessId();
        const { data, error } = await supabase.from('appointments').insert({
          business_id: resolvedBusinessId,
          booking_ref: bookingRef,
          customer_name: params.customerName,
          customer_phone: params.customerPhone,
          customer_email: params.customerEmail,
          service_id: params.serviceId,
          employee_id: params.staffId,
          appointment_date: params.date,
          start_time: params.timeSlot,
          end_time: endTime,
          duration_min: params.durationMin,
          status: 'scheduled',
          price_kes: params.priceKes,
          payment_method: params.paymentMethod,
          payment_status: 'pending',
          notes: params.notes,
        }).select().single();

        if (error) {
          console.error('Supabase appointment insert error:', error);
        } else if (data) {
          newAppointment.id = data.id;
        }
      } catch (err) {
        console.error('Failed to insert into Supabase, saving to local store', err);
      }
    }

    // Always update local store to guarantee UI responsiveness
    saveAppointment(newAppointment);

    return {
      success: true,
      appointment: newAppointment,
    };
  }

  /**
   * Update appointment status with automatic sales ledger logging
   */
  async updateStatus(
    appointmentId: string,
    newStatus: Appointment['status'],
    mpesaRef?: string,
    staffCommissionRate = 0.35
  ): Promise<Appointment[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from('appointments')
          .update({
            status: newStatus,
            ...(mpesaRef ? { mpesa_reference: mpesaRef, payment_status: 'paid' } : {}),
            updated_at: new Date().toISOString(),
          })
          .eq('id', appointmentId);
      } catch (err) {
        console.warn('Supabase status update error:', err);
      }
    }

    return updateStoredAppointmentStatus(appointmentId, newStatus, mpesaRef);
  }

  /**
   * Calculate documented sales from completed services & recorded sales:
   * Rule:
   * 1. Completed & Paid appointment triggers a sale.
   * 2. Commission = Price * CommissionRate (e.g. 35%).
   * 3. Net Business = Price - Commission.
   */
  calculateSalesLedger(appointments: Appointment[], staff: StaffMember[]): {
    totalSalesKes: number;
    totalCommissionsKes: number;
    netBusinessKes: number;
    salesRecords: RecordedSaleRecord[];
  } {
    const completedOrPaid = appointments.filter(
      a => a.status === 'completed' || a.paymentStatus === 'paid'
    );

    const staffMap = new Map(staff.map(s => [s.id, s]));

    const salesRecords: RecordedSaleRecord[] = completedOrPaid.map(apt => {
      const staffMember = staffMap.get(apt.staffId);
      const commissionRate = staffMember ? staffMember.commissionRate : 0.35;
      const commissionKes = Math.round(apt.priceKes * commissionRate);
      const netBusinessKes = apt.priceKes - commissionKes;

      return {
        id: `sale-${apt.id}`,
        businessId: DEFAULT_BUSINESS_ID,
        appointmentId: apt.id,
        serviceId: apt.serviceId,
        serviceName: apt.serviceName,
        employeeId: apt.staffId,
        employeeName: apt.staffName,
        customerName: apt.customerName,
        amountKes: apt.priceKes,
        commissionRate,
        commissionKes,
        netBusinessKes,
        paymentMethod: apt.paymentMethod,
        mpesaReference: apt.mpesaRef,
        timestamp: apt.createdAt,
      };
    });

    const totalSalesKes = salesRecords.reduce((acc, r) => acc + r.amountKes, 0);
    const totalCommissionsKes = salesRecords.reduce((acc, r) => acc + r.commissionKes, 0);
    const netBusinessKes = totalSalesKes - totalCommissionsKes;

    return {
      totalSalesKes,
      totalCommissionsKes,
      netBusinessKes,
      salesRecords,
    };
  }
}

export const backendService = new BackendService();
