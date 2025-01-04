import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ContactFormDto } from './dto/email-formulario.dto';

@Injectable()
export class EmailFormularioService {
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

  async sendContactFormEmail(contactFormDto: ContactFormDto) {
    const { name, lastName, email, message } = contactFormDto;

    const mailOptions = {
      from: `"FemCoders Club" <${process.env.EMAIL_USER}>`,
      to: 'info@femcodersclub.com',
      subject: `Nuevo mensaje de ${name}`,
      text: `
        Nombre: ${name} ${lastName}
        Email: ${email}
        Mensaje: ${message}
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
