import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const payments = await dataStore.getPayments();
    return NextResponse.json(payments);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
