import { Controller, Post, Body } from '@nestjs/common';
import { EmailFormularioService } from './email-formulario.service';
import { ContactFormDto } from './dto/email-formulario.dto';

@Controller('email-formulario')
export class EmailFormularioController {
  constructor(
    private readonly emailFormularioService: EmailFormularioService,
  ) {}

  @Post('send')
  async sendEmail(@Body() contactFormDto: ContactFormDto) {
    await this.emailFormularioService.sendContactFormEmail(contactFormDto);
    return { message: 'Correo enviado con éxito' };
  }
}
