import React from 'react';
import { prisma } from '@/lib/prisma';
import HomePage from './HomePage';

export const dynamic = 'force-dynamic';

export default async function Page() {
  // 1. Fetch site settings from DB
  const settings = await prisma.siteSetting.findMany();
  const initialConfigs: Record<string, string> = {};
  settings.forEach(s => {
    initialConfigs[s.key] = s.value;
  });

  // 2. Fetch slides from DB
  const slides = await prisma.mainSlide.findMany({
    orderBy: { order: 'asc' }
  });

  // 3. Fetch products and group by category
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });
  const grouped: Record<string, { name: string; products: any[] }> = {};
  products.forEach((p: any) => {
    const catName = p.category?.name || '기타';
    if (!grouped[catName]) grouped[catName] = { name: catName, products: [] };
    grouped[catName].products.push(p);
  });
  const initialCategories = Object.values(grouped);

  // 카테고리 표시 순서 고정 (점보롤 -> 페이퍼타올 -> 두루마리 화장지 -> 기타)
  const orderMap: Record<string, number> = {
    '점보롤': 1,
    '페이퍼타올': 2,
    '두루마리 화장지': 3,
  };

  initialCategories.sort((a, b) => {
    const aOrder = orderMap[a.name] || 99;
    const bOrder = orderMap[b.name] || 99;
    if (aOrder === bOrder) return a.name.localeCompare(b.name);
    return aOrder - bOrder;
  });
  return (
    <HomePage 
      initialConfigs={initialConfigs} 
      initialSlides={slides} 
      initialCategories={initialCategories} 
    />
  );
}
