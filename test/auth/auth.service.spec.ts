/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { UserService } from '../../src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOneByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should create a new user', async () => {
      const signupDto = {
        userName: 'Test',
        userLastName: 'User',
        userEmail: 'test@example.com',
        userPassword: 'password',
        userTelephone: 123456789,
        userGender: 'male',
      };

      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(null);
      jest.spyOn(userService, 'create').mockResolvedValue({
        idUser: 1,
        userRole: 'user',
        isRegisteredWithGoogle: false,
        userPassword: await bcrypt.hash(signupDto.userPassword, 10),
        ...signupDto,
      });

      await expect(service.signup(signupDto)).resolves.toEqual({
        User,
      });
    });

    it('should throw an error if user already exists', async () => {
      const signupDto = {
        userName: 'Test',
        userLastName: 'User',
        userEmail: 'test@example.com',
        userPassword: 'password',
        userTelephone: 123456789,
        userGender: 'male',
      };

      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue({
        idUser: 1,
        userRole: 'user',
        isRegisteredWithGoogle: false,
        userPassword: await bcrypt.hash(signupDto.userPassword, 10),
        ...signupDto,
      });

      await expect(service.signup(signupDto)).rejects.toThrow(
        new BadRequestException('Este usuario ya existe'),
      );
    });
  });

  describe('login', () => {
    it('should return a token and user data if login is successful', async () => {
      const loginDto = {
        userEmail: 'test@example.com',
        userPassword: 'password',
      };

      const user = {
        idUser: 1,
        userName: 'Test',
        userLastName: 'User',
        userEmail: 'test@example.com',
        userPassword: await bcrypt.hash(loginDto.userPassword, 10),
        userGender: 'male',
        userTelephone: 123456789,
        userRole: 'user',
        isRegisteredWithGoogle: false,
      };

      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('jwt_token');

      await expect(service.login(loginDto)).resolves.toEqual({
        token: 'jwt_token',
        idUser: user.idUser,
        name: user.userName,
        lastName: user.userLastName,
        gender: user.userGender,
        email: user.userEmail,
        telephone: user.userTelephone,
        role: user.userRole,
      });
    });

    it('should throw an error if email is incorrect', async () => {
      const loginDto = {
        userEmail: 'test@example.com',
        userPassword: 'password',
      };

      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        new BadRequestException('El correo electrónico o la contraseña es incorrecta'),
      );
    });

    it('should throw an error if password is incorrect', async () => {
      const loginDto = {
        userEmail: 'test@example.com',
        userPassword: 'password',
      };

      const user = {
        idUser: 1,
        userName: 'Test',
        userLastName: 'User',
        userEmail: 'test@example.com',
        userPassword: await bcrypt.hash('wrong_password', 10),
        userGender: 'male',
        userTelephone: 123456789,
        userRole: 'user',
        isRegisteredWithGoogle: false,
      };

      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        new BadRequestException('El correo electrónico o la contraseña es incorrecta'),
      );
    });
  });
});

