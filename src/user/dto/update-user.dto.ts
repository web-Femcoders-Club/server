import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    userName: string;
    userLastName: string;
    userGender: string;
    userEmail: string;
    userTelephone: number;
}
