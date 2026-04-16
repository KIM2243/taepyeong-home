import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const categories = [
    { name: '점보롤', slug: 'jumbo-roll' },
    { name: '페이퍼타올', slug: 'paper-towel' },
    { name: '두루마리 화장지', slug: 'roll-toilet' },
  ];

  try {
    for (const cat of categories) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      });
    }

    // Seed Admin
    await prisma.admin.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        password: '1212'
      }
    });

    return NextResponse.json({ success: true, message: "Categories and Admin seeded successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
