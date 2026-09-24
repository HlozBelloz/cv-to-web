import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const plans = await dataStore.getPlans();
    return NextResponse.json(plans);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, priceEgp } = await req.json();
    if (!id || typeof priceEgp !== 'number') {
      return NextResponse.json({ error: 'Valid plan ID and priceEgp number required' }, { status: 400 });
    }

    const updated = await dataStore.updatePlanPrice(id, priceEgp);
    if (!updated) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, plan: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const newPlan = await req.json();
    const saved = await dataStore.savePlan(newPlan);
    return NextResponse.json({ success: true, plan: saved });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
