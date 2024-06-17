/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateVolunteerDto } from '../src/volunteer/dto/create-volunteer.dto';
import { UpdateVolunteerDto } from '../src/volunteer/dto/update-volunteer.dto';

describe('VolunteerController (e2e)', () => {
  let app: INestApplication;
  let createdVolunteerId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/volunteer (POST) should create a new volunteer', async () => {
    const createVolunteerDto: CreateVolunteerDto = {
      volunteerName: 'John',
      volunteerLastName: 'Doe',
      volunteerEmail: 'johndoe@example.com',
      volunteerGender: 'he/him',
    };

    const response = await request(app.getHttpServer())
      .post('/volunteer')
      .send(createVolunteerDto)
      .expect(201);

    createdVolunteerId = response.body.idVolunteer;
    expect(response.body.volunteerEmail).toEqual(createVolunteerDto.volunteerEmail);
  });

  it('/volunteer (GET) should list all volunteers', async () => {
    const response = await request(app.getHttpServer())
      .get('/volunteer')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/volunteer/:id (GET) should get a volunteer by id', async () => {
    const response = await request(app.getHttpServer())
      .get(`/volunteer/${createdVolunteerId}`)
      .expect(200);

    expect(response.body.idVolunteer).toEqual(createdVolunteerId);
  });

  it('/volunteer/:idVolunteer (PUT) should update a volunteer', async () => {
    const updateVolunteerDto: UpdateVolunteerDto = {
      volunteerName: 'Jane',
      volunteerLastName: 'Doe',
      volunteerEmail: 'janedoe@example.com',
      volunteerGender: 'she/her',
    };

    const response = await request(app.getHttpServer())
      .put(`/volunteer/${createdVolunteerId}`)
      .send(updateVolunteerDto)
      .expect(200);

    expect(response.body).toEqual({ affected: 1, generatedMaps: [], raw: [] }); 
  });

  it('/volunteer/:id (DELETE) should delete a volunteer', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/volunteer/${createdVolunteerId}`)
      .expect(200);

    expect(response.body).toEqual({ affected: 1, raw: [] }); 
  });

  afterAll(async () => {
    await app.close();
  });
});

