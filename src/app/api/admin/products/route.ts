import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true
      },
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // categorySlug으로 카테고리 조회 → categoryId 확보
    let categoryId = data.categoryId;
    if (!categoryId && data.categorySlug) {
      const category = await prisma.category.findUnique({
        where: { slug: data.categorySlug }
      });
      if (!category) {
        return NextResponse.json({ error: `카테고리를 찾을 수 없습니다: ${data.categorySlug}` }, { status: 400 });
      }
      categoryId = category.id;
    }

    if (!categoryId) {
      return NextResponse.json({ error: '카테고리를 선택해주세요.' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        spec: data.spec || '',
        desc1: data.desc1 || '',
        desc2: data.desc2 || '',
        desc3: data.desc3 || '',
        desc4: data.desc4 || '',
        desc5: data.desc5 || '',
        imageUrl: data.imageUrl || null,
        categoryId: categoryId,
        order: data.order || 0
      }
    });
    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Product create error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
