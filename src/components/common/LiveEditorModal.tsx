'use client';

import React, { useState } from 'react';
import { CVProfile, Experience, Education, Project, SkillGroup, CertificateItem, LanguageItem } from '@/types';
import {
  X,
  Save,
  Download,
  Upload,
  User,
  GraduationCap,
  FolderGit2,
  Cpu,
  Award,
  Briefcase,
  Languages,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Sparkles
} from 'lucide-react';

interface LiveEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CVProfile;
  onSave: (updatedProfile: CVProfile) => void;
}

type TabType = 'personal' | 'education' | 'projects' | 'skills' | 'certs' | 'experience' | 'languages' | 'json';

export function LiveEditorModal({ isOpen, onClose, profile, onSave }: LiveEditorModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [draft, setDraft] = useState<CVProfile>(() => JSON.parse(JSON.stringify(profile)));
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [rawJson, setRawJson] = useState<string>(() => JSON.stringify(profile, null, 2));
  const [jsonError, setJsonError] = useState<string>('');

  if (!isOpen) return null;

  // Sync raw JSON when draft changes
  const updateDraft = (newDraft: CVProfile) => {
    setDraft(newDraft);
    setRawJson(JSON.stringify(newDraft, null, 2));
  };

  const handleSave = async () => {
    setSaveStatus('Saving changes...');
    try {
      // 1. Save to local storage
      if (typeof window !== 'undefined') {
        localStorage.setItem(`cv_profile_${draft.slug}`, JSON.stringify(draft));
        localStorage.setItem(`user_profile_data_${draft.slug}`, JSON.stringify(draft));
      }

      // 2. Post to API in background if online
      try {
        await fetch('/api/profiles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(draft)
        });
      } catch {
        // API offline or static mode fallback
      }

      onSave(draft);
      setSaveStatus('Saved successfully!');
      setTimeout(() => {
        setSaveStatus('');
        onClose();
      }, 800);
    } catch (err: any) {
      setSaveStatus('Error saving: ' + (err.message || 'Unknown'));
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(draft, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${draft.slug}_profile.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (jsonString: string) => {
    try {
      setJsonError('');
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        updateDraft(parsed);
        setSaveStatus('JSON imported successfully!');
        setTimeout(() => setSaveStatus(''), 2000);
      }
    } catch (err: any) {
      setJsonError('Invalid JSON format: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-left">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">Live Profile Editor</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
                  Everything Editable
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Update personal info, GPA, projects, skills, and certificates with instant live persistence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
              title="Download backup profile.json"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-950/60 border-b border-slate-800 px-4 flex items-center gap-1 overflow-x-auto shrink-0 scrollbar-none py-2">
          {[
            { id: 'personal', label: 'Personal & Photos', icon: <User className="w-3.5 h-3.5" /> },
            { id: 'education', label: 'Education & GPA', icon: <GraduationCap className="w-3.5 h-3.5" /> },
            { id: 'projects', label: 'Projects Archive', icon: <FolderGit2 className="w-3.5 h-3.5" /> },
            { id: 'skills', label: 'Skills Matrix', icon: <Cpu className="w-3.5 h-3.5" /> },
            { id: 'certs', label: 'Courses & Certs', icon: <Award className="w-3.5 h-3.5" /> },
            { id: 'experience', label: 'Experience & Roles', icon: <Briefcase className="w-3.5 h-3.5" /> },
            { id: 'languages', label: 'Languages', icon: <Languages className="w-3.5 h-3.5" /> },
            { id: 'json', label: 'Raw JSON Import/Export', icon: <FileCode className="w-3.5 h-3.5" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: PERSONAL & PHOTOS */}
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={draft.fullName || ''}
                  onChange={(e) => updateDraft({ ...draft, fullName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Professional Title</label>
                <input
                  type="text"
                  value={draft.title || ''}
                  onChange={(e) => updateDraft({ ...draft, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline</label>
                <input
                  type="text"
                  value={draft.tagline || ''}
                  onChange={(e) => updateDraft({ ...draft, tagline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Availability Status</label>
                <input
                  type="text"
                  value={draft.availabilityStatus || 'Available for Opportunities'}
                  onChange={(e) => updateDraft({ ...draft, availabilityStatus: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={draft.email || ''}
                  onChange={(e) => updateDraft({ ...draft, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={draft.phone || ''}
                  onChange={(e) => updateDraft({ ...draft, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  value={draft.location || ''}
                  onChange={(e) => updateDraft({ ...draft, location: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn URL</label>
                <input
                  type="text"
                  value={draft.linkedinUrl || ''}
                  onChange={(e) => updateDraft({ ...draft, linkedinUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub URL</label>
                <input
                  type="text"
                  value={draft.githubUrl || ''}
                  onChange={(e) => updateDraft({ ...draft, githubUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Avatar / Headshot URL</label>
                <input
                  type="text"
                  value={draft.avatarUrl || ''}
                  onChange={(e) => updateDraft({ ...draft, avatarUrl: e.target.value })}
                  placeholder="https://... or /photo.jpg"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Executive Summary / Objective</label>
                <textarea
                  rows={4}
                  value={draft.summary || ''}
                  onChange={(e) => updateDraft({ ...draft, summary: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: EDUCATION & GPA */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-amber-300">Prominent Academic GPA Card</h4>
                  <p className="text-xs text-slate-300">Displayed prominently on your portfolio header and education section</p>
                </div>
                <div className="w-36">
                  <input
                    type="text"
                    value={draft.gpa || (draft.education?.[0]?.gpa || '1.65 (A-)')}
                    onChange={(e) => {
                      const val = e.target.value;
                      const edu = [...(draft.education || [])];
                      if (edu.length > 0) edu[0].gpa = val;
                      updateDraft({ ...draft, gpa: val, education: edu });
                    }}
                    placeholder="e.g. 1.65 (A-) or 1.78"
                    className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-3 py-2 text-xs font-bold text-amber-400 text-center focus:outline-none"
                  />
                </div>
              </div>

              {(draft.education || []).map((edu, idx) => (
                <div key={edu.id || idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Education Item #{idx + 1}</span>
                    <button
                      onClick={() => {
                        const next = draft.education.filter((_, i) => i !== idx);
                        updateDraft({ ...draft, education: next });
                      }}
                      className="text-rose-400 hover:text-rose-300 text-xs p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Institution</label>
                      <input
                        type="text"
                        value={edu.institution || ''}
                        onChange={(e) => {
                          const next = [...draft.education];
                          next[idx].institution = e.target.value;
                          updateDraft({ ...draft, education: next });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Degree & Field</label>
                      <input
                        type="text"
                        value={edu.degree || ''}
                        onChange={(e) => {
                          const next = [...draft.education];
                          next[idx].degree = e.target.value;
                          updateDraft({ ...draft, education: next });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">GPA / Honors</label>
                      <input
                        type="text"
                        value={edu.honors || ''}
                        onChange={(e) => {
                          const next = [...draft.education];
                          next[idx].honors = e.target.value;
                          updateDraft({ ...draft, education: next });
                        }}
                        placeholder="Current GPA: 1.65 (A-)"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Degree Verification Link</label>
                      <input
                        type="text"
                        value={edu.degreePortalUrl || ''}
                        onChange={(e) => {
                          const next = [...draft.education];
                          next[idx].degreePortalUrl = e.target.value;
                          updateDraft({ ...draft, education: next });
                        }}
                        placeholder="https://graduates.mans.edu.eg or https://www.guc.edu.eg"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => {
                  const newItem: Education = {
                    id: 'edu-' + Date.now(),
                    degree: 'Bachelor of Science (B.Sc.)',
                    fieldOfStudy: 'Information Engineering',
                    institution: 'University Name',
                    gpa: '1.65 (A-)',
                    startDate: '2024',
                    endDate: '2029'
                  };
                  updateDraft({ ...draft, education: [...(draft.education || []), newItem] });
                }}
                className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-amber-500/50 text-slate-400 hover:text-amber-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Academic Credential</span>
              </button>
            </div>
          )}

          {/* TAB 3: PROJECTS ARCHIVE */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              {(draft.projects || []).map((proj, idx) => (
                <div key={proj.id || idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Project #{idx + 1}</span>
                    <button
                      onClick={() => {
                        const next = draft.projects.filter((_, i) => i !== idx);
                        updateDraft({ ...draft, projects: next });
                      }}
                      className="text-rose-400 hover:text-rose-300 text-xs p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Title</label>
                      <input
                        type="text"
                        value={proj.title || ''}
                        onChange={(e) => {
                          const next = [...draft.projects];
                          next[idx].title = e.target.value;
                          updateDraft({ ...draft, projects: next });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Category</label>
                      <select
                        value={proj.category || 'Software Systems'}
                        onChange={(e) => {
                          const next = [...draft.projects];
                          next[idx].category = e.target.value;
                          updateDraft({ ...draft, projects: next });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      >
                        <option value="Hardware & Security">Hardware & Security</option>
                        <option value="Software Systems">Software Systems</option>
                        <option value="Infrastructure & Cloud">Infrastructure & Cloud</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Key Metric / Result</label>
                      <input
                        type="text"
                        value={proj.metrics || ''}
                        onChange={(e) => {
                          const next = [...draft.projects];
                          next[idx].metrics = e.target.value;
                          updateDraft({ ...draft, projects: next });
                        }}
                        placeholder="e.g. Sub-5ms Packet Latency"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Tech Stack (comma separated)</label>
                    <input
                      type="text"
                      value={(proj.technologies || []).join(', ')}
                      onChange={(e) => {
                        const next = [...draft.projects];
                        next[idx].technologies = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        updateDraft({ ...draft, projects: next });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={proj.description || ''}
                      onChange={(e) => {
                        const next = [...draft.projects];
                        next[idx].description = e.target.value;
                        updateDraft({ ...draft, projects: next });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={() => {
                  const newItem: Project = {
                    id: 'proj-' + Date.now(),
                    title: 'New Engineering Project',
                    category: 'Software Systems',
                    description: 'Architecture and implementation details.',
                    technologies: ['Java', 'Docker', 'Linux'],
                    metrics: '100% Reliable Deployment'
                  };
                  updateDraft({ ...draft, projects: [...(draft.projects || []), newItem] });
                }}
                className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-amber-500/50 text-slate-400 hover:text-amber-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project to Archive</span>
              </button>
            </div>
          )}

          {/* TAB 4: SKILLS MATRIX */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              {(draft.skillGroups || []).map((grp, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={grp.category || ''}
                      onChange={(e) => {
                        const next = [...draft.skillGroups];
                        next[idx].category = e.target.value;
                        updateDraft({ ...draft, skillGroups: next });
                      }}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-bold text-amber-400 w-64"
                    />
                    <button
                      onClick={() => {
                        const next = draft.skillGroups.filter((_, i) => i !== idx);
                        updateDraft({ ...draft, skillGroups: next });
                      }}
                      className="text-rose-400 hover:text-rose-300 text-xs p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Skills (comma separated)</label>
                    <input
                      type="text"
                      value={(grp.skills || []).join(', ')}
                      onChange={(e) => {
                        const next = [...draft.skillGroups];
                        next[idx].skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        updateDraft({ ...draft, skillGroups: next });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={() => {
                  const newItem: SkillGroup = {
                    category: 'New Capability Group',
                    skills: ['Skill 1', 'Skill 2', 'Skill 3']
                  };
                  updateDraft({ ...draft, skillGroups: [...(draft.skillGroups || []), newItem] });
                }}
                className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-amber-500/50 text-slate-400 hover:text-amber-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill Group</span>
              </button>
            </div>
          )}

          {/* TAB 5: COURSES & CERTS */}
          {activeTab === 'certs' && (
            <div className="space-y-4">
              {(draft.certificates || []).map((cert, idx) => (
                <div key={cert.id || idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Certificate #{idx + 1}</span>
                    <button
                      onClick={() => {
                        const next = draft.certificates?.filter((_, i) => i !== idx) || [];
                        updateDraft({ ...draft, certificates: next });
                      }}
                      className="text-rose-400 hover:text-rose-300 text-xs p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Certificate Title</label>
                      <input
                        type="text"
                        value={cert.title || ''}
                        onChange={(e) => {
                          const next = [...(draft.certificates || [])];
                          next[idx].title = e.target.value;
                          updateDraft({ ...draft, certificates: next });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Issuer</label>
                      <input
                        type="text"
                        value={cert.issuer || ''}
                        onChange={(e) => {
                          const next = [...(draft.certificates || [])];
                          next[idx].issuer = e.target.value;
                          updateDraft({ ...draft, certificates: next });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Image URL (High-Res Scan)</label>
                      <input
                        type="text"
                        value={cert.imageUrl || ''}
                        onChange={(e) => {
                          const next = [...(draft.certificates || [])];
                          next[idx].imageUrl = e.target.value;
                          updateDraft({ ...draft, certificates: next });
                        }}
                        placeholder="/certs/ccna_enterprise.jpg"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Credential URL</label>
                      <input
                        type="text"
                        value={cert.credentialUrl || ''}
                        onChange={(e) => {
                          const next = [...(draft.certificates || [])];
                          next[idx].credentialUrl = e.target.value;
                          updateDraft({ ...draft, certificates: next });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Curriculum Topics (comma separated)</label>
                    <input
                      type="text"
                      value={(cert.topics || []).join(', ')}
                      onChange={(e) => {
                        const next = [...(draft.certificates || [])];
                        next[idx].topics = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        updateDraft({ ...draft, certificates: next });
                      }}
                      placeholder="OSPFv2 Routing, Network Security, ACLs, VPNs"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={() => {
                  const newItem: CertificateItem = {
                    id: 'cert-' + Date.now(),
                    title: 'New Professional Certificate',
                    issuer: 'Cisco Networking Academy',
                    issueDate: '2026',
                    imageUrl: '/certs/ccna_enterprise.jpg',
                    badge: 'Verified Credential',
                    category: 'Cisco CCNA',
                    topics: ['Core Networking', 'Security Automation']
                  };
                  updateDraft({ ...draft, certificates: [...(draft.certificates || []), newItem] });
                }}
                className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-amber-500/50 text-slate-400 hover:text-amber-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Certificate or Course</span>
              </button>
            </div>
          )}

          {/* TAB 6: EXPERIENCE & ROLES */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              {(draft.experiences || []).map((exp, idx) => (
                <div key={exp.id || idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Experience #{idx + 1}</span>
                    <button
                      onClick={() => {
                        const next = draft.experiences.filter((_, i) => i !== idx);
                        updateDraft({ ...draft, experiences: next });
                      }}
                      className="text-rose-400 hover:text-rose-300 text-xs p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Role / Job Title</label>
                      <input
                        type="text"
                        value={exp.role || ''}
                        onChange={(e) => {
                          const next = [...draft.experiences];
                          next[idx].role = e.target.value;
                          updateDraft({ ...draft, experiences: next });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Company / Organization</label>
                      <input
                        type="text"
                        value={exp.company || ''}
                        onChange={(e) => {
                          const next = [...draft.experiences];
                          next[idx].company = e.target.value;
                          updateDraft({ ...draft, experiences: next });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate || ''}
                        onChange={(e) => {
                          const next = [...draft.experiences];
                          next[idx].startDate = e.target.value;
                          updateDraft({ ...draft, experiences: next });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">End Date</label>
                      <input
                        type="text"
                        value={exp.endDate || ''}
                        onChange={(e) => {
                          const next = [...draft.experiences];
                          next[idx].endDate = e.target.value;
                          updateDraft({ ...draft, experiences: next });
                        }}
                        placeholder="Present or 2026"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Bullet Points (one per line)</label>
                    <textarea
                      rows={3}
                      value={(exp.bulletPoints || []).join('\n')}
                      onChange={(e) => {
                        const next = [...draft.experiences];
                        next[idx].bulletPoints = e.target.value.split('\n').filter(Boolean);
                        updateDraft({ ...draft, experiences: next });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={() => {
                  const newItem: Experience = {
                    id: 'exp-' + Date.now(),
                    role: 'Systems Engineer',
                    company: 'Organization',
                    startDate: '2024',
                    endDate: 'Present',
                    description: 'Technical responsibilities and impact.',
                    bulletPoints: ['Point 1', 'Point 2']
                  };
                  updateDraft({ ...draft, experiences: [...(draft.experiences || []), newItem] });
                }}
                className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-amber-500/50 text-slate-400 hover:text-amber-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Experience Entry</span>
              </button>
            </div>
          )}

          {/* TAB 7: SPOKEN LANGUAGES */}
          {activeTab === 'languages' && (
            <div className="space-y-4">
              {((draft.languages || [
                { name: 'Arabic', proficiency: 'Native', flag: '🇪🇬' },
                { name: 'English', proficiency: 'Fluent (Professional)', flag: '🇬🇧' },
                { name: 'German', proficiency: 'A2 Level (GUC)', flag: '🇩🇪' },
              ])).map((lang, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  <input
                    type="text"
                    value={lang.flag || '🌐'}
                    onChange={(e) => {
                      const next = [...(draft.languages || [])];
                      next[idx].flag = e.target.value;
                      updateDraft({ ...draft, languages: next });
                    }}
                    className="w-14 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-center text-sm"
                  />
                  <input
                    type="text"
                    value={lang.name}
                    onChange={(e) => {
                      const next = [...(draft.languages || [])];
                      next[idx].name = e.target.value;
                      updateDraft({ ...draft, languages: next });
                    }}
                    placeholder="Language name"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={lang.proficiency}
                    onChange={(e) => {
                      const next = [...(draft.languages || [])];
                      next[idx].proficiency = e.target.value;
                      updateDraft({ ...draft, languages: next });
                    }}
                    placeholder="Proficiency (e.g. Native / Fluent)"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                  <button
                    onClick={() => {
                      const next = (draft.languages || []).filter((_, i) => i !== idx);
                      updateDraft({ ...draft, languages: next });
                    }}
                    className="text-rose-400 hover:text-rose-300 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                onClick={() => {
                  const newItem: LanguageItem = { name: 'Language', proficiency: 'Conversational', flag: '🌐' };
                  updateDraft({ ...draft, languages: [...(draft.languages || []), newItem] });
                }}
                className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-amber-500/50 text-slate-400 hover:text-amber-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Spoken Language</span>
              </button>
            </div>
          )}

          {/* TAB 8: RAW JSON IMPORT / EXPORT */}
          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Full JSON Profile Backup</h4>
                  <p className="text-[11px] text-slate-400">Copy this JSON to backup, or paste valid JSON to restore all profile data</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleImportJson(rawJson)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                  >
                    Import & Apply JSON
                  </button>
                </div>
              </div>

              {jsonError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{jsonError}</span>
                </div>
              )}

              <textarea
                rows={16}
                value={rawJson}
                onChange={(e) => {
                  setRawJson(e.target.value);
                  setJsonError('');
                }}
                className="w-full bg-slate-950 font-mono text-xs text-amber-300/90 border border-slate-800 rounded-2xl p-4 focus:outline-none focus:border-amber-500/60 leading-relaxed"
              />
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {saveStatus && (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {saveStatus}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save & Apply Changes</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
