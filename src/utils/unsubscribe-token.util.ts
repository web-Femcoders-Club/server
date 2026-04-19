/* eslint-disable prettier/prettier */
import * as crypto from 'crypto';

export function generateUnsubscribeToken(email: string): string {
  const secret = process.env.UNSUBSCRIBE_SECRET;
  if (!secret) throw new Error('UNSUBSCRIBE_SECRET no está configurado');
  return crypto
    .createHmac('sha256', secret)
    .update(email.toLowerCase().trim())
    .digest('hex');
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  try {
    const expected = generateUnsubscribeToken(email);
    return crypto.timingSafeEqual(
      Buffer.from(expected, 'hex'),
      Buffer.from(token, 'hex'),
    );
  } catch {
    return false;
  }
}

export function buildUnsubscribeUrl(email: string): string {
  const token = generateUnsubscribeToken(email);
  const frontendUrl =
    process.env.FRONTEND_URL || 'https://www.femcodersclub.com';
  const params = new URLSearchParams({ email, token });
  return `${frontendUrl}/baja-email?${params.toString()}`;
}
