'use client';

import React, { useState } from 'react';
import { CVProfile } from '@/types';
import { 
  Download, 
  Share2, 
  CheckCircle2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  ArrowUpRight
} from 'lucide-react';

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

export function MinimalistTheme({ profile }: Props) {
  const [copied, setCopied] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

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
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1917] antialiased selection:bg-stone-300 selection:text-stone-900 font-sans">
      {/* Top Banner if custom domain is active */}
      {profile.customDomain && (
        <div className="bg-[#f2efe9] border-b border-stone-200 text-xs text-center py-2 text-stone-600">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Globe className="w-3.5 h-3.5 text-stone-500" />
            Verified Portfolio: <strong>{profile.customDomain}</strong>
          </span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-24 space-y-20">
        
        {/* HEADER SECTION */}
        <header className="space-y-8 border-b border-stone-300 pb-12">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
                Curriculum Vitae & Professional Portfolio
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal tracking-tight text-stone-900">
                {profile.fullName}
              </h1>
              <p className="text-xl sm:text-2xl text-stone-700 font-serif italic">
                {profile.title}
              </p>
              <p className="text-base text-stone-600 leading-relaxed pt-2">
                {profile.tagline}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
              {profile.originalPdfUrl && (
                <a
                  href={profile.originalPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-50 flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
              )}
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-lg border border-stone-300 hover:bg-stone-200/60 text-stone-800 flex items-center justify-center gap-2 transition-colors"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Contact Details Bar */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-stone-600 border-t border-stone-200 pt-4">
            {profile.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                {profile.location}
              </span>
            )}
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 hover:text-stone-900 transition-colors">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                {profile.email}
              </a>
            )}
            {profile.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                {profile.phone}
              </span>
            )}
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-stone-900 transition-colors">
                <LinkedInIcon className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3 h-3 text-stone-400" />
              </a>
            )}
            {profile.githubUrl && (
              <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-stone-900 transition-colors">
                <GitHubIcon className="w-3.5 h-3.5" />
                <span>GitHub</span>
                <ArrowUpRight className="w-3 h-3 text-stone-400" />
              </a>
            )}
          </div>
        </header>

        {/* METRICS ROW */}
        {profile.metrics && profile.metrics.length > 0 && (
          <section className="grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-stone-200 pb-12">
            {profile.metrics.map((m, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-3xl sm:text-4xl font-serif text-stone-900">
                  {m.value}
                </div>
                <div className="text-xs uppercase tracking-wider font-semibold text-stone-700">
                  {m.label}
                </div>
                {m.description && (
                  <div className="text-xs text-stone-500">
                    {m.description}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* EXECUTIVE SUMMARY */}
        {profile.summary && (
          <section className="space-y-4 border-b border-stone-200 pb-12">
            <h2 className="text-xs uppercase tracking-widest text-stone-500 font-bold">
              01. Executive Overview
            </h2>
            <div className="text-stone-700 font-serif text-lg leading-relaxed space-y-4 max-w-3xl">
              {profile.summary.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>
        )}

        {/* WORK EXPERIENCE */}
        {profile.experiences && profile.experiences.length > 0 && (
          <section className="space-y-8 border-b border-stone-200 pb-12">
            <h2 className="text-xs uppercase tracking-widest text-stone-500 font-bold">
              02. Professional Experience
            </h2>

            <div className="space-y-10">
              {profile.experiences.map((exp) => (
                <div key={exp.id} className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-stone-200 pb-2">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-stone-900">
                        {exp.role}
                      </h3>
                      <p className="text-sm text-stone-600 italic">
                        {exp.company} {exp.location ? `— ${exp.location}` : ''}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-stone-500 shrink-0">
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-sm text-stone-600 leading-relaxed">
                      {exp.description}
                    </p>
                  )}

                  {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                    <ul className="space-y-2 pt-1 pl-4 list-disc list-outside text-stone-700 text-sm leading-relaxed marker:text-stone-400">
                      {exp.bulletPoints.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS & CAPABILITIES */}
        {profile.skillGroups && profile.skillGroups.length > 0 && (
          <section className="space-y-6 border-b border-stone-200 pb-12">
            <h2 className="text-xs uppercase tracking-widest text-stone-500 font-bold">
              03. Competencies & Domain Expertise
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {profile.skillGroups.map((g, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wide border-b border-stone-200 pb-1">
                    {g.category}
                  </h3>
                  <ul className="space-y-1 text-sm text-stone-600">
                    {g.skills.map((skill, sIdx) => (
                      <li key={sIdx} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-stone-400" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* KEY PROJECTS */}
        {profile.projects && profile.projects.length > 0 && (
          <section className="space-y-6 border-b border-stone-200 pb-12">
            <h2 className="text-xs uppercase tracking-widest text-stone-500 font-bold">
              04. Selected Works & Case Studies
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {profile.projects.map((proj) => (
                <div key={proj.id} className="p-6 bg-[#f5f2ec] rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-serif font-bold text-stone-900">
                      {proj.title}
                    </h3>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-stone-900">
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {proj.description}
                  </p>
                  {proj.metrics && (
                    <div className="text-xs font-serif italic text-stone-800 pt-1">
                      Result: {proj.metrics}
                    </div>
                  )}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2">
                      {proj.technologies.map((t, tIdx) => (
                        <span key={tIdx} className="text-[11px] px-2 py-0.5 rounded bg-stone-200 text-stone-700">
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
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-stone-200 pb-12">
            {profile.education && profile.education.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xs uppercase tracking-widest text-stone-500 font-bold">
                  05. Academic Background
                </h2>
                <div className="space-y-4">
                  {profile.education.map((edu) => (
                    <div key={edu.id} className="space-y-1">
                      <h4 className="text-sm font-bold text-stone-900 font-serif">{edu.degree}</h4>
                      <p className="text-xs text-stone-600">{edu.fieldOfStudy}</p>
                      <p className="text-xs text-stone-500">{edu.institution} {edu.endDate ? `(${edu.endDate})` : ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profile.certifications && profile.certifications.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xs uppercase tracking-widest text-stone-500 font-bold">
                  06. Honors & Credentials
                </h2>
                <ul className="space-y-2 text-xs text-stone-700">
                  {profile.certifications.map((c, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-500" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* RECRUITER INQUIRY */}
        <section className="space-y-6">
          <div className="max-w-xl mx-auto space-y-4 text-center">
            <h2 className="text-2xl font-serif text-stone-900">
              Direct Inquiry & Consultation
            </h2>
            <p className="text-xs text-stone-600">
              Inquire regarding executive leadership, advisory roles, or strategic opportunities.
            </p>

            {contactSubmitted ? (
              <div className="p-6 bg-stone-200 rounded-xl text-stone-800 text-xs">
                Inquiry received. Candidate will review and respond shortly.
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3 text-left">
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 text-stone-900 text-xs focus:outline-none focus:border-stone-600"
                    placeholder="e.g. Eleanor Vance"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Your Work Email</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 text-stone-900 text-xs focus:outline-none focus:border-stone-600"
                    placeholder="e.vance@venture.com"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Opportunity Details</label>
                  <textarea
                    required
                    rows={3}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-300 text-stone-900 text-xs focus:outline-none focus:border-stone-600"
                    placeholder="We would love to discuss..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="text-center text-xs text-stone-500 border-t border-stone-200 pt-8">
          <p>© {new Date().getFullYear()} {profile.fullName}. Professional Portfolio.</p>
        </footer>
      </div>
    </div>
  );
}
