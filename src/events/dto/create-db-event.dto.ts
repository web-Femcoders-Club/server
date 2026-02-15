/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDbEventDto {
  @ApiProperty({
    description: 'Event name',
    example: 'Taller: Propuesta de Valor con Jennifer Neyra',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Event start date and time in ISO format',
    example: '2026-02-26T18:30:00',
  })
  @IsNotEmpty()
  @IsString()
  start_local: string;

  @ApiProperty({
    description: 'Event location',
    example: 'Canódromo, Barcelona',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'Event description',
    example: 'Taller presencial con cupos limitados.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Event URL or contact info',
    example: 'mailto:info@femcodersclub.com',
  })
  @IsNotEmpty()
  @IsString()
  event_url: string;

  @ApiProperty({
    description: 'URL of the event logo/image',
    example: '/assets/eventos2026/eventoJenniferNeyra.webp',
    required: false,
  })
  @IsOptional()
  @IsString()
  logo_url?: string;
}
