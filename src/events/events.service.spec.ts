/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { EventbriteService } from './events.service';
import { of } from 'rxjs';
import { CreateEventDto } from './dto/create-event.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';

describe('EventbriteService', () => {
  let service: EventbriteService;
  let httpService: HttpService;
  let eventRepository: Repository<Event>;

  beforeEach(async () => {
    process.env.EVENTBRITE_API_KEY = 'mocked_token';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventbriteService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn().mockReturnValue(of({ data: { id: '123' } })),
          },
        },
        {
          provide: getRepositoryToken(Event),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<EventbriteService>(EventbriteService);
    httpService = module.get<HttpService>(HttpService);
    eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  afterEach(() => {
    delete process.env.EVENTBRITE_API_KEY;
  });

  it('should create an event', async () => {
    const createEventDto: CreateEventDto = {
      eventName: 'Test Event',
      eventStart: new Date('2024-04-03T10:00:00Z'),
      eventEnd: new Date('2024-04-03T12:00:00Z'),
      eventTimezone: 'America/New_York',
      eventCurrency: 'USD',
    };

    jest.spyOn(eventRepository, 'create').mockReturnValue(createEventDto as any);
    jest.spyOn(eventRepository, 'save').mockResolvedValue(createEventDto as any);

    const result = await service.createEvent(createEventDto).toPromise();
    expect(result).toEqual({ id: '123' });
    expect(httpService.post).toHaveBeenCalledWith(
      'https://www.eventbriteapi.com/v3/organizations/2076189237573/events/',
      createEventDto,
      {
        headers: {
          Authorization: `Bearer ${process.env.EVENTBRITE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );
  });
});


