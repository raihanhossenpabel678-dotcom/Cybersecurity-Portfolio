import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Copy,
  Check,
  FileText,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { MediaItem } from '../../types';
import { uploadMediaFile, deleteAdminMedia } from '../../lib/api';

interface MediaLibraryProps {
  media: MediaItem[];
  onRefresh: () => void;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({ media, onRefresh }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);

    try {
      await uploadMediaFile(file);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'File upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAdminMedia(deleteId);
      setDeleteId(null);
      onRefresh();
    } catch (err: any) {
      alert('Error deleting: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-purple-400" />
            <span>Media Library & Document Storage</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Upload profile images, security evidence graphs, certificates, and permitted PDF documents.
          </p>
        </div>

        {/* Upload Button with hidden file input */}
        <label className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#8B5CF6] flex items-center gap-2 cursor-pointer shadow-lg">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Validating & Uploading...' : 'Upload File'}</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml,application/pdf"
            disabled={uploading}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Security Constraints Notice */}
      <div className="p-3.5 rounded-xl bg-[#101019] border border-purple-950/60 text-xs text-slate-400 flex items-center justify-between">
        <div>
          <span className="text-purple-300 font-semibold">Strict Security Validation:</span> JPEG, PNG, WEBP, SVG, and PDF only. Max file size: 5 MB. Executables strictly rejected.
        </div>
        <div className="font-mono text-[11px] text-slate-500">
          Stored: {media.length} files
        </div>
      </div>

      {/* Media Grid */}
      {media.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-[#101019] border border-purple-900/30 text-slate-400 space-y-3">
          <ImageIcon className="w-10 h-10 text-purple-400 mx-auto opacity-30" />
          <div className="text-sm font-medium">No media uploaded yet</div>
          <div className="text-xs text-slate-500">
            Click "Upload File" above to add your profile photo, certificate images, or report documents.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map((item) => {
            const isImage = item.mimeType.startsWith('image/');
            return (
              <div
                key={item.id}
                className="rounded-xl bg-[#101019] border border-purple-900/30 overflow-hidden flex flex-col justify-between group hover:border-purple-600/50 transition-colors"
              >
                {/* Thumbnail Preview */}
                <div className="h-32 bg-[#15111F] flex items-center justify-center overflow-hidden relative">
                  {isImage ? (
                    <img
                      src={item.filePath}
                      alt={item.originalName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <FileText className="w-10 h-10 text-purple-400" />
                  )}
                </div>

                {/* Details */}
                <div className="p-3 space-y-1">
                  <div className="text-xs font-semibold text-white truncate" title={item.originalName}>
                    {item.originalName}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>{(item.fileSize / 1024).toFixed(1)} KB</span>
                    <span>{item.mimeType.split('/')[1]?.toUpperCase()}</span>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-between border-t border-purple-950/40">
                    <button
                      onClick={() => handleCopyUrl(item.filePath, item.id)}
                      className="p-1.5 rounded-lg bg-[#15111F] text-slate-400 hover:text-white border border-purple-950/60 cursor-pointer flex items-center gap-1 text-[10px]"
                      title="Copy URL"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>URL</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="p-1.5 rounded-lg bg-[#15111F] text-rose-400 hover:text-rose-200 border border-rose-900/40 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="p-6 rounded-2xl bg-[#101019] border border-rose-900/50 max-w-sm w-full space-y-4 text-center">
            <Trash2 className="w-10 h-10 text-rose-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Delete Media Item?</h4>
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
                Delete File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
