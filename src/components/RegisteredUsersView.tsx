import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Trash2,
  ShieldCheck,
  Building,
  Fingerprint,
  CheckCircle,
} from 'lucide-react';
import { User } from '../types';

interface RegisteredUsersViewProps {
  users: User[];
  onOpenEnroll: () => void;
  onDeleteUser: (userId: string) => void;
}

export const RegisteredUsersView: React.FC<RegisteredUsersViewProps> = ({
  users,
  onOpenEnroll,
  onDeleteUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  // Extract departments
  const departments = useMemo(() => {
    const set = new Set<string>();
    users.forEach((u) => set.add(u.department));
    return ['All', ...Array.from(set)];
  }, [users]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDept = selectedDepartment === 'All' || u.department === selectedDepartment;
      return matchSearch && matchDept;
    });
  }, [users, searchQuery, selectedDepartment]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              Biometric Database · known_faces/
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Registered Personnel &amp; Face Profiles
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            128-dimensional facial embeddings registered for real-time camera matching and automated attendance.
          </p>
        </div>

        <button
          onClick={onOpenEnroll}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:shadow-md hover:shadow-indigo-500/20 active:scale-98 transition-all cursor-pointer whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" />
          <span>Enroll New Face via Camera</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50 to-blue-50/60 border border-indigo-200/80 shadow-xs">
          <span className="text-xs font-bold text-indigo-900">Total Registered Individuals</span>
          <div className="text-3xl font-black font-mono text-indigo-950 mt-1 tabular-nums">
            {users.length}
          </div>
        </div>
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-200/80 shadow-xs">
          <span className="text-xs font-bold text-emerald-900">Active Biometric Templates</span>
          <div className="text-3xl font-black font-mono text-emerald-800 mt-1 tabular-nums">
            {users.filter((u) => u.status === 'Active').length}
          </div>
        </div>
        <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-50 to-violet-50/60 border border-purple-200/80 shadow-xs">
          <span className="text-xs font-bold text-purple-900">Embedding Resolution</span>
          <div className="text-3xl font-black font-mono text-purple-900 mt-1">
            128 Floats / Face
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, ID, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <span>Department:</span>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-600 cursor-pointer"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of registered user cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.length === 0 ? (
          <div className="col-span-full py-14 text-center text-slate-400 bg-white rounded-3xl border border-slate-200/80">
            No enrolled faces found matching your query.
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="flex items-start gap-3.5">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face';
                  }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{user.name}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                      {user.status}
                    </span>
                  </div>

                  <p className="text-xs text-indigo-600 font-bold mt-0.5 truncate">{user.role}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{user.department}</p>
                </div>
              </div>

              {/* Technical embedding details */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-[11px] font-mono space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span>ID Badge:</span>
                  <span className="text-slate-900 font-bold">{user.employeeId}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Embedding Vector:</span>
                  <span className="text-indigo-600 font-bold flex items-center gap-1">
                    <Fingerprint className="w-3.5 h-3.5" />
                    128-D Computed
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Enrolled:</span>
                  <span className="text-slate-400">{user.registeredAt}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-[10px] text-emerald-700 font-mono font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Biometric
                </span>

                <button
                  onClick={() => onDeleteUser(user.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Remove from database"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
