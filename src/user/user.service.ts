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

  async findOneById(user_id: number) {
    const user = await this.userRepository.find({ where: { idUser: user_id } });
    if (!user) {
      throw new HttpException(`No User found`, 404);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { userEmail: email } });
  }

  async create(CreateUserDto: CreateUserDto) {
    return this.userRepository.save(CreateUserDto);
  }

  async updateUser(user_id: number, editUser: UpdateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { idUser: user_id },
      });

      if (!user) {
        throw new HttpException(`Not user found`, 404);
      }

      user.userName = editUser.userName;
      user.userLastName = editUser.userLastName;
      user.userGender = editUser.userGender;
      user.userEmail = editUser.userEmail;
      user.userTelephone = editUser.userTelephone;

      await queryRunner.manager.save(User, user);

      await queryRunner.commitTransaction();

      return `user successfully modified`;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getById(idUser: number) {
    const user = await this.userRepository.findOne({ where: { idUser } });
    if (user) {
      return user;
    }
    throw new HttpException(
      'El usuario con este Id no existe',
      HttpStatus.NOT_FOUND,
    );
  }

  async getByEmail(userEmail: string) {
    const user = await this.userRepository.findOne({ where: { userEmail } });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async createWithGoogle(
    userGoogle: { userEmail: string; userName: string; userLastName: string },
    token: string,
  ) {
    const newUser = await this.userRepository.create({
      userEmail: userGoogle.userEmail,
      userName: userGoogle.userName,
      userLastName: userGoogle.userLastName,
      userGender: 'No definido',
      userTelephone: 0,
    });
    await this.userRepository.save(newUser);
    const idUser = newUser.idUser;
    const name = newUser.userName;
    const lastName = newUser.userLastName;
    const gender = newUser.userGender;
    const email = newUser.userEmail;
    const telephone = newUser.userTelephone;
    const role = newUser.userRole;

    return { token, idUser, name, lastName, gender, email, telephone, role };

  }

}
