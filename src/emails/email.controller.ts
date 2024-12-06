/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailDto } from './dto/email.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

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

  @Post('/documentation')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files', maxCount: 10 }])
  )
  async sendDocumentationRequest(
    @Body() emailDto: EmailDto,
    @UploadedFiles() files: { files?: Express.Multer.File[] }
  ) {
    if (!emailDto.userEmail) {
      throw new BadRequestException('El correo electrónico es obligatorio');
    }

    if (!emailDto.mentorshipTitle) {
      throw new BadRequestException('El título del recurso es obligatorio');
    }

    if (!files?.files || files.files.length === 0) {
      throw new BadRequestException('Debe adjuntar al menos un archivo');
    }

    const allowedExtensions = [
      'pdf', 'docx', 'png', 'jpg', 'jpeg', 
      'doc', 'txt', 'md', 'pptx', 'xlsx',
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const invalidFiles = files.files.filter(file => {
      const extension = file.originalname.split('.').pop()?.toLowerCase();
      return (
        !extension || 
        !allowedExtensions.includes(extension) || 
        file.size > maxSize
      );
    });

    if (invalidFiles.length > 0) {
      const invalidFileNames = invalidFiles.map(file => file.originalname).join(', ');
      throw new BadRequestException(
        `Archivos inválidos: ${invalidFileNames}. 
        Extensiones permitidas: ${allowedExtensions.join(', ')}. 
        Tamaño máximo: 5MB`
      );
    }

    const fullEmailDto: EmailDto = {
      ...emailDto,
      files: files.files,
    };

    await this.emailService.sendDocumentationEmail(fullEmailDto);

    return { 
      message: 'Documentación enviada correctamente',
      acceptedFiles: files.files.map(file => file.originalname),
      fileCount: files.files.length,
    };
  }
}
