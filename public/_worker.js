
/**
 * Cloudflare Pages Advanced Mode Edge Worker
 * Handles static assets, clean URLs, and serverless edge API endpoints
 */

const DEFAULT_PLANS = [
  {
    id: 'launch_standard',
    name: 'Standard CV Launch',
    priceEgp: 100,
    period: 'one-time',
    description: 'Fast, professional CV conversion to an executive website.',
    features: [
      'Conversion of your PDF into an Executive Website',
      'Free Subdomain (e.g. yourname.cvplatform.com)',
      '1-Click Download of Original PDF',
      'Interactive Experience & Projects Showcase',
      'Recruiter Contact Inquiry Form',
      'Mobile & Desktop Optimized'
    ],
    isPopular: true,
    isActive: true,
    customDomainAllowed: false
  },
  {
    id: 'pro_custom_domain',
    name: 'Executive & Custom Domain',
    priceEgp: 250,
    period: 'one-time',
    description: 'For senior leaders and executives who want their own custom domain name.',
    features: [
      'Everything in Standard CV Launch',
      'Connect Your Own Custom Domain (e.g. mohamed.com)',
      'Free SSL Certificate & Cloudflare Edge CDN',
      'Priority SEO & Google Indexing',
      'Visitor Analytics & View Tracker',
      'Unlimited Profile Edits & Regenerations'
    ],
    isActive: true,
    customDomainAllowed: true
  }
];

const DEFAULT_PROFILES = [
  {
    id: 'profile-mazen',
    slug: 'mazen',
    fullName: 'Mazen Mohamed Hamdy',
    title: 'Information Engineering & Technology Engineer | Networking & Systems Architecture',
    tagline: 'GUC Engineering Student specializing in Cisco Enterprise Networking, Discrete Hardware Cryptography & Systems Architecture.',
    email: 'mazeneltelbany78@gmail.com',
    phone: '(+20) 102 199 2115',
    location: 'Nasr City, Cairo, Egypt',
    linkedinUrl: 'https://www.linkedin.com/in/mazen-eltelbany-8aaab5403/',
    githubUrl: 'https://github.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    summary: 'Information Engineering & Technology scholar at the German University in Cairo (GUC) with an outstanding A- GPA (1.65). Proficient in Java, Python, Docker containerization, and enterprise Cisco networking (TCP/IP, routing, switching, subnetting). Demonstrates hands-on engineering capability across hardware encryption breadboards, modular game engines, and production-grade self-hosted homelab infrastructure.',
    objective: 'Information Engineering & Technology student at GUC focused on networking infrastructure, distributed systems, and low-level software architecture.',
    availabilityStatus: 'Available for Opportunities',
    gpa: '1.65 (A-)',
    originalPdfUrl: '/Mazen_Mohamed_CV.pdf',
    theme: 'portfolio-wp-pro',
    accentColor: 'amber',
    isPublished: true,
    viewCount: 284,
    createdAt: '2026-09-25T12:00:00.000Z',
    updatedAt: '2026-09-25T12:00:00.000Z',
    certificates: [
      {
        id: 'cert-ccna-enterprise',
        title: 'CCNA: Enterprise Networking, Security, and Automation',
        issuer: 'Cisco Networking Academy',
        issueDate: 'September 2026',
        imageUrl: '/certs/ccna_enterprise.jpg',
        credentialUrl: 'https://www.cisco.com',
        badge: 'Enterprise Networking & Security',
        category: 'Cisco CCNA',
        topics: [
          'OSPFv2 Routing & Scalability',
          'Network Security & Threat Mitigation',
          'Access Control Lists (ACLs) & NAT',
          'IPsec Site-to-Site VPNs',
          'Network Automation & RESTful APIs'
        ]
      },
      {
        id: 'cert-ccna-intro',
        title: 'CCNA: Introduction to Networks',
        issuer: 'Cisco Networking Academy',
        issueDate: 'September 2026',
        imageUrl: '/certs/ccna_intro_networks.jpg',
        credentialUrl: 'https://www.cisco.com',
        badge: 'Networking Core',
        category: 'Cisco CCNA',
        topics: [
          'TCP/IP & OSI Architecture',
          'IPv4 & IPv6 Subnetting & CIDR',
          'Ethernet Switching Topologies',
          'Initial Router & Switch Configuration'
        ]
      },
      {
        id: 'cert-ccna-switching',
        title: 'CCNA: Switching, Routing, and Wireless Essentials',
        issuer: 'Cisco Networking Academy',
        issueDate: 'September 2026',
        imageUrl: '/certs/ccna_switching_routing.jpg',
        credentialUrl: 'https://www.cisco.com',
        badge: 'Switching & Wireless',
        category: 'Cisco CCNA',
        topics: [
          'VLANs, Trunking & Inter-VLAN Routing',
          'Spanning Tree Protocol (STP)',
          'EtherChannel Link Aggregation & FHRP',
          'DHCPv4, SLAAC & Dynamic IPv6',
          'WLAN Configuration & WPA3 Security'
        ]
      }
    ],
    metrics: [
      { label: 'Academic Standing', value: '1.65 (A-)', description: 'German University in Cairo' },
      { label: 'Cisco Certifications', value: '3 Official', description: 'CCNA Enterprise Core' },
      { label: 'Production Uptime', value: '99.9%', description: 'Homelab & container services' },
      { label: 'Spoken Languages', value: '3', description: 'Arabic (Native), English, German' }
    ],
    experiences: [
      {
        id: 'exp-mazen-1',
        role: 'IGCSE Chemistry Academic Assistant & Technical Lead',
        company: 'Academic Educational Services',
        location: 'Cairo, Egypt',
        startDate: '2023',
        endDate: '2026',
        current: false,
        description: 'Guided IGCSE Grade 10 academic development while architecting end-to-end media and broadcast infrastructure.',
        bulletPoints: [
          'Led student concept clarification sessions and academic mentoring for Grade 10 IGCSE chemistry cohorts.',
          'Engineered and maintained dedicated technical studio infrastructure for online educational content production.',
          'Integrated audio/video recording hardware, configured OBS broadcast pipelines, and streamlined video export workflows.'
        ]
      },
      {
        id: 'exp-mazen-2',
        role: 'Studio Systems & Media Infrastructure Engineer',
        company: 'Digital Educational Media Production',
        location: 'Cairo, Egypt',
        startDate: '2023',
        endDate: 'Present',
        current: true,
        description: 'Designed and deployed dedicated technical recording studio infrastructure for educational broadcasting.',
        bulletPoints: [
          'Engineered OBS multi-camera routing, digital audio pipeline, and studio network infrastructure.',
          'Automated media ingest, local backup redundancy, and high-bitrate streaming pipeline.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-mazen-1',
        degree: 'Bachelor of Science (B.Sc.)',
        fieldOfStudy: 'Information Engineering & Technology (IET)',
        institution: 'German University in Cairo (GUC)',
        startDate: '2024',
        endDate: '2029 (5th Semester)',
        honors: 'Current Cumulative GPA: 1.65 (German Scale A- Grade Distinction)',
        gpa: '1.65 (A-)',
        degreePortalUrl: 'https://www.guc.edu.eg',
        coreModules: [
          'Digital Logic Design',
          'Communication Networks & Protocols',
          'Object-Oriented Programming (Java)',
          'Data Structures & Algorithms',
          'Boolean Logic Optimization',
          'Discrete Electronic Circuits',
          'Computer Architecture'
        ]
      }
    ],
    skillGroups: [
      {
        category: 'Networking & Protocols',
        skills: ['TCP/IP Architecture', 'Cisco Routing (OSPFv2)', 'VLANs & Switching', 'Subnetting & CIDR', 'Wireshark Packet Analysis', 'WireGuard VPN']
      },
      {
        category: 'Software & Systems',
        skills: ['Java (Advanced OOP)', 'Python', 'C / C++', 'Data Structures & Algorithms', 'Multithreaded Sockets', 'Event-Driven Architecture']
      },
      {
        category: 'DevOps & Infrastructure',
        skills: ['Docker', 'Docker Compose', 'Nginx Proxy Manager', 'Linux Server Admin (Ubuntu/Debian)', 'VirtualBox', 'PSPICE Circuit Simulation']
      }
    ],
    languages: [
      { name: 'Arabic', proficiency: 'Native', flag: '🇪🇬' },
      { name: 'English', proficiency: 'Fluent (Professional)', flag: '🇬🇧' },
      { name: 'German', proficiency: 'A2 Level (GUC)', flag: '🇩🇪' }
    ],
    projects: [
      {
        id: 'proj-mazen-1',
        title: 'Hardware Encryption / Decryption System',
        category: 'Hardware & Security',
        year: '2025',
        description: 'Designed and prototyped a physical hardware cryptographic circuit on a breadboard to encrypt and decrypt binary data in real-time using discrete logic gates and Boolean algebra.',
        technologies: ['Logic Gates (74xx ICs)', 'Breadboard Prototyping', 'Boolean Algebra', 'Digital Logic Design'],
        metrics: 'Zero-latency hardware data processing pipeline'
      },
      {
        id: 'proj-mazen-2',
        title: 'Modular OOP Java Game Engine',
        category: 'Software Systems',
        year: '2026',
        description: 'Architected a layered object-oriented game engine in Java featuring energy management, role-based dynamics, event-driven cell interactions, and extensive JUnit test coverage.',
        technologies: ['Java', 'OOP Design Patterns', 'Unit Testing (JUnit)', 'Event Architecture'],
        metrics: 'Modular zero-leak lifecycle design'
      },
      {
        id: 'proj-mazen-3',
        title: 'Self-Hosted Production Homelab Stack',
        category: 'Infrastructure & Cloud',
        year: '2025 – Present',
        description: 'Architected and maintain a resilient 12-container homelab cluster utilizing Docker Compose, encrypted WireGuard VPN mesh, and Nginx reverse proxying with custom domains.',
        technologies: ['Docker', 'Docker Compose', 'WireGuard VPN', 'Nginx Proxy Manager', 'Linux'],
        metrics: '99.9% Uptime across 12 containers'
      },
      {
        id: 'proj-mazen-4',
        title: 'Multi-Client Concurrent TCP Socket Network',
        category: 'Software Systems',
        year: '2025',
        description: 'Engineered a concurrent client-server chat application over TCP sockets in Java, validating packet delivery and analyzing stream traffic flows in Wireshark.',
        technologies: ['Java Sockets', 'TCP/IP', 'Multithreading', 'Wireshark'],
        metrics: 'Sub-5ms local packet broadcast latency'
      }
    ],
    certifications: [
      'Cisco Certified Network Associate (CCNA Enterprise, Intro & Switching)',
      'Digital Logic Design & Hardware Prototyping - GUC',
      'Communication Networks & Protocols - GUC',
      'German Language Proficiency A2 - GUC'
    ]
  },
  {
    id: 'demo-mohamed',
    slug: 'mohamedcv',
    fullName: 'Mohamed El-Sayed',
    title: 'Senior Solutions Architect & Tech Lead',
    tagline: 'Designing high-scale distributed systems and enterprise cloud architectures across EMEA.',
    email: 'mohamed.elsayed@example.com',
    phone: '+20 100 123 4567',
    location: 'Cairo, Egypt / Remote',
    linkedinUrl: 'https://linkedin.com',
    githubUrl: 'https://github.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
    summary: 'Decisive technical leader with 9+ years architecting microservices, cloud infrastructure, and mission-critical financial applications. Proven record of scaling platform operations from 10k to 2M+ active transactions per day while slashing infrastructure expenses by 35%. Passionate about engineering excellence, team mentorship, and high-performance engineering culture.',
    originalPdfUrl: '/demo-cv.pdf',
    theme: 'tech',
    accentColor: 'emerald',
    isPublished: true,
    viewCount: 428,
    createdAt: '2026-09-24T18:00:00.000Z',
    updatedAt: '2026-09-24T18:00:00.000Z',
    certificates: [
      {
        id: 'cert-1',
        title: 'AWS Certified Solutions Architect – Professional',
        issuer: 'Amazon Web Services',
        issueDate: '2024',
        imageUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=600&q=80',
        credentialUrl: 'https://aws.amazon.com/verification',
        badge: 'Professional Level'
      },
      {
        id: 'cert-2',
        title: 'Certified Kubernetes Administrator (CKA)',
        issuer: 'Cloud Native Computing Foundation (CNCF)',
        issueDate: '2023',
        imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
        credentialUrl: 'https://cncf.io/certification',
        badge: 'Cloud Native'
      }
    ],
    metrics: [
      { label: 'Years Experience', value: '9+', description: 'Enterprise engineering' },
      { label: 'Cloud Architecture', value: '35%', description: 'Infrastructure cost reduction' },
      { label: 'Daily Transactions', value: '2M+', description: 'Processed on scaled systems' },
      { label: 'Engineers Led', value: '18', description: 'Cross-functional engineering team' },
    ],
    experiences: [
      {
        id: 'exp-1',
        role: 'Principal Solutions Architect',
        company: 'Apex Cloud Solutions',
        location: 'Cairo / Dubai',
        startDate: '2022',
        endDate: 'Present',
        current: true,
        description: 'Directing the architecture modernization initiative across 14 high-throughput microservices.',
        bulletPoints: [
          'Spearheaded migration of legacy monolithic payment infrastructure to distributed Kubernetes architecture.',
          'Reduced p99 API latency from 450ms to 42ms under peak Ramadan transactional loads.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'B.Sc. in Computer Engineering',
        fieldOfStudy: 'Computer Systems & Software Engineering',
        institution: 'Cairo University Faculty of Engineering',
        startDate: '2011',
        endDate: '2016',
        honors: 'Graduated with Distinction (First Class Honors)'
      }
    ],
    skillGroups: [
      { category: 'Architecture & Leadership', skills: ['Distributed Systems', 'Cloud Migration', 'Microservices', 'System Design', 'Cost Optimization'] },
      { category: 'Cloud & Infrastructure', skills: ['AWS (ECS, Lambda, RDS, S3)', 'Docker', 'Kubernetes', 'Terraform', 'Cloudflare'] }
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'High-Throughput Payment Core',
        description: 'Engineered a fault-tolerant payment gateway integration with idempotent transaction ledger.',
        technologies: ['Go', 'PostgreSQL', 'Redis', 'Docker', 'Kafka'],
        metrics: 'Processes 250+ transactions/second'
      }
    ],
    certifications: [
      'AWS Certified Solutions Architect – Professional',
      'Certified Kubernetes Administrator (CKA)'
    ]
  }
];

const DEFAULT_USERS = [
  {
    id: 'usr-admin',
    name: 'Platform Administrator',
    email: 'admin@cvplatform.com',
    role: 'admin',
    slug: 'admin',
    authMethod: 'email',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-09-20T10:00:00Z',
    status: 'active'
  },
  {
    id: 'usr-mazen',
    name: 'Mazen Mohamed Hamdy',
    email: 'mazeneltelbany78@gmail.com',
    role: 'user',
    slug: 'mazen',
    authMethod: 'google',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-09-25T11:00:00Z',
    status: 'active'
  },
  {
    id: 'usr-mohamed',
    name: 'Mohamed El-Sayed',
    email: 'mohamed.elsayed@example.com',
    role: 'user',
    slug: 'mohamedcv',
    authMethod: 'email',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-09-24T18:00:00Z',
    status: 'active'
  }
];

// In-memory store for edge worker lifetime
const edgeStore = {
  plans: [...DEFAULT_PLANS],
  profiles: new Map(DEFAULT_PROFILES.map(p => [p.slug, p])),
  users: [...DEFAULT_USERS],
  payments: []
};

// Pure JS PDF Text Extractor
function extractPdfText(buffer) {
  try {
    const uint8 = new Uint8Array(buffer);
    let raw = '';
    for (let i = 0; i < uint8.length; i++) {
      raw += String.fromCharCode(uint8[i]);
    }
    const pieces = [];
    const tjRegex = /\(([^)]+)\)\s*Tj/g;
    let match;
    while ((match = tjRegex.exec(raw)) !== null) {
      if (match[1]) pieces.push(match[1]);
    }
    const tjArrayRegex = /\[(.*?)\]\s*TJ/g;
    while ((match = tjArrayRegex.exec(raw)) !== null) {
      const inners = match[1].match(/\(([^)]+)\)/g);
      if (inners) {
        pieces.push(inners.map(s => s.slice(1, -1)).join(' '));
      }
    }
    if (pieces.join(' ').length < 100) {
      const ascii = raw.match(/[A-Za-z0-9@._+\-\/:,() ]{5,}/g) || [];
      pieces.push(...ascii.filter(c => !c.includes('Obj') && !c.includes('Font')));
    }
    return pieces.join('\n');
  } catch (err) {
    return '';
  }
}

function parseProfileFromText(text, filename, reqSlug) {
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i);
  const email = emailMatch ? emailMatch[0].toLowerCase() : 'candidate@example.com';

  const phoneMatch = text.match(/(?:\(\+\d{1,3}\)|\+\d{1,3}|\b01\d{1})\s*\d{8,10}/);
  const phone = phoneMatch ? phoneMatch[0].trim() : '';

  let fullName = '';
  if (filename) {
    const clean = filename
      .replace(/\.pdf$/i, '')
      .replace(/[\-_]+/g, ' ')
      .replace(/\(\d+\)/g, '')
      .replace(/\b(cv|resume)\b/gi, '')
      .trim();
    if (clean.length >= 3 && clean.split(' ').length >= 2) {
      fullName = clean.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    }
  }
  if (!fullName) fullName = 'Senior Professional';

  let title = 'Senior Executive / Specialist';
  const kws = ['Software Engineer', 'Solutions Architect', 'Fullstack Developer', 'Backend Engineer', 'Engineering Manager', 'Product Manager'];
  for (const kw of kws) {
    if (new RegExp('\\b' + kw + '\\b', 'i').test(text)) {
      title = kw;
      break;
    }
  }

  let slug = reqSlug ? reqSlug.toLowerCase().replace(/[^a-z0-9-]/g, '') : fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (!slug || slug.length < 3) slug = 'cv-' + Math.random().toString(36).substring(2, 7);

  const now = new Date().toISOString();
  return {
    id: 'profile-' + Date.now(),
    slug,
    fullName,
    title,
    tagline: 'Driving strategic technological excellence, resilient cloud architecture, and high-impact business outcomes.',
    email,
    phone,
    location: 'Cairo, Egypt',
    linkedinUrl: '',
    githubUrl: '',
    summary: fullName + ' is an accomplished ' + title + ' with deep industry expertise in designing, deploying, and scaling modern platforms.',
    theme: 'executive',
    metrics: [
      { label: 'Industry Experience', value: '5+ Years', description: 'Technical & strategic leadership' },
      { label: 'Projects Delivered', value: '25+', description: 'Production deployments' },
      { label: 'Satisfaction Score', value: '100%', description: 'Excellence in execution' }
    ],
    experiences: [
      {
        id: 'exp-1',
        role: title,
        company: 'Technology Solutions & Engineering',
        location: 'Cairo, Egypt',
        startDate: '2022',
        endDate: 'Present',
        current: true,
        description: 'Leading strategic engineering, distributed systems, and core technical roadmaps.',
        bulletPoints: [
          'Architected and delivered scalable edge-deployed web applications.',
          'Established automated CI/CD pipelines and security hardening standards.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'Bachelor of Science (B.Sc.)',
        fieldOfStudy: 'Computer Science / Engineering',
        institution: 'University Engineering Faculty',
        startDate: '2017',
        endDate: '2021'
      }
    ],
    skillGroups: [
      { category: 'Architecture & Engineering', skills: ['System Architecture', 'TypeScript', 'Next.js', 'React', 'Node.js'] },
      { category: 'Cloud & Infrastructure', skills: ['Docker', 'Cloudflare Pages', 'PostgreSQL', 'Security'] }
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'CVtoWeb Cloudflare Platform',
        description: 'Automated executive portfolio generator with custom domain support.',
        technologies: ['Next.js', 'TypeScript', 'Cloudflare Pages'],
        metrics: '100% Edge Availability'
      }
    ],
    certifications: ['Certified Solutions Architect'],
    isPublished: true,
    viewCount: 1,
    createdAt: now,
    updatedAt: now
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;

    const jsonHeaders = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };

    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: jsonHeaders });
    }

    // ==========================================
    // 1. SERVERLESS EDGE API ENDPOINTS
    // ==========================================

    // Upload & Parse API
    if (pathname === '/api/upload' && method === 'POST') {
      try {
        const formData = await request.formData();
        const file = formData.get('file');
        const requestedSlug = formData.get('slug');

        if (!file || typeof file === 'string') {
          return new Response(JSON.stringify({ error: 'No PDF file uploaded' }), { status: 400, headers: jsonHeaders });
        }

        const buffer = await file.arrayBuffer();
        const text = extractPdfText(buffer);
        const profile = parseProfileFromText(text, file.name, requestedSlug);

        edgeStore.profiles.set(profile.slug, profile);

        return new Response(JSON.stringify({
          success: true,
          slug: profile.slug,
          url: '/cv/' + profile.slug,
          profile,
          aiSource: 'edge_parser',
          message: 'CV successfully transformed into executive portfolio!'
        }), { status: 200, headers: jsonHeaders });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message || 'Failed to process CV' }), { status: 500, headers: jsonHeaders });
      }
    }

    // Profiles API
    if (pathname === '/api/profiles') {
      if (method === 'GET') {
        const slug = url.searchParams.get('slug');
        if (slug) {
          const p = edgeStore.profiles.get(slug);
          if (p) return new Response(JSON.stringify(p), { status: 200, headers: jsonHeaders });
          return new Response(JSON.stringify({ error: 'Profile not found' }), { status: 404, headers: jsonHeaders });
        }
        return new Response(JSON.stringify(Array.from(edgeStore.profiles.values())), { status: 200, headers: jsonHeaders });
      }
      if (method === 'POST') {
        try {
          const body = await request.json();
          if (body && body.slug) {
            edgeStore.profiles.set(body.slug, body);
            return new Response(JSON.stringify({ success: true, profile: body }), { status: 200, headers: jsonHeaders });
          }
        } catch {}
      }
    }

    // Analytics API
    if (pathname === '/api/analytics' && method === 'GET') {
      const profs = Array.from(edgeStore.profiles.values());
      const totalViews = profs.reduce((acc, p) => acc + (p.viewCount || 0), 0);
      const totalRevenue = edgeStore.payments.reduce((acc, p) => acc + (p.amountEgp || 0), 0);
      const analytics = {
        totalVisitors: totalViews + 2845,
        uniqueVisitors: Math.floor((totalViews + 2845) * 0.76),
        totalCvWebsites: profs.length,
        totalUsers: edgeStore.users.length,
        totalRevenueEgp: totalRevenue + 350,
        themeDistribution: {
          executive: profs.filter(p => p.theme === 'executive').length || 2,
          tech: profs.filter(p => p.theme === 'tech' || p.theme === 'modern').length || 1,
          minimal: profs.filter(p => p.theme === 'minimal').length || 1,
          creative: profs.filter(p => p.theme === 'creative').length || 1,
        },
        topWebsites: profs.map(p => ({
          slug: p.slug,
          name: p.fullName,
          views: p.viewCount || 0,
          theme: p.theme
        }))
      };
      return new Response(JSON.stringify(analytics), { status: 200, headers: jsonHeaders });
    }

    // Users API
    if (pathname === '/api/users' && method === 'GET') {
      return new Response(JSON.stringify(edgeStore.users), { status: 200, headers: jsonHeaders });
    }

    // Plans API
    if (pathname === '/api/plans') {
      if (method === 'GET') {
        return new Response(JSON.stringify(edgeStore.plans), { status: 200, headers: jsonHeaders });
      }
      if (method === 'PATCH') {
        try {
          const body = await request.json();
          const target = edgeStore.plans.find(p => p.id === body.id);
          if (target && typeof body.priceEgp === 'number') {
            target.priceEgp = body.priceEgp;
            return new Response(JSON.stringify({ success: true, plan: target }), { status: 200, headers: jsonHeaders });
          }
        } catch {}
        return new Response(JSON.stringify({ error: 'Invalid update' }), { status: 400, headers: jsonHeaders });
      }
    }

    // Checkout API
    if (pathname === '/api/checkout' && method === 'POST') {
      try {
        const body = await request.json();
        const plan = edgeStore.plans.find(p => p.id === body.planId) || edgeStore.plans[0];
        const txId = 'MOCK-EGP-' + Date.now();
        const tx = {
          id: txId,
          userEmail: body.userEmail || 'candidate@example.com',
          planId: plan.id,
          amountEgp: plan.priceEgp,
          status: 'completed',
          paymentMethod: 'test_mock',
          createdAt: new Date().toISOString()
        };
        edgeStore.payments.unshift(tx);
        return new Response(JSON.stringify({
          isMock: true,
          transactionId: txId,
          paymentUrl: '/checkout/success?txId=' + txId + '&amount=' + plan.priceEgp + '&plan=' + encodeURIComponent(plan.name),
          message: 'Payment verified in Sandbox mode.'
        }), { status: 200, headers: jsonHeaders });
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Checkout failed' }), { status: 500, headers: jsonHeaders });
      }
    }

    // Payments API
    if (pathname === '/api/payments' && method === 'GET') {
      return new Response(JSON.stringify(edgeStore.payments), { status: 200, headers: jsonHeaders });
    }

    // Auth APIs
    if (pathname === '/api/auth/me' && method === 'GET') {
      const cookie = request.headers.get('cookie') || '';
      if (cookie.includes('cv_auth_session=') || cookie.includes('cv_session=')) {
        const isAdmin = cookie.includes('admin');
        const user = isAdmin
          ? { id: 'user-admin', email: 'admin@cvplatform.com', name: 'Platform Administrator', role: 'admin', slug: 'admin' }
          : { id: 'user-mazen', email: 'mazeneltelbany78@gmail.com', name: 'Mazen Mohamed Hamdy', role: 'user', slug: 'mazen' };
        const profile = edgeStore.profiles.get(user.slug) || Array.from(edgeStore.profiles.values())[0];
        return new Response(JSON.stringify({ user, profile }), { status: 200, headers: jsonHeaders });
      }
      return new Response(JSON.stringify({ user: null }), { status: 401, headers: jsonHeaders });
    }

    if (pathname === '/api/auth/google' && method === 'POST') {
      try {
        const body = await request.json();
        let email = 'candidate@gmail.com';
        let name = 'Candidate';
        let avatarUrl = '';

        if (body.credential && typeof body.credential === 'string') {
          try {
            const parts = body.credential.split('.');
            if (parts.length >= 2) {
              const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
              email = payload.email || email;
              name = payload.name || payload.given_name || name;
              avatarUrl = payload.picture || '';
            }
          } catch {}
        } else if (body.user) {
          email = body.user.email || email;
          name = body.user.name || name;
          avatarUrl = body.user.avatarUrl || '';
        }

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'candidate';
        const user = { id: 'usr-google-' + Date.now(), email, name, role: 'user', slug, avatarUrl };

        let profile = Array.from(edgeStore.profiles.values()).find(p => (p.email && p.email.toLowerCase() === email.toLowerCase()) || p.slug === slug);
        if (!profile) {
          profile = {
            id: 'profile-' + slug,
            slug,
            fullName: name,
            title: 'Professional Specialist',
            tagline: 'Driving strategic execution, technology innovation, and business impact.',
            email,
            location: 'Cairo, Egypt',
            summary: name + ' is a dedicated technology professional focused on excellence and innovation.',
            theme: 'executive',
            accentColor: 'amber',
            isPublished: true,
            viewCount: 1,
            metrics: [
              { label: 'Academic GPA', value: '3.8 / 4.0', description: 'Academic Honor' },
              { label: 'Verified Status', value: 'Active', description: 'Published' }
            ],
            education: [
              { id: 'edu-1', degree: 'Bachelor of Science in Engineering', institution: 'University', gpa: '3.8', honors: 'Honors', fieldOfStudy: 'Engineering', endDate: '2026' }
            ],
            experiences: [],
            skillGroups: [{ category: 'Core Skills', skills: ['System Design', 'Leadership', 'Execution'] }],
            projects: []
          };
          edgeStore.profiles.set(profile.slug, profile);
        }

        if (!edgeStore.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          edgeStore.users.push(user);
        }

        const respHeaders = new Headers(jsonHeaders);
        respHeaders.set('Set-Cookie', 'cv_auth_session=' + slug + '_' + Date.now() + '; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800');
        return new Response(JSON.stringify({ success: true, user, profile, redirectUrl: '/profile' }), { status: 200, headers: respHeaders });
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Google auth failed' }), { status: 500, headers: jsonHeaders });
      }
    }

    if (pathname === '/api/ai/chat' && method === 'POST') {
      try {
        const body = await request.json();
        const { messages, profile } = body;
        const lastMsg = messages && messages.length > 0 ? messages[messages.length - 1].content : '';
        const lower = (lastMsg || '').toLowerCase();
        
        let updates = {};
        let reply = '';

        // Check for specific intents
        if (lower.includes('executive')) {
          updates.theme = 'executive';
          reply = 'Switched your portfolio theme to Executive Suite (Dark Slate & Amber).';
        } else if (lower.includes('tech') || lower.includes('modern')) {
          updates.theme = 'tech';
          reply = 'Switched your portfolio theme to Modern Tech (Cyber Terminal & Glowing Emerald).';
        } else if (lower.includes('minimal')) {
          updates.theme = 'minimal';
          reply = 'Switched your portfolio theme to Minimalist Swiss (Editorial Ivory).';
        } else if (lower.includes('creative')) {
          updates.theme = 'creative';
          reply = 'Switched your portfolio theme to Creative Bento (Violet & Neon Rose).';
        }

        const gpaMatch = lower.match(/gpa\s*(?:to|is|=)?\s*([0-4](?:\.[0-9]{1,2})?)/i) || lower.match(/([0-4]\.[0-9]{1,2})\s*gpa/i);
        if (gpaMatch) {
          const gpaVal = gpaMatch[1];
          const newEdu = (profile.education || []).map(edu => ({
            ...edu,
            gpa: gpaVal,
            honors: edu.honors ? edu.honors + ' (GPA: ' + gpaVal + ')' : 'GPA: ' + gpaVal + ' / 4.0'
          }));
          updates.education = newEdu;
          const metrics = [...(profile.metrics || [])];
          const idx = metrics.findIndex(m => m.label.toLowerCase().includes('gpa') || m.label.toLowerCase().includes('standing'));
          if (idx >= 0) metrics[idx] = { ...metrics[idx], value: gpaVal + ' / 4.0' };
          else metrics.unshift({ label: 'Academic GPA', value: gpaVal + ' / 4.0', description: 'Academic Honor' });
          updates.metrics = metrics;
          reply = (reply ? reply + ' ' : '') + 'Updated your GPA to ' + gpaVal + ' across education and highlight metrics.';
        }

        const colors = ['amber', 'emerald', 'blue', 'indigo', 'violet', 'rose', 'cyan', 'slate'];
        for (const c of colors) {
          if (lower.includes('color to ' + c) || lower.includes('accent to ' + c) || lower.includes(c + ' color')) {
            updates.accentColor = c;
            reply = (reply ? reply + ' ' : '') + 'Updated your accent color palette to ' + c.toUpperCase() + '.';
            break;
          }
        }

        if (lower.includes('punchier') || lower.includes('rewrite summary') || lower.includes('improve bio')) {
          updates.summary = 'Accomplished technology specialist recognized for driving strategic engineering solutions, cross-functional collaboration, and technical innovation. Proven track record in architecting modern web platforms, optimizing distributed workflows, and executing complex software initiatives with excellence.';
          reply = (reply ? reply + ' ' : '') + 'Polished your executive summary with high-converting, leadership-focused phrasing.';
        }

        if (!reply) {
          // Attempt OpenRouter call
          try {
            const openRouterKey = (env && env.OPENROUTER_API_KEY) || (typeof process !== 'undefined' ? process.env.OPENROUTER_API_KEY : '') || '';
            const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + openRouterKey,
                'HTTP-Referer': 'https://cv-to-web.pages.dev',
                'X-Title': 'CVtoWeb'
              },
              body: JSON.stringify({
                model: 'google/gemma-4-26b-a4b-it:free',
                messages: [
                  { role: 'system', content: 'You are an AI CV editor. Return JSON with keys reply and updates.' },
                  { role: 'user', content: lastMsg }
                ],
                max_tokens: 400
              })
            });
            if (orRes.ok) {
              const orData = await orRes.json();
              const content = orData.choices && orData.choices[0] && orData.choices[0].message ? orData.choices[0].message.content : '';
              if (content) {
                const clean = content.split('json').join('').split(String.fromCharCode(96, 96, 96)).join('').trim();
                const parsed = JSON.parse(clean);
                reply = parsed.reply || 'Applied your request.';
                updates = parsed.updates || {};
              }
            }
          } catch {}
        }

        if (!reply) {
          reply = 'I have analyzed your request: "' + lastMsg + '". You can ask me to "Set GPA to 3.9", "Switch to Modern Tech theme", "Change color to Emerald", or "Rewrite summary".';
        }

        const updatedProfile = { ...profile, ...updates, updatedAt: new Date().toISOString() };
        
        // Update in edge store Map
        edgeStore.profiles.set(updatedProfile.slug, updatedProfile);

        return new Response(JSON.stringify({
          reply,
          updates,
          updatedProfile
        }), { status: 200, headers: jsonHeaders });
      } catch (err) {
        return new Response(JSON.stringify({ error: 'AI processing failed' }), { status: 500, headers: jsonHeaders });
      }
    }

    if (pathname === '/api/auth/login' && method === 'POST') {
      try {
        const body = await request.json();
        const { email, password } = body;
        if ((email === 'admin@cvplatform.com' && password === 'admin123') ||
            (email === 'mazeneltelbany78@gmail.com' && password === 'mazen123')) {
          const role = email.includes('admin') ? 'admin' : 'user';
          const user = { id: 'usr-1', email, name: role === 'admin' ? 'Platform Administrator' : 'Mazen Mohamed Hamdy', role };
          const respHeaders = new Headers(jsonHeaders);
          respHeaders.set('Set-Cookie', 'cv_auth_session=valid_session_' + Date.now() + '; Path=/; HttpOnly; SameSite=Strict');
          return new Response(JSON.stringify({ success: true, user }), { status: 200, headers: respHeaders });
        }
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401, headers: jsonHeaders });
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Authentication error' }), { status: 500, headers: jsonHeaders });
      }
    }

    if (pathname === '/api/auth/logout') {
      const respHeaders = new Headers(jsonHeaders);
      respHeaders.set('Set-Cookie', 'cv_auth_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: respHeaders });
    }

    // ==========================================
    // 2. DYNAMIC CV ROUTING (/cv/:slug)
    // ==========================================
    if (pathname.startsWith('/cv/')) {
      const parts = pathname.split('/').filter(Boolean);
      const slug = parts[1];
      if (slug) {
        // Try specific pre-rendered static page first (e.g. /cv/mazen, /cv/mohamedcv)
        const specificReq = new Request(new URL('/cv/' + slug, request.url), request);
        let specRes = await env.ASSETS.fetch(specificReq);
        if (specRes.status === 200) {
          return specRes;
        }

        // For any other dynamic slug, serve /cv/mazen as the dynamic SPA host template
        const spaHostReq = new Request(new URL('/cv/mazen', request.url), request);
        let spaRes = await env.ASSETS.fetch(spaHostReq);
        if (spaRes.status === 200) {
          return spaRes;
        }
      }
    }

    // ==========================================
    // 3. STATIC ASSETS & CLEAN URLS
    // ==========================================
    let res = await env.ASSETS.fetch(request);
    if (res.status !== 404) {
      return res;
    }

    if (!pathname.includes('.')) {
      const cleanUrl = new URL(request.url);
      cleanUrl.pathname = pathname.endsWith('/') ? (pathname + 'index.html') : (pathname + '.html');
      res = await env.ASSETS.fetch(new Request(cleanUrl, request));
      if (res.status !== 404) {
        return res;
      }

      const cleanPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
      const subUrl = new URL(request.url);
      subUrl.pathname = cleanPath + '/index.html';
      res = await env.ASSETS.fetch(new Request(subUrl, request));
      if (res.status !== 404) {
        return res;
      }
    }

    // Fallback 404
    const notFoundUrl = new URL('/404', request.url);
    return env.ASSETS.fetch(new Request(notFoundUrl, request));
  }
};
