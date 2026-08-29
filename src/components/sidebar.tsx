'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Gift, 
  Users, 
  Stethoscope, 
  Paperclip, 
  BarChart2, 
  TrendingUp, 
  Receipt, 
  FileText, 
  X, 
  Building, 
  Bookmark, 
  Settings as SettingsIcon, 
  Mail, 
  LogOut,
  Infinity
} from 'lucide-react';
import { logout } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();

  const isCurrent = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const navItems = [
    {
      group: 'OVERVIEW',
      items: [
        { name: 'Dashboard', href: '/', icon: Home, exact: true },
        { name: 'Refer & Earn', href: '#', icon: Gift },
      ]
    },
    {
      group: 'PATIENTS',
      items: [
        { name: 'Patients', href: '/', icon: Users }, // Typically this would be /patients, but in this app the home is the patients directory
        { name: 'Visits', href: '#', icon: Stethoscope },
        { name: 'Prescriptions', href: '#', icon: Paperclip },
      ]
    },
    {
      group: 'FINANCE',
      items: [
        { name: 'Accounting', href: '#', icon: BarChart2 },
        { name: 'Reports', href: '#', icon: TrendingUp },
        { name: 'Expenses', href: '#', icon: Receipt },
        { name: 'Tax Calculator', href: '#', icon: FileText },
      ]
    },
    {
      group: 'DATA MANAGEMENT',
      items: [
        { 
          name: 'Close OPD', 
          href: '#', 
          icon: X, 
          actionBtn: true 
        },
        { name: 'All Data', href: '#', icon: FileText },
      ]
    },
    {
      group: 'SETTINGS',
      items: [
        { name: 'My Clinics', href: '/clinics', icon: Building },
        { name: 'Rx Templates', href: '#', icon: Bookmark },
        { name: 'Settings', href: '/settings', icon: SettingsIcon },
        { name: 'Contact Support', href: '#', icon: Mail },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-slate-200 text-slate-600 rounded-full p-1.5 flex items-center justify-center">
          <Infinity className="w-6 h-6" />
        </div>
        <span className="font-bold text-xl tracking-wide text-slate-800 dark:text-slate-100 uppercase">OPDPRO</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-6 pb-6">
        {navItems.map((section, idx) => (
          <div key={idx}>
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-2">
              {section.group}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                let active = false;
                
                // Extremely simple active path logic
                if (item.exact) {
                  active = pathname === item.href;
                } else if (item.href !== '#') {
                  active = isCurrent(item.href);
                }
                
                if (item.actionBtn) {
                  return (
                    <li key={itemIdx} className="mb-2">
                      <button 
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-red-200 text-red-500 bg-red-50/50 hover:bg-red-50 transition-colors"
                        onClick={() => console.log('Placeholder action')}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{item.name}</span>
                      </button>
                    </li>
                  );
                }

                return (
                  <li key={itemIdx}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                        active 
                          ? "bg-indigo-100/50 text-indigo-700 font-medium dark:bg-indigo-900/30 dark:text-indigo-400" 
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                      )}
                    >
                      <Icon className={cn("w-5 h-5", active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300")} />
                      <span className="text-sm">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Profile & Sign Out */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 mb-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
            DA
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-none mb-1">DOCTOR AMMAD</span>
            <span className="text-xs text-slate-500">Doctor</span>
          </div>
        </div>

        <form action={logout}>
          <button 
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sign out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
