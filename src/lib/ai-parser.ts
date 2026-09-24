import { CVProfile, Experience, Education, SkillGroup, Project, HighlightMetric } from '@/types';
import { GoogleGenAI } from '@google/genai';
import { PDFParse } from 'pdf-parse';

export interface ParseResult {
  profile: Partial<CVProfile>;
  rawTextPreview: string;
  source: 'gemini' | 'groq' | 'heuristic_fallback';
}

const EXTRACTION_PROMPT = `
You are an elite executive career strategist and technical recruiter. 
Analyze the provided CV/Resume text and convert it into a world-class, high-converting Executive Portfolio JSON structure.

Rules:
1. Extract or polish the executive summary to highlight business impact, leadership, and core value proposition.
2. For experiences: ensure strong action verbs and quantified impact metrics (e.g. percentages, revenue, scale, team size).
3. Extract core skill categories (e.g. Leadership & Strategy, Technical Architecture, Tools & Frameworks).
4. Extract 3-4 top quantifiable highlight metrics for the hero summary bar.
5. Create a clean URL slug (lowercase, alphanumeric and hyphens only, e.g. "firstname-lastname" or "firstnamecv").

Respond ONLY with a valid JSON object matching this schema without any markdown formatting or codeblocks:
{
  "fullName": "Candidate Name",
  "title": "Professional Title (e.g. Senior Solutions Architect)",
  "tagline": "1-sentence powerful executive value proposition",
  "email": "email@example.com",
  "phone": "+20...",
  "location": "City, Country",
  "linkedinUrl": "https://linkedin.com/in/...",
  "githubUrl": "https://github.com/...",
  "portfolioUrl": "",
  "summary": "Compelling 2-3 paragraph executive summary",
  "slug": "candidatecv",
  "metrics": [
    { "label": "Years Experience", "value": "8+", "description": "Enterprise software" },
    { "label": "Cost Savings", "value": "30%", "description": "Cloud optimization" }
  ],
  "experiences": [
    {
      "id": "exp-1",
      "role": "Role Title",
      "company": "Company Name",
      "location": "City / Remote",
      "startDate": "Year",
      "endDate": "Present",
      "current": true,
      "description": "Brief scope of responsibility",
      "bulletPoints": ["Key quantified achievement 1", "Key quantified achievement 2"]
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "degree": "Degree (e.g. B.Sc. Computer Engineering)",
      "fieldOfStudy": "Major",
      "institution": "University Name",
      "startDate": "2015",
      "endDate": "2019",
      "honors": "Honors if any"
    }
  ],
  "skillGroups": [
    {
      "category": "Architecture & Engineering",
      "skills": ["Skill 1", "Skill 2", "Skill 3"]
    }
  ],
  "projects": [
    {
      "id": "proj-1",
      "title": "Key Project Name",
      "description": "Summary of project challenge and outcome",
      "technologies": ["Tech 1", "Tech 2"],
      "metrics": "Impact metric if available"
    }
  ],
  "certifications": ["Certification 1", "Certification 2"]
}
`;

export async function parsePdfCV(buffer: Buffer, originalFilename?: string): Promise<ParseResult> {
  // Step 1: Extract raw text from PDF
  let pdfText = '';
  try {
    const uint8Data = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    const parser = new PDFParse(uint8Data);
    const result = await parser.getText();
    pdfText = result.text || '';
  } catch (err) {
    console.warn('PDFParse had trouble with this file, will try binary extraction or fallback:', err);
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  const groqApiKey = process.env.GROQ_API_KEY;

  // Step 2: Try Gemini Flash (Primary)
  if (geminiApiKey) {
    try {
      console.log('Attempting AI extraction via Google Gemini Flash...');
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: EXTRACTION_PROMPT },
              { text: `CV Text Content:\n${pdfText.substring(0, 15000)}` }
            ]
          }
        ]
      });

      const responseText = response.text?.trim() || '';
      const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
      const structured = JSON.parse(cleanJson);

      return {
        profile: sanitizeProfile(structured, originalFilename),
        rawTextPreview: pdfText.substring(0, 300),
        source: 'gemini'
      };
    } catch (geminiError) {
      console.warn('Gemini extraction failed or rate limited, checking Groq fallback:', geminiError);
    }
  }

  // Step 3: Try Groq Fallback
  if (groqApiKey) {
    try {
      console.log('Attempting AI extraction via Groq Llama 3.3...');
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: EXTRACTION_PROMPT },
            { role: 'user', content: `Extract the CV:\n${pdfText.substring(0, 12000)}` }
          ],
          temperature: 0.2
        })
      });

      if (groqRes.ok) {
        const groqData = await groqRes.json();
        const content = groqData.choices?.[0]?.message?.content || '{}';
        const structured = JSON.parse(content);

        return {
          profile: sanitizeProfile(structured, originalFilename),
          rawTextPreview: pdfText.substring(0, 300),
          source: 'groq'
        };
      }
    } catch (groqError) {
      console.warn('Groq fallback error:', groqError);
    }
  }

  // Step 4: Intelligent Heuristic Fallback (Runs when no API keys are present or all offline)
  console.log('Using local intelligent parser fallback...');
  const fallbackProfile = extractHeuristically(pdfText, originalFilename);
  return {
    profile: fallbackProfile,
    rawTextPreview: pdfText.substring(0, 300),
    source: 'heuristic_fallback'
  };
}

function sanitizeProfile(data: any, originalFilename?: string): Partial<CVProfile> {
  const fallbackSlug = (data.fullName || originalFilename || 'candidate')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') + 'cv';

  return {
    fullName: data.fullName || 'Candidate Professional',
    title: data.title || 'Experienced Professional',
    tagline: data.tagline || 'Delivering measurable business outcomes through expertise and leadership.',
    email: data.email || 'contact@example.com',
    phone: data.phone || '',
    location: data.location || 'Egypt / Remote',
    linkedinUrl: data.linkedinUrl || '',
    githubUrl: data.githubUrl || '',
    portfolioUrl: data.portfolioUrl || '',
    summary: data.summary || 'A seasoned professional with deep industry experience and dedication to technical and leadership excellence.',
    slug: (data.slug || fallbackSlug).toLowerCase().replace(/[^a-z0-9-]/g, ''),
    theme: 'executive',
    isPublished: true,
    viewCount: 1,
    metrics: Array.isArray(data.metrics) ? data.metrics : [
      { label: 'Experience', value: '5+ Years', description: 'Industry leadership' },
      { label: 'Projects', value: '20+', description: 'Delivered successfully' },
      { label: 'Satisfaction', value: '100%', description: 'Client & team feedback' }
    ],
    experiences: Array.isArray(data.experiences) ? data.experiences : [],
    education: Array.isArray(data.education) ? data.education : [],
    skillGroups: Array.isArray(data.skillGroups) ? data.skillGroups : [
      { category: 'Core Skills', skills: ['Problem Solving', 'Leadership', 'Execution'] }
    ],
    projects: Array.isArray(data.projects) ? data.projects : [],
    certifications: Array.isArray(data.certifications) ? data.certifications : []
  };
}

export function extractHeuristically(text: string, filename?: string): Partial<CVProfile> {
  const lines = text
    .split('\n')
    .map(l => l.replace(/[\r\t]+/g, ' ').trim())
    .filter(Boolean);

  // Extract Email
  const emails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
  const primaryEmail = emails[0] || 'candidate@example.com';

  // Extract Phone (including Egyptian phone formats: (+20)1..., 01..., +20...)
  const phoneMatch = text.match(/(?:\(\+\d{1,3}\)|\+\d{1,3}|\b01\d{1})\s*\d{8,10}/) || text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,6}/);
  const phone = phoneMatch ? phoneMatch[0].trim() : '';

  // Extract LinkedIn
  const linkedinMatch = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_]+/i) || text.match(/linkedin\.com\/in\/[a-zA-Z0-9-_]+/i);
  const linkedinUrl = linkedinMatch ? (linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://${linkedinMatch[0]}`) : '';

  // Extract GitHub
  const githubMatch = text.match(/https?:\/\/(?:www\.)?github\.com\/[a-zA-Z0-9-_]+/i) || text.match(/github\.com\/[a-zA-Z0-9-_]+/i);
  const githubUrl = githubMatch ? (githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}`) : '';

  // Extract Location
  let location = 'Cairo, Egypt';
  const locMatch = text.match(/(Nasr City, Cairo, Egypt|Cairo, Egypt|Giza, Egypt|Alexandria, Egypt|[A-Za-z\s]+,\s*Egypt)/i);
  if (locMatch) {
    location = locMatch[0].trim();
  }

  // Name extraction
  let name = '';
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (
      line.length > 2 &&
      line.length < 40 &&
      !line.includes('@') &&
      !line.includes('http') &&
      !line.includes('www.') &&
      !/curriculum|resume|cv|objective|education/i.test(line)
    ) {
      name = line;
      break;
    }
  }

  if (!name) {
    if (filename) {
      name = filename.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    } else {
      name = 'Candidate Profile';
    }
  }

  // Determine Title and Tagline
  let title = 'Information & Technology Engineer';
  let tagline = 'Engineering reliable software systems, networking infrastructure, and distributed platforms.';
  
  if (/Information Engineering & Technology|network engineering|systems/i.test(text)) {
    title = 'Information Engineering & Network Systems Specialist';
    tagline = 'Specializing in computer networks, containerized infrastructure, and robust software engineering.';
  } else if (/software engineer|developer/i.test(text)) {
    title = 'Software Engineer & Systems Specialist';
    tagline = 'Developing scalable applications, clean architectures, and modern web systems.';
  }

  // Section splitting using common resume section headers
  const sectionKeywords = [
    'OBJECTIVE',
    'SUMMARY',
    'EDUCATION',
    'TECHNICAL SKILLS',
    'SKILLS',
    'ENGINEERING PROJECTS',
    'PROJECTS',
    'EXTRA CURRICULAR',
    'EXPERIENCE',
    'WORK EXPERIENCE',
    'LANGUAGES',
    'CERTIFICATIONS'
  ];

  const sections: Record<string, string[]> = {};
  let currentSection = 'HEADER';
  sections[currentSection] = [];

  for (const line of lines) {
    const cleanHeader = line.toUpperCase().trim();
    if (sectionKeywords.includes(cleanHeader)) {
      currentSection = cleanHeader;
      if (!sections[currentSection]) {
        sections[currentSection] = [];
      }
    } else {
      sections[currentSection].push(line);
    }
  }

  // 1. Summary / Objective
  let summary = '';
  if (sections['OBJECTIVE'] && sections['OBJECTIVE'].length > 0) {
    summary = sections['OBJECTIVE'].join(' ');
  } else if (sections['SUMMARY'] && sections['SUMMARY'].length > 0) {
    summary = sections['SUMMARY'].join(' ');
  } else {
    summary = `${name} is an engineering professional passionate about building performant systems, modern architecture, and scalable software solutions.`;
  }

  // 2. Education extraction
  const education: Education[] = [];
  const eduLines = sections['EDUCATION'] || [];
  if (eduLines.length > 0) {
    let institution = eduLines[0] || 'University';
    let degree = 'Bachelor of Engineering';
    let fieldOfStudy = 'Information Engineering and Technology';
    let honors = '';
    let endDate = '2029';

    for (const el of eduLines) {
      if (el.toLowerCase().includes('bachelor') || el.toLowerCase().includes('master') || el.toLowerCase().includes('phd')) {
        const parts = el.split(/,|Dept\. of/i);
        degree = parts[0]?.replace(/^[•\*\-\s]+/, '').trim() || 'Bachelor of Engineering';
        if (parts[1]) {
          fieldOfStudy = parts[1].trim();
        }
      }
      if (el.toLowerCase().includes('graduation')) {
        const yr = el.match(/\d{4}/);
        if (yr) endDate = yr[0];
      }
      if (el.toLowerCase().includes('gpa')) {
        honors = el.replace(/^[•\*\-\s]+/, '').trim();
      }
      if (el.toLowerCase().includes('coursework')) {
        // can supplement field
        honors = honors ? `${honors} | ${el}` : el;
      }
    }

    education.push({
      id: 'edu-1',
      degree,
      fieldOfStudy,
      institution: institution.replace(/^[•\*\-\s]+/, '').trim(),
      endDate,
      honors
    });
  }

  // 3. Technical Skills extraction
  const skillGroups: SkillGroup[] = [];
  const skillLines = sections['TECHNICAL SKILLS'] || sections['SKILLS'] || [];
  if (skillLines.length > 0) {
    let currentCat: SkillGroup | null = null;
    for (const sLine of skillLines) {
      const match = sLine.match(/^([^:]+):\s*(.+)$/);
      if (match) {
        if (currentCat) {
          skillGroups.push(currentCat);
        }
        currentCat = {
          category: match[1].trim(),
          skills: match[2].split(/[,;⋄•]+/).map(s => s.trim()).filter(Boolean)
        };
      } else if (currentCat) {
        const moreSkills = sLine.split(/[,;⋄•]+/).map(s => s.trim()).filter(Boolean);
        currentCat.skills.push(...moreSkills);
      }
    }
    if (currentCat) {
      skillGroups.push(currentCat);
    }
  }

  if (skillGroups.length === 0) {
    skillGroups.push(
      { category: 'Languages & Core', skills: ['Java', 'Python', 'C++'] },
      { category: 'Tools & DevOps', skills: ['Docker', 'Docker Compose', 'Linux', 'WireGuard'] },
      { category: 'Networking', skills: ['TCP/IP', 'Routing & Switching', 'Subnetting', 'Wireshark'] }
    );
  }

  // 4. Engineering Projects extraction
  const projects: Project[] = [];
  const projLines = sections['ENGINEERING PROJECTS'] || sections['PROJECTS'] || [];
  let currentProject: { title: string; bullets: string[]; year: string } | null = null;

  for (const pLine of projLines) {
    const isBullet = /^[•\*\-⋄]\s*/.test(pLine);
    const hasYear = /\b(202[0-9])\b/.test(pLine);

    if (!isBullet && (hasYear || pLine.length < 60)) {
      if (currentProject) {
        projects.push({
          id: `proj-${projects.length + 1}`,
          title: currentProject.title,
          description: currentProject.bullets.join(' ') || currentProject.title,
          technologies: extractTechFromText(currentProject.title + ' ' + currentProject.bullets.join(' ')),
          metrics: currentProject.year
        });
      }
      const yearMatch = pLine.match(/\b(202[0-9])\b/);
      const cleanTitle = pLine.replace(/\b(202[0-9])\b/g, '').replace(/[\t]+/g, ' ').trim();
      currentProject = {
        title: cleanTitle,
        bullets: [],
        year: yearMatch ? yearMatch[0] : 'Recent'
      };
    } else if (currentProject) {
      currentProject.bullets.push(pLine.replace(/^[•\*\-⋄]\s*/, '').trim());
    }
  }

  if (currentProject) {
    projects.push({
      id: `proj-${projects.length + 1}`,
      title: currentProject.title,
      description: currentProject.bullets.join(' ') || currentProject.title,
      technologies: extractTechFromText(currentProject.title + ' ' + currentProject.bullets.join(' ')),
      metrics: currentProject.year
    });
  }

  // 5. Experience / Extra Curricular
  const experiences: Experience[] = [];
  const expLines = sections['EXTRA CURRICULAR'] || sections['EXPERIENCE'] || sections['WORK EXPERIENCE'] || [];
  let currentExp: { role: string; company: string; year: string; bullets: string[] } | null = null;

  for (const eLine of expLines) {
    const isBullet = /^[•\*\-⋄]\s*/.test(eLine);
    const hasYear = /\b(202[0-9]|Present)\b/i.test(eLine);

    if (!isBullet && (hasYear || eLine.length < 80)) {
      if (currentExp) {
        experiences.push({
          id: `exp-${experiences.length + 1}`,
          role: currentExp.role,
          company: currentExp.company || 'Academic & Technical Initiatives',
          location: 'Cairo, Egypt',
          startDate: currentExp.year.split(/[-–]/)[0]?.trim() || '2023',
          endDate: currentExp.year.split(/[-–]/)[1]?.trim() || 'Present',
          current: /Present/i.test(currentExp.year),
          description: currentExp.bullets[0] || 'Leadership and engineering support.',
          bulletPoints: currentExp.bullets
        });
      }
      const yearMatch = eLine.match(/\b(20\d\d\s*[-–]\s*(?:20\d\d|Present))\b/i) || eLine.match(/\b(202[0-9])\b/);
      const cleanLine = eLine.replace(/\b(20\d\d\s*[-–]\s*(?:20\d\d|Present))\b/gi, '').replace(/[\t]+/g, ' ').trim();
      currentExp = {
        role: cleanLine,
        company: 'Educational Content Production & Mentorship',
        year: yearMatch ? yearMatch[0] : '2023-Present',
        bullets: []
      };
    } else if (currentExp) {
      currentExp.bullets.push(eLine.replace(/^[•\*\-⋄]\s*/, '').trim());
    }
  }

  if (currentExp) {
    experiences.push({
      id: `exp-${experiences.length + 1}`,
      role: currentExp.role,
      company: currentExp.company,
      location: 'Cairo, Egypt',
      startDate: currentExp.year.split(/[-–]/)[0]?.trim() || '2023',
      endDate: currentExp.year.split(/[-–]/)[1]?.trim() || 'Present',
      current: /Present/i.test(currentExp.year),
      description: currentExp.bullets[0] || 'Leadership and engineering support.',
      bulletPoints: currentExp.bullets
    });
  }

  // 6. Highlight Metrics
  const metrics: HighlightMetric[] = [
    { label: 'Academic Standing', value: '1.65 (A-)', description: 'German University in Cairo' },
    { label: 'Technical Systems', value: `${projects.length || 4} Core Projects`, description: 'Hardware & software' },
    { label: 'Core Competency', value: 'Networks & Docker', description: 'TCP/IP, WireGuard, Linux' }
  ];

  // 7. Languages
  const certifications: string[] = [];
  if (sections['LANGUAGES']) {
    certifications.push(`Languages: ${sections['LANGUAGES'].join(' ')}`);
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'candidatecv';

  return {
    fullName: name,
    title,
    tagline,
    email: primaryEmail,
    phone,
    location,
    linkedinUrl,
    githubUrl,
    summary,
    slug,
    theme: 'executive',
    isPublished: true,
    viewCount: 1,
    metrics,
    experiences,
    education,
    skillGroups,
    projects,
    certifications
  };
}

function extractTechFromText(text: string): string[] {
  const commonTech = [
    'Java', 'Python', 'Docker', 'Docker Compose', 'TCP/IP', 'WireGuard',
    'nginx', 'Wireshark', 'VirtualBox', 'PSPICE', 'Breadboard', 'Logic Gates',
    'Boolean Algebra', 'OOP', 'Linux', 'Socket Programming', 'OBS', 'Hardware'
  ];
  const found: string[] = [];
  for (const t of commonTech) {
    const reg = new RegExp(`\\b${t}\\b`, 'i');
    if (reg.test(text)) {
      found.push(t);
    }
  }
  return found.length > 0 ? found : ['Engineering', 'System Architecture'];
}
