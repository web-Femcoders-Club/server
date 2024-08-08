/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async signup(signupDto: SignupDto) {
    const { userName, userLastName, userEmail, userPassword, userTelephone, userGender } = signupDto;

    const existingUser = await this.userService.findOneByEmail(userEmail);
    if (existingUser) {
      throw new BadRequestException('Este usuario ya existe');
    }

    const newUser = this.userRepository.create({
      userName,
      userLastName,
      userEmail,
      userPassword, 
      userTelephone,
      userGender,
      userRole: 'user', 
    });

    await this.userRepository.save(newUser);
    return {
      userName: newUser.userName,
      userLastName: newUser.userLastName,
      userEmail: newUser.userEmail,
    };
  }

  async login(loginDto: LoginDto) {
    const { userEmail, userPassword } = loginDto;
    const user = await this.userService.findOneByEmail(userEmail);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (userPassword !== user.userPassword) {
      throw new BadRequestException('El correo electrónico o la contraseña es incorrecta');
    }

    return {
      idUser: user.idUser,
      name: user.userName,
      lastName: user.userLastName,
      gender: user.userGender,
      email: user.userEmail,
      telephone: user.userTelephone,
      role: user.userRole,
    };
  }
}




