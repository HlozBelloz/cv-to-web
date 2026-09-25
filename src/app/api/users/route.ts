import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rawUsers = await dataStore.getUsers();
    
    // Return sanitized users list
    const users = rawUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      slug: u.slug || 'candidate',
      authMethod: u.googleId ? 'google' : 'email',
      avatarUrl: u.avatarUrl || '',
      createdAt: u.createdAt,
      status: 'active',
    }));

    return NextResponse.json(users);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve users';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
