import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
  const session = cookies().get('admin_session');
  if (!session || session.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const admin = await prisma.admin.findFirst({
      select: { username: true, email: true }
    });

    return NextResponse.json(admin);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = cookies().get('admin_session');
  if (!session || session.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { email } = await req.json();

    // 이메일 형식 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      return NextResponse.json({ error: '유효하지 않은 이메일 형식입니다.' }, { status: 400 });
    }

    const admin = await prisma.admin.findFirst();
    if (!admin) {
      return NextResponse.json({ error: '관리자 계정을 찾을 수 없습니다.' }, { status: 404 });
    }

    await prisma.admin.update({
      where: { id: admin.id },
      data: { email }
    });

    return NextResponse.json({ success: true, message: '프로필 정보가 저장되었습니다.' });
  } catch (error: any) {
    console.error('[PROFILE_UPDATE_ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
