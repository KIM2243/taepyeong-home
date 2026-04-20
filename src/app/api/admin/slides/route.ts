import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const slides = await prisma.mainSlide.findMany({
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(slides);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Count existing slides
    const count = await prisma.mainSlide.count();
    if (count >= 3) {
      return NextResponse.json({ error: "슬라이드는 최대 3개까지만 등록 가능합니다." }, { status: 400 });
    }

    const slide = await prisma.mainSlide.create({
      data: {
        accent: data.accent,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        order: data.order || count
      }
    });
    return NextResponse.json(slide);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
