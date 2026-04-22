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

    // Handle Email Notification in the background
    (async () => {
      try {
        const emailSetting = await prisma.siteSetting.findUnique({
          where: { key: 'notification_emails' }
        });
        
        if (emailSetting && emailSetting.value) {
          const emails: string[] = JSON.parse(emailSetting.value);
          if (Array.isArray(emails) && emails.length > 0) {
            await sendInquiryNotification(emails, inquiry);
          }
        }
      } catch (err) {
        console.error('[MAILER] Background notification failed:', err);
      }
    })();

    return NextResponse.json(inquiry, { status: 201 });
  } catch (error: any) {
    console.error('Failed to submit inquiry:', error);
    return NextResponse.json({ error: 'Failed to submit inquiry', details: error?.message || String(error) }, { status: 500 });
  }
}
