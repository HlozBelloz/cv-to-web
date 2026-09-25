import { CVProfile } from '@/types';

export interface AtsCheckItem {
  type: 'high' | 'medium' | 'low';
  title: string;
  advice: string;
}

export interface AtsAnalysisResult {
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  rating: 'Exceptional' | 'Competitive' | 'Needs Polish' | 'Critical Gaps';
  breakdown: {
    sectionCompleteness: { score: number; max: 25; feedback: string };
    impactAndMetrics: { score: number; max: 25; feedback: string };
    actionVerbs: { score: number; max: 20; feedback: string };
    skillsTaxonomy: { score: number; max: 20; feedback: string };
    brevityAndContact: { score: number; max: 10; feedback: string };
  };
  metricsCount: number;
  actionVerbCount: number;
  detectedKeywords: string[];
  strengths: string[];
  recommendations: AtsCheckItem[];
}

const POWER_ACTION_VERBS = [
  'accelerated', 'achieved', 'administered', 'advised', 'allocated', 'amplified',
  'analyzed', 'architected', 'assembled', 'audited', 'automated', 'boosted',
  'budgeted', 'built', 'centralized', 'championed', 'coached', 'collaborated',
  'conceptualized', 'consolidated', 'constructed', 'contracted', 'converted',
  'coordinated', 'created', 'customized', 'decreased', 'delivered', 'deployed',
  'designed', 'developed', 'devised', 'directed', 'distributed', 'documented',
  'doubled', 'drafted', 'drove', 'eliminated', 'enabled', 'enacted', 'engineered',
  'enhanced', 'established', 'evaluated', 'executed', 'expanded', 'expedited',
  'facilitated', 'forecasted', 'formulated', 'fostered', 'founded', 'generated',
  'guided', 'halved', 'headed', 'identified', 'implemented', 'improved',
  'increased', 'initiated', 'innovated', 'inspected', 'instituted', 'integrated',
  'introduced', 'invented', 'investigated', 'launched', 'led', 'leveraged',
  'managed', 'maximized', 'mentored', 'migrated', 'minimized', 'modernized',
  'negotiated', 'optimized', 'orchestrated', 'organized', 'overhauled', 'oversaw',
  'partnered', 'pioneered', 'planned', 'produced', 'programmed', 'projected',
  'promoted', 'rearchitected', 'rebuilt', 'recruited', 'redesigned', 'reduced',
  'refined', 'reformed', 'remodeled', 'reorganized', 'replaced', 'restructured',
  'revamped', 'scaled', 'secured', 'simplified', 'slashed', 'spearheaded',
  'standardized', 'steered', 'streamlined', 'strengthened', 'supervised', 'surpassed',
  'systematized', 'tested', 'trained', 'transformed', 'tripled', 'unified',
  'upgraded', 'validated', 'yielded'
];

const METRIC_REGEX = /(\b\d+(\.\d+)?%|\$\d+[\d,]*(\.\d+)?|\b\d+x\b|\b\d+[\d,]*\s*(users|clients|customers|requests|queries|rps|tps|ms|seconds|minutes|hours|days|weeks|months|years|egp|usd|eur|gbp|k|m|b)\b|\b\d{2,}\b)/gi;

export function analyzeAtsCompatibility(profile: CVProfile): AtsAnalysisResult {
  const strengths: string[] = [];
  const recommendations: AtsCheckItem[] = [];

  // 1. SECTION COMPLETENESS (Max 25)
  let sectionScore = 0;
  if (profile.fullName && profile.title) sectionScore += 5;
  if (profile.summary && profile.summary.length > 80) sectionScore += 5;
  if (profile.experiences && profile.experiences.length > 0) sectionScore += 5;
  if (profile.education && profile.education.length > 0) sectionScore += 5;
  const totalSkillCount = (profile.skills?.length || 0) + (profile.skillGroups?.reduce((acc, g) => acc + (g.skills?.length || 0), 0) || 0);
  if (totalSkillCount >= 5) sectionScore += 5;

  let sectionFeedback = 'All essential sections present and fully formatted.';
  if (sectionScore < 20) {
    sectionFeedback = 'Missing crucial CV sections (education, full work history, or summary).';
    recommendations.push({
      type: 'high',
      title: 'Complete Missing Core Sections',
      advice: 'Enterprise ATS parsers require explicit Experience, Education, and Skills headers to index your profile.'
    });
  } else {
    strengths.push('Complete standard structure (Header, Summary, Experience, Education, Skills).');
  }

  // 2. IMPACT & METRICS (Max 25)
  let metricsCount = 0;
  const allBulletPoints: string[] = [];
  
  (profile.experiences || []).forEach(exp => {
    if (exp.bulletPoints) {
      allBulletPoints.push(...exp.bulletPoints);
    }
    if (exp.description) {
      allBulletPoints.push(exp.description);
    }
  });

  (profile.projects || []).forEach(proj => {
    if (proj.description) allBulletPoints.push(proj.description);
    if (proj.metrics) allBulletPoints.push(proj.metrics);
  });

  allBulletPoints.forEach(text => {
    const matches = text.match(METRIC_REGEX);
    if (matches) {
      metricsCount += matches.length;
    }
  });

  // Calculate score based on metric frequency
  let impactScore = 0;
  if (metricsCount >= 8) {
    impactScore = 25;
    strengths.push(`High quantifiable outcome density (${metricsCount} data points/KPIs detected).`);
  } else if (metricsCount >= 4) {
    impactScore = 18;
    strengths.push(`Good use of metrics (${metricsCount} numbers/percentages detected).`);
  } else if (metricsCount >= 2) {
    impactScore = 12;
    recommendations.push({
      type: 'medium',
      title: 'Add More Quantifiable Results',
      advice: 'Recruiters favor numbers (e.g. "improved latency by 35%", "scaled to 100K users", "managed \$50K budget").'
    });
  } else {
    impactScore = 5;
    recommendations.push({
      type: 'high',
      title: 'Missing Quantifiable Data & Metrics',
      advice: 'ATS algorithms score resumes higher when achievements include percentages, currency, latency drops, or volume metrics.'
    });
  }

  const impactFeedback = `${metricsCount} quantified metrics found across your career achievements.`;

  // 3. ACTION VERBS (Max 20)
  let actionVerbCount = 0;
  const detectedVerbs = new Set<string>();

  allBulletPoints.forEach(text => {
    const words = text.toLowerCase().split(/[\s,.;:()]+/);
    words.forEach(word => {
      if (POWER_ACTION_VERBS.includes(word)) {
        actionVerbCount++;
        detectedVerbs.add(word);
      }
    });
  });

  let actionScore = 0;
  if (actionVerbCount >= 10) {
    actionScore = 20;
    strengths.push(`Exceptional leadership action language (${detectedVerbs.size} unique action verbs).`);
  } else if (actionVerbCount >= 5) {
    actionScore = 15;
    strengths.push('Solid action verb usage at the beginning of experience points.');
  } else if (actionVerbCount >= 2) {
    actionScore = 10;
    recommendations.push({
      type: 'medium',
      title: 'Strengthen Responsibility Bullet Points',
      advice: 'Begin each bullet with a power action verb (e.g. Spearheaded, Engineered, Orchestrated, Automated).'
    });
  } else {
    actionScore = 5;
    recommendations.push({
      type: 'high',
      title: 'Replace Passive Language with Power Verbs',
      advice: 'Avoid passive phrases like "responsible for" or "helped with". Use impactful verbs like "Architected" or "Spearheaded".'
    });
  }

  const actionFeedback = `${actionVerbCount} high-impact action verbs detected across your roles.`;

  // 4. SKILLS & KEYWORD TAXONOMY (Max 20)
  const allSkills = new Set<string>();
  (profile.skills || []).forEach((s: string) => allSkills.add(s.toLowerCase()));
  (profile.skillGroups || []).forEach(g => {
    (g.skills || []).forEach((s: string) => allSkills.add(s.toLowerCase()));
  });

  let skillsScore = 0;
  if (allSkills.size >= 12 && profile.skillGroups && profile.skillGroups.length >= 2) {
    skillsScore = 20;
    strengths.push(`Categorized domain skill taxonomy with ${allSkills.size} relevant competencies.`);
  } else if (allSkills.size >= 8) {
    skillsScore = 15;
    strengths.push(`Good core skill inventory (${allSkills.size} competencies).`);
  } else if (allSkills.size >= 4) {
    skillsScore = 10;
    recommendations.push({
      type: 'medium',
      title: 'Expand Domain Skills & Frameworks',
      advice: 'List modern tools, frameworks, and methodologies relevant to your target seniority level.'
    });
  } else {
    skillsScore = 5;
    recommendations.push({
      type: 'high',
      title: 'Insufficient Hard Skills Listed',
      advice: 'ATS automated keyword filters drop candidates with fewer than 5-8 verified technical and domain skills.'
    });
  }

  const skillsFeedback = `${allSkills.size} unique skills categorized across your profile.`;

  // 5. BREVITY, CLARITY & CONTACT (Max 10)
  let brevityScore = 0;
  if (profile.email && profile.email.includes('@')) brevityScore += 3;
  if (profile.phone && profile.phone.length >= 7) brevityScore += 3;
  if (profile.location) brevityScore += 2;
  if (profile.linkedinUrl || profile.githubUrl) brevityScore += 2;

  if (brevityScore === 10) {
    strengths.push('Comprehensive contact & online presence data (email, phone, location, social).');
  } else if (!profile.phone || !profile.email) {
    recommendations.push({
      type: 'high',
      title: 'Verify Direct Recruiter Contacts',
      advice: 'Add an active phone number and professional email for immediate recruiter reachout.'
    });
  }

  const brevityFeedback = `${brevityScore}/10 contact channels properly configured.`;

  // TOTAL SCORE
  const totalScore = Math.min(100, Math.max(0, sectionScore + impactScore + actionScore + skillsScore + brevityScore));

  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' = 'C';
  let rating: 'Exceptional' | 'Competitive' | 'Needs Polish' | 'Critical Gaps' = 'Needs Polish';

  if (totalScore >= 90) {
    grade = 'A+';
    rating = 'Exceptional';
  } else if (totalScore >= 80) {
    grade = 'A';
    rating = 'Competitive';
  } else if (totalScore >= 70) {
    grade = 'B';
    rating = 'Needs Polish';
  } else {
    grade = 'C';
    rating = 'Critical Gaps';
  }

  return {
    score: totalScore,
    grade,
    rating,
    breakdown: {
      sectionCompleteness: { score: sectionScore, max: 25, feedback: sectionFeedback },
      impactAndMetrics: { score: impactScore, max: 25, feedback: impactFeedback },
      actionVerbs: { score: actionScore, max: 20, feedback: actionFeedback },
      skillsTaxonomy: { score: skillsScore, max: 20, feedback: skillsFeedback },
      brevityAndContact: { score: brevityScore, max: 10, feedback: brevityFeedback },
    },
    metricsCount,
    actionVerbCount,
    detectedKeywords: Array.from(allSkills),
    strengths,
    recommendations
  };
}
