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

  async sendMentorshipEmail(emailDto: EmailDto) {
    const { userEmail, mentorshipType, description, githubLink } = emailDto;

    const subject = 'Solicitud de Mentoría';
    const text = `
      Hola,

      Un usuario ha solicitado una mentoría:
      - Correo Electrónico: ${userEmail}
      - Tipo de Mentoría: ${mentorshipType || 'No especificado'}
      - Descripción: ${description || 'No proporcionada'}
      - Enlace a GitHub: ${githubLink || 'No proporcionado'}

      Este correo fue generado automáticamente desde la aplicación.

      Saludos,
      El equipo de FemCoders
    `;

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
      text,
      html,
    });
  }
}
