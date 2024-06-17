/* eslint-disable prettier/prettier */

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { User } from './../src/user/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let createdUserId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
  });

  afterAll(async () => {
    await userRepository.query('DELETE FROM user'); 
    await app.close();
  });

  it('/user (POST) should create a new user', async () => {
    const createUserDto = {
      userName: 'Elena',
      userLastName: 'Martinez',
      userEmail: 'elenamartinez@gmail.com',
      userPassword: 'Elena1234',
      userTelephone: 123456789,
      userGender: 'she/her',
      userRole: 'user', 
    };

    const response = await request(app.getHttpServer())
      .post('/user')
      .send(createUserDto)
      .expect(201);

    createdUserId = response.body.idUser;
    expect(response.body.userEmail).toEqual(createUserDto.userEmail);
  });

  it('/user/:user_id (PUT) should update a user', async () => {
    const updateUserDto = {
      userName: 'Elena Updated',
      userLastName: 'Martinez Updated',
      userEmail: 'elena.updated@gmail.com',
      userPassword: 'ElenaUpdated1234',
      userTelephone: 987654321,
      userGender: 'she/her',
    };

    const response = await request(app.getHttpServer())
      .put(`/user/${createdUserId}`)
      .send(updateUserDto)
      .expect(200);

    expect(response.body).toEqual({}); 
  });

  it('/user/:user_id (GET) should get a user by id', async () => {
    const response = await request(app.getHttpServer())
      .get(`/user/${createdUserId}`)
      .expect(200);

    expect(response.body.idUser).toEqual(createdUserId);
  });

  it('/user/:user_id (DELETE) should delete a user', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/user/${createdUserId}`)
      .expect(200);

    expect(response.body).toEqual({ message: 'User deleted successfully' });
  });
});






