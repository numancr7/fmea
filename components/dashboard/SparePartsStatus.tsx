"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SparePart {
  name: string;
  code: string;
  currentStock: number;
  minStock: number;
}

interface SparePartsStatusProps {
  statusCounts: { approved: number; pending: number; rejected: number };
  lowStock: SparePart[];
}

const SparePartsStatus: React.FC<SparePartsStatusProps> = ({ statusCounts, lowStock }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-2">Spare Parts Status</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="text-2xl font-bold">{statusCounts.approved}</div>
          <div className="text-xs text-gray-500">Approved</div>
        </div>
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="text-2xl font-bold">{statusCounts.pending}</div>
          <div className="text-xs text-gray-500">Pending</div>
        </div>
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="text-2xl font-bold">{statusCounts.rejected}</div>
          <div className="text-xs text-gray-500">Rejected</div>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="border border-red-300 bg-red-50 text-red-700 rounded p-3 mb-4">
          <div className="font-semibold">Low Stock Warning</div>
          <div className="text-xs">{lowStock.length} spare part(s) below minimum stock level</div>
        </div>
      )}

      <div>
        <div className="font-semibold text-sm mb-2">Low Stock Items</div>
        {lowStock.map((item) => (
          <div key={item.code} className="bg-gray-100 rounded p-3 mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-xs text-gray-500">{item.code}</div>
            </div>
            <div className="text-xs text-right mt-1 sm:mt-0">
              <span className="font-semibold">{item.currentStock}</span>
              <span className="text-gray-400"> / {item.minStock}</span>
              <span className="ml-1 text-gray-400">Current / Min</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SparePartsStatus; 