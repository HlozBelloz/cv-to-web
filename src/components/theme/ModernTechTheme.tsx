'use client';

import React, { useState } from 'react';
import { CVProfile } from '@/types';
import { 
  Terminal, 
  Cpu, 
  Code2, 
  GitBranch, 
  ExternalLink, 
  Download, 
  Share2, 
  CheckCircle2, 
  Send, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Layers, 
  Award,
  GraduationCap,
  QrCode,
  Printer,
  UserPlus
} from 'lucide-react';
import { CertificateItem } from '@/types';
import { downloadVCard } from '@/lib/vcard';
import { QRCodeModal } from '@/components/common/QRCodeModal';
import { CertificateModal } from '@/components/common/CertificateModal';

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

interface Props {
  profile: CVProfile;
}

export function ModernTechTheme({ profile }: Props) {
  const [copied, setCopied] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200 antialiased font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Banner if custom domain is active */}
      {profile.customDomain && (
        <div className="bg-[#0b1222] border-b border-emerald-900/40 text-xs text-center py-1.5 text-slate-400 font-mono">
          <span className="inline-flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>domain: <strong className="text-emerald-300">{profile.customDomain}</strong> [verified]</span>
          </span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-16">
        
        {/* HERO SECTION / TERMINAL STYLE */}
        <header className="relative bg-[#0d1527]/90 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800/80 font-mono text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-slate-500">developer-profile.tsx</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>status: ready_for_impact</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-start gap-6 max-w-3xl">
              {profile.avatarUrl && (
                <div className="relative shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-emerald-500/60 shadow-lg shadow-emerald-500/10 bg-[#080d1a]">
                    <img
                      src={profile.avatarUrl}
                      alt={profile.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] shadow-sm flex items-center gap-1 border border-slate-950 font-mono">
                    <CheckCircle2 className="w-3 h-3 text-slate-950" />
                    verified
                  </span>
                </div>
              )}

              <div className="space-y-4">
                <div className="font-mono text-xs text-emerald-400 flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  <span>const candidate = new Engineer();</span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
                  {profile.fullName}
                </h1>

                <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                  {profile.title}
                </p>

                <p className="text-base text-slate-300 leading-relaxed max-w-2xl">
                  {profile.tagline}
                </p>

              {/* Meta details */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-400 font-mono pt-2">
                {profile.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    {profile.location}
                  </span>
                )}
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    {profile.email}
                  </a>
                )}
                {profile.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    {profile.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              {profile.originalPdfUrl ? (
                <a
                  href={profile.originalPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 print:hidden"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD_CV.PDF</span>
                </a>
              ) : null}

              <button
                onClick={handleCopyLink}
                className="px-5 py-3 rounded-xl bg-[#131d35] hover:bg-[#1a2747] text-slate-200 border border-slate-700 font-mono text-xs flex items-center justify-center gap-2 transition-colors print:hidden"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-slate-400" />}
                <span>{copied ? 'LINK_COPIED' : 'SHARE_PROFILE'}</span>
              </button>

              <button
                onClick={() => downloadVCard(profile)}
                className="px-5 py-2.5 rounded-xl bg-[#131d35] hover:bg-[#1a2747] text-slate-200 border border-slate-750 font-mono text-xs flex items-center justify-center gap-2 transition-colors print:hidden"
                title="Save direct contact to your phone address book"
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                <span>EXPORT_VCARD.VCF</span>
              </button>

              <div className="grid grid-cols-2 gap-2 font-mono text-xs print:hidden">
                <button
                  onClick={() => setIsQrOpen(true)}
                  className="px-3 py-2 rounded-xl bg-[#090e1b] hover:bg-[#131d35] text-slate-300 border border-slate-800 flex items-center justify-center gap-1.5 transition-colors"
                  title="Open QR Code to scan on mobile"
                >
                  <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                  <span>QR_CODE</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-2 rounded-xl bg-[#090e1b] hover:bg-[#131d35] text-slate-300 border border-slate-800 flex items-center justify-center gap-1.5 transition-colors"
                  title="Print or Save as Clean PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-cyan-400" />
                  <span>PRINT_PDF</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-[#131d35] hover:bg-[#1a2747] text-slate-400 hover:text-emerald-400 border border-slate-800 transition-colors"
                    title="LinkedIn"
                  >
                    <LinkedInIcon className="w-4 h-4" />
                  </a>
                )}
                {profile.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-[#131d35] hover:bg-[#1a2747] text-slate-400 hover:text-emerald-400 border border-slate-800 transition-colors"
                    title="GitHub"
                  >
                    <GitHubIcon className="w-4 h-4" />
                  </a>
                )}
                {profile.portfolioUrl && (
                  <a
                    href={profile.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-[#131d35] hover:bg-[#1a2747] text-slate-400 hover:text-emerald-400 border border-slate-800 transition-colors"
                    title="External Site"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* METRICS GRID / GITHUB COMMIT STYLE TILES */}
          {profile.metrics && profile.metrics.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-800/80">
              {profile.metrics.map((metric, i) => (
                <div key={i} className="bg-[#080d1a] border border-slate-800/80 rounded-xl p-4 text-left font-mono space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                    {metric.value}
                  </div>
                  <div className="text-xs font-semibold text-slate-300">
                    {metric.label}
                  </div>
                  {metric.description && (
                    <div className="text-[11px] text-slate-500 truncate">
                      {metric.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </header>

        {/* SUMMARY / SYSTEM ARCHITECTURE */}
        {profile.summary && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
              <Code2 className="w-4 h-4" />
              <span>{"// executive_summary.md"}</span>
            </div>
            <div className="bg-[#0d1527]/70 border border-slate-800/80 rounded-2xl p-6 sm:p-8 text-slate-300 leading-relaxed text-sm sm:text-base space-y-4 font-sans">
              {profile.summary.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS MATRIX / TECH STACK PILLS */}
        {profile.skillGroups && profile.skillGroups.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>{"// technical_stack_and_capabilities"}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {profile.skillGroups.map((group, idx) => (
                <div key={idx} className="bg-[#0d1527]/70 border border-slate-800/80 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold font-mono text-slate-200 border-b border-slate-800 pb-2 flex items-center justify-between">
                    <span>{group.category}</span>
                    <span className="text-emerald-400 text-xs">[{group.skills.length}]</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 rounded-md bg-[#131d35] border border-slate-700/60 text-emerald-300 font-mono text-xs hover:border-emerald-500/50 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* WORK EXPERIENCE / GIT COMMITS TIMELINE */}
        {profile.experiences && profile.experiences.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
              <GitBranch className="w-4 h-4" />
              <span>{"// git_log_work_history"}</span>
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-800">
              {profile.experiences.map((exp) => (
                <div key={exp.id} className="relative pl-12 space-y-3">
                  {/* Git commit dot */}
                  <div className="absolute left-3.5 top-1.5 w-3.5 h-3.5 rounded-full bg-[#070b14] border-2 border-emerald-400 z-10" />

                  <div className="bg-[#0d1527]/70 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 hover:border-slate-700 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <div>
                        <h3 className="text-lg font-bold text-white font-mono">
                          {exp.role}
                        </h3>
                        <p className="text-sm font-semibold text-emerald-400">
                          {exp.company} {exp.location ? `— ${exp.location}` : ''}
                        </p>
                      </div>
                      <span className="text-xs font-mono text-slate-400 bg-[#131d35] px-2.5 py-1 rounded-md border border-slate-800 shrink-0">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>

                    {exp.description && (
                      <p className="text-sm text-slate-300 leading-relaxed font-sans">
                        {exp.description}
                      </p>
                    )}

                    {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                      <ul className="space-y-2 pt-2 border-t border-slate-800/60 font-sans">
                        {exp.bulletPoints.map((bullet, bIdx) => (
                          <li key={bIdx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2.5">
                            <span className="text-emerald-400 font-mono mt-0.5 select-none">&gt;</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS SHOWCASE */}
        {profile.projects && profile.projects.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>{"// production_shipped_projects"}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.projects.map((proj) => (
                <div key={proj.id} className="bg-[#0d1527]/70 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-white font-mono">
                        {proj.title}
                      </h3>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                      {proj.description}
                    </p>
                    {proj.metrics && (
                      <div className="text-xs font-mono text-emerald-300 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-lg inline-block">
                        Metric: {proj.metrics}
                      </div>
                    )}
                  </div>

                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/60">
                      {proj.technologies.map((t, idx) => (
                        <span key={idx} className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#131d35] text-slate-300 border border-slate-800">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION & CERTIFICATIONS */}
        {((profile.education && profile.education.length > 0) || (profile.certifications && profile.certifications.length > 0)) && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.education && profile.education.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4" />
                  <span>{"// education"}</span>
                </div>
                <div className="bg-[#0d1527]/70 border border-slate-800/80 rounded-2xl p-6 space-y-4">
                  {profile.education.map((edu) => (
                    <div key={edu.id} className="space-y-1 font-mono">
                      <h4 className="text-sm font-bold text-white">{edu.degree}</h4>
                      <p className="text-xs text-emerald-400">{edu.fieldOfStudy}</p>
                      <p className="text-xs text-slate-400">{edu.institution} {edu.endDate ? `(${edu.endDate})` : ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profile.certifications && profile.certifications.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  <span>{"// certifications"}</span>
                </div>
                <div className="bg-[#0d1527]/70 border border-slate-800/80 rounded-2xl p-6 space-y-3 font-mono text-xs">
                  {profile.certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* VERIFIED CREDENTIALS & CERTIFICATES PHOTO GALLERY */}
        {profile.certificates && profile.certificates.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  <span>{"// verified_credentials"}</span>
                </div>
                <h2 className="text-2xl font-bold text-white font-mono">
                  Official Certifications & Verification
                </h2>
              </div>
              <span className="font-mono text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 self-start sm:self-auto">
                {profile.certificates.length} cryptographic records
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.certificates.map((cert) => (
                <div 
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  className="group bg-[#0d1527]/80 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 flex flex-col justify-between cursor-pointer"
                >
                  <div className="space-y-3">
                    {cert.imageUrl ? (
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                        <img 
                          src={cert.imageUrl} 
                          alt={cert.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        {cert.badge && (
                          <span className="absolute top-2.5 right-2.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 shadow-md">
                            {cert.badge}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-video w-full rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-500/40 font-mono text-xs">
                        [CERTIFICATE_PREVIEW]
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between text-xs text-emerald-400 font-mono">
                        <span>{cert.issuer}</span>
                        {cert.issueDate && <span className="text-slate-400">{cert.issueDate}</span>}
                      </div>
                      <h3 className="text-sm font-bold text-white mt-1 group-hover:text-emerald-300 transition-colors line-clamp-2 font-mono">
                        {cert.title}
                      </h3>
                      <p className="text-[11px] font-mono text-slate-500 mt-1 flex items-center gap-1 group-hover:text-emerald-400">
                        <span>{"// click_to_inspect"}</span>
                      </p>
                    </div>
                  </div>

                  {cert.credentialUrl && (
                    <a 
                      href={cert.credentialUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={(e) => e.stopPropagation()}
                      className="mt-4 pt-3 border-t border-slate-800/80 inline-flex items-center justify-between text-xs font-mono text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        verify_hash
                      </span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* RECRUITER CONTACT FORM */}
        <section className="bg-gradient-to-br from-[#0d1527] to-[#070b14] border border-emerald-900/40 rounded-3xl p-8 sm:p-10 shadow-2xl print:hidden">
          <div className="max-w-xl mx-auto space-y-6 text-center">
            <div className="space-y-2">
              <span className="font-mono text-xs text-emerald-400">{"// initialize_communication"}</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-mono">
                Initiate Recruiter Inquiry
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-sans">
                Looking for technical leadership, high-scale engineering, or architectural consultation? Send a direct dispatch.
              </p>
            </div>

            {contactSubmitted ? (
              <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-6 font-mono text-emerald-300 text-sm space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
                <p>Dispatch received! Candidate notified directly.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-left font-mono">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#080d1a] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Sarah Connor (Talent Lead)"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Your Work Email</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#080d1a] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                    placeholder="s.connor@enterprise.com"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Message / Role Scope</label>
                  <textarea
                    required
                    rows={3}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#080d1a] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                    placeholder="We have an open Principal / Lead opportunity..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                >
                  <Send className="w-4 h-4" />
                  <span>TRANSMIT_DISPATCH()</span>
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center font-mono text-xs text-slate-600 pt-8 border-t border-slate-900 print:hidden">
          <p>Generated by CVtoWeb Platform • Verified Candidate Dossier</p>
        </footer>
      </div>

      {/* QR Code & Certificate Modals */}
      <QRCodeModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        url={typeof window !== 'undefined' ? window.location.href : `https://cv-to-web.pages.dev/cv/${profile.slug}`}
        candidateName={profile.fullName}
      />

      <CertificateModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
}
