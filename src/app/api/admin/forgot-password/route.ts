import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/mailer';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { username, email } = await req.json();

    if (!username || !email) {
      return NextResponse.json({ success: false, message: '아이디와 이메일을 모두 입력해 주세요.' }, { status: 400 });
    }

    // 1. Find user by username and email
    const admin = await prisma.admin.findUnique({
      where: { username }
    });

    if (!admin || !admin.email || admin.email !== email) {
      // Security: Don't reveal if the user exists or not, but in this specific admin-only context, 
      // a clear message is often preferred for usability.
      return NextResponse.json({ success: false, message: '등록된 정보와 일치하는 계정을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 2. Generate a random temporary password (8 chars)
    const tempPassword = crypto.randomBytes(4).toString('hex');

    // 3. Update the database (note: currently plain text as per existing logic, though hashing is recommended)
    await prisma.admin.update({
      where: { username },
      data: { password: tempPassword }
    });

    // 4. Send the email
    try {
      await sendPasswordResetEmail(admin.email, tempPassword);
    } catch (mailError) {
      console.error('[FORGOT-PASSWORD] Mail error:', mailError);
      return NextResponse.json({ success: false, message: '메일 발송 중 오류가 발생했습니다. SMTP 설정을 확인해 주세요.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: '임시 비밀번호가 메일로 발송되었습니다.' });
  } catch (error: any) {
    console.error('[FORGOT-PASSWORD] Global error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
