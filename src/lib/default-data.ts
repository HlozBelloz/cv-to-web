import { Plan, CVProfile } from '@/types';

export const DEFAULT_PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Standard CV Launch',
    priceEgp: 100,
    period: 'one-time',
    description: 'Convert your PDF CV into an executive website with a permanent hosted link.',
    features: [
      'High-converting Executive Corporate Theme',
      'Instant AI Extraction from PDF',
      'Free Subdomain (e.g. yourname.cvplatform.com)',
      '1-Click Download of Original PDF',
      'Interactive Experience & Projects Showcase',
      'Recruiter Contact Inquiry Form',
      'Mobile & Desktop Optimized'
    ],
    isPopular: true,
    isActive: true,
    customDomainAllowed: false,
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
    isPopular: false,
    isActive: true,
    customDomainAllowed: true,
  }
];

export const DEMO_PROFILES: CVProfile[] = [
  {
    id: 'demo-mohamed',
    slug: 'mohamedcv',
    fullName: 'Mohamed El-Sayed',
    title: 'Senior Solutions Architect & Tech Lead',
    tagline: 'Designing high-scale distributed systems and enterprise cloud architectures across EMEA.',
    email: 'mohamed.elsayed@example.com',
    phone: '+20 100 123 4567',
    location: 'Cairo, Egypt / Remote',
    linkedinUrl: 'https://linkedin.com/in/mohamed-demo',
    githubUrl: 'https://github.com/mohamed-demo',
    portfolioUrl: 'https://mohamedcv.dev',
    summary: 'Decisive technical leader with 9+ years architecting microservices, cloud infrastructure, and mission-critical financial applications. Proven record of scaling platform operations from 10k to 2M+ active transactions per day while slashing infrastructure expenses by 35%. Passionate about engineering excellence, team mentorship, and high-performance engineering culture.',
    originalPdfUrl: '/demo-cv.pdf',
    customDomain: undefined,
    theme: 'executive',
    isPublished: true,
    viewCount: 428,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
        description: 'Leading enterprise cloud transformation programs and core architecture governance for banking and telecom clients.',
        bulletPoints: [
          'Spearheaded transition from legacy monolithic systems to event-driven microservices on AWS/Kubernetes, achieving 99.99% uptime.',
          'Formulated zero-trust security postures and compliance frameworks adhering to ISO 27001 and PCI-DSS standards.',
          'Mentored 18 senior and staff engineers across 3 distributed international pods.'
        ]
      },
      {
        id: 'exp-2',
        role: 'Senior Backend Engineering Lead',
        company: 'NileTech FinTech',
        location: 'Cairo, Egypt',
        startDate: '2019',
        endDate: '2022',
        current: false,
        description: 'Architected payment processing engines and automated settlement pipelines.',
        bulletPoints: [
          'Engineered low-latency payment reconciliation microservices processing over 120M EGP in monthly transactions.',
          'Decreased API response latency by 45% through Redis caching layers and PostgreSQL query tuning.',
          'Automated CI/CD deployment pipelines with zero-downtime rolling upgrades.'
        ]
      },
      {
        id: 'exp-3',
        role: 'Full-Stack Software Engineer',
        company: 'Global Digital Agency',
        location: 'Alexandria, Egypt',
        startDate: '2016',
        endDate: '2019',
        current: false,
        description: 'Developed client-facing web portals and high-traffic e-commerce systems.',
        bulletPoints: [
          'Built responsive frontends using Next.js and React alongside robust Node.js/Go backends.',
          'Integrated multiple third-party payment gateways and CRM systems seamlessly.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'Bachelor of Science (B.Sc.)',
        fieldOfStudy: 'Computer Science & Engineering',
        institution: 'Cairo University - Faculty of Engineering',
        startDate: '2011',
        endDate: '2016',
        honors: 'Graduated with First Class Honors'
      }
    ],
    skillGroups: [
      {
        category: 'Architecture & Leadership',
        skills: ['Distributed Systems', 'Cloud Migration', 'Microservices', 'System Design', 'Team Leadership', 'Agile/Scrum', 'Cost Optimization']
      },
      {
        category: 'Cloud & Infrastructure',
        skills: ['AWS (ECS, Lambda, RDS, S3)', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD Pipelines', 'Cloudflare', 'Monitoring & Grafana']
      },
      {
        category: 'Languages & Frameworks',
        skills: ['Node.js / TypeScript', 'Go (Golang)', 'Python', 'Next.js / React', 'PostgreSQL', 'Redis', 'Kafka / RabbitMQ', 'GraphQL & REST']
      }
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'High-Throughput Payment Core',
        description: 'Engineered a fault-tolerant payment gateway integration with idempotent transaction ledger and automated reconciliation.',
        technologies: ['Go', 'PostgreSQL', 'Redis', 'Docker', 'Kafka'],
        metrics: 'Processes 250+ transactions/second under peak load'
      },
      {
        id: 'proj-2',
        title: 'Cloud Cost Optimization Framework',
        description: 'Designed automated compute autoscaling and spot instance governance pipeline across multi-region Kubernetes clusters.',
        technologies: ['Terraform', 'Kubernetes', 'AWS', 'Python'],
        metrics: 'Saved $45,000 annually in AWS compute spend'
      }
    ],
    certifications: [
      'AWS Certified Solutions Architect – Professional',
      'Certified Kubernetes Administrator (CKA)',
      'TOGAF 9.2 Certified Enterprise Architect'
    ]
  },
  {
    id: 'profile-mazen',
    slug: 'mazen',
    fullName: 'Mazen Mohamed Hamdy',
    title: 'Information Engineering & Technology Engineer | Networking & Cloud Systems',
    tagline: 'GUC Engineering Student specializing in High-Performance Networking, Container Orchestration & Distributed Systems.',
    email: 'mazeneltelbany78@gmail.com',
    phone: '(+20) 102 199 2115',
    location: 'Nasr City, Cairo, Egypt',
    linkedinUrl: 'https://www.linkedin.com/in/mazen-eltelbany-8aaab5403/',
    githubUrl: 'https://github.com',
    summary: 'Information Engineering & Technology scholar at the German University in Cairo (GUC) with an outstanding A- GPA (1.65). Proficient in Java, Python, Docker containerization, and foundational enterprise networking (TCP/IP, routing, switching, subnetting). Demonstrates hands-on engineering capability across hardware encryption breadboards, modular game engines, and production-grade self-hosted homelab infrastructure.',
    originalPdfUrl: '/mazen-cv.pdf',
    theme: 'executive',
    isPublished: true,
    viewCount: 142,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metrics: [
      { label: 'Academic Standing', value: '1.65 (A-)', description: 'GUC Information Engineering' },
      { label: 'Engineering Projects', value: '5+', description: 'Hardware, networks & software' },
      { label: 'Production Uptime', value: '99.9%', description: 'Homelab & container services' },
      { label: 'Core Languages', value: '3', description: 'Arabic (Native), English, German' }
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
      }
    ],
    education: [
      {
        id: 'edu-mazen-1',
        degree: 'Bachelor of Engineering (B.Sc.)',
        fieldOfStudy: 'Information Engineering and Technology',
        institution: 'German University in Cairo (GUC)',
        startDate: '2024',
        endDate: '2029 (Expected)',
        honors: 'Current GPA: 1.65 (A-)'
      }
    ],
    skillGroups: [
      {
        category: 'Programming & Systems',
        skills: ['Java (Advanced OOP)', 'Python', 'Data Structures & Algorithms', 'Boolean Logic Optimization', 'Digital Logic Design']
      },
      {
        category: 'Networks & Protocols',
        skills: ['TCP/IP Fundamentals', 'Routing & Switching', 'Subnetting & CIDR', 'WireGuard VPN', 'Wireshark Packet Analysis', 'Network Troubleshooting']
      },
      {
        category: 'DevOps & Infrastructure',
        skills: ['Docker', 'Docker Compose', 'nginx Proxy Manager', 'Linux Server Administration', 'VirtualBox', 'PSPICE Simulation']
      },
      {
        category: 'Languages',
        skills: ['Arabic (Native)', 'English (Fluent)', 'German (A2 Level)']
      }
    ],
    projects: [
      {
        id: 'proj-mazen-1',
        title: 'Hardware Encryption / Decryption System',
        description: 'Designed and prototyped a physical hardware system on a breadboard to encrypt and decrypt binary data using Boolean algebra and fundamental logic gates.',
        technologies: ['Digital Logic', 'Boolean Algebra', 'Logic Gates', 'Breadboard Prototyping'],
        metrics: 'Zero-latency hardware data processing pipeline'
      },
      {
        id: 'proj-mazen-2',
        title: 'Self-Hosted Homelab Infrastructure',
        description: 'Architected and deployed multi-container service infrastructure utilizing Docker and Docker Compose with reverse proxying and secure remote tunneling.',
        technologies: ['Docker', 'Docker Compose', 'WireGuard VPN', 'nginx Proxy Manager', 'Linux'],
        metrics: '100% encrypted remote access with automated media pipelines'
      },
      {
        id: 'proj-mazen-3',
        title: 'Java Socket Network Chat Application',
        description: 'Engineered a concurrent client-server chat application over TCP sockets, validating packet delivery and analyzing stream traffic flows in Wireshark.',
        technologies: ['Java', 'TCP/IP Sockets', 'Multithreading', 'Wireshark'],
        metrics: 'Bidirectional multi-client communication over local networks'
      },
      {
        id: 'proj-mazen-4',
        title: 'Modular OOP Java Game Engine',
        description: 'Architected a layered object-oriented game engine in Java featuring energy management, role-based dynamics, and event-driven cell interactions.',
        technologies: ['Java', 'OOP Design Patterns', 'Unit Testing', 'Exception Handling'],
        metrics: 'Comprehensive unit test coverage and modular architecture'
      }
    ],
    certifications: [
      'Digital Logic Design & Hardware Prototyping - GUC',
      'Communication Networks & Protocols - GUC',
      'German Language Proficiency A2'
    ]
  }
];
