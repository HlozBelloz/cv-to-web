import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/store';
import { signSession, AUTH_COOKIE_NAME, getAuthCookieOptions } from '@/lib/auth';
import { User, CVProfile } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let email = '';
    let name = '';
    let googleId = '';
    let avatarUrl = '';

    // 1. Process Google Identity Services (GIS) Credential JWT if provided
    if (body.credential && typeof body.credential === 'string') {
      try {
        const parts = body.credential.split('.');
        if (parts.length >= 2) {
          const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
          const payloadStr = Buffer.from(payloadBase64, 'base64').toString('utf8');
          const payload = JSON.parse(payloadStr);

          email = payload.email || '';
          name = payload.name || payload.given_name || 'Google User';
          googleId = payload.sub || '';
          avatarUrl = payload.picture || '';
        }
      } catch (e) {
        console.warn('Failed to parse Google JWT credential:', e);
      }
    }

    // 2. Direct user object fallback
    if (!email && body.user) {
      email = body.user.email || '';
      name = body.user.name || 'Google User';
      googleId = body.user.googleId || `goog_${Date.now()}`;
      avatarUrl = body.user.avatarUrl || body.user.picture || '';
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Valid Google email is required for authentication' },
        { status: 400 }
      );
    }

    email = email.toLowerCase().trim();

    // 3. Find or create user
    let user = await dataStore.getUserByEmail(email);

    if (user) {
      // Update with googleId and avatar if missing
      user.googleId = user.googleId || googleId;
      user.avatarUrl = avatarUrl || user.avatarUrl;
      await dataStore.saveUser(user);
    } else {
      // Derive clean slug from user's name
      const baseSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || 'candidate';

      let slug = baseSlug;
      let counter = 1;
      while (await dataStore.getProfileBySlug(slug)) {
        slug = `${baseSlug}-${counter++}`;
      }

      user = {
        id: `user-google-${Date.now()}`,
        email,
        name,
        role: 'user',
        slug,
        googleId,
        avatarUrl,
        createdAt: new Date().toISOString(),
      };

      await dataStore.saveUser(user);

      // Create initial profile for this new user if one doesn't exist
      const existingProfile = await dataStore.getProfileBySlug(slug);
      if (!existingProfile) {
        const newProfile: CVProfile = {
          id: `profile-${slug}`,
          slug,
          fullName: name,
          title: 'Professional Candidate',
          tagline: 'Passionate and driven professional ready to create meaningful impact.',
          email,
          summary: `Welcome to my executive portfolio website. I am an experienced specialist with a background in engineering, software systems, and continuous delivery.`,
          theme: 'executive',
          accentColor: 'amber',
          isPublished: true,
          viewCount: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          metrics: [
            { label: 'Academic GPA', value: '3.8 / 4.0', description: 'Academic Honor' },
            { label: 'Technical Depth', value: '100%', description: 'Architecture & Engineering' },
            { label: 'Verified Status', value: 'Ready', description: 'Available for Opportunities' },
          ],
          education: [
            {
              id: `edu-1`,
              degree: 'Bachelor of Science in Engineering',
              fieldOfStudy: 'Information Engineering & Computer Systems',
              institution: 'German University in Cairo (GUC)',
              startDate: '2021',
              endDate: '2026',
              gpa: '3.8',
              honors: 'Excellent with High Honors',
            },
          ],
          experiences: [],
          skillGroups: [
            {
              category: 'Core Competencies',
              skills: ['Fullstack Architecture', 'Next.js', 'Distributed Systems', 'Cloud Edge'],
            },
          ],
          projects: [],
        };

        await dataStore.saveProfile(newProfile);
      }
    }

    // 4. Create secure session
    const sessionToken = signSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      slug: user.slug,
      name: user.name,
      avatarUrl: user.avatarUrl,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        slug: user.slug,
        avatarUrl: user.avatarUrl,
      },
      redirectUrl: '/dashboard',
    });

    const cookieOptions = getAuthCookieOptions();
    response.cookies.set(AUTH_COOKIE_NAME, sessionToken, cookieOptions);

    return response;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Google authentication failed';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
