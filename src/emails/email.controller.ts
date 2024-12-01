/* eslint-disable prettier/prettier */
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailDto } from './dto/email.dto';

@Controller('emails')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('/mentorship')
  async sendMentorshipRequest(@Body() emailDto: EmailDto) {
    
    if (!emailDto.userEmail) {
      throw new BadRequestException('El correo electrónico es obligatorio');
    }

  
    await this.emailService.sendMentorshipEmail(emailDto);

    return { message: 'Correo enviado correctamente' };
  }
}
