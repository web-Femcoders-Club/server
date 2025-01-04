import { IsNotEmpty, IsEmail } from 'class-validator';

export class ContactFormDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  message: string;
}
