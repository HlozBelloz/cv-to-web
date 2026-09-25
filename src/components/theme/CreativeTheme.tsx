'use client';

import React, { useState } from 'react';
import { CVProfile } from '@/types';
import { 
  Sparkles, 
  Palette, 
  Rocket, 
  ExternalLink, 
  Download, 
  Share2, 
  CheckCircle2, 
  Send, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Zap,
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

export function CreativeTheme({ profile }: Props) {
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
    <div className="min-h-screen bg-[#090514] text-slate-100 antialiased selection:bg-rose-500/30 selection:text-rose-200">
      {/* Top Banner if custom domain is active */}
      {profile.customDomain && (
        <div className="bg-[#120a26] border-b border-purple-900/40 text-xs text-center py-1.5 text-purple-300">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Globe className="w-3.5 h-3.5 text-rose-400" />
            Live Creative Domain: <strong className="text-white">{profile.customDomain}</strong>
          </span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-16">
        
        {/* HERO SECTION / BENTO HEADER */}
        <header className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Bio Card */}
          <div className="lg:col-span-2 relative bg-gradient-to-br from-[#160c30] via-[#1a0f38] to-[#0f0722] border border-purple-800/40 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6 overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-bl from-rose-500/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-500/20 to-purple-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              Creative Specialist & Visionary
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-6">
              {profile.avatarUrl && (
                <div className="relative shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-rose-500/60 shadow-xl shadow-rose-500/20 bg-[#160c30]">
                    <img
                      src={profile.avatarUrl}
                      alt={profile.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-[10px] shadow-sm flex items-center gap-1 border border-purple-950">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                    Verified
                  </span>
                </div>
              )}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
                  {profile.fullName}
                </h1>
                <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-rose-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                  {profile.title}
                </p>
              </div>
            </div>

            <p className="text-base text-purple-100/90 leading-relaxed max-w-xl">
              {profile.tagline}
            </p>

            {/* Meta details */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-purple-300/80 pt-2">
              {profile.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {profile.location}
                </span>
              )}
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Mail className="w-3.5 h-3.5 text-rose-400" />
                  {profile.email}
                </a>
              )}
              {profile.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-rose-400" />
                  {profile.phone}
                </span>
              )}
            </div>
          </div>

          {/* Side Action & Socials Bento Card */}
          <div className="bg-[#140b2b] border border-purple-800/40 rounded-3xl p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
                <Rocket className="w-4 h-4" />
                <span>Connect & Acquire</span>
              </div>
              <p className="text-xs text-purple-300/80 leading-relaxed">
                Available for high-stakes leadership roles, design direction, and innovative venture development.
              </p>
            </div>

            <div className="space-y-3">
              {profile.originalPdfUrl && (
                <a
                  href={profile.originalPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-500/20 print:hidden"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Curriculum</span>
                </a>
              )}

              <button
                onClick={handleCopyLink}
                className="w-full py-3 px-4 rounded-2xl bg-[#1e103d] hover:bg-[#281552] text-purple-200 border border-purple-700/50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors print:hidden"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-purple-400" />}
                <span>{copied ? 'Link Copied!' : 'Share Portfolio'}</span>
              </button>

              <button
                onClick={() => downloadVCard(profile)}
                className="w-full py-3 px-4 rounded-2xl bg-[#1e103d] hover:bg-[#281552] text-purple-200 border border-purple-700/50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors print:hidden"
                title="Save contact directly to phone contacts"
              >
                <UserPlus className="w-3.5 h-3.5 text-rose-400" />
                <span>Save Contact (vCard)</span>
              </button>

              <div className="grid grid-cols-2 gap-2 print:hidden">
                <button
                  onClick={() => setIsQrOpen(true)}
                  className="py-2.5 px-3 rounded-2xl bg-[#100724] hover:bg-[#1e103d] text-purple-300 border border-purple-800/60 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  title="Open QR Code to scan on mobile"
                >
                  <QrCode className="w-3.5 h-3.5 text-rose-400" />
                  <span>QR Code</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="py-2.5 px-3 rounded-2xl bg-[#100724] hover:bg-[#1e103d] text-purple-300 border border-purple-800/60 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  title="Print or Save as Clean PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Print</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#1e103d] hover:bg-[#281552] text-purple-300 hover:text-rose-400 border border-purple-700/40 transition-colors"
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
                    className="p-3 rounded-xl bg-[#1e103d] hover:bg-[#281552] text-purple-300 hover:text-rose-400 border border-purple-700/40 transition-colors"
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
                    className="p-3 rounded-xl bg-[#1e103d] hover:bg-[#281552] text-purple-300 hover:text-rose-400 border border-purple-700/40 transition-colors"
                    title="External Works"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* METRICS BENTO TILES */}
        {profile.metrics && profile.metrics.length > 0 && (
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {profile.metrics.map((metric, i) => (
              <div 
                key={i} 
                className="bg-[#140b2b]/90 border border-purple-800/40 rounded-2xl p-5 space-y-1 hover:border-purple-600 transition-colors"
              >
                <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-rose-400 to-amber-300 bg-clip-text text-transparent">
                  {metric.value}
                </div>
                <div className="text-xs font-bold text-white">
                  {metric.label}
                </div>
                {metric.description && (
                  <div className="text-[11px] text-purple-300/70 truncate">
                    {metric.description}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* EXECUTIVE NARRATIVE */}
        {profile.summary && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
              <Palette className="w-4 h-4" />
              <span>Vision & Philosophy</span>
            </div>
            <div className="bg-[#140b2b]/80 border border-purple-800/40 rounded-3xl p-8 text-purple-100/90 leading-relaxed text-base space-y-4 shadow-xl">
              {profile.summary.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS & CRAFT BENTO */}
        {profile.skillGroups && profile.skillGroups.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
              <Zap className="w-4 h-4" />
              <span>Creative Superpowers & Toolkit</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {profile.skillGroups.map((group, idx) => (
                <div key={idx} className="bg-[#140b2b]/80 border border-purple-800/40 rounded-3xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-purple-800/40 pb-2">
                    {group.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-3 py-1 rounded-full bg-[#201042] border border-purple-700/50 text-rose-200 text-xs font-medium hover:scale-105 transition-transform"
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

        {/* WORK JOURNEY / STORY TIMELINE */}
        {profile.experiences && profile.experiences.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
              <Rocket className="w-4 h-4" />
              <span>Experience & Trajectory</span>
            </div>

            <div className="space-y-6">
              {profile.experiences.map((exp) => (
                <div key={exp.id} className="bg-[#140b2b]/80 border border-purple-800/40 rounded-3xl p-8 space-y-4 hover:border-purple-600/80 transition-colors shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-black text-white">
                        {exp.role}
                      </h3>
                      <p className="text-sm font-semibold text-rose-400">
                        {exp.company} {exp.location ? `— ${exp.location}` : ''}
                      </p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#24124a] text-purple-300 border border-purple-700/40 shrink-0">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-sm text-purple-200/90 leading-relaxed">
                      {exp.description}
                    </p>
                  )}

                  {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                    <ul className="space-y-2 pt-2 border-t border-purple-800/40">
                      {exp.bulletPoints.map((bullet, bIdx) => (
                        <li key={bIdx} className="text-xs sm:text-sm text-purple-200/90 flex items-start gap-2.5">
                          <span className="text-rose-400 mt-1">✦</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FEATURED PROJECTS BENTO */}
        {profile.projects && profile.projects.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
              <Sparkles className="w-4 h-4" />
              <span>Signature Projects & Deliverables</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.projects.map((proj) => (
                <div key={proj.id} className="bg-[#140b2b]/80 border border-purple-800/40 rounded-3xl p-7 flex flex-col justify-between space-y-4 hover:border-rose-500/50 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-black text-white">
                        {proj.title}
                      </h3>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-rose-400 hover:text-rose-300">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed">
                      {proj.description}
                    </p>
                    {proj.metrics && (
                      <div className="text-xs font-bold text-rose-300 bg-rose-950/40 border border-rose-800/40 px-3 py-1.5 rounded-xl inline-block">
                        Metric: {proj.metrics}
                      </div>
                    )}
                  </div>

                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-purple-800/40">
                      {proj.technologies.map((t, idx) => (
                        <span key={idx} className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-[#201042] text-purple-200">
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

        {/* EDUCATION & HONORS */}
        {((profile.education && profile.education.length > 0) || (profile.certifications && profile.certifications.length > 0)) && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.education && profile.education.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
                  <GraduationCap className="w-4 h-4" />
                  <span>Education</span>
                </div>
                <div className="bg-[#140b2b]/80 border border-purple-800/40 rounded-3xl p-6 space-y-4">
                  {profile.education.map((edu) => (
                    <div key={edu.id} className="space-y-1">
                      <h4 className="text-sm font-bold text-white">{edu.degree}</h4>
                      <p className="text-xs text-rose-400 font-semibold">{edu.fieldOfStudy}</p>
                      <p className="text-xs text-purple-300/80">{edu.institution} {edu.endDate ? `(${edu.endDate})` : ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profile.certifications && profile.certifications.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
                  <Award className="w-4 h-4" />
                  <span>Credentials</span>
                </div>
                <div className="bg-[#140b2b]/80 border border-purple-800/40 rounded-3xl p-6 space-y-3 text-xs">
                  {profile.certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-purple-200">
                      <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
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
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
                  <Award className="w-4 h-4" />
                  <span>Verified Credentials</span>
                </div>
                <h2 className="text-2xl font-black text-white">
                  Certified Accomplishments & Diplomas
                </h2>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 self-start sm:self-auto">
                {profile.certificates.length} Verified Credentials
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.certificates.map((cert) => (
                <div 
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  className="group bg-[#140b2b]/90 border border-purple-800/40 hover:border-rose-500/50 rounded-3xl p-5 transition-all duration-300 hover:shadow-2xl hover:shadow-rose-500/10 flex flex-col justify-between cursor-pointer"
                >
                  <div className="space-y-4">
                    {cert.imageUrl ? (
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-purple-900/40">
                        <img 
                          src={cert.imageUrl} 
                          alt={cert.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        {cert.badge && (
                          <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-md">
                            {cert.badge}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-video w-full rounded-2xl bg-[#1e103d] border border-purple-800/40 flex items-center justify-center text-purple-400">
                        <Award className="w-8 h-8" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between text-xs text-rose-400 font-medium">
                        <span>{cert.issuer}</span>
                        {cert.issueDate && <span className="text-purple-300/60">{cert.issueDate}</span>}
                      </div>
                      <h3 className="text-sm font-bold text-white mt-1 group-hover:text-rose-300 transition-colors line-clamp-2">
                        {cert.title}
                      </h3>
                      <p className="text-[11px] text-purple-400/70 mt-1 flex items-center gap-1 group-hover:text-rose-300">
                        <span>Click to view credential record</span>
                      </p>
                    </div>
                  </div>

                  {cert.credentialUrl && (
                    <a 
                      href={cert.credentialUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={(e) => e.stopPropagation()}
                      className="mt-4 pt-3 border-t border-purple-900/40 inline-flex items-center justify-between text-xs text-purple-300 hover:text-white transition-colors font-medium"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                        Verify Credential
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
        <section className="bg-gradient-to-br from-[#1a0f38] to-[#120a26] border border-purple-700/50 rounded-3xl p-8 sm:p-12 shadow-2xl print:hidden">
          <div className="max-w-xl mx-auto space-y-6 text-center">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Get in Touch</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Start a Conversation
              </h2>
              <p className="text-xs sm:text-sm text-purple-300/80">
                Interested in collaboration, design direction, or bringing bold ideas to life?
              </p>
            </div>

            {contactSubmitted ? (
              <div className="bg-rose-950/40 border border-rose-800/60 rounded-2xl p-6 text-rose-300 text-sm space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-rose-400" />
                <p>Thank you! Your message has been sent directly to the candidate.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
                <div>
                  <label className="text-xs text-purple-300 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0e071e] border border-purple-800 text-white text-xs focus:outline-none focus:border-rose-500"
                    placeholder="e.g. Maya Lin"
                  />
                </div>
                <div>
                  <label className="text-xs text-purple-300 block mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0e071e] border border-purple-800 text-white text-xs focus:outline-none focus:border-rose-500"
                    placeholder="maya@studio.design"
                  />
                </div>
                <div>
                  <label className="text-xs text-purple-300 block mb-1">Inquiry / Project Scope</label>
                  <textarea
                    required
                    rows={3}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0e071e] border border-purple-800 text-white text-xs focus:outline-none focus:border-rose-500"
                    placeholder="Let's build something exceptional..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-500/20"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="text-center text-xs text-purple-400/60 pt-8 border-t border-purple-900/40 print:hidden">
          <p>© {new Date().getFullYear()} {profile.fullName} • Powered by CVtoWeb</p>
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
