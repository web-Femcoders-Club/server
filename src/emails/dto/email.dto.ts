import { ApiProperty } from '@nestjs/swagger';

export class EmailDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario solicitante',
    example: 'user@example.com',
  })
  userEmail: string;

  @ApiProperty({
    description: 'Tipo de mentoría solicitada',
    example: 'JavaScript avanzado',
    required: false,
  })
  mentorshipType?: string;

  @ApiProperty({
    description: 'Título del recurso o mentoría',
    example: 'Introducción a IA',
    required: false,
  })
  mentorshipTitle?: string;

  @ApiProperty({
    description: 'Enlace a GitHub del usuario',
    example: 'https://github.com/username',
    required: false,
  })
  githubLink?: string;

  @ApiProperty({
    description: 'Descripción de la solicitud o del recurso enviado',
    example: 'Necesito ayuda con React Hooks o breve descripción del recurso.',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Archivos adjuntos (opcional)',
    type: 'string',
    format: 'binary',
    required: false,
  })
  files?: Express.Multer.File[];
}
