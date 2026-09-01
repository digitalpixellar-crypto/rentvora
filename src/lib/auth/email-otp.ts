import crypto from 'crypto';

const OTP_SECRET = process.env.RESEND_API_KEY || 'rentvora-secure-email-otp-secret-2026';
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Generates a 6-digit numeric OTP and a tamper-proof HMAC verification token
 */
export function generateEmailOtp(email: string) {
  const cleanEmail = email.trim().toLowerCase();
  // Generate random 6-digit code between 100000 and 999999
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + OTP_EXPIRY_MS;

  const payload = `${cleanEmail}:${otp}:${expiresAt}`;
  const hash = crypto.createHmac('sha256', OTP_SECRET).update(payload).digest('hex');
  const token = `${expiresAt}.${hash}`;

  return { otp, token, expiresAt };
}

/**
 * Verifies if the provided OTP matches the HMAC token for the given email
 */
export function verifyEmailOtp(email: string, otp: string, token: string): { valid: boolean; reason?: string } {
  if (!email || !otp || !token) {
    return { valid: false, reason: 'Missing verification parameters' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = otp.trim();

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, reason: 'Invalid verification token format' };
  }

  const [expiresAtStr, providedHash] = parts;
  const expiresAt = Number(expiresAtStr);

  if (isNaN(expiresAt)) {
    return { valid: false, reason: 'Invalid token expiration' };
  }

  if (Date.now() > expiresAt) {
    return { valid: false, reason: 'Verification code has expired. Please request a new code.' };
  }

  const payload = `${cleanEmail}:${cleanOtp}:${expiresAtStr}`;
  const expectedHash = crypto.createHmac('sha256', OTP_SECRET).update(payload).digest('hex');

  // Constant-time comparison to prevent timing attacks
  const providedBuffer = Buffer.from(providedHash, 'hex');
  const expectedBuffer = Buffer.from(expectedHash, 'hex');

  if (providedBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(providedBuffer, expectedBuffer)) {
    return { valid: false, reason: 'Incorrect verification code. Please check your email and try again.' };
  }

  return { valid: true };
}
