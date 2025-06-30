"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2, Settings, Database, FileText, User, Users, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const Sidebar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navItemClasses = (path: string) =>
    cn(
      "flex items-center px-4 py-2 rounded-md transition-colors",
      "hover:bg-[#223366] hover:text-white",
      isActive(path) && "bg-[#223366] text-white"
    );

  return (
    <aside className="w-64 bg-[#0a1a36] text-white border-r border-[#13294b] flex flex-col h-[calc(100vh-56px)]">
      <ScrollArea className="flex-1">
        <nav className="space-y-6 p-4">
          <div>
            <h3 className="text-xs uppercase text-white/70 font-semibold mb-2 px-4">Main</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/" className={navItemClasses('/')}> <BarChart2 className="mr-3 h-5 w-5" /> <span>Dashboard</span> </Link>
              </li>
              <li>
                <Link href="/equipment-classes" className={navItemClasses('/equipment-classes')}> <Database className="mr-3 h-5 w-5" /> <span>Equipment Class</span> </Link>
              </li>
              <li>
                <Link href="/equipment-types" className={navItemClasses('/equipment-types')}> <Database className="mr-3 h-5 w-5" /> <span>Equipment Boundary</span> </Link>
              </li>
              <li>
                <Link href="/equipment" className={navItemClasses('/equipment')}> <Database className="mr-3 h-5 w-5" /> <span>Equipment List</span> </Link>
              </li>
              <li>
                <Link href="/products" className={navItemClasses('/products')}> <Database className="mr-3 h-5 w-5" /> <span>Medium</span> </Link>
              </li>
              <li>
                <Link href="/components" className={navItemClasses('/components')}> <Settings className="mr-3 h-5 w-5" /> <span>Components</span> </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs uppercase text-white/70 font-semibold mb-2 px-4">Equipment Management</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/manufacturers" className={navItemClasses('/manufacturers')}> <FileText className="mr-3 h-5 w-5" /> <span>Manufacturers</span> </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs uppercase text-white/70 font-semibold mb-2 px-4">Risk Analysis</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/fmea-analysis" className={navItemClasses('/fmea-analysis')}> <AlertTriangle className="mr-3 h-5 w-5" /> <span>FMEA Analysis</span> </Link>
              </li>
              <li>
                <Link href="/failure-modes" className={navItemClasses('/failure-modes')}> <FileText className="mr-3 h-5 w-5" /> <span>Failure Modes</span> </Link>
              </li>
              <li>
                <Link href="/failure-mechanisms" className={navItemClasses('/failure-mechanisms')}> <Settings className="mr-3 h-5 w-5" /> <span>Failure Mechanisms</span> </Link>
              </li>
              <li>
                <Link href="/failure-causes" className={navItemClasses('/failure-causes')}> <FileText className="mr-3 h-5 w-5" /> <span>Failure Causes</span> </Link>
              </li>
              <li>
                <Link href="/spare-parts" className={navItemClasses('/spare-parts')}> <Settings className="mr-3 h-5 w-5" /> <span>Spare Parts</span> </Link>
              </li>
              <li>
                <Link href="/tasks" className={navItemClasses('/tasks')}> <FileText className="mr-3 h-5 w-5" /> <span>Tasks</span> </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs uppercase text-white/70 font-semibold mb-2 px-4">Admin</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/users" className={navItemClasses('/users')}> <User className="mr-3 h-5 w-5" /> <span>Users</span> </Link>
              </li>
              <li>
                <Link href="/teams" className={navItemClasses('/teams')}> <Users className="mr-3 h-5 w-5" /> <span>Teams</span> </Link>
              </li>
              <li>
                <Link href="/settings" className={navItemClasses('/settings')}> <Settings className="mr-3 h-5 w-5" /> <span>Settings</span> </Link>
              </li>
            </ul>
          </div>
        </nav>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar; 