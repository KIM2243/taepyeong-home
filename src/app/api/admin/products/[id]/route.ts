import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - 단일 상품 조회
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true }
    });
    if (!product) return NextResponse.json({ error: '제품을 찾을 수 없습니다.' }, { status: 404 });
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - 상품 수정
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await req.json();

    // categorySlug → categoryId 변환
    let categoryId = data.categoryId;
    if (!categoryId && data.categorySlug) {
      const category = await prisma.category.findUnique({ where: { slug: data.categorySlug } });
      if (!category) return NextResponse.json({ error: `카테고리를 찾을 수 없습니다: ${data.categorySlug}` }, { status: 400 });
      categoryId = category.id;
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        spec: data.spec || '',
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(categoryId && { categoryId }),
      }
    });
    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Product update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - 상품 삭제
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
