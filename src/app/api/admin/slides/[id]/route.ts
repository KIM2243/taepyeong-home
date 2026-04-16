import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.mainSlide.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await req.json();
    const slide = await prisma.mainSlide.update({
      where: { id },
      data: {
        accent: data.accent,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        order: data.order
      }
    });
    return NextResponse.json(slide);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
