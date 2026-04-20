import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const baseUrl = 'https://www.tpfresh.com';

  const items = products.map((p) => `
    <item>
      <title><![CDATA[${p.name} (${p.spec})]]></title>
      <link>${baseUrl}/products/${p.category.slug}</link>
      <description><![CDATA[${p.name} - ${p.spec}. 태평프레시에서 제공하는 고품질 기업용 화장지/물류 제품입니다.]]></description>
      <pubDate>${p.createdAt.toUTCString()}</pubDate>
      <guid isPermaLink="false">${p.id}</guid>
    </item>
  `).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2000/svg">
  <channel>
    <title>태평프레시 (Taepyeong Fresh)</title>
    <link>${baseUrl}</link>
    <description>태평프레시는 기업용 화장지, 점보롤, 키친타올 등 고품질 제품을 공급하는 B2B 전문 유통 기업입니다.</description>
    <language>ko-kr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
    },
  });
}
