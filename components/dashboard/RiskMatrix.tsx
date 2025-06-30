"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RiskItem {
  id: string;
  name: string;
  severity: number;
  probability: number;
  riskScore: number;
  category: string;
}

const RiskMatrix = () => {
  return (
    <div className="overflow-x-auto">
      <table className="border-2 border-black border-collapse min-w-[900px] text-xs font-sans select-none">
        <thead>
          {/* Top Headers */}
          <tr>
            <th rowSpan={7} colSpan={3} className="border border-black bg-gray-400 font-bold text-center align-middle w-14">Impact</th>
          </tr>
          <tr>
            <th colSpan={2} className="border border-black bg-gray-400 font-bold text-center max-w-[100px]">Consequence</th>
            {['1\nInsignificant', '2\nMinor', '3\nModerate', '4\nMajor', '5\nCatastrophic'].map((text, i) => (
              <th key={i} className="border border-black bg-gray-300 font-bold text-center whitespace-pre-line">{text}</th>
            ))}
          </tr>
          <tr>
            <th colSpan={2} className="border border-black bg-gray-400 font-bold text-center max-w-[100px]">People (Health and Safety)</th>
            {['Slight Injury', 'Minor Injury', 'Major Injury', 'Single Fatality', 'Multiple Fatalities'].map((text, i) => (
              <th key={i} className="border border-black text-center">{text}</th>
            ))}
          </tr>
          <tr>
            <th colSpan={2} className="border border-black bg-gray-400 font-bold text-center max-w-[100px]">Environment</th>
            {['Slight Impact', 'Minor Impact', 'Localized Impact', 'Major Impact', 'Massive Impact'].map((text, i) => (
              <th key={i} className="border border-black text-center">{text}</th>
            ))}
          </tr>
          <tr>
            <th rowSpan={2} className="border border-black bg-gray-400 font-bold text-center align-middle max-w-[100px]">Asset Damage</th>
            <th className="border border-black bg-gray-400 font-bold text-center">USD</th>
            {['Slight Damage\n(<25K)', 'Minor Damage\n(25-100k)', 'Local Damage\n(100K-1M)', 'Major Damage\n(1-10M)', 'Extensive Damage\n(>10M)'].map((text, i) => (
              <th key={i} className="border border-black text-center whitespace-pre-line">{text}</th>
            ))}
          </tr>
          <tr>
            <th className="border border-black bg-gray-400 font-bold text-center">RM</th>
            {['Slight Damage\n(<75K)', 'Minor Damage\n(75-300k)', 'Local Damage\n(300K-3M)', 'Major Damage\n(3-30M)', 'Extensive Damage\n(>30M)'].map((text, i) => (
              <th key={i} className="border border-black text-center whitespace-pre-line">{text}</th>
            ))}
          </tr>
          <tr>
            <th colSpan={2} className="border border-black bg-gray-400 font-bold text-center max-w-[100px]">Reputation</th>
            <th className="border border-black text-center">Slight Impact</th>
            <th className="border border-black text-center">Limited Impact </th>
            <th className="border border-black text-center">Considerable Impact</th>
            <th className="border border-black text-center">National Impact</th>
            <th className="border border-black text-center">International Impact</th>
          </tr>
        </thead>
        <tbody>
          {/* Likelihood / Frequency vertical header */}
          <tr>
            <td rowSpan={6} className="border border-black bg-orange-200 font-bold text-center align-middle w-6" style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}>Likelihood/requency</td>
            <td className="border border-black bg-orange-200 font-bold text-center">E<br />Almost Certain</td>
            <td className="border border-black max-w-[120px]">Happened several time per year in plant</td>
            <td colSpan={2} className="border border-black text-center">0 - 0.5 Years</td>
            <td className="border border-black bg-yellow-400 font-bold text-center">E1</td>
            <td className="border border-black bg-yellow-500 font-bold text-center">E2</td>
            <td className="border border-black bg-red-600 text-white font-bold text-center">E3</td>
            <td className="border border-black bg-red-600 text-white font-bold text-center">E4</td>
            <td className="border border-black bg-red-600 text-white font-bold text-center">E5</td>
          </tr>
          <tr>
            <td className="border border-black bg-orange-200 font-bold text-center">D<br />Likely</td>
            <td className="border border-black max-w-[120px]">Happened several time per year in POPU (&gt;1)</td>
            <td colSpan={2} className="border border-black text-center max-w-[100px]">0.5 - 4 Years</td>
            <td className="border border-black bg-green-700 text-white font-bold text-center">D1</td>
            <td className="border border-black bg-yellow-400 font-bold text-center">D2</td>
            <td className="border border-black bg-yellow-500 font-bold text-center">D3</td>
            <td className="border border-black bg-red-600 text-white font-bold text-center">D4</td>
            <td className="border border-black bg-red-600 text-white font-bold text-center">D5</td>
          </tr>
          <tr>
            <td className="border border-black bg-orange-200 font-bold text-center">C<br />Possible</td>
            <td className="border border-black max-w-[120px]">Incident has occurred in OPU (1 Time)</td>
            <td colSpan={2} className="border border-black text-center max-w-[100px]">4 - 10 Years</td>
            <td className="border border-black bg-green-700 text-white font-bold text-center">C1</td>
            <td className="border border-black bg-green-700 text-white font-bold text-center">C2</td>
            <td className="border border-black bg-yellow-400 font-bold text-center">C3</td>
            <td className="border border-black bg-yellow-500 font-bold text-center">C4</td>
            <td className="border border-black bg-red-600 text-white font-bold text-center">C5</td>
          </tr>
          <tr>
            <td className="border border-black bg-orange-200 font-bold text-center">B<br />Unlikely</td>
            <td className="border border-black max-w-[120px]">Heard of incident in industry</td>
            <td colSpan={2} className="border border-black text-center max-w-[100px]">10 - 20 Years</td>
            <td className="border border-black bg-green-700 text-white font-bold text-center">B1</td>
            <td className="border border-black bg-green-700 text-white font-bold text-center">B2</td>
            <td className="border border-black bg-green-700 text-white font-bold text-center">B3</td>
            <td className="border border-black bg-yellow-400 font-bold text-center">B4</td>
            <td className="border border-black bg-yellow-400 font-bold text-center">B5</td>
          </tr>
          <tr>
            <td className="border border-black bg-orange-200 font-bold text-center">A<br />Negligible</td>
            <td className="border border-black max-w-[120px]">Never heard of in industry</td>
            <td colSpan={2} className="border border-black text-center max-w-[100px]">&gt;20 Years</td>
            <td className="border border-black bg-green-700 text-white font-bold text-center">A1</td>
            <td className="border border-black bg-green-700 text-white font-bold text-center">A2</td>
            <td className="border border-black bg-green-700 text-white font-bold text-center">A3</td>
            <td className="border border-black bg-yellow-400 font-bold text-center">A4</td>
            <td className="border border-black bg-yellow-400 font-bold text-center">A5</td>
          </tr>
        </tbody>
      </table>
      <div className="flex gap-4 mt-2 text-xs">
        <div className="flex items-center gap-1"><span className="inline-block w-4 h-4 bg-green-700 rounded"></span>Low</div>
        <div className="flex items-center gap-1"><span className="inline-block w-4 h-4 bg-yellow-400 rounded"></span>Limited</div>
        <div className="flex items-center gap-1"><span className="inline-block w-4 h-4 bg-yellow-500 rounded"></span>Considerable</div>
        <div className="flex items-center gap-1"><span className="inline-block w-4 h-4 bg-red-600 rounded"></span>National</div>
        <div className="flex items-center gap-1"><span className="inline-block w-4 h-4 bg-red-800 rounded"></span>International</div>
      </div>
    </div>
  );
};

export default RiskMatrix; 