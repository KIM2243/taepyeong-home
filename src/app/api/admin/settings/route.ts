import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();
    // Convert array of [{key, value}, ...] to {key: value, ...}
    const config = Object.fromEntries(settings.map(s => [s.key, s.value]));
    return NextResponse.json(config);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check session (simple cookie check matches existing logic)
    const cookie = req.cookies.get('admin_session');
    if (cookie?.value !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Perform bulk upsert
    const operations = Object.entries(body).map(([key, value]) => {
      return prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    });

    await prisma.$transaction(operations);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: `Failed to save settings: ${err.message || String(err)}` }, { status: 500 });
  }
}
