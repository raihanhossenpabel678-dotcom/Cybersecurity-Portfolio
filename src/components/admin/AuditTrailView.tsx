import React, { useState } from 'react';
import { History, Shield, Search, Clock, RefreshCw } from 'lucide-react';
import { AuditLogItem } from '../../types';

interface AuditTrailViewProps {
  logs: AuditLogItem[];
  onRefresh: () => void;
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ logs, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setTimeout(() => setRefreshing(false), 500);
  };

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.entityType.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-purple-400" />
            <span>Administrative Security Audit Trail</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic and operational audit event history for all administrative mutations and logins.
          </p>
        </div>

        <button
          onClick={handleManualRefresh}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-[#101019] border border-purple-900/40 hover:border-purple-600 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Trail</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Filter audit events by action or entity..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#101019] border border-purple-900/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-600 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#101019] border border-purple-900/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#15111F] text-slate-400 uppercase tracking-wider font-semibold border-b border-purple-950/50">
              <tr>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Entity Type</th>
                <th className="py-3 px-4">Operation Details</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-950/40 text-slate-300">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-[#15111F]/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-purple-300 text-[11px]">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {log.entityType}
                  </td>
                  <td className="py-3.5 px-4 text-slate-200">
                    {log.details || '—'}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-500">
                    {new Date(log.createdAt).toLocaleString()}
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
