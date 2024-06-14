import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userService: UserService; // Añade esta línea para tener acceso a UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            signup: jest.fn().mockImplementation((user) => {
              return Promise.resolve({
                idUser: 1,
                userRole: 'user',
                isRegisteredWithGoogle: false,
                ...user,
              });
            }),
          },
        },
        {
          provide: UserService, // Mock para UserService
          useValue: {
            findOneByEmail: jest.fn().mockResolvedValue({
              idUser: 1,
              userName: 'Belén',
              userLastName: 'Develop',
              userEmail: 'bj@gmail.com',
              userPassword: 'hashed_password',
              userGender: 'female',
              userTelephone: 123567890,
              userRole: 'user',
            }),
            // Añade otros métodos de UserService que necesites mockear
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService); // Obtén la instancia de UserService
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('LogIn should return a token', async () => {
    const user = {
      userEmail: 'bj@gmail.com',
      userPassword: '123123',
    };
    const result = {
      token: 'testing_token',
      idUser: 1,
      name: 'Belén',
      lastName: 'Develop',
      gender: 'female',
      email: 'bj@gmail.com',
      telephone: 123567890,
      role: 'user',
    };

    jest.spyOn(service, 'login').mockResolvedValue(result);

    expect(await controller.login(user)).toBe(result);
  });

  // Añade aquí el resto de tus pruebas...
})