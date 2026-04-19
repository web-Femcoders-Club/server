/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnsubscribedEmail } from '../emails/entities/unsubscribed-email.entity';
import { EmailService } from '../emails/email.service';
import { buildUnsubscribeUrl, verifyUnsubscribeToken } from '../utils/unsubscribe-token.util';

export type UnsubscribeResult =
  | { status: 'ok' }
  | { status: 'already' }
  | { status: 'invalid' };

export type UnsubscribeRequestResult =
  | { status: 'sent' }
  | { status: 'already' };

@Injectable()
export class UnsubscribeService {
  constructor(
    @InjectRepository(UnsubscribedEmail)
    private readonly repo: Repository<UnsubscribedEmail>,
    private readonly emailService: EmailService,
  ) {}

  async processUnsubscribe(
    email: string,
    token: string,
  ): Promise<UnsubscribeResult> {
    const normalizedEmail = email.toLowerCase().trim();

    if (!verifyUnsubscribeToken(normalizedEmail, token)) {
      return { status: 'invalid' };
    }

    const existing = await this.repo.findOne({
      where: { email: normalizedEmail },
    });
    if (existing) {
      return { status: 'already' };
    }

    const record = this.repo.create({ email: normalizedEmail, source: null });
    await this.repo.save(record);
    return { status: 'ok' };
  }

  async isUnsubscribed(email: string): Promise<boolean> {
    const record = await this.repo.findOne({
      where: { email: email.toLowerCase().trim() },
    });
    return !!record;
  }

  async findAll(): Promise<UnsubscribedEmail[]> {
    return this.repo.find({ order: { unsubscribedAt: 'DESC' } });
  }

  async requestUnsubscribeLink(email: string): Promise<UnsubscribeRequestResult> {
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await this.repo.findOne({ where: { email: normalizedEmail } });
    if (existing) {
      return { status: 'already' };
    }

    const url = buildUnsubscribeUrl(normalizedEmail);
    const html = `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#333;">
        <h2 style="color:#4737bb;">Solicitud de baja de comunicaciones</h2>
        <p>Hola,</p>
        <p>
          Hemos recibido tu solicitud para dejar de recibir comunicaciones de
          <strong>FemCoders Club</strong>.
        </p>
        <p>Para confirmar la baja, haz clic en el siguiente enlace:</p>
        <p style="text-align:center;margin:32px 0;">
          <a href="${url}"
             style="background-color:#ea4f33;color:#fff;padding:12px 28px;
                    border-radius:6px;text-decoration:none;font-weight:bold;">
            Confirmar baja
          </a>
        </p>
        <p style="font-size:13px;color:#888;">
          Si no solicitaste esta baja, ignora este mensaje. Tu dirección no será dada de baja
          hasta que hagas clic en el enlace.
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
        <p style="font-size:12px;color:#aaa;text-align:center;">
          FemCoders Club · info@femcodersclub.com
        </p>
      </div>
    `;

    await this.emailService.sendRawEmail(
      normalizedEmail,
      'Confirma tu baja de comunicaciones — FemCoders Club',
      html,
    );

    return { status: 'sent' };
  }
}
