import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface NotFoundViewProps {
  navigate: (path: string) => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ navigate }) => {
  return (
    <div className="py-24 max-w-3xl mx-auto px-4 text-center space-y-6">
      <div className="w-20 h-20 rounded-2xl bg-[#15111F] border border-purple-800/40 flex items-center justify-center mx-auto text-[#C084FC] shadow-[0_0_30px_rgba(124,58,237,0.25)]">
        <ShieldAlert className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <div className="text-xs font-mono uppercase tracking-widest text-purple-400">
          HTTP 404 · ACCESS POINT UNRESOLVED
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Requested Security Asset Not Found
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          The URI endpoint you requested does not exist or may have been restricted under security policies.
        </p>
      </div>

      <div className="pt-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#8B5CF6] shadow-lg cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Security Portfolio</span>
        </button>
      </div>
    </div>
  );
};
