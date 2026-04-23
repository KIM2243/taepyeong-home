import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendInquiryNotification } from '@/lib/mailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, address, details } = body;

    // Validate
    if (!name || !email || !phone || !details) {
      return NextResponse.json({ error: '필수 정보가 누락되었습니다.' }, { status: 400 });
    }

    // Save to Database
    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone,
        address,
        details,
        status: 'UNREAD'
      }
    });

    // Handle Email Notification
    try {
      const emailSetting = await prisma.siteSetting.findUnique({
        where: { key: 'notification_emails' }
      });
      
      if (emailSetting && emailSetting.value) {
        const emails: string[] = JSON.parse(emailSetting.value);
        if (Array.isArray(emails) && emails.length > 0) {
          // In Serverless environments like Vercel, we MUST await the email sending
          // or the function might terminate before it is sent.
          await sendInquiryNotification(emails, inquiry);
        }
      }
    } catch (err) {
      console.error('[MAILER] Notification failed:', err);
      // We don't return error to user here because the inquiry is already saved to DB
    }

    return NextResponse.json({ 
      success: true, 
      data: inquiry 
    });
  } catch (error: any) {
    console.error('Failed to submit inquiry:', error);
    return NextResponse.json({ error: 'Failed to submit inquiry', details: error?.message || String(error) }, { status: 500 });
  }
}
