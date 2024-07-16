/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async findOneById(user_id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { idUser: user_id } });
    if (!user) {
      throw new HttpException(`No User found`, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { userEmail: email } });
    if (!user) {
      throw new HttpException(`No User found`, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async updateUser(user_id: number, editUser: UpdateUserDto): Promise<string> {
    const user = await this.findOneById(user_id);
    if (!user) {
      throw new HttpException(`Not user found`, HttpStatus.NOT_FOUND);
    }
    Object.assign(user, editUser);
    await this.userRepository.save(user);
    return `user successfully modified`;
  }

  async remove(user_id: number): Promise<{ message: string }> {
    const user = await this.findOneById(user_id);
    if (!user) {
      throw new HttpException(`No User found`, HttpStatus.NOT_FOUND);
    }
    await this.userRepository.delete(user_id);
    return { message: 'User deleted successfully' };
  }

  async getById(idUser: number): Promise<User> {
    const user = await this.findOneById(idUser);
    return user;
  }

  async getByEmail(userEmail: string): Promise<User> {
    const user = await this.findOneByEmail(userEmail);
    return user;
  }

 /* async createWithGoogle(
    userGoogle: { userEmail: string; userName: string; userLastName: string },
    token: string,
  ): Promise<{ token: string; idUser: number; name: string; lastName: string; gender: string; email: string; telephone: string; role: string }> {
    const newUser = this.userRepository.create({
      userEmail: userGoogle.userEmail,
      userName: userGoogle.userName,
      userLastName: userGoogle.userLastName,
      userGender: 'No definido',
      userTelephone: '0', // Cambiado a string
    });
    await this.userRepository.save(newUser);
    const { idUser, userName, userLastName, userGender, userEmail, userTelephone, userRole } = newUser;
    return { token, idUser, name: userName, lastName: userLastName, gender: userGender, email: userEmail, telephone: userTelephone, role: userRole };
  }
}*/
}

