import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { username, currentPassword, newPassword } = await req.json();

    const admin = await prisma.admin.findUnique({
      where: { username }
    });

    if (!admin || admin.password !== currentPassword) {
      return NextResponse.json({ success: false, message: "현재 비밀번호가 일치하지 않습니다." }, { status: 401 });
    }

    await prisma.admin.update({
      where: { username },
      data: { password: newPassword }
    });

    return NextResponse.json({ success: true, message: "비밀번호가 성공적으로 변경되었습니다." });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
