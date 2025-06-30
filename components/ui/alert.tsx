import React from 'react';

export function Alert({ children, variant = 'default', className = '' }: { children: React.ReactNode, variant?: 'default' | 'destructive', className?: string }) {
  const base = 'rounded-md p-4 border flex flex-col gap-1';
  const color = variant === 'destructive'
    ? 'bg-red-50 border-red-200 text-red-800'
    : 'bg-blue-50 border-blue-200 text-blue-800';
  return <div className={`${base} ${color} ${className}`}>{children}</div>;
}

export function AlertTitle({ children }: { children: React.ReactNode }) {
  return <div className="font-bold text-sm mb-1">{children}</div>;
}

export function AlertDescription({ children }: { children: React.ReactNode }) {
  return <div className="text-xs">{children}</div>;
}

export default Alert; 