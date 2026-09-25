'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CVProfile } from '@/types';
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  Mail, 
  Phone, 
  MapPin, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Send, 
  Share2,
  TrendingUp,
  Globe,
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

export function ExecutiveTheme({ profile }: Props) {
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
    // In production, this can send a notification email via Resend or Cloudflare Email
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Banner if custom domain is active */}
      {profile.customDomain && (
        <div className="bg-slate-900/90 border-b border-slate-800 text-xs text-center py-1.5 text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            Verified Executive Domain: <strong className="text-slate-200">{profile.customDomain}</strong>
          </span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-16">
        
        {/* HERO SECTION */}
        <header className="relative bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/80 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-start gap-6 max-w-3xl">
              {profile.avatarUrl && (
                <div className="relative shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-500/60 shadow-lg shadow-amber-500/10 bg-slate-800">
                    <img
                      src={profile.avatarUrl}
                      alt={profile.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500/90 text-slate-950 font-bold text-[10px] shadow-sm flex items-center gap-1 border border-slate-900">
                    <CheckCircle2 className="w-3 h-3 text-slate-950" />
                    Verified
                  </span>
                </div>
              )}

              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Available for Strategic Roles & Consultations
                </div>

                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                  {profile.fullName}
                </h1>

                <p className="text-xl sm:text-2xl font-semibold text-amber-400/90">
                  {profile.title}
                </p>

                <p className="text-base text-slate-300 leading-relaxed max-w-2xl">
                  {profile.tagline}
                </p>

                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-400 pt-2">
                  {profile.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      {profile.location}
                    </span>
                  )}
                  {profile.email && (
                    <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
                      <Mail className="w-4 h-4 text-slate-500" />
                      {profile.email}
                    </a>
                  )}
                  {profile.phone && (
                    <a href={`tel:${profile.phone}`} className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
                      <Phone className="w-4 h-4 text-slate-500" />
                      {profile.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              {profile.originalPdfUrl && (
                <a
                  href={profile.originalPdfUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] print:hidden"
                >
                  <Download className="w-4 h-4" />
                  Download Original CV
                </a>
              )}

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 font-medium text-sm transition-all print:hidden"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                {copied ? 'Link Copied!' : 'Share Portfolio'}
              </button>

              <button
                onClick={() => downloadVCard(profile)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-750 font-medium text-xs transition-all print:hidden"
                title="Save contact directly to phone address book"
              >
                <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                <span>Save Contact (vCard)</span>
              </button>

              <div className="grid grid-cols-2 gap-2 print:hidden">
                <button
                  onClick={() => setIsQrOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-xs transition-all"
                  title="Scan portfolio QR on mobile"
                >
                  <QrCode className="w-3.5 h-3.5 text-amber-400" />
                  <span>QR Code</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-xs transition-all"
                  title="Print or Save as Clean PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Print / PDF</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    title="LinkedIn Profile"
                  >
                    <LinkedInIcon className="w-5 h-5" />
                  </a>
                )}
                {profile.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    title="GitHub Profile"
                  >
                    <GitHubIcon className="w-5 h-5" />
                  </a>
                )}
                {profile.portfolioUrl && (
                  <a
                    href={profile.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    title="External Link"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* KEY HIGHLIGHT METRICS */}
        {profile.metrics && profile.metrics.length > 0 && (
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {profile.metrics.map((metric, idx) => (
              <div 
                key={idx}
                className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 text-center transition-transform hover:-translate-y-1"
              >
                <div className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">
                  {metric.value}
                </div>
                <div className="text-sm font-semibold text-slate-200 mt-1">
                  {metric.label}
                </div>
                {metric.description && (
                  <div className="text-xs text-slate-400 mt-0.5">
                    {metric.description}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* EXECUTIVE SUMMARY */}
        {profile.summary && (
          <section className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 sm:p-10 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              Executive Profile & Leadership Scope
            </h2>
            <p className="text-slate-300 leading-relaxed whitespace-pre-line text-base">
              {profile.summary}
            </p>
          </section>
        )}

        {/* CAREER TRAJECTORY & EXPERIENCE */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-amber-400" />
              Career Milestones & Leadership Experience
            </h2>
          </div>

          <div className="relative border-l-2 border-slate-800 ml-4 pl-6 sm:pl-8 space-y-12">
            {profile.experiences.map((exp) => (
              <div key={exp.id} className="relative group">
                {/* Timeline node */}
                <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-amber-400 group-hover:bg-amber-400 transition-colors" />

                <div className="bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 sm:p-8 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                        {exp.role}
                      </h3>
                      <p className="text-amber-400/90 font-medium">
                        {exp.company} {exp.location && <span className="text-slate-400 text-sm font-normal">| {exp.location}</span>}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-800 text-xs font-semibold text-slate-300 w-fit">
                      {exp.startDate} — {exp.endDate}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-slate-300 text-sm mt-3">
                      {exp.description}
                    </p>
                  )}

                  {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                    <ul className="mt-4 space-y-2 text-sm text-slate-300">
                      {exp.bulletPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="text-amber-400 font-bold mt-1 text-xs">▸</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CORE COMPETENCIES & SKILLS TAXONOMY */}
        {profile.skillGroups && profile.skillGroups.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3 border-b border-slate-800 pb-4">
              <Award className="w-6 h-6 text-amber-400" />
              Core Competencies & Domain Expertise
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {profile.skillGroups.map((group, idx) => (
                <div key={idx} className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 space-y-4">
                  <h3 className="font-semibold text-amber-300 text-base">
                    {group.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill, sIdx) => (
                      <span 
                        key={sIdx} 
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/60 rounded-lg text-xs font-medium"
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

        {/* NOTABLE PROJECTS */}
        {profile.projects && profile.projects.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3 border-b border-slate-800 pb-4">
              <ExternalLink className="w-6 h-6 text-amber-400" />
              Strategic Initiatives & Projects
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.projects.map((proj) => (
                <div key={proj.id} className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-lg">{proj.title}</h3>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-amber-400">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-slate-300">{proj.description}</p>
                    {proj.metrics && (
                      <div className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded w-fit">
                        Impact: {proj.metrics}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {proj.technologies.map((t, i) => (
                      <span key={i} className="text-[11px] font-mono px-2 py-0.5 bg-slate-800 text-slate-400 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION & CREDENTIALS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Education */}
          {profile.education && profile.education.length > 0 && (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-400" />
                Education & Academics
              </h3>
              <div className="space-y-4">
                {profile.education.map((edu) => (
                  <div key={edu.id} className="border-b border-slate-800/60 pb-3 last:border-none last:pb-0">
                    <div className="font-bold text-slate-200">{edu.degree}</div>
                    <div className="text-sm text-amber-400">{edu.fieldOfStudy}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{edu.institution} • {edu.startDate}-{edu.endDate}</div>
                    {edu.honors && <div className="text-xs text-emerald-400 mt-1">{edu.honors}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {profile.certifications && profile.certifications.length > 0 && (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Executive Certifications
              </h3>
              <ul className="space-y-2.5">
                {profile.certifications.map((cert, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* VERIFIED CERTIFICATES & CREDENTIALS VISUAL SHOWCASE */}
        {profile.certificates && profile.certificates.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                  <Award className="w-6 h-6 text-amber-400" />
                  Verified Credentials & Official Certifications
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Authentic credential verification and certified achievements.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold self-start sm:self-auto">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {profile.certificates.length} Verified Records
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.certificates.map((cert) => (
                <div 
                  key={cert.id} 
                  onClick={() => setSelectedCert(cert)}
                  className="group bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between cursor-pointer"
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
                          <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 shadow-md">
                            {cert.badge}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-video w-full rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                        <Award className="w-8 h-8 text-amber-500/40" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between text-xs text-amber-400 font-medium">
                        <span>{cert.issuer}</span>
                        {cert.issueDate && <span className="text-slate-400">{cert.issueDate}</span>}
                      </div>
                      <h3 className="text-sm font-bold text-white mt-1 group-hover:text-amber-300 transition-colors line-clamp-2">
                        {cert.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 group-hover:text-slate-400">
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
                      className="mt-4 pt-3 border-t border-slate-800/80 inline-flex items-center justify-between text-xs text-slate-400 hover:text-amber-300 transition-colors font-medium"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
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

        {/* RECRUITER / CONTACT INQUIRY SECTION */}
        <section className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl print:hidden">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Connect Directly with {profile.fullName.split(' ')[0]}
            </h2>
            <p className="text-sm text-slate-400">
              For executive hiring, strategic consulting, or technical advisory discussions.
            </p>

            {contactSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <span className="font-medium">Thank you! Your message has been sent directly to {profile.fullName}.</span>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-left pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Your Name / Organization"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Work Email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm"
                  />
                </div>
                <textarea
                  required
                  rows={4}
                  placeholder={`Write a brief message or opportunity details for ${profile.fullName}...`}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20"
                >
                  <Send className="w-4 h-4" />
                  Send Inquiries
                </button>
              </form>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="text-center text-xs text-slate-500 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
          <p>© {new Date().getFullYear()} {profile.fullName}. All rights reserved.</p>
          <Link 
            href="/"
            className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5"
          >
            Powered by <strong className="text-slate-300 font-semibold">CVtoWeb</strong> — Convert your CV to a live website
          </Link>
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
