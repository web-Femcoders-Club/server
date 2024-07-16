/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    description: 'The first name of the User',
    example: 'Elena'
  })
  userName: string;

  @ApiProperty({
    description: 'The last name of the User',
    example: 'Martinez'
  })
  userLastName: string;

  @ApiProperty({
    description: 'The email of the User',
    example: 'elenamartinez@gmail.com'
  })
  userEmail: string;

  @ApiProperty({
    description: 'The password of the User',
    example: 'Elena1234'
  })
  userPassword: string;

  @ApiProperty({
    description: 'The telephone of the User',
    example: '+34631459735'
  })
  userTelephone: string; 

  @ApiProperty({
    description: 'The gender of the User',
    example: 'she/her'
  })
  userGender: string;
}

