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
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
    summary: 'Decisive technical leader with 9+ years architecting microservices, cloud infrastructure, and mission-critical financial applications. Proven record of scaling platform operations from 10k to 2M+ active transactions per day while slashing infrastructure expenses by 35%. Passionate about engineering excellence, team mentorship, and high-performance engineering culture.',
    originalPdfUrl: '/demo-cv.pdf',
    customDomain: undefined,
    theme: 'executive',
    accentColor: 'amber',
    isPublished: true,
    viewCount: 428,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
        fieldOfStudy: 'Information Engineering and Technology (IET)',
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
  }
];
