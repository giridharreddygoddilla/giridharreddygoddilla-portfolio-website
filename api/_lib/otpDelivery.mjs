import { maskEmail, maskPhone } from './crypto.mjs';

export function getRecoveryProviderStatus() {
  const recoveryEmail = (process.env.OWNER_RECOVERY_EMAIL || '').trim();
  const recoveryPhone = (process.env.OWNER_RECOVERY_PHONE || '').trim();

  const resendApiKey = (process.env.RESEND_API_KEY || '').trim();
  const emailFrom = (process.env.OTP_EMAIL_FROM || '').trim();

  const twilioSid = (process.env.TWILIO_ACCOUNT_SID || '').trim();
  const twilioToken = (process.env.TWILIO_AUTH_TOKEN || '').trim();
  const twilioFrom = (process.env.TWILIO_FROM_NUMBER || '').trim();

  const missingEmailVars = [];
  if (!recoveryEmail) missingEmailVars.push('OWNER_RECOVERY_EMAIL');
  if (!resendApiKey) missingEmailVars.push('RESEND_API_KEY');
  if (!emailFrom) missingEmailVars.push('OTP_EMAIL_FROM');

  const missingSmsVars = [];
  if (!recoveryPhone) missingSmsVars.push('OWNER_RECOVERY_PHONE');
  if (!twilioSid) missingSmsVars.push('TWILIO_ACCOUNT_SID');
  if (!twilioToken) missingSmsVars.push('TWILIO_AUTH_TOKEN');
  if (!twilioFrom) missingSmsVars.push('TWILIO_FROM_NUMBER');

  return {
    emailConfigured: missingEmailVars.length === 0,
    smsConfigured: missingSmsVars.length === 0,
    maskedEmail: maskEmail(recoveryEmail),
    maskedPhone: maskPhone(recoveryPhone),
    missingEmailVars,
    missingSmsVars,
  };
}

export async function sendEmailOtp({ otp, purposeLabel }) {
  // Deterministic test hook ONLY when running local automated integration tests
  if (process.env.SECURITY_TEST_INMEMORY === '1' && globalThis.__TEST_OTP_SINK__) {
    globalThis.__TEST_OTP_SINK__.push({ channel: 'email', otp, purposeLabel, sentAt: Date.now() });
    return { delivered: true };
  }

  const status = getRecoveryProviderStatus();
  if (!status.emailConfigured) {
    return {
      delivered: false,
      error: `Email OTP delivery is not configured yet. Missing environment variables: ${status.missingEmailVars.join(', ')}.`,
      missingVars: status.missingEmailVars,
    };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY.trim()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.OTP_EMAIL_FROM.trim(),
      to: [process.env.OWNER_RECOVERY_EMAIL.trim()],
      subject: `Portfolio Security OTP — ${purposeLabel}`,
      html: `
        <div style="font-family:Segoe UI,Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#0b0d14;color:#f5f5f5;border-radius:12px;">
          <p style="font-size:11px;letter-spacing:2px;color:#e50920;text-transform:uppercase;margin:0 0 8px;">Giridhar Portfolio Security</p>
          <h2 style="margin:0 0 12px;font-size:20px;">${purposeLabel}</h2>
          <p style="color:#c8cbd4;font-size:14px;line-height:1.5;">Use this single-use 6-digit verification code within <strong>5 minutes</strong>:</p>
          <div style="font-size:32px;font-weight:800;letter-spacing:8px;padding:16px;text-align:center;background:#161923;border:1px solid #2b3040;border-radius:10px;margin:16px 0;color:#ffffff;">${otp}</div>
          <p style="color:#8f95a3;font-size:12px;">If you did not request this code, ignore this email and review your security settings.</p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error('[OTP Email Delivery Failed]', res.status, detail);
    return {
      delivered: false,
      error: 'Email OTP provider rejected the delivery request. Please verify your Resend API key and verified sender domain.',
    };
  }

  return { delivered: true };
}

export async function sendSmsOtp({ otp, purposeLabel }) {
  if (process.env.SECURITY_TEST_INMEMORY === '1' && globalThis.__TEST_OTP_SINK__) {
    globalThis.__TEST_OTP_SINK__.push({ channel: 'sms', otp, purposeLabel, sentAt: Date.now() });
    return { delivered: true };
  }

  const status = getRecoveryProviderStatus();
  if (!status.smsConfigured) {
    return {
      delivered: false,
      error: `SMS OTP delivery is not configured yet. Missing environment variables: ${status.missingSmsVars.join(', ')}.`,
      missingVars: status.missingSmsVars,
    };
  }

  const sid = process.env.TWILIO_ACCOUNT_SID.trim();
  const token = process.env.TWILIO_AUTH_TOKEN.trim();
  const from = process.env.TWILIO_FROM_NUMBER.trim();
  const to = process.env.OWNER_RECOVERY_PHONE.trim();

  const body = new URLSearchParams({
    To: to,
    From: from,
    Body: `Portfolio Security (${purposeLabel}): Your single-use 6-digit code is ${otp}. Expires in 5 minutes.`,
  });

  const authHeader = Buffer.from(`${sid}:${token}`).toString('base64');
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authHeader}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error('[OTP SMS Delivery Failed]', res.status, detail);
    return {
      delivered: false,
      error: 'SMS OTP provider rejected the delivery request. Please verify your Twilio credentials and sender number.',
    };
  }

  return { delivered: true };
}
