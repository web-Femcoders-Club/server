/* eslint-disable prettier/prettier */
// import { IsNotEmpty, IsEmail } from 'class-validator';

// export class ContactFormDto {
//   @IsNotEmpty()
//   name: string;

//   @IsNotEmpty()
//   lastName: string;

//   @IsEmail()
//   email: string;

//   @IsNotEmpty()
//   message: string;
// }
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
