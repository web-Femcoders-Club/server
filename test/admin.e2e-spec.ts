/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateSponsorDto } from './../src/sponsor/dto/create-sponsor.dto';
import { Repository } from 'typeorm';
import { Sponsors } from './../src/sponsor/entities/sponsor.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AdminController (e2e)', () => {
  let app: INestApplication;
  let sponsorRepository: Repository<Sponsors>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    sponsorRepository = moduleFixture.get<Repository<Sponsors>>(getRepositoryToken(Sponsors));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await sponsorRepository.query(`DELETE FROM sponsors`);

    const newSponsor: CreateSponsorDto = {
      sponsorsName: 'Test Sponsor',
      sponsorsCompany: 'Test Company',
      sponsorsEmail: 'test@example.com',
      sponsorsMessage: 'Hello',
      sponsorsTelephone: 123456789,
      sponsorsDate: new Date(),
      sponsorsStatus: 'Pending',
    };

    await sponsorRepository.save(sponsorRepository.create(newSponsor));
  });

  it('/admin (GET) should return an array of sponsors', () => {
    return request(app.getHttpServer())
      .get('/admin')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/admin (POST) should create a new sponsor', () => {
    const newSponsor: CreateSponsorDto = {
      sponsorsName: 'Another Sponsor',
      sponsorsCompany: 'Another Company',
      sponsorsEmail: 'another@example.com',
      sponsorsMessage: 'Hello again',
      sponsorsTelephone: 987654321,
      sponsorsDate: new Date(),
      sponsorsStatus: 'Pending',
    };

    return request(app.getHttpServer())
      .post('/admin')
      .send(newSponsor)
      .expect(201)
      .expect((res) => {
        expect(new Date(res.body.sponsorsDate).toISOString()).toBe(newSponsor.sponsorsDate.toISOString());
        delete res.body.sponsorsDate;
        delete newSponsor.sponsorsDate;
        expect(res.body).toMatchObject(newSponsor);
      });
  });

  it('/admin/:sponsor_id (GET) should return a sponsor by ID', async () => {
    const res = await request(app.getHttpServer()).get('/admin').expect(200);
    const sponsor = res.body[0];

    return request(app.getHttpServer())
      .get(`/admin/${sponsor.idPotential_Sponsors}`)
      .expect(200)
      .expect((res) => {
        expect(res.body[0]).toMatchObject(sponsor);
      });
  });

  it('/admin/:sponsor_id (PUT) should update a sponsor', async () => {
    const res = await request(app.getHttpServer()).get('/admin').expect(200);
    const sponsor = res.body[0];

    const updatedSponsor = {
      sponsorsName: 'Updated Sponsor',
      sponsorsCompany: 'Updated Company',
      sponsorsEmail: 'updated@example.com',
      sponsorsTelephone: 987654321,
    };

    return request(app.getHttpServer())
      .put(`/admin/${sponsor.idPotential_Sponsors}`)
      .send(updatedSponsor)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toEqual('sponsor modification successful');
      });
  });

  it('/admin/:sponsorId (DELETE) should delete a sponsor', async () => {
    const res = await request(app.getHttpServer()).get('/admin').expect(200);
    const sponsor = res.body[0];

    return request(app.getHttpServer())
      .delete(`/admin/${sponsor.idPotential_Sponsors}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toEqual('sponsor deleted');
      });
  });
});


