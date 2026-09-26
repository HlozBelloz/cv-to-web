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
  UserPlus,
  BookOpen,
  GraduationCap,
  Sparkles,
  Layers,
  Network,
  Cpu,
  Tv,
  Check,
  Edit3,
  Terminal,
  ShieldCheck,
  Radio,
  Code2
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

export function CyberDarkGlassTheme({ profile: initialProfile }: Props) {
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
    <div className="min-h-screen bg-[#07090e] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200 font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden">
      
      {/* Ambient Cyber Neon Glow Background */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/3 w-[550px] h-[550px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* 1. TOP STICKY NAVBAR */}
      <nav className="sticky top-0 z-40 bg-[#07090e]/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5 print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4] animate-pulse" />
            <a href="#hero" className="font-['Outfit',sans-serif] text-base sm:text-lg font-bold tracking-tight text-white hover:text-cyan-300 transition-colors">
              {profile.fullName}
            </a>
            <span className="hidden md:inline-block text-slate-700">|</span>
            <span className="hidden md:inline-block font-['Fira_Code',monospace] text-[11px] text-cyan-400 font-semibold tracking-wider uppercase">
              CYBER_TERMINAL_v2.6
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-400 mr-2">
              <a href="#education" className="hover:text-cyan-300 transition-colors">Education & GPA</a>
              <a href="#capabilities" className="hover:text-cyan-300 transition-colors">Capabilities</a>
              <a href="#projects" className="hover:text-cyan-300 transition-colors">Projects</a>
              <a href="#certifications" className="hover:text-cyan-300 transition-colors">Certs</a>
              <a href="#experience" className="hover:text-cyan-300 transition-colors">Timeline</a>
            </div>

            <button
              onClick={() => setIsQrOpen(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors"
              title="QR Code Portfolio Share"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
            </button>

            <button
              onClick={() => downloadVCard(profile)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
              <span>vCard</span>
            </button>

            {profile.originalPdfUrl && (
              <a
                href={profile.originalPdfUrl}
                download
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Resume PDF</span>
              </a>
            )}

            <button
              onClick={handleOpenEditor}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 text-xs font-bold transition-colors"
              title="Edit Profile Content"
            >
              <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Live Edit</span>
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-20">

        {/* 2. AMBIENT GLOW CYBER HERO */}
        <section id="hero" className="rounded-3xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Bio Info */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="flex items-center gap-2 font-['Fira_Code',monospace]">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 text-cyan-300 text-xs font-semibold border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#06b6d4]" />
                  {profile.availabilityStatus || 'SYSTEM STATUS: AVAILABLE'}
                </span>
                <span className="text-xs text-slate-600">•</span>
                <span className="text-xs text-slate-400">
                  {profile.location || 'Cairo, Egypt'}
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="font-['Outfit',sans-serif] text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                  {profile.fullName}
                </h1>
                <p className="text-base sm:text-lg font-medium text-cyan-300/90 leading-snug">
                  {profile.title}
                </p>
              </div>

              {/* Dossier Terminal Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-slate-800 text-slate-300 text-xs sm:text-sm leading-relaxed font-mono relative">
                <div className="flex items-center gap-1.5 pb-2 text-[10px] text-cyan-400 font-bold border-b border-slate-800 mb-2">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>CANDIDATE_DOSSIER // ARCHITECTURE_PROFILE</span>
                </div>
                <p className="font-sans leading-relaxed">{profile.summary || profile.tagline}</p>
              </div>

              {/* Quick Contacts */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{profile.email}</span>
                  {copiedEmail ? (
                    <span className="text-[10px] text-cyan-300 font-bold bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-500/30">Copied</span>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">copy</span>
                  )}
                </button>

                {profile.phone && (
                  <a
                    href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{profile.phone}</span>
                  </a>
                )}

                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition-colors"
                  >
                    <LinkedInIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>LinkedIn</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-500" />
                  </a>
                )}

                {profile.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition-colors"
                  >
                    <GitHubIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>GitHub</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-500" />
                  </a>
                )}

                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-900/30 text-cyan-300 text-xs font-semibold transition-colors ml-auto"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Link Copied!' : 'Share Terminal'}</span>
                </button>
              </div>

            </div>

            {/* Right Photo Frame with Neon Glow Ring & Floating Academic Badge */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-[270px] aspect-[4/5] rounded-3xl overflow-hidden border-2 border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.2)] bg-slate-950">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-cyan-400 font-mono text-5xl bg-slate-950">
                    {profile.fullName.charAt(0)}
                  </div>
                )}

                {/* Floating Academic Badge */}
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-black/85 backdrop-blur-md text-white border border-cyan-500/40 shadow-xl text-center">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block font-mono">
                    VERIFIED ACADEMIC GPA
                  </span>
                  <p className="text-sm font-extrabold text-white pt-0.5">
                    {profile.gpa || 'GPA: 1.65 (A- Grade)'}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 3. EDUCATION & PROMINENT ACADEMIC GPA SECTION */}
        <section id="education" className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-5 h-5 text-cyan-400" />
              <h2 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-bold text-white">
                Academic Background & GPA Distinction
              </h2>
            </div>
            <span className="font-['Fira_Code',monospace] text-xs text-cyan-400">
              [ACADEMIC_RECORD]
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* GPA Neon Dossier Card */}
            <div className="md:col-span-4 rounded-3xl border-2 border-cyan-500/50 bg-gradient-to-br from-slate-900 to-[#07090e] p-6 sm:p-7 flex flex-col justify-between shadow-[0_0_25px_rgba(6,182,212,0.15)] relative overflow-hidden">
              <div className="space-y-4 relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono uppercase">
                  <Award className="w-3.5 h-3.5 text-cyan-400" />
                  GUC Engineering
                </span>

                <div className="pt-2">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono block">CUMULATIVE GPA</span>
                  <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 pt-1">
                    {profile.gpa || '1.65 (A-)'}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  German University in Cairo (GUC). German grading system where 1.0 is the top distinction, 1.65 indicates high A- standing.
                </p>
              </div>

              <div className="pt-6 relative z-10">
                <a
                  href={profile.education?.[0]?.degreePortalUrl || 'https://www.guc.edu.eg'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]"
                >
                  <span>Verify University Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* University & Degree Details */}
            <div className="md:col-span-8 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between">
              {(profile.education || []).map((edu, idx) => (
                <div key={edu.id || idx} className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
                      <p className="text-sm font-semibold text-cyan-300">{edu.fieldOfStudy}</p>
                      <p className="text-xs text-slate-400 pt-0.5">{edu.institution}</p>
                    </div>
                    <span className="font-['Fira_Code',monospace] text-xs px-3 py-1 rounded-full bg-slate-800 text-cyan-300 border border-slate-700 self-start">
                      {edu.startDate} – {edu.endDate || '2029'}
                    </span>
                  </div>

                  {edu.honors && (
                    <div className="p-3.5 rounded-xl bg-black/50 border border-slate-800 text-xs text-slate-300 font-mono">
                      <strong className="text-cyan-400">Distinction:</strong> {edu.honors}
                    </div>
                  )}

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
                      CORE ENGINEERING MODULES:
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
                          className="text-xs px-3 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 font-medium"
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

        {/* 4. CAPABILITIES MATRIX */}
        <section id="capabilities" className="space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-bold text-white">
              Engineering Capabilities Matrix
            </h2>
            <p className="text-xs text-slate-400 pt-1 font-mono">
              Systems architecture, hardware cryptographic logic, and infrastructure automation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-slate-800 shadow-xl space-y-4 hover:border-cyan-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/70 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Network className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Network & Infrastructure</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enterprise Cisco routing, VLAN topologies, subnetting, Wireshark packet capture, and encrypted VPN tunnels.
                </p>
              </div>
              <ul className="space-y-2 pt-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Cisco CCNA (3 Official Certifications)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>TCP/IP, Routing (OSPFv2), Switching</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>WireGuard VPN & Packet Inspection</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-slate-800 shadow-xl space-y-4 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-blue-950/70 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Software Architecture</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Object-oriented software systems in Java and Python, modular event-driven game engines, and socket architectures.
                </p>
              </div>
              <ul className="space-y-2 pt-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Advanced OOP Design Patterns in Java</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Concurrent Multi-Client TCP Sockets</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Discrete Hardware Encryption & Logic Gates</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-slate-800 shadow-xl space-y-4 hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Tv className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Studio & Homelab Systems</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Self-hosted Docker stacks, Nginx reverse proxying, OBS live production broadcasting, and media pipelines.
                </p>
              </div>
              <ul className="space-y-2 pt-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>12-Container Docker Compose Stack</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Nginx Proxy Manager & Custom Routing</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Multi-Camera Video Ingest & Audio Routing</span>
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* 5. 3-COLUMN PROJECTS ARCHIVE */}
        <section id="projects" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-bold text-white">
                Projects Archive
              </h2>
              <p className="text-xs text-slate-400 pt-1 font-mono">
                [FILTERABLE_SYSTEMS_CATALOG]
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setProjectFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    projectFilter === cat
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
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
                className="group rounded-3xl bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 flex flex-col justify-between shadow-xl hover:border-cyan-500/50 transition-all cursor-pointer"
                onClick={() => setSelectedProject(proj)}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-950 text-cyan-300 border border-cyan-500/30 font-mono">
                      {proj.category || 'System'}
                    </span>
                    {proj.metrics && (
                      <span className="text-[11px] font-semibold text-emerald-400">
                        {proj.metrics}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                      <span>{proj.title}</span>
                      <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>
                  </div>
                </div>

                <div className="pt-5 space-y-3 border-t border-slate-800/80 mt-5">
                  <div className="flex flex-wrap gap-1.5">
                    {proj.technologies?.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 font-mono border border-slate-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. VERIFIED CERTIFICATES GALLERY */}
        <section id="certifications" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-bold text-white">
                Verified Certifications & Lightbox
              </h2>
              <p className="text-xs text-slate-400 pt-1 font-mono">
                Official Cisco Networking Academy credentials rendered in high-resolution scan mode
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {certCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCertFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    certFilter === cat
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
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
                className="group rounded-3xl bg-slate-900/60 backdrop-blur-md border border-slate-800 overflow-hidden shadow-xl hover:border-cyan-500/50 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-[16/11] bg-black overflow-hidden border-b border-slate-800">
                  {cert.imageUrl ? (
                    <img
                      src={cert.imageUrl}
                      alt={cert.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <Award className="w-12 h-12 text-slate-700" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="px-3.5 py-1.5 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" />
                      View Full Scan
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>{cert.issuer}</span>
                      <span>{cert.issueDate || '2026'}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {cert.title}
                    </h3>
                  </div>

                  {cert.badge && (
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {cert.badge}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. EXPERIENCE TIMELINE */}
        <section id="experience" className="space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-bold text-white">
              Work & Mentorship Timeline
            </h2>
          </div>

          <div className="space-y-6">
            {(profile.experiences || []).map((exp) => (
              <div key={exp.id} className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-slate-800 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                    <p className="text-xs font-semibold text-cyan-300">{exp.company}</p>
                    {exp.location && (
                      <p className="text-xs text-slate-500 pt-0.5">{exp.location}</p>
                    )}
                  </div>
                  <span className="font-['Fira_Code',monospace] text-xs px-3 py-1 rounded-full bg-slate-950 text-cyan-300 border border-slate-800 self-start">
                    {exp.startDate} – {exp.endDate || 'Present'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {exp.description}
                </p>

                {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                  <ul className="space-y-2 pt-1">
                    {exp.bulletPoints.map((bp, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
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
          <div className="border-b border-slate-800 pb-3">
            <h2 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-bold text-white">
              Spoken Languages
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {((profile.languages && profile.languages.length > 0) ? profile.languages : [
              { name: 'Arabic', proficiency: 'Native', flag: '🇪🇬' },
              { name: 'English', proficiency: 'Fluent (Professional)', flag: '🇬🇧' },
              { name: 'German', proficiency: 'A2 Level (GUC)', flag: '🇩🇪' },
            ]).map((lang, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800 shadow-xl flex items-center gap-3">
                <span className="text-2xl">{lang.flag || '🌐'}</span>
                <div>
                  <h4 className="text-sm font-bold text-white">{lang.name}</h4>
                  <p className="text-xs text-cyan-400 font-mono">{lang.proficiency}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 9. RECRUITER CONTACT INQUIRY SECTION */}
        <section id="contact" className="rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 p-8 sm:p-12 shadow-[0_0_30px_rgba(6,182,212,0.1)] space-y-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block font-mono">
              CONNECT WITH CANDIDATE
            </span>
            <h2 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl font-extrabold text-white">
              Ready to Discuss High-Throughput Engineering?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Available for technical engineering roles, distributed systems projects, and network infrastructure initiatives.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02]"
            >
              <Mail className="w-4 h-4" />
              <span>Direct Email: {profile.email}</span>
            </a>

            {profile.phone && (
              <a
                href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs transition-colors border border-slate-700"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp</span>
              </a>
            )}

            <button
              onClick={() => downloadVCard(profile)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs transition-colors border border-slate-700"
            >
              <UserPlus className="w-4 h-4 text-cyan-400" />
              <span>Save vCard Contact</span>
            </button>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 bg-[#07090e] py-8 px-6 text-center text-xs text-slate-500 font-mono">
        <p>© {new Date().getFullYear()} {profile.fullName}. Certified Engineer. Powered by CVtoWeb.</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative text-left">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              ✕
            </button>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-cyan-400 font-mono uppercase tracking-wider block">
                {selectedProject.category || 'PROJECT DOSSIER'}
              </span>
              <h3 className="text-xl font-bold text-white">{selectedProject.title}</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedProject.description}
            </p>
            {selectedProject.metrics && (
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-semibold text-cyan-300 font-mono">
                Key Metric: {selectedProject.metrics}
              </div>
            )}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block font-mono">STACK:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedProject.technologies?.map((tech, idx) => (
                  <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 font-mono">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
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
