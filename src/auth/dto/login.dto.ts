/* eslint-disable prettier/prettier */
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Email of User', example: 'maria@gmail.com' })
  @IsEmail()
  userEmail: string;

  @ApiProperty({ description: 'Password of User', example: '12345678' })
  @IsString()
  @MinLength(6)
  userPassword: string;
}
