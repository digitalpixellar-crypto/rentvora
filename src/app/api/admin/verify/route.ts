import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Server-side rate limiter for admin brute-force protection
const failedAttempts = new Map<string, { count: number; lockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15-minute lockout after 5 failed attempts
const SESSION_EXPIRY_MS = 2 * 60 * 60 * 1000; // 2 hours

function getAdminSecret(): string {
  return process.env.ADMIN_SECRET_KEY || process.env.ADMIN_MASTER_PIN || 'RV_Admin@2026#Secure';
}

function getIpAddress(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
}

export async function POST(request: Request) {
  try {
    const ip = getIpAddress(request);
    const now = Date.now();

    // 1. Check Rate Limiting / Lockout Status
    const attemptRecord = failedAttempts.get(ip);
    if (attemptRecord && attemptRecord.lockedUntil > now) {
      const remainingMins = Math.ceil((attemptRecord.lockedUntil - now) / 60000);
      return NextResponse.json({
        error: `Security Lockout: Too many failed admin authentication attempts. Try again in ${remainingMins} minute(s).`
      }, { status: 429 });
    }

    const body = await request.json();
    const { passcode, token } = body;

    // 2. Token verification mode (if client already has an active session token)
    if (token) {
      const secret = getAdminSecret();
      const parts = token.split('.');
      if (parts.length === 2) {
        const [expiresAtStr, providedHash] = parts;
        const expiresAt = Number(expiresAtStr);
        if (!isNaN(expiresAt) && expiresAt > now) {
          const expectedPayload = `admin_session:${expiresAtStr}`;
          const expectedHash = crypto.createHmac('sha256', secret).update(expectedPayload).digest('hex');
          
          const bufProvided = Buffer.from(providedHash, 'hex');
          const bufExpected = Buffer.from(expectedHash, 'hex');

          if (bufProvided.length === bufExpected.length && crypto.timingSafeEqual(bufProvided, bufExpected)) {
            return NextResponse.json({ valid: true, expiresAt });
          }
        }
      }
      return NextResponse.json({ valid: false, error: 'Session expired or invalid' }, { status: 401 });
    }

    // 3. Passcode Authentication Mode
    if (!passcode || typeof passcode !== 'string') {
      return NextResponse.json({ error: 'Admin security passcode is required' }, { status: 400 });
    }

    const adminSecret = getAdminSecret();

    // Constant-time comparison using sha256 to prevent timing attacks
    const hashInput = crypto.createHash('sha256').update(passcode.trim()).digest();
    const hashSecret = crypto.createHash('sha256').update(adminSecret.trim()).digest();

    const isMatch = crypto.timingSafeEqual(hashInput, hashSecret);

    if (!isMatch) {
      // Record failed attempt
      const currentCount = (attemptRecord?.count || 0) + 1;
      const willLock = currentCount >= MAX_ATTEMPTS;
      failedAttempts.set(ip, {
        count: currentCount,
        lockedUntil: willLock ? now + LOCKOUT_MS : 0,
      });

      const remainingAttempts = Math.max(0, MAX_ATTEMPTS - currentCount);
      return NextResponse.json({
        error: willLock 
          ? 'Maximum attempts exceeded. Admin access locked for 15 minutes.' 
          : `Invalid admin credentials. ${remainingAttempts} attempt(s) remaining.`
      }, { status: 401 });
    }

    // 4. Success: Clear failed attempts and generate secure session token
    failedAttempts.delete(ip);

    const expiresAt = now + SESSION_EXPIRY_MS;
    const sessionPayload = `admin_session:${expiresAt}`;
    const tokenHash = crypto.createHmac('sha256', adminSecret).update(sessionPayload).digest('hex');
    const adminToken = `${expiresAt}.${tokenHash}`;

    return NextResponse.json({
      success: true,
      token: adminToken,
      expiresAt,
      message: 'Admin authorization successful',
    });

  } catch (error: any) {
    console.error('Admin verification error:', error);
    return NextResponse.json({ error: 'Server authentication failure' }, { status: 500 });
  }
}
