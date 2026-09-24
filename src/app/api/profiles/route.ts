import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const domain = searchParams.get('domain');

    if (slug) {
      const profile = await dataStore.getProfileBySlug(slug);
      if (!profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }
      return NextResponse.json(profile);
    }

    if (domain) {
      const profile = await dataStore.getProfileByCustomDomain(domain);
      if (!profile) {
        return NextResponse.json({ error: 'Domain not mapped to any profile' }, { status: 404 });
      }
      return NextResponse.json(profile);
    }

    const profiles = await dataStore.getProfiles();
    return NextResponse.json(profiles);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const saved = await dataStore.saveProfile(body);
    return NextResponse.json({ success: true, profile: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing profile ID' }, { status: 400 });
    }
    const success = await dataStore.deleteProfile(id);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
