/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class ContactFormDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  lastName?: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  message: string;
}
