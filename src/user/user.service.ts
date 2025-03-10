/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import sharp from 'sharp';

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
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { userEmail: email } });
    if (!user) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { userPassword, ...otherDetails } = createUserDto;

    
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const newUser = this.userRepository.create({
      ...otherDetails,
      userPassword: hashedPassword,
    });

    await this.userRepository.save(newUser);
    return newUser;
  }

  async updateUser(user_id: number, editUser: UpdateUserDto): Promise<string> {
    const user = await this.findOneById(user_id);
    if (!user) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }

   
    if (editUser.userAvatar) {
      editUser.userAvatar = await this.processAvatar(editUser.userAvatar);
    }

    
    if (editUser.userPassword) {
      editUser.userPassword = await bcrypt.hash(editUser.userPassword, 10);
    }

   
    Object.assign(user, editUser);
    await this.userRepository.save(user);

    return 'User successfully updated';
  }

  async remove(user_id: number): Promise<{ message: string }> {
    const user = await this.findOneById(user_id);
    if (!user) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.delete(user_id);
    return { message: 'User deleted successfully' };
  }

  async getById(idUser: number): Promise<User> {
    return this.findOneById(idUser);
  }

  async getByEmail(userEmail: string): Promise<User> {
    return this.findOneByEmail(userEmail);
  }

  private async processAvatar(avatarBase64: string): Promise<string> {
    try {
      const matches = avatarBase64.match(/^data:(image\/\w+);base64,/);
      if (!matches) {
        throw new HttpException('Invalid image format', HttpStatus.BAD_REQUEST);
      }

      const mimeType = matches[1];
      const supportedFormats = ['image/jpeg', 'image/png', 'image/webp'];
      if (!supportedFormats.includes(mimeType)) {
        throw new HttpException('Unsupported image format', HttpStatus.BAD_REQUEST);
      }

      const base64Data = avatarBase64.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');

    
      if (imageBuffer.length > 2 * 1024 * 1024) {
        throw new HttpException('Avatar too large. Max size is 2 MB.', HttpStatus.BAD_REQUEST);
      }

      
      const resizedImageBuffer = await sharp(imageBuffer)
        .resize(200, 200) 
        .toFormat('jpeg', { quality: 80 }) 
        .toBuffer();

      return `data:image/jpeg;base64,${resizedImageBuffer.toString('base64')}`;
    } catch (error) {
      throw new HttpException('Error processing avatar image', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

