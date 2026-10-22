import React, { useState } from 'react';
import { 
  Package, AlertTriangle, Plus, Download, History, 
  ArrowUpRight, ArrowDownRight, Check, RefreshCw 
} from 'lucide-react';
import { InventoryItem, InventoryMovement } from '../types';
import { adjustInventoryStock, exportToCsv } from '../services/dataStorage';

interface InventoryIntelligenceTabProps {
  inventory: InventoryItem[];
  movements: InventoryMovement[];
  onRefresh: () => void;
}

export const InventoryIntelligenceTab: React.FC<InventoryIntelligenceTabProps> = ({
  inventory,
  movements,
  onRefresh,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'stock' | 'movements'>('stock');
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(inventory[0]?.id || '');
  const [adjustmentDelta, setAdjustmentDelta] = useState<number>(5);
  const [movementType, setMovementType] = useState<InventoryMovement['type']>('restock');
  const [reason, setReason] = useState('Weekly shipment delivery from distributor');

  const lowStockItems = inventory.filter(i => i.quantity <= i.minThreshold);
  const totalStockValuationKes = inventory.reduce((sum, i) => sum + i.quantity * i.costPriceKes, 0);

  const handleAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId) return;
    const delta = movementType === 'restock' ? Math.abs(adjustmentDelta) : -Math.abs(adjustmentDelta);
    adjustInventoryStock(selectedItemId, delta, movementType, reason.trim() || 'Manual adjustment');
    onRefresh();
    setIsAdjusting(false);
  };

  const handleExportCsv = () => {
    const rows = inventory.map(i => ({
      'Item Name': i.name,
      'Brand': i.brand,
      'Category': i.category,
      'Quantity': i.quantity,
      'Unit': i.unit,
      'Min Threshold': i.minThreshold,
      'Cost Price (KES)': i.costPriceKes,
      'Retail Price (KES)': i.retailPriceKes,
      'Total Value (KES)': i.quantity * i.costPriceKes,
      'Last Restocked': i.lastRestocked,
    }));
    exportToCsv(`salonflow_inventory_${new Date().toISOString().split('T')[0]}`, rows);
  };

  return (
    <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 sm:p-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D9]">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#9A7B50] font-semibold">
            Supply Chain & Material Tracking
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#18181B] mt-0.5">
            Inventory Intelligence & Movement Audit
          </h2>
          <p className="text-xs text-[#71717A] mt-1 max-w-2xl leading-relaxed">
            Real-time stock quantities with threshold alerts. Every restock, service consumption, and damaged item is recorded in an immutable movement ledger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 text-xs font-semibold bg-[#FAF8F5] border border-[#E8E2D9] hover:border-[#18181B] text-[#18181B] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Stock CSV</span>
          </button>
          <button
            onClick={() => setIsAdjusting(!isAdjusting)}
            className="px-4 py-2 text-xs font-semibold bg-[#0F281E] hover:bg-[#15382B] text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Restock / Adjust Item</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
            Catalog Products
          </div>
          <div className="text-2xl font-bold font-mono text-[#18181B] mt-1">
            {inventory.length}
          </div>
          <div className="text-[10px] text-[#71717A] mt-0.5">Active hair, beard & spa lines</div>
        </div>

        <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
            Stock Valuation (Cost)
          </div>
          <div className="text-2xl font-bold font-mono text-[#18181B] mt-1">
            KES {totalStockValuationKes.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#71717A] mt-0.5">Wholesale asset worth</div>
        </div>

        <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
            Low Stock Warnings
          </div>
          <div className={`text-2xl font-bold font-mono mt-1 ${
            lowStockItems.length > 0 ? 'text-rose-600' : 'text-emerald-700'
          }`}>
            {lowStockItems.length}
          </div>
          <div className="text-[10px] text-[#71717A] mt-0.5">Items at or below min threshold</div>
        </div>

        <div className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
            Audited Movements
          </div>
          <div className="text-2xl font-bold font-mono text-[#18181B] mt-1">
            {movements.length}
          </div>
          <div className="text-[10px] text-[#71717A] mt-0.5">Historical stock shifts logged</div>
        </div>
      </div>

      {/* Adjust Stock Form */}
      {isAdjusting && (
        <form onSubmit={handleAdjustStock} className="p-5 bg-[#FAF8F5] border border-[#C5A880] rounded-xl space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[#0F281E] flex items-center justify-between">
            <span>Stock Adjustment / Restock Log</span>
            <button type="button" onClick={() => setIsAdjusting(false)} className="text-[#71717A] hover:text-[#18181B]">
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#18181B] mb-1">Select Product</label>
              <select
                value={selectedItemId}
                onChange={e => setSelectedItemId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E8E2D9] rounded-lg text-xs text-[#18181B]"
              >
                {inventory.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.quantity} in stock)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#18181B] mb-1">Movement Type</label>
              <select
                value={movementType}
                onChange={e => setMovementType(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-[#E8E2D9] rounded-lg text-xs text-[#18181B]"
              >
                <option value="restock">Restock (+ Addition)</option>
                <option value="service_usage">Service Usage (- Deduct)</option>
                <option value="damage_waste">Damage / Spillage (- Deduct)</option>
                <option value="audit_adjustment">Audit Correction</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#18181B] mb-1">Quantity Units</label>
              <input
                type="number"
                min={1}
                required
                value={adjustmentDelta}
                onChange={e => setAdjustmentDelta(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#E8E2D9] rounded-lg text-xs font-mono font-bold text-[#18181B]"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-[#18181B] mb-1">Audit Reason / Invoice Ref</label>
              <input
                type="text"
                required
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="e.g. Received new shipment of 10 tubs from Nairobi wholesale"
                className="w-full px-3 py-2 bg-white border border-[#E8E2D9] rounded-lg text-xs text-[#18181B]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-[#0F281E] hover:bg-[#15382B] text-white rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Commit Stock Adjustment
            </button>
          </div>
        </form>
      )}

      {/* Sub Tabs: Stock List vs Movement Ledger */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E8E2D9] pb-2">
          <button
            onClick={() => setActiveSubTab('stock')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'stock'
                ? 'bg-[#0F281E] text-white'
                : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            Product Stock Levels ({inventory.length})
          </button>
          <button
            onClick={() => setActiveSubTab('movements')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'movements'
                ? 'bg-[#0F281E] text-white'
                : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Movement Audit History ({movements.length})</span>
          </button>
        </div>

        {activeSubTab === 'stock' ? (
          <div className="overflow-x-auto border border-[#E8E2D9] rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF8F5] text-[#71717A] border-b border-[#E8E2D9] uppercase font-mono text-[10px]">
                <tr>
                  <th className="px-4 py-3">Product Name</th>
                  <th className="px-4 py-3">Brand & Category</th>
                  <th className="px-4 py-3">Current Qty</th>
                  <th className="px-4 py-3">Min Threshold</th>
                  <th className="px-4 py-3 text-right">Cost (KES)</th>
                  <th className="px-4 py-3 text-right">Retail (KES)</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D9] text-[#18181B]">
                {inventory.map(item => {
                  const isLow = item.quantity <= item.minThreshold;
                  return (
                    <tr key={item.id} className="hover:bg-[#FAF8F5]">
                      <td className="px-4 py-3 font-semibold text-[#18181B]">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-[#71717A]">
                        {item.brand} · {item.category}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-sm">
                        {item.quantity} <span className="text-[11px] font-normal text-[#71717A]">{item.unit}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[#71717A]">
                        {item.minThreshold}
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        KES {item.costPriceKes.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-semibold">
                        KES {item.retailPriceKes.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isLow ? (
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                            Low Stock
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Adequate
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto border border-[#E8E2D9] rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF8F5] text-[#71717A] border-b border-[#E8E2D9] uppercase font-mono text-[10px]">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Movement Type</th>
                  <th className="px-4 py-3">Change</th>
                  <th className="px-4 py-3">Resulting Qty</th>
                  <th className="px-4 py-3">Reason / Audit Trail</th>
                  <th className="px-4 py-3">Recorded By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D9] text-[#18181B]">
                {movements.map(mov => (
                  <tr key={mov.id} className="hover:bg-[#FAF8F5]">
                    <td className="px-4 py-3 font-mono text-[11px] text-[#71717A]">
                      {new Date(mov.timestamp).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 font-semibold">{mov.itemName}</td>
                    <td className="px-4 py-3 capitalize text-[#52525B]">
                      {mov.type.replace('_', ' ')}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold">
                      {mov.quantityDelta > 0 ? (
                        <span className="text-emerald-700">+{mov.quantityDelta}</span>
                      ) : (
                        <span className="text-rose-600">{mov.quantityDelta}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold">
                      {mov.resultingQuantity}
                    </td>
                    <td className="px-4 py-3 text-[#52525B]">
                      {mov.reason}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-[#71717A]">
                      {mov.recordedBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
