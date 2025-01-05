/* eslint-disable prettier/prettier */

import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'your_secret_key';

  constructor(
    private readonly userService: UserService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async signup(signupDto: SignupDto) {
    const {
      userName,
      userLastName,
      userEmail,
      userPassword,
      userTelephone,
      userGender,
    } = signupDto;

    const existingUser = await this.userService.findOneByEmail(userEmail);
    if (existingUser) {
      throw new BadRequestException('Este usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const newUser = this.userRepository.create({
      userName,
      userLastName,
      userEmail,
      userPassword: hashedPassword,
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

    const isPasswordValid = await bcrypt.compare(
      userPassword,
      user.userPassword,
    );
    if (!isPasswordValid) {
      throw new BadRequestException(
        'El correo electrónico o la contraseña es incorrecta',
      );
    }

    const payload = {
      idUser: user.idUser,
      userName: user.userName,
      userLastName: user.userLastName,
      userEmail: user.userEmail,
      userRole: user.userRole,
    };
    const token = jwt.sign(payload, this.jwtSecret, { expiresIn: '1h' });

    return {
      idUser: user.idUser,
      name: user.userName,
      lastName: user.userLastName,
      gender: user.userGender,
      email: user.userEmail,
      telephone: user.userTelephone,
      role: user.userRole,
      token: token,
    };
  }

  async generateResetPasswordToken(userEmail: string): Promise<string> {
    const user = await this.userService.findOneByEmail(userEmail);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const payload = { idUser: user.idUser };
    const token = jwt.sign(payload, this.jwtSecret, { expiresIn: '1h' });

    const resetLink = `${process.env.VITE_FRONTEND_URL}/reset-password?token=${token}`;

    return resetLink;
  }

  public verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new BadRequestException('Token inválido o expirado');
    }
  }

  async findUserByEmail(userEmail: string): Promise<User> {
    return this.userService.findOneByEmail(userEmail);
  }

  async updatePassword(userId: number, newPassword: string) {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.userPassword = hashedPassword;

    await this.userRepository.save(user);
    return { message: 'Contraseña actualizada con éxito' };
  }
}
