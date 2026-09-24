import { NextRequest, NextResponse } from 'next/server';
import { paymobService } from '@/lib/paymob';
import { dataStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { planId, userEmail, userName, userPhone } = await req.json();

    const plan = await dataStore.getPlanById(planId);
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    const result = await paymobService.initiatePayment({
      amountCents: plan.priceEgp * 100,
      currency: 'EGP',
      userEmail: userEmail || 'customer@example.com',
      userName: userName || 'Customer Candidate',
      userPhone: userPhone || '+201000000000',
      planId: plan.id,
      planName: plan.name
    });

    await dataStore.recordPayment({
      id: result.transactionId,
      userEmail: userEmail || 'customer@example.com',
      planId: plan.id,
      amountEgp: plan.priceEgp,
      status: result.isMock ? 'completed' : 'pending',
      paymentMethod: result.isMock ? 'test_mock' : 'card',
      createdAt: new Date().toISOString()
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
