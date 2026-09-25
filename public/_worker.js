
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

// In-memory store for edge worker lifetime
const edgeStore = {
  plans: [...DEFAULT_PLANS],
  profiles: new Map(),
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
    const method = request.method.toUpperCase();

    const jsonHeaders = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: jsonHeaders });
    }

    // ==========================================
    // 1. API ROUTES
    // ==========================================

    // Upload CV
    if (pathname === '/api/upload-cv' && method === 'POST') {
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
      if (cookie.includes('cv_auth_session=')) {
        return new Response(JSON.stringify({
          user: { id: 'user-admin', email: 'admin@cvplatform.com', name: 'Platform Administrator', role: 'admin' }
        }), { status: 200, headers: jsonHeaders });
      }
      return new Response(JSON.stringify({ user: null }), { status: 401, headers: jsonHeaders });
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
      const slug = pathname.replace('/cv/', '').replace(/\/$/, '');
      if (slug) {
        // Try specific pre-rendered static page first (e.g. cv/mazen.html)
        const specificReq = new Request(new URL('/cv/' + slug + '.html', request.url), request);
        let specRes = await env.ASSETS.fetch(specificReq);
        if (specRes.status === 200) {
          return specRes;
        }

        // For any other dynamic slug, serve cv/mazen.html as the dynamic SPA host template
        const spaHostReq = new Request(new URL('/cv/mazen.html', request.url), request);
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
      cleanUrl.pathname = pathname.endsWith('/') ? `${pathname}index.html` : `${pathname}.html`;
      res = await env.ASSETS.fetch(new Request(cleanUrl, request));
      if (res.status !== 404) {
        return res;
      }

      const subUrl = new URL(request.url);
      subUrl.pathname = `${pathname.replace(/\/$/, '')}/index.html`;
      res = await env.ASSETS.fetch(new Request(subUrl, request));
      if (res.status !== 404) {
        return res;
      }
    }

    // Fallback 404
    const notFoundUrl = new URL('/404.html', request.url);
    return env.ASSETS.fetch(new Request(notFoundUrl, request));
  }
};
