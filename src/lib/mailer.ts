import nodemailer from 'nodemailer';

interface InquiryData {
  name: string;
  email: string;
  phone: string;
  address?: string | null;
  details: string;
}

const createTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP credentials missing in .env');
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 465,
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

export async function sendInquiryNotification(toEmails: string[], inquiryData: InquiryData) {
  if (!toEmails || toEmails.length === 0) return;

  try {
    const transporter = createTransporter();

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

    await transporter.sendMail({
      from: `"태평프레시 시스템" <${process.env.SMTP_USER}>`,
      to: toEmails.join(', '),
      subject: `[태평프레시] ${inquiryData.name}님으로부터 새로운 문의가 접수되었습니다.`,
      html: htmlBody,
    });

    console.log('[MAILER] Inquiry notification sent successfully');
  } catch (error) {
    console.error('[MAILER] Failed to send inquiry notification:', error);
    throw error;
  }
}

/**
 * Sends a temporary password to the admin's recovery email.
 */
export async function sendPasswordResetEmail(to: string, tempPassword: string) {
  const mailOptions = {
    from: `"태평프레시 시스템" <${process.env.SMTP_USER}>`,
    to,
    subject: '[태평프레시] 관리자 계정 임시 비밀번호 안내',
    html: `
      <div style="font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #005B82; margin-top: 0;">임시 비밀번호가 발급되었습니다.</h2>
        <p style="color: #475569; line-height: 1.6;">본 메일은 관리자 계정 분실로 인한 비밀번호 재설정 요청에 따라 발송되었습니다.</p>
        
        <div style="background: #f8fafc; padding: 24px; border-radius: 8px; margin: 30px 0; text-align: center;">
          <p style="margin: 0 0 10px 0; font-size: 0.9rem; color: #64748b;">임시 비밀번호</p>
          <p style="margin: 0; font-size: 1.5rem; font-weight: 700; color: #1e293b; letter-spacing: 2px;">${tempPassword}</p>
        </div>
        
        <div style="background: #fff4f4; padding: 16px; border-radius: 8px; border-left: 4px solid #ef4444; margin-bottom: 30px;">
          <p style="margin: 0; color: #991b1b; font-size: 0.9rem;">
            <strong>주의:</strong> 보안을 위해 로그인 후 반드시 비밀번호를 바로 변경해 주세요.
          </p>
        </div>

        <p style="color: #64748b; font-size: 0.85rem; border-top: 1px solid #e2e8f0; padding-top: 20px;">
          본 메일은 발신 전용입니다. 문의사항은 관리자에게 직접 연락 바랍니다.
        </p>
      </div>
    `,
  };

  try {
    const transporter = createTransporter();
    await transporter.sendMail(mailOptions);
    console.log('[MAILER] Password reset email sent successfully');
  } catch (error) {
    console.error('[MAILER] Failed to send password reset email:', error);
    throw error;
  }
}
