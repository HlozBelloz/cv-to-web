'use client';

import React, { useState } from 'react';
import { CVProfile, CertificateItem, Project } from '@/types';
import { 
  Download, 
  Share2, 
  CheckCircle2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  ArrowUpRight,
  ExternalLink,
  Award,
  QrCode,
  Printer,
  UserPlus,
  BookOpen,
  GraduationCap,
  Sparkles,
  Layers,
  Network,
  Cpu,
  Tv,
  Check,
  Edit3
} from 'lucide-react';
import { downloadVCard } from '@/lib/vcard';
import { QRCodeModal } from '@/components/common/QRCodeModal';
import { CertificateModal } from '@/components/common/CertificateModal';
import { AdminAuthModal } from '@/components/common/AdminAuthModal';
import { LiveEditorModal } from '@/components/common/LiveEditorModal';

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

export function PortfolioWpProTheme({ profile: initialProfile }: Props) {
  const [profile, setProfile] = useState<CVProfile>(initialProfile);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectFilter, setProjectFilter] = useState<string>('All');
  const [certFilter, setCertFilter] = useState<string>('All');
  
  // Auth & Live Editor Modals
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isLiveEditorOpen, setIsLiveEditorOpen] = useState(false);

  // Sync state if initialProfile changes
  React.useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  const handleCopyEmail = () => {
    if (typeof window !== 'undefined' && profile.email) {
      navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleOpenEditor = () => {
    // Check if already authorized
    if (typeof window !== 'undefined' && localStorage.getItem('cv_admin_authorized') === 'true') {
      setIsLiveEditorOpen(true);
    } else {
      setIsAdminAuthOpen(true);
    }
  };

  const categories = ['All', 'Hardware & Security', 'Software Systems', 'Infrastructure & Cloud'];
  const filteredProjects = (profile.projects || []).filter(p => {
    if (projectFilter === 'All') return true;
    return p.category === projectFilter || p.technologies?.some(t => t.toLowerCase().includes(projectFilter.toLowerCase()));
  });

  const certCategories = ['All', 'Cisco CCNA', 'Academic', 'DevOps & Systems'];
  const filteredCerts = (profile.certificates || []).filter(c => {
    if (certFilter === 'All') return true;
    return c.category === certFilter || (certFilter === 'Cisco CCNA' && c.issuer?.toLowerCase().includes('cisco'));
  });

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#18181b] antialiased selection:bg-stone-200 selection:text-stone-900 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* 1. TOP STICKY NAVBAR */}
      <nav className="sticky top-0 z-40 bg-[#fcfbf9]/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3.5 print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <a href="#hero" className="font-['Playfair_Display',serif] text-base sm:text-lg font-bold tracking-tight text-stone-900 hover:text-stone-700 transition-colors">
              {profile.fullName}
            </a>
            <span className="hidden md:inline-block text-stone-300">|</span>
            <span className="hidden md:inline-block text-xs uppercase tracking-widest text-stone-500 font-semibold">
              Executive Portfolio
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex items-center gap-5 text-xs font-semibold text-stone-600 mr-2">
              <a href="#education" className="hover:text-stone-950 transition-colors">Education & GPA</a>
              <a href="#capabilities" className="hover:text-stone-950 transition-colors">Capabilities</a>
              <a href="#projects" className="hover:text-stone-950 transition-colors">Projects</a>
              <a href="#certifications" className="hover:text-stone-950 transition-colors">Certifications</a>
              <a href="#experience" className="hover:text-stone-950 transition-colors">Experience</a>
            </div>

            <button
              onClick={() => setIsQrOpen(true)}
              className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              title="QR Code Portfolio Share"
            >
              <QrCode className="w-4 h-4" />
            </button>

            <button
              onClick={() => downloadVCard(profile)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold shadow-xs transition-colors"
              title="Add to Phone Contacts"
            >
              <UserPlus className="w-3.5 h-3.5 text-stone-600" />
              <span>vCard</span>
            </button>

            {profile.originalPdfUrl && (
              <a
                href={profile.originalPdfUrl}
                download
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs transition-all hover:scale-[1.02]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Resume PDF</span>
              </a>
            )}

            <button
              onClick={handleOpenEditor}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors"
              title="Edit Profile Content"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">Live Edit</span>
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-20">

        {/* 2. FULL-WIDTH EDITORIAL HERO BOX */}
        <section id="hero" className="rounded-3xl border border-stone-300/80 bg-white p-6 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left Column: Bio & Details */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Status Pill */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {profile.availabilityStatus || 'Available for Opportunities'}
                </span>
                <span className="text-xs text-stone-400">•</span>
                <span className="text-xs text-stone-500 font-medium">
                  {profile.location || 'Cairo, Egypt'}
                </span>
              </div>

              {/* Title & Headline */}
              <div className="space-y-3">
                <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-stone-950 leading-[1.1]">
                  {profile.fullName}
                </h1>
                <p className="text-base sm:text-lg font-medium text-stone-600 leading-snug">
                  {profile.title}
                </p>
              </div>

              {/* Objective / Summary Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#faf8f5] border border-stone-200/80 text-stone-700 text-sm leading-relaxed">
                <p>{profile.summary || profile.tagline}</p>
              </div>

              {/* Quick Contacts & Socials with Copy-to-Clipboard */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
                  title="Click to copy email address"
                >
                  <Mail className="w-3.5 h-3.5 text-stone-600" />
                  <span>{profile.email}</span>
                  {copiedEmail ? (
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">Copied!</span>
                  ) : (
                    <span className="text-[10px] text-stone-400">Copy</span>
                  )}
                </button>

                {profile.phone && (
                  <a
                    href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-stone-600" />
                    <span>{profile.phone}</span>
                  </a>
                )}

                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
                  >
                    <LinkedInIcon className="w-3.5 h-3.5 text-stone-700" />
                    <span>LinkedIn</span>
                    <ArrowUpRight className="w-3 h-3 text-stone-400" />
                  </a>
                )}

                {profile.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
                  >
                    <GitHubIcon className="w-3.5 h-3.5 text-stone-700" />
                    <span>GitHub</span>
                    <ArrowUpRight className="w-3 h-3 text-stone-400" />
                  </a>
                )}

                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors ml-auto"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Link Copied!' : 'Share Portfolio'}</span>
                </button>
              </div>

            </div>

            {/* Right Column: Headshot Photo Frame (object-top) & Verified Pill */}
            <div className="lg:col-span-4 flex flex-col items-center sm:items-start lg:items-end">
              <div className="relative w-full max-w-[280px] aspect-[4/5] rounded-2xl overflow-hidden border border-stone-300 shadow-md bg-stone-100">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400 font-serif text-5xl bg-stone-200">
                    {profile.fullName.charAt(0)}
                  </div>
                )}
                
                {/* Academic Standing Overlay */}
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-stone-900/90 backdrop-blur-md text-white border border-white/10 shadow-lg text-center">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                    Verified Academic Distinction
                  </span>
                  <p className="text-xs font-bold text-stone-100">
                    {profile.gpa || (profile.education?.[0]?.honors?.includes('GPA') ? profile.education[0].honors : 'Current GPA: 1.65 (A-)')}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 3. GRADUATION BANNER & PROMINENT ACADEMIC GPA CARD */}
        <section id="education" className="space-y-6">
          <div className="flex items-center justify-between border-b border-stone-300 pb-3">
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-5 h-5 text-stone-700" />
              <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-normal text-stone-950">
                Academic Background & GPA Distinction
              </h2>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Verified Credential
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Prominent Academic GPA Card */}
            <div className="md:col-span-4 rounded-3xl border-2 border-stone-900 bg-stone-950 text-white p-6 sm:p-7 flex flex-col justify-between shadow-lg relative overflow-hidden">
              <div className="space-y-3 relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" />
                  Academic Excellence
                </span>

                <div className="pt-2">
                  <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold block">Official Cumulative Standing</span>
                  <div className="text-4xl sm:text-5xl font-extrabold text-amber-400 tracking-tight pt-1">
                    {profile.gpa || '1.65 (A-)'}
                  </div>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed pt-1">
                  German Scale Distinction (1.0 = Highest Honor, 1.65 equivalent to A-). Information Engineering & Technology.
                </p>
              </div>

              <div className="pt-6 relative z-10">
                <a
                  href={profile.education?.[0]?.degreePortalUrl || 'https://www.guc.edu.eg'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-950 font-bold text-xs shadow-md transition-colors"
                >
                  <span>Verify Portal Record</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* University & Degree Details */}
            <div className="md:col-span-8 rounded-3xl border border-stone-300/80 bg-white p-6 sm:p-8 space-y-6 shadow-xs flex flex-col justify-between">
              {(profile.education || []).map((edu, idx) => (
                <div key={edu.id || idx} className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-stone-900">{edu.degree}</h3>
                      <p className="text-sm font-semibold text-stone-600">{edu.fieldOfStudy}</p>
                      <p className="text-xs text-stone-500 font-medium pt-0.5">{edu.institution}</p>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200 self-start">
                      {edu.startDate} – {edu.endDate || 'Present'}
                    </span>
                  </div>

                  {edu.honors && (
                    <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-stone-200 text-xs text-stone-700">
                      <strong>Honors & Coursework:</strong> {edu.honors}
                    </div>
                  )}

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                      Core Engineering Coursework:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Digital Logic Design',
                        'Communication Networks & Protocols',
                        'Object-Oriented Programming (Java)',
                        'Data Structures & Algorithms',
                        'Boolean Logic Optimization',
                        'Discrete Electronic Circuits',
                        'Computer Architecture'
                      ].map((mod, i) => (
                        <span
                          key={i}
                          className="text-xs px-3 py-1 rounded-lg bg-stone-100 text-stone-800 border border-stone-200 font-medium"
                        >
                          ✓ {mod}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 4. 3-COLUMN CAPABILITIES MATRIX */}
        <section id="capabilities" className="space-y-6">
          <div className="border-b border-stone-300 pb-3">
            <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-normal text-stone-950">
              Core Engineering Capabilities
            </h2>
            <p className="text-xs text-stone-500 font-medium pt-1">
              Cross-disciplinary competency across networking infrastructure, software architecture, and media systems
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Capability 1: Network & Infrastructure */}
            <div className="p-6 rounded-3xl bg-white border border-stone-300/80 shadow-xs space-y-4 hover:border-stone-400 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
                <Network className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-stone-900">Network & Infrastructure</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Enterprise Cisco routing, VLAN topologies, subnetting, Wireshark packet capture, and encrypted VPN tunnels.
                </p>
              </div>
              <ul className="space-y-2 pt-2 text-xs text-stone-700 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Cisco CCNA (3 Official Certifications)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>TCP/IP, Routing (OSPFv2), Switching</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>WireGuard VPN & Packet Inspection</span>
                </li>
              </ul>
            </div>

            {/* Capability 2: Software Architecture */}
            <div className="p-6 rounded-3xl bg-white border border-stone-300/80 shadow-xs space-y-4 hover:border-stone-400 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-stone-900">Software Architecture</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Object-oriented software systems in Java and Python, modular event-driven game engines, and socket architectures.
                </p>
              </div>
              <ul className="space-y-2 pt-2 text-xs text-stone-700 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Advanced OOP Design Patterns in Java</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Concurrent Multi-Client TCP Sockets</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Discrete Hardware Encryption & Logic Gates</span>
                </li>
              </ul>
            </div>

            {/* Capability 3: Studio & Homelab Infrastructure */}
            <div className="p-6 rounded-3xl bg-white border border-stone-300/80 shadow-xs space-y-4 hover:border-stone-400 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
                <Tv className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-stone-900">Studio & Homelab Systems</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Self-hosted Docker stacks, Nginx reverse proxying, OBS live production broadcasting, and media pipelines.
                </p>
              </div>
              <ul className="space-y-2 pt-2 text-xs text-stone-700 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>12-Container Docker Compose Stack</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Nginx Proxy Manager & Custom Routing</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Multi-Camera Video Ingest & Audio Routing</span>
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* 5. 3-COLUMN PROJECT ARCHIVE GRID WITH CATEGORY FILTER PILLS */}
        <section id="projects" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-300 pb-4">
            <div>
              <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-normal text-stone-950">
                Projects Archive
              </h2>
              <p className="text-xs text-stone-500 font-medium pt-1">
                Engineered systems spanning discrete hardware, modular engines, and self-hosted infrastructure
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setProjectFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    projectFilter === cat
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="group rounded-3xl bg-white border border-stone-300/80 p-6 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-stone-400 transition-all cursor-pointer"
                onClick={() => setSelectedProject(proj)}
              >
                <div className="space-y-4">
                  {/* Card Header graphic banner */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                      {proj.category || 'Engineering'}
                    </span>
                    {proj.metrics && (
                      <span className="text-[11px] font-semibold text-emerald-700">
                        {proj.metrics}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors flex items-center justify-between">
                      <span>{proj.title}</span>
                      <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>
                  </div>
                </div>

                <div className="pt-5 space-y-3 border-t border-stone-100 mt-5">
                  <div className="flex flex-wrap gap-1.5">
                    {proj.technologies?.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {(proj.technologies?.length || 0) > 4 && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-stone-50 text-stone-400">
                        +{(proj.technologies?.length || 0) - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. FILTERABLE CERTIFICATES GALLERY WITH THUMBNAIL SCANS */}
        <section id="certifications" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-300 pb-4">
            <div>
              <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-normal text-stone-950">
                Official Certifications & Verification
              </h2>
              <p className="text-xs text-stone-500 font-medium pt-1">
                Verified Cisco CCNA credentials and academic distinctions with high-resolution scan view
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {certCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCertFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    certFilter === cat
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCerts.map((cert) => (
              <div
                key={cert.id}
                onClick={() => setSelectedCert(cert)}
                className="group rounded-3xl bg-white border border-stone-300/80 overflow-hidden shadow-xs hover:shadow-md hover:border-stone-400 transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Certificate Scan Thumbnail */}
                <div className="relative aspect-[16/11] bg-stone-100 overflow-hidden border-b border-stone-200">
                  {cert.imageUrl ? (
                    <img
                      src={cert.imageUrl}
                      alt={cert.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                      <Award className="w-12 h-12 text-stone-300" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="px-3.5 py-1.5 rounded-full bg-white/95 text-stone-900 font-bold text-xs shadow-lg backdrop-blur-xs flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" />
                      View High-Res Scan
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium">
                      <span>{cert.issuer}</span>
                      <span>{cert.issueDate || '2026'}</span>
                    </div>
                    <h3 className="text-sm font-bold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-2">
                      {cert.title}
                    </h3>
                  </div>

                  {cert.badge && (
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {cert.badge}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. EXPERIENCE & MENTORSHIP TIMELINE */}
        <section id="experience" className="space-y-6">
          <div className="border-b border-stone-300 pb-3">
            <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-normal text-stone-950">
              Work & Mentorship Experience
            </h2>
            <p className="text-xs text-stone-500 font-medium pt-1">
              Leadership in academic mentoring and media systems engineering
            </p>
          </div>

          <div className="space-y-6">
            {(profile.experiences || []).map((exp) => (
              <div key={exp.id} className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-300/80 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">{exp.role}</h3>
                    <p className="text-xs font-semibold text-stone-600">{exp.company}</p>
                    {exp.location && (
                      <p className="text-xs text-stone-400 pt-0.5">{exp.location}</p>
                    )}
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200 self-start">
                    {exp.startDate} – {exp.endDate || 'Present'}
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {exp.description}
                </p>

                {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                  <ul className="space-y-2 pt-1">
                    {exp.bulletPoints.map((bp, i) => (
                      <li key={i} className="text-xs text-stone-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-1.5 shrink-0" />
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 8. LANGUAGES SECTION */}
        <section id="languages" className="space-y-4">
          <div className="border-b border-stone-300 pb-3">
            <h2 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-normal text-stone-950">
              Spoken Languages
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {((profile.languages && profile.languages.length > 0) ? profile.languages : [
              { name: 'Arabic', proficiency: 'Native', flag: '🇪🇬' },
              { name: 'English', proficiency: 'Fluent (Professional)', flag: '🇬🇧' },
              { name: 'German', proficiency: 'A2 Level (GUC)', flag: '🇩🇪' },
            ]).map((lang, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white border border-stone-300/80 shadow-xs flex items-center gap-3">
                <span className="text-2xl">{lang.flag || '🌐'}</span>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">{lang.name}</h4>
                  <p className="text-xs text-stone-500 font-medium">{lang.proficiency}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 9. RECRUITER CONTACT INQUIRY SECTION */}
        <section id="contact" className="rounded-3xl bg-stone-900 text-white p-8 sm:p-12 shadow-xl space-y-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
              Initiate Collaboration
            </span>
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl font-normal text-white">
              Let&apos;s Build Resilient Engineering Systems.
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Available for technical engineering roles, distributed systems projects, and network infrastructure initiatives.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs shadow-lg transition-all hover:scale-[1.02]"
            >
              <Mail className="w-4 h-4" />
              <span>Email Directly: {profile.email}</span>
            </a>

            {profile.phone && (
              <a
                href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs transition-colors border border-stone-700"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Message</span>
              </a>
            )}

            <button
              onClick={() => downloadVCard(profile)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs transition-colors border border-stone-700"
            >
              <UserPlus className="w-4 h-4 text-stone-300" />
              <span>Save vCard Contact</span>
            </button>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-stone-300/80 bg-white py-8 px-6 text-center text-xs text-stone-500">
        <p>© {new Date().getFullYear()} {profile.fullName}. Certified Engineer & Portfolio. Powered by CVtoWeb.</p>
      </footer>

      {/* MODALS */}
      <CertificateModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />

      <QRCodeModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        slug={profile.slug}
        name={profile.fullName}
      />

      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onSuccess={() => {
          setIsAdminAuthOpen(false);
          setIsLiveEditorOpen(true);
        }}
      />

      <LiveEditorModal
        isOpen={isLiveEditorOpen}
        onClose={() => setIsLiveEditorOpen(false)}
        profile={profile}
        onSave={(updated) => setProfile(updated)}
      />

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative text-left">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 transition-colors"
            >
              ✕
            </button>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                {selectedProject.category || 'Project Detail'}
              </span>
              <h3 className="text-xl font-bold text-stone-900">{selectedProject.title}</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {selectedProject.description}
            </p>
            {selectedProject.metrics && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                Key Result: {selectedProject.metrics}
              </div>
            )}
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-900 block">Technologies:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedProject.technologies?.map((tech, idx) => (
                  <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
