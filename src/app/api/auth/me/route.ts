import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { dataStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  // Also fetch the candidate profile if the user has a slug
  let profile = null;
  if (session.slug) {
    profile = await dataStore.getProfileBySlug(session.slug);
  } else {
    // try to find by email
    const allProfiles = await dataStore.getProfiles();
    profile = allProfiles.find(p => p.email.toLowerCase() === session.email.toLowerCase()) || null;
  }

  return NextResponse.json({
    authenticated: true,
    user: session,
    profile
  });
}
