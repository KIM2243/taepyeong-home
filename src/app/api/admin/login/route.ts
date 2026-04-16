import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { id, password } = await req.json();

  // MASTER & DEFAULT FALLBACK (Highest Priority: Ensures access even if DB tables are missing)
  if (id === "admin" && (password === "1212" || password === "rlawhddbs132!")) {
    const resp = NextResponse.json({ success: true, message: "Logged in via default credentials" });
    resp.cookies.set('admin_session', 'true', { 
      path: '/', 
      httpOnly: false, // Changed to false to allow client-side Auth check in AdminLayout
      maxAge: 60 * 60 * 24
    });
    return resp;
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { username: id }
    });

    if (admin && admin.password === password) {
      const response = NextResponse.json({ success: true, message: "Logged in successfully" });
      
      response.cookies.set('admin_session', 'true', {
        httpOnly: false, // Changed to false for client-side Auth check
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day
      });

      return response;
    }

    return NextResponse.json({ success: false, message: "아이디 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });

  } catch (error: any) {
    console.error("Login DB Error:", error);
    return NextResponse.json({ success: false, message: `DB 연결 오류: ${error.message}` }, { status: 500 });
  }
}
