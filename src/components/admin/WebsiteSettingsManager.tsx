import React, { useState } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Upload,
  User,
  Shield,
  ExternalLink,
  Eye
} from 'lucide-react';
import { WebsiteSettings } from '../../types';
import { updateAdminSettings, uploadMediaFile } from '../../lib/api';

interface WebsiteSettingsManagerProps {
  settings: WebsiteSettings;
  onRefresh: () => void;
}

export const WebsiteSettingsManager: React.FC<WebsiteSettingsManagerProps> = ({
  settings,
  onRefresh
}) => {
  const [formData, setFormData] = useState<WebsiteSettings>(settings);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await updateAdminSettings(formData);
      setSuccess(true);
      onRefresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save website settings');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const res = await uploadMediaFile(file);
      setFormData((prev) => ({
        ...prev,
        profilePhotoUrl: res.fileUrl
      }));
    } catch (err: any) {
      alert('Photo upload failed: ' + err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-400" />
          <span>Website Global Settings & Profile Configuration</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Update your public identity, bio, hero headline, Fiverr URL, profile photo, and section visibility without editing code.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Website settings updated successfully! Public pages now reflect your changes.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Profile Photo & Visual Identity */}
        <div className="p-6 rounded-2xl bg-[#101019] border border-purple-900/30 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-purple-300 flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Profile Photograph & Hero Avatar</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
            {/* Circular Preview Container */}
            <div className="relative w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-[#6D28D9] via-[#8B5CF6] to-[#C084FC] shadow-[0_0_20px_rgba(124,58,237,0.35)] shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#15111F] flex items-center justify-center">
                {formData.profilePhotoUrl ? (
                  <img
                    src={formData.profilePhotoUrl}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-2 text-[10px] text-purple-300 font-semibold">
                    No Photo Uploaded
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 flex-1 text-xs">
              <p className="text-slate-400">
                Upload your actual professional photograph to display inside the circular gradient hero frame.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <label className="px-3.5 py-2 rounded-xl font-semibold text-white bg-purple-900/80 hover:bg-purple-800 border border-purple-700/50 flex items-center gap-2 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingPhoto ? 'Uploading...' : 'Upload Real Photo'}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    disabled={uploadingPhoto}
                    onChange={handleProfilePhotoUpload}
                    className="hidden"
                  />
                </label>
                {formData.profilePhotoUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, profilePhotoUrl: '' })}
                    className="px-3 py-2 rounded-xl text-slate-400 hover:text-rose-300 transition-colors"
                  >
                    Reset to Default Emblem
                  </button>
                )}
              </div>
              <div className="text-[11px] text-slate-500">
                Or enter image URL:
                <input
                  type="text"
                  value={formData.profilePhotoUrl}
                  onChange={(e) => setFormData({ ...formData, profilePhotoUrl: e.target.value })}
                  placeholder="/uploads/photo.jpg or https://..."
                  className="w-full mt-1 px-3 py-1.5 rounded-lg bg-[#15111F] border border-purple-950 text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Personal & Identity Information */}
        <div className="p-6 rounded-2xl bg-[#101019] border border-purple-900/30 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-purple-300">
            Professional Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Your Full Name *</label>
              <input
                type="text"
                required
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Professional Title *</label>
              <input
                type="text"
                required
                value={formData.professionalTitle}
                onChange={(e) => setFormData({ ...formData, professionalTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Hero Headline *</label>
            <input
              type="text"
              required
              value={formData.heroHeadline}
              onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600 font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Hero Lead Description *</label>
            <textarea
              rows={2}
              required
              value={formData.heroDescription}
              onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Full Bio / About Me Content *</label>
            <textarea
              rows={4}
              required
              value={formData.bioContent}
              onChange={(e) => setFormData({ ...formData, bioContent: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600 leading-relaxed"
            />
          </div>
        </div>

        {/* Section 3: Contact Channels & External Profiles */}
        <div className="p-6 rounded-2xl bg-[#101019] border border-purple-900/30 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-purple-300">
            Contact & Social Profiles
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Contact Email *</label>
              <input
                type="email"
                required
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Fiverr Profile URL</label>
              <input
                type="text"
                value={formData.fiverrUrl}
                onChange={(e) => setFormData({ ...formData, fiverrUrl: e.target.value })}
                placeholder="https://www.fiverr.com/..."
                className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">LinkedIn Profile URL</label>
              <input
                type="text"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://www.linkedin.com/in/..."
                className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">GitHub Profile URL</label>
              <input
                type="text"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Footer Text</label>
            <input
              type="text"
              value={formData.footerText}
              onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#15111F] border border-purple-950 text-white focus:outline-none focus:border-purple-600"
            />
          </div>
        </div>

        {/* Section 4: Homepage Section Visibility */}
        <div className="p-6 rounded-2xl bg-[#101019] border border-purple-900/30 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-purple-300">
            Homepage Section Visibility
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(formData.sectionVisibility).map(([section, isVisible]) => (
              <label key={section} className="flex items-center gap-2 p-3 rounded-lg bg-[#15111F] border border-purple-950/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sectionVisibility: {
                        ...formData.sectionVisibility,
                        [section]: e.target.checked
                      }
                    })
                  }
                  className="rounded bg-[#101019] border-purple-900 text-purple-600"
                />
                <span className="capitalize text-slate-300 font-medium">
                  {section}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#8B5CF6] disabled:opacity-50 shadow-xl flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Changes...' : 'Save Settings to Database'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
