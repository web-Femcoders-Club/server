/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'User name',
    example: 'Elena'
  })
  userName?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Martinez'
  })
  userLastName?: string;

  @ApiProperty({
    description: 'User gender',
    example: 'she/her'
  })
  userGender?: string;

  @ApiProperty({
    description: 'User email',
    example: 'elenamartinez@gmail.com'
  })
  userEmail?: string;

  @ApiProperty({
    description: 'User telephone',
    example: '+34631459735'
  })
  userTelephone?: string; 

  @ApiProperty({
    description: 'User avatar in Base64 format',
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD...'
  })
  userAvatar?: string; 
}

