import nodemailer from 'nodemailer';

interface InquiryData {
  name: string;
  email: string;
  phone: string;
  address?: string | null;
  details: string;
}

export async function sendInquiryNotification(toEmails: string[], inquiryData: InquiryData) {
  if (!toEmails || toEmails.length === 0) return;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  // If SMTP is not properly configured, just log to the console gracefully.
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn('[MAILER] SMTP credentials missing in .env. Skipping email notification to:', toEmails.join(', '));
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 465,
      secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const htmlBody = `
      <div style="font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #005b82, #0077a8); padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 20px; font-weight: 700; margin: 0;">새로운 온라인 문의가 접수되었습니다</h1>
        </div>
        <div style="padding: 24px; background: #ffffff;">
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9;">
              <span style="font-size: 13px; color: #64748b; display: block; margin-bottom: 4px;">고객/업체명</span>
              <strong style="font-size: 16px; color: #0f172a;">${inquiryData.name}</strong>
            </li>
            <li style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9;">
              <span style="font-size: 13px; color: #64748b; display: block; margin-bottom: 4px;">연락처</span>
              <strong style="font-size: 15px; color: #0f172a;">${inquiryData.phone}</strong>
            </li>
            <li style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9;">
              <span style="font-size: 13px; color: #64748b; display: block; margin-bottom: 4px;">이메일</span>
              <strong style="font-size: 15px; color: #0f172a;">${inquiryData.email}</strong>
            </li>
            <li style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9;">
              <span style="font-size: 13px; color: #64748b; display: block; margin-bottom: 4px;">주소 (선택)</span>
              <strong style="font-size: 15px; color: #0f172a;">${inquiryData.address || '-'}</strong>
            </li>
            <li>
              <span style="font-size: 13px; color: #64748b; display: block; margin-bottom: 8px;">문의 내용</span>
              <div style="font-size: 15px; color: #334155; line-height: 1.6; background: #f8fafc; padding: 16px; border-radius: 6px; white-space: pre-wrap;">${inquiryData.details}</div>
            </li>
          </ul>
        </div>
        <div style="background: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 12px; color: #94a3b8;">본 메일은 태평프레시 시스템에서 자동 발송되었습니다.</p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"태평프레시 시스템" <${SMTP_USER}>`, // sender address
      to: toEmails.join(', '), // list of receivers
      subject: `[태평프레시] ${inquiryData.name}님으로부터 새로운 문의가 접수되었습니다.`, // Subject line
      html: htmlBody, // html body
    });

    console.log('[MAILER] Message sent successfully: %s', info.messageId);
  } catch (error) {
    console.error('[MAILER] Error sending email:', error);
  }
}
