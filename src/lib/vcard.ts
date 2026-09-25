import { CVProfile } from '@/types';

/**
 * Generates and triggers download of a standardized vCard 3.0 (.vcf) file
 * Allows recruiters to import candidate contact info directly into iOS/Android Contacts in 1 tap
 */
export function downloadVCard(profile: CVProfile): void {
  if (typeof window === 'undefined') return;

  const names = (profile.fullName || 'Candidate').split(' ');
  const lastName = names.length > 1 ? names.slice(1).join(' ') : '';
  const firstName = names[0] || 'Candidate';

  const vCardLines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${lastName};${firstName};;;`,
    `FN:${profile.fullName}`,
    `TITLE:${profile.title || 'Specialist'}`,
  ];

  if (profile.email) {
    vCardLines.push(`EMAIL;type=INTERNET;type=WORK;type=pref:${profile.email}`);
  }

  if (profile.phone) {
    vCardLines.push(`TEL;type=CELL;type=VOICE;type=pref:${profile.phone}`);
  }

  if (profile.location) {
    vCardLines.push(`ADR;type=WORK:;;${profile.location};;;;`);
  }

  const siteUrl = profile.customDomain 
    ? `https://${profile.customDomain}` 
    : `${window.location.origin}/cv/${profile.slug}`;
  vCardLines.push(`URL;type=WORK:${siteUrl}`);

  if (profile.linkedinUrl) {
    vCardLines.push(`X-SOCIALPROFILE;type=linkedin:${profile.linkedinUrl}`);
  }

  if (profile.githubUrl) {
    vCardLines.push(`X-SOCIALPROFILE;type=github:${profile.githubUrl}`);
  }

  if (profile.summary) {
    const cleanSummary = profile.summary.replace(/\r?\n|\r/g, ' ').substring(0, 300);
    vCardLines.push(`NOTE:${cleanSummary}`);
  }

  vCardLines.push('END:VCARD');

  const vCardData = vCardLines.join('\r\n');
  const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${profile.slug}-contact.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
