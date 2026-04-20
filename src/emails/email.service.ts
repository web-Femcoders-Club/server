/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { EmailDto } from './dto/email.dto';
import * as nodemailer from 'nodemailer';
import { buildUnsubscribeUrl } from '../utils/unsubscribe-token.util';

@Injectable()
export class EmailService {
  private transporter;
  private readonly from: string;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    this.from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  }

  /**
   * Envía un correo relacionado con mentorías
   * @param emailDto Datos del correo
   */
  async sendMentorshipEmail(emailDto: EmailDto) {
    const { userEmail, mentorshipType, description, githubLink } = emailDto;

    const subject = 'Solicitud de Mentoría';
    const html = `
      <p>Hola,</p>
      <p>Un usuario ha solicitado una mentoría:</p>
      <ul>
        <li><strong>Correo Electrónico:</strong> ${userEmail}</li>
        <li><strong>Tipo de Mentoría:</strong> ${mentorshipType || 'No especificado'}</li>
        <li><strong>Descripción:</strong> ${description || 'No proporcionada'}</li>
        <li><strong>Enlace a GitHub:</strong> ${githubLink || 'No proporcionado'}</li>
      </ul>
      <p>Este correo fue generado automáticamente desde la aplicación.</p>
      <p>Saludos,</p>
      <p>El equipo de FemCoders</p>
    `;

    await this.transporter.sendMail({
      from: this.from,
      to: process.env.EMAIL_RECEIVER,
      subject,
      html,
    });
  }

  /**
   * Envía una notificación cuando un nuevo usuario se registra
   */
  async sendNewRegistrationNotification(userData: {
    userName: string;
    userLastName: string;
    userEmail: string;
  }) {
    const subject = '🎉 Nuevo registro en FemCoders Club';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B5CF6;">¡Nuevo registro en la web!</h2>
        <p>Se ha registrado una nueva usuaria en FemCoders Club:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Nombre:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${userData.userName} ${userData.userLastName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${userData.userEmail}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Fecha:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}</td>
          </tr>
        </table>
        <p style="color: #666; font-size: 12px;">Este correo fue generado automáticamente.</p>
      </div>
    `;

    await this.transporter.sendMail({
      from: this.from,
      to: 'femcodersclub@gmail.com',
      subject,
      html,
    });
  }

  /**
   * Envía un correo relacionado con documentación, incluyendo archivos adjuntos
   * @param emailDto Datos del correo
   */
  async sendDocumentationEmail(emailDto: EmailDto) {
    const { userEmail, mentorshipTitle, description, files } = emailDto;

    const subject = `Nuevo recurso: ${mentorshipTitle || 'Sin título'}`;
    const html = `
      <p>Hola,</p>
      <p>Un usuario ha enviado un recurso:</p>
      <ul>
        <li><strong>Correo Electrónico:</strong> ${userEmail}</li>
        <li><strong>Título del Recurso:</strong> ${mentorshipTitle || 'No proporcionado'}</li>
        <li><strong>Descripción:</strong> ${description || 'No proporcionada'}</li>
      </ul>
      <p>Este correo fue generado automáticamente desde la aplicación.</p>
      <p>Saludos,</p>
      <p>El equipo de FemCoders</p>
    `;

    const attachments =
      files?.map((file) => ({
        filename: file.originalname,
        content: file.buffer,
        contentType: file.mimetype,
      })) || [];

    await this.transporter.sendMail({
      from: this.from,
      to: process.env.EMAIL_RECEIVER,
      subject,
      html,
      attachments,
    });
  }

  async sendRawEmail(to: string, subject: string, html: string, from?: string): Promise<void> {
    const apiKey = process.env.BREVO_API_KEY;
    if (apiKey) {
      const axios = await import('axios');
      await axios.default.post(
        'https://api.brevo.com/v3/smtp/email',
        {
          sender: { email: from ?? this.from, name: 'FemCoders Club' },
          to: [{ email: to }],
          subject,
          htmlContent: html,
        },
        { headers: { 'api-key': apiKey, 'Content-Type': 'application/json' } },
      ).catch((err) => {
        const detail = err?.response?.data ?? err?.message;
        throw new Error(`Brevo API error: ${JSON.stringify(detail)}`);
      });
    } else {
      await this.transporter.sendMail({ from: from ?? this.from, to, subject, html });
    }
  }

  /**
   * Genera el pie de baja para incluir en emails enviados a personas reales.
   * No usar en emails internos que van al buzón del admin.
   */
  buildUnsubscribeFooter(recipientEmail: string): string {
    const url = buildUnsubscribeUrl(recipientEmail);
    return `
      <div style="margin-top:32px;padding-top:16px;border-top:1px solid #eee;
                  text-align:center;font-size:12px;color:#888;font-family:sans-serif;">
        <p style="margin:0 0 6px;">
          Has recibido este correo porque formas parte de la comunidad FemCoders Club.
        </p>
        <p style="margin:0;">
          Si no deseas recibir más comunicaciones, puedes
          <a href="${url}" style="color:#ea4f33;text-decoration:underline;">darte de baja aquí</a>.
        </p>
      </div>
    `;
  }
}
