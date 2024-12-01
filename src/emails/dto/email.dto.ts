/* eslint-disable prettier/prettier */
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
    description: 'Enlace a GitHub del usuario',
    example: 'https://github.com/username',
    required: false,
  })
  githubLink?: string;

  @ApiProperty({
    description: 'Descripción de la solicitud',
    example: 'Necesito ayuda con React Hooks.',
    required: false,
  })
  description?: string;
}

