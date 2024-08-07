/* eslint-disable prettier/prettier */
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ description: 'User name', example: 'Maria' })
  @IsString()
  userName: string;

  @ApiProperty({ description: 'User last name', example: 'Garcia' })
  @IsString()
  userLastName: string;

  @ApiProperty({ description: 'User telephone number', example: '123456789' })
  @IsString()
  userTelephone: string;

  @ApiProperty({ description: 'Email of User', example: 'maria@gmail.com' })
  @IsEmail()
  userEmail: string;

  @ApiProperty({ description: 'Password of User', example: '12345678' })
  @IsString()
  @MinLength(6)
  userPassword: string;

  @ApiProperty({ description: 'User gender', example: 'Female' })
  @IsString()
  userGender: string;
}
