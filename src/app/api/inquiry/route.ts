import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, address, details } = body;

    // Validate
    if (!name || !email || !phone || !details) {
      return NextResponse.json({ error: '필수 정보가 누락되었습니다.' }, { status: 400 });
    }

    // Save to Database
    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone,
        address,
        details,
        status: 'UNREAD'
      }
    });

    return NextResponse.json(inquiry, { status: 201 });
  } catch (error: any) {
    console.error('Failed to submit inquiry:', error);
    return NextResponse.json({ error: 'Failed to submit inquiry', details: error?.message || String(error) }, { status: 500 });
  }
}
