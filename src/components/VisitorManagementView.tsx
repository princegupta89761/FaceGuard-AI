import React, { useState, useMemo } from 'react';
import {
  Users,
  UserCheck,
  UserPlus,
  Search,
  Download,
  Clock,
  Building,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Camera,
  Printer,
  BadgeAlert,
  X,
} from 'lucide-react';
import { VisitorRecord } from '../types';
import { downloadCsvFile } from '../utils/exportCsv';
import { playSuccessBeep } from '../utils/audio';

interface VisitorManagementViewProps {
  visitors: VisitorRecord[];
  onCheckInVisitor: (visitor: VisitorRecord) => void;
  onCheckOutVisitor: (visitorId: string) => void;
}

export const VisitorManagementView: React.FC<VisitorManagementViewProps> = ({
  visitors,
  onCheckInVisitor,
  onCheckOutVisitor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Checked In' | 'Checked Out' | 'Overstay Alert'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Visitor Form State
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [purpose, setPurpose] = useState<VisitorRecord['purpose']>('Client Meeting');
  const [hostEmployee, setHostEmployee] = useState('David Kim (VP Technology)');
  const [phone, setPhone] = useState('');
  const [snapshotUrl, setSnapshotUrl] = useState('');

  // Filtered visitors
  const filteredVisitors = useMemo(() => {
    return visitors.filter((v) => {
      const matchSearch =
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.visitorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.hostEmployee.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'All' || v.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [visitors, searchQuery, statusFilter]);

  const activeCount = visitors.filter((v) => v.status === 'Checked In').length;
  const overstayCount = visitors.filter((v) => v.status === 'Overstay Alert').length;

  const handleCreateVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    playSuccessBeep();
    const newVisitor: VisitorRecord = {
      id: `vis-${Date.now()}`,
      visitorId: `VIS-${Math.floor(4000 + Math.random() * 900)}`,
      name: name.trim(),
      company: company.trim() || 'Independent / Guest',
      purpose,
      hostEmployee,
      phone: phone.trim() || '+1 (555) 000-0000',
      entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      status: 'Checked In',
      snapshotUrl:
        snapshotUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
      badgeIssued: true,
    };

    onCheckInVisitor(newVisitor);
    setIsModalOpen(false);
    setName('');
    setCompany('');
    setPhone('');
    setSnapshotUrl('');
  };

  const handleExportCsv = () => {
    const headers = ['Visitor ID', 'Name', 'Company', 'Purpose', 'Host Employee', 'Phone', 'Entry Time', 'Exit Time', 'Status'];
    const rows = visitors.map((v) => [
      `"${v.visitorId}"`,
      `"${v.name}"`,
      `"${v.company}"`,
      `"${v.purpose}"`,
      `"${v.hostEmployee}"`,
      `"${v.phone}"`,
      `"${v.entryTime}"`,
      `"${v.exitTime || 'Active'}"`,
      `"${v.status}"`,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadCsvFile(csv, `visitor_log_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Module · Visitor Management System (VMS)
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Visitor Registry &amp; Digital Badging
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Biometric visitor check-in, host notification, overstay detection, and automated audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Visitor CSV</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-md hover:shadow-amber-500/20 active:scale-98 transition-all cursor-pointer whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register New Visitor</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200/80 shadow-xs">
          <span className="text-xs font-bold text-amber-900">Total Visitors Today</span>
          <div className="text-3xl font-black font-mono text-amber-950 mt-1 tabular-nums">{visitors.length}</div>
        </div>
        <div className="p-5 rounded-3xl bg-gradient-to-br from-sky-50 to-blue-50/60 border border-sky-200/80 shadow-xs">
          <span className="text-xs font-bold text-sky-900">Currently On Premise</span>
          <div className="text-3xl font-black font-mono text-sky-700 mt-1 tabular-nums">{activeCount}</div>
        </div>
        <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-50 to-pink-50/60 border border-rose-200/80 shadow-xs">
          <span className="text-xs font-bold text-rose-900">Overstay Alerts</span>
          <div className="text-3xl font-black font-mono text-rose-700 mt-1 tabular-nums">{overstayCount}</div>
        </div>
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-200/80 shadow-xs">
          <span className="text-xs font-bold text-emerald-900">Digital Badges Issued</span>
          <div className="text-3xl font-black font-mono text-emerald-800 mt-1 tabular-nums">
            {visitors.filter((v) => v.badgeIssued).length}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search visitor, ID, host, company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold">
          {(['All', 'Checked In', 'Checked Out', 'Overstay Alert'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Visitors Table */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-5">Visitor</th>
                <th className="py-3.5 px-5">Badge ID</th>
                <th className="py-3.5 px-5">Organization</th>
                <th className="py-3.5 px-5">Purpose</th>
                <th className="py-3.5 px-5">Host Employee</th>
                <th className="py-3.5 px-5">Entry / Exit</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVisitors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                    No visitor records found.
                  </td>
                </tr>
              ) : (
                filteredVisitors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 flex items-center gap-3">
                      <img
                        src={v.snapshotUrl}
                        alt={v.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{v.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{v.phone}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-mono font-bold text-amber-700 tabular-nums">
                      {v.visitorId}
                    </td>
                    <td className="py-3.5 px-5 text-slate-700 font-medium">{v.company}</td>
                    <td className="py-3.5 px-5 text-slate-600">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 font-bold text-slate-700 text-[11px]">
                        {v.purpose}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-700 font-medium">{v.hostEmployee}</td>
                    <td className="py-3.5 px-5 font-mono text-slate-600">
                      <span>{v.entryTime}</span>
                      {v.exitTime && <span className="text-slate-400"> → {v.exitTime}</span>}
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold ${
                          v.status === 'Checked In'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : v.status === 'Checked Out'
                            ? 'bg-slate-100 text-slate-600 border border-slate-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      {v.status === 'Checked In' || v.status === 'Overstay Alert' ? (
                        <button
                          onClick={() => onCheckOutVisitor(v.id)}
                          className="flex items-center gap-1.5 ml-auto px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer text-xs font-bold"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Check Out</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">Concluded</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visitor Check-In Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-7 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <span>Register &amp; Check In Guest</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVisitor} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Visitor Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Lin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Company / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Horizon Robotics"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Purpose of Visit</label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value as VisitorRecord['purpose'])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="Client Meeting">Client Meeting</option>
                    <option value="Technical Audit">Technical Audit</option>
                    <option value="Job Interview">Job Interview</option>
                    <option value="Vendor Delivery">Vendor Delivery</option>
                    <option value="VIP Guest">VIP Guest</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Host Employee</label>
                  <select
                    value={hostEmployee}
                    onChange={(e) => setHostEmployee(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="David Kim (VP Technology)">David Kim (VP Technology)</option>
                    <option value="Dr. Elena Rostova (Principal AI)">Dr. Elena Rostova (Principal AI)</option>
                    <option value="Marcus Chen (Vision Lead)">Marcus Chen (Vision Lead)</option>
                    <option value="Sarah Jenkins (HR Director)">Sarah Jenkins (HR Director)</option>
                    <option value="Aiden Patel (Security Chief)">Aiden Patel (Security Chief)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:shadow-md cursor-pointer"
                >
                  Issue Badge &amp; Check In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
