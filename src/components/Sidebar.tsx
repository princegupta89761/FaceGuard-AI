import React from 'react';
import {
  LayoutDashboard,
  Camera,
  CalendarCheck,
  History,
  Users,
  Building,
  Clock,
  Smile,
  ShieldAlert,
  Settings,
  Code2,
  CheckCircle2,
} from 'lucide-react';
import { ActiveScreen } from '../types';

interface SidebarProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  registeredCount: number;
  todayAttendanceCount: number;
  unknownAlertCount: number;
  activeVisitorsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeScreen,
  onNavigate,
  registeredCount,
  todayAttendanceCount,
  unknownAlertCount,
  activeVisitorsCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveScreen,
      label: 'Dashboard',
      icon: LayoutDashboard,
      iconColor: 'text-indigo-600',
      badge: null,
    },
    {
      id: 'live-recognition' as ActiveScreen,
      label: 'Live Face Recognition',
      icon: Camera,
      iconColor: 'text-sky-600',
      badge: 'LIVE',
      badgeColor: 'bg-sky-100 text-sky-700 font-bold',
    },
    {
      id: 'attendance' as ActiveScreen,
      label: 'Attendance System',
      icon: CalendarCheck,
      iconColor: 'text-emerald-600',
      badge: todayAttendanceCount > 0 ? String(todayAttendanceCount) : null,
      badgeColor: 'bg-emerald-100 text-emerald-700 font-bold',
    },
    {
      id: 'registered-users' as ActiveScreen,
      label: 'Registered Faces',
      icon: Users,
      iconColor: 'text-blue-600',
      badge: String(registeredCount),
      badgeColor: 'bg-blue-100 text-blue-700 font-bold',
    },
    {
      id: 'visitors' as ActiveScreen,
      label: 'Visitor Management',
      icon: Building,
      iconColor: 'text-amber-600',
      badge: activeVisitorsCount > 0 ? `${activeVisitorsCount} Onsite` : null,
      badgeColor: 'bg-amber-100 text-amber-700 font-bold',
    },
    {
      id: 'timeline' as ActiveScreen,
      label: 'Recognition Timeline',
      icon: Clock,
      iconColor: 'text-teal-600',
      badge: null,
    },
    {
      id: 'emotion-analytics' as ActiveScreen,
      label: 'Emotion Analytics',
      icon: Smile,
      iconColor: 'text-purple-600',
      badge: 'AI',
      badgeColor: 'bg-purple-100 text-purple-700 font-bold',
    },
    {
      id: 'security-center' as ActiveScreen,
      label: 'Security Alert Center',
      icon: ShieldAlert,
      iconColor: 'text-rose-600',
      badge: unknownAlertCount > 0 ? `${unknownAlertCount} Alerts` : null,
      badgeColor: 'bg-rose-100 text-rose-700 font-bold',
    },
    {
      id: 'history' as ActiveScreen,
      label: 'Snapshots & Audit Log',
      icon: History,
      iconColor: 'text-slate-600',
      badge: null,
    },
    {
      id: 'settings' as ActiveScreen,
      label: 'System Settings',
      icon: Settings,
      iconColor: 'text-slate-600',
      badge: null,
    },
    {
      id: 'python-hub' as ActiveScreen,
      label: 'Python & SQLite Hub',
      icon: Code2,
      iconColor: 'text-violet-600',
      badge: 'EXPORT',
      badgeColor: 'bg-violet-100 text-violet-700 font-bold',
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 select-none shadow-xs">
      <div className="p-4 space-y-4 overflow-y-auto">
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            System Modules
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-900 border border-indigo-200/80 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : item.iconColor}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono shrink-0 ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Anti-spoofing Sentinel status card */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 text-xs space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-emerald-900 font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
              Anti-Spoof Sentinel
            </span>
            <span className="text-[10px] text-emerald-700 font-black font-mono">ACTIVE</span>
          </div>
          <p className="text-[11px] text-emerald-800 leading-relaxed font-normal">
            Eye Aspect Ratio (EAR) &amp; texture frequency analysis enabled against photo attacks.
          </p>
        </div>
      </div>

      {/* Footer system details */}
      <div className="p-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between bg-slate-50/50">
        <div>
          <div className="text-slate-800 font-bold">Edge Vision Server</div>
          <div className="font-mono text-[10px] text-slate-400">128-D DESCRIPTORS</div>
        </div>
        <div className="flex items-center gap-1 text-emerald-600 font-mono text-[11px] font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          READY
        </div>
      </div>
    </aside>
  );
};
