import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - 순서 일괄 저장 { items: [{ id, order }] }
export async function POST(req: Request) {
  try {
    const { items } = await req.json();
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: '잘못된 요청 형식입니다.' }, { status: 400 });
    }

    await Promise.all(
      items.map(({ id, order }: { id: string; order: number }) =>
        prisma.product.update({ where: { id }, data: { order } })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Reorder error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
