import React, { useState } from 'react';
import { 
  DollarSign, TrendingDown, TrendingUp, Plus, Download, 
  Trash2, Calendar, FileText, Check, AlertCircle, PieChart 
} from 'lucide-react';
import { ExpenseCategory, ExpenseItem } from '../types';
import { addExpense, exportToCsv } from '../services/dataStorage';

interface ExpensesAndProfitTabProps {
  expenses: ExpenseItem[];
  totalGrossSalesKes: number;
  totalCommissionsKes: number;
  onRefresh: () => void;
}

export const ExpensesAndProfitTab: React.FC<ExpensesAndProfitTabProps> = ({
  expenses,
  totalGrossSalesKes,
  totalCommissionsKes,
  onRefresh,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Barber & Salon Supplies');
  const [amountKes, setAmountKes] = useState<number>(3500);
  const [receiptRef, setReceiptRef] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const totalExpensesKes = expenses.reduce((sum, e) => sum + e.amountKes, 0);
  const netOperatingProfitKes = totalGrossSalesKes - totalCommissionsKes - totalExpensesKes;

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amountKes <= 0) return;

    const newExp: ExpenseItem = {
      id: `exp-${Date.now()}`,
      category,
      title: title.trim(),
      amountKes,
      date,
      receiptRef: receiptRef.trim() || undefined,
      notes: notes.trim() || undefined,
      recordedBy: 'Owner',
    };

    addExpense(newExp);
    onRefresh();
    setIsAdding(false);
    setTitle('');
    setReceiptRef('');
    setNotes('');
  };

  const handleExportCsv = () => {
    const rows = expenses.map(e => ({
      'Expense ID': e.id,
      'Date': e.date,
      'Category': e.category,
      'Title': e.title,
      'Amount (KES)': e.amountKes,
      'Receipt Ref': e.receiptRef || 'N/A',
      'Notes': e.notes || '',
      'Recorded By': e.recordedBy,
    }));
    exportToCsv(`salonflow_expenses_${new Date().toISOString().split('T')[0]}`, rows);
  };

  return (
    <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 sm:p-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D9]">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#9A7B50] font-semibold">
            Financial Health & Net Operating Cashflow
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#18181B] mt-0.5">
            Operational Expenses & Net Profit Ledger
          </h2>
          <p className="text-xs text-[#71717A] mt-1 max-w-2xl leading-relaxed">
            True net profit accounting: Salon Revenue minus Artisan Commissions minus Operating Expenses (Rent, KPLC Power, Barber Supplies, Generator Fuel).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 text-xs font-semibold bg-[#FAF8F5] border border-[#E8E2D9] hover:border-[#18181B] text-[#18181B] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-2 text-xs font-semibold bg-[#0F281E] hover:bg-[#15382B] text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* 4 Financial Strips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
            Gross Sales (KES)
          </div>
          <div className="text-2xl font-bold font-mono text-[#18181B] mt-1">
            KES {totalGrossSalesKes.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#71717A] mt-0.5">Till, Cash & Card Settled</div>
        </div>

        <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
            Artisan Commissions
          </div>
          <div className="text-2xl font-bold font-mono text-amber-900 mt-1">
            - KES {totalCommissionsKes.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#71717A] mt-0.5">Stylist service shares</div>
        </div>

        <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
            Total Operating Costs
          </div>
          <div className="text-2xl font-bold font-mono text-rose-800 mt-1">
            - KES {totalExpensesKes.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#71717A] mt-0.5">Rent, KPLC, Supplies</div>
        </div>

        <div className="bg-[#0F281E] text-white rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#C5A880]">
            True Net Salon Profit
          </div>
          <div className={`text-2xl font-bold font-mono mt-1 ${
            netOperatingProfitKes >= 0 ? 'text-emerald-300' : 'text-rose-300'
          }`}>
            KES {netOperatingProfitKes.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#E6E0D6] mt-0.5">Owner take-home balance</div>
        </div>
      </div>

      {/* Record Expense Modal / Dropdown */}
      {isAdding && (
        <form onSubmit={handleCreateExpense} className="p-5 bg-[#FAF8F5] border border-[#C5A880] rounded-xl space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[#0F281E] flex items-center justify-between">
            <span>New Expense Entry</span>
            <button type="button" onClick={() => setIsAdding(false)} className="text-[#71717A] hover:text-[#18181B]">
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#18181B] mb-1">Expense Description</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Kenya Power token recharge, Plaza suite rent, Tea leaves"
                className="w-full px-3 py-2 bg-white border border-[#E8E2D9] rounded-lg text-xs text-[#18181B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#18181B] mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2 bg-white border border-[#E8E2D9] rounded-lg text-xs text-[#18181B]"
              >
                <option value="Rent & Space">Rent & Space</option>
                <option value="Barber & Salon Supplies">Barber & Salon Supplies</option>
                <option value="Utilities & Generator">Utilities & Generator</option>
                <option value="Staff Refreshments">Staff Refreshments</option>
                <option value="Marketing & Software">Marketing & Software</option>
                <option value="Maintenance & Cleaning">Maintenance & Cleaning</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#18181B] mb-1">Amount (KES)</label>
              <input
                type="number"
                required
                min={1}
                value={amountKes}
                onChange={e => setAmountKes(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#E8E2D9] rounded-lg text-xs font-mono font-bold text-[#18181B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#18181B] mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E8E2D9] rounded-lg text-xs text-[#18181B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#18181B] mb-1">Receipt / M-Pesa Ref</label>
              <input
                type="text"
                value={receiptRef}
                onChange={e => setReceiptRef(e.target.value)}
                placeholder="e.g. RKL902341"
                className="w-full px-3 py-2 bg-white border border-[#E8E2D9] rounded-lg text-xs font-mono text-[#18181B]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-[#0F281E] hover:bg-[#15382B] text-white rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Save Expense Record
            </button>
          </div>
        </form>
      )}

      {/* Expenses Ledger Table */}
      <div className="space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#18181B]">
          Recorded Operating Expenses ({expenses.length})
        </div>
        <div className="overflow-x-auto border border-[#E8E2D9] rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF8F5] text-[#71717A] border-b border-[#E8E2D9] uppercase font-mono text-[10px]">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Expense Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Receipt Ref</th>
                <th className="px-4 py-3 text-right">Amount (KES)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9] text-[#18181B]">
              {expenses.map(exp => (
                <tr key={exp.id} className="hover:bg-[#FAF8F5]">
                  <td className="px-4 py-3 font-mono text-[11px] text-[#71717A]">{exp.date}</td>
                  <td className="px-4 py-3 font-medium">
                    <div>{exp.title}</div>
                    {exp.notes && <div className="text-[10px] text-[#71717A]">{exp.notes}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-[#52525B]">
                      {exp.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[#71717A]">
                    {exp.receiptRef || '—'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold">
                    KES {exp.amountKes.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
