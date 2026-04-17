import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.tpfresh.com';

  // 1. Fetch all categories for category pages
  const categories = await prisma.category.findMany({
    select: { slug: true, updatedAt: true },
  });

  const categoryEntries = categories.map((cat) => ({
    url: `${baseUrl}/products/${cat.slug}`,
    lastModified: cat.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 2. Home page entry
  const homeEntry = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1.0,
  };

  return [homeEntry, ...categoryEntries];
}
