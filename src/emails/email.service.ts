/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { EmailDto } from './dto/email.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
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
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECEIVER,
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
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECEIVER,
      subject,
      html,
      attachments,
    });
  }
}
