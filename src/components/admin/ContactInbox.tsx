import React, { useState } from 'react';
import {
  Mail,
  MailOpen,
  Trash2,
  Archive,
  Reply,
  CheckCircle2,
  X,
  Search,
  AlertCircle
} from 'lucide-react';
import { ContactMessage } from '../../types';
import {
  updateContactStatus,
  deleteContactMessage
} from '../../lib/api';

interface ContactInboxProps {
  messages: ContactMessage[];
  onRefresh: () => void;
}

export const ContactInbox: React.FC<ContactInboxProps> = ({ messages, onRefresh }) => {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleMarkStatus = async (msg: ContactMessage, isRead: boolean) => {
    try {
      await updateContactStatus(msg.id, { isRead });
      if (selectedMessage && selectedMessage.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, isRead });
      }
      onRefresh();
    } catch (err: any) {
      alert('Error updating: ' + err.message);
    }
  };

  const handleToggleArchive = async (msg: ContactMessage) => {
    try {
      await updateContactStatus(msg.id, { isArchived: !msg.isArchived });
      if (selectedMessage && selectedMessage.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, isArchived: !msg.isArchived });
      }
      onRefresh();
    } catch (err: any) {
      alert('Error updating archive: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteContactMessage(deleteId);
      if (selectedMessage && selectedMessage.id === deleteId) {
        setSelectedMessage(null);
      }
      setDeleteId(null);
      onRefresh();
    } catch (err: any) {
      alert('Error deleting message: ' + err.message);
    }
  };

  const handleOpenMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      handleMarkStatus(msg, true);
    }
  };

  const filtered = messages.filter((m) => {
    if (filter === 'unread' && m.isRead) return false;
    if (filter === 'archived' && !m.isArchived) return false;
    if (filter === 'all' && m.isArchived) return false;

    return (
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-rose-400" />
            <span>Contact Submissions & Inquiries</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            View customer messages, reply via secure email, and manage read/archive states.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#101019] border border-purple-900/40">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
              filter === 'all'
                ? 'bg-purple-900/60 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Active Inbox
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
              filter === 'unread'
                ? 'bg-purple-900/60 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Unread Only
          </button>
          <button
            onClick={() => setFilter('archived')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
              filter === 'archived'
                ? 'bg-purple-900/60 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Archived
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by sender, email, or content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#101019] border border-purple-900/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-600 transition-colors"
        />
      </div>

      {/* Messages List */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-[#101019] border border-purple-900/30 text-slate-400 space-y-2">
          <Mail className="w-10 h-10 text-purple-400 mx-auto opacity-30" />
          <div className="text-sm font-medium">No messages found</div>
          <div className="text-xs text-slate-500">
            Messages submitted through the public contact form will appear here.
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#101019] border border-purple-900/30 overflow-hidden divide-y divide-purple-950/40">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleOpenMessage(msg)}
              className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors cursor-pointer ${
                !msg.isRead ? 'bg-[#15111F]/80 hover:bg-[#181424]' : 'hover:bg-[#12111A]'
              }`}
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  {!msg.isRead ? (
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  ) : (
                    <MailOpen className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                  <span className="font-bold text-sm text-white truncate">
                    {msg.name}
                  </span>
                  <span className="text-xs text-slate-400 truncate">
                    &lt;{msg.email}&gt;
                  </span>
                </div>
                <div className="text-xs font-semibold text-purple-300 truncate">
                  {msg.subject}
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">
                  {msg.message}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-xs text-slate-400 font-mono">
                <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleArchive(msg);
                  }}
                  className="p-1.5 rounded-lg bg-[#15111F] hover:text-white border border-purple-950/60"
                  title={msg.isArchived ? 'Unarchive' : 'Archive'}
                >
                  <Archive className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(msg.id);
                  }}
                  className="p-1.5 rounded-lg bg-[#15111F] text-rose-400 hover:text-rose-200 border border-rose-900/40"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Reader Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#101019] border border-purple-800/60 rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white bg-[#15111F] border border-purple-950/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-3 pb-4 border-b border-purple-950/50">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Received: {new Date(selectedMessage.createdAt).toLocaleString()}</span>
                <span className="text-purple-300">
                  {selectedMessage.isArchived ? 'Archived' : 'Active'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {selectedMessage.subject}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="font-semibold text-white">{selectedMessage.name}</span>
                <span>&lt;{selectedMessage.email}&gt;</span>
              </div>
            </div>

            {/* Message Body */}
            <div className="p-4 rounded-xl bg-[#15111F] border border-purple-950/60 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
              {selectedMessage.message}
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-purple-950/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleMarkStatus(selectedMessage, !selectedMessage.isRead)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-[#15111F] border border-purple-950/60"
                >
                  Mark as {selectedMessage.isRead ? 'Unread' : 'Read'}
                </button>
                <button
                  onClick={() => handleToggleArchive(selectedMessage)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-[#15111F] border border-purple-950/60"
                >
                  {selectedMessage.isArchived ? 'Restore to Inbox' : 'Archive'}
                </button>
              </div>

              <a
                href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                  `Re: ${selectedMessage.subject} - MD. Raihan Hossen Rajib`
                )}`}
                className="px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#8B5CF6] flex items-center gap-1.5 shadow-lg"
              >
                <Reply className="w-3.5 h-3.5" />
                <span>Reply via Email</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="p-6 rounded-2xl bg-[#101019] border border-rose-900/50 max-w-sm w-full space-y-4 text-center">
            <Trash2 className="w-10 h-10 text-rose-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Delete Inquiry?</h4>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-white bg-rose-600 hover:bg-rose-700 shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
