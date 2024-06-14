import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { EventbriteService } from './events.service';
import { of } from 'rxjs';
import { CreateEventDto } from './dto/create-event.dto'

describe('EventbriteService', () => {
  let service: EventbriteService;
  let httpService: HttpService;

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
      ],
    }).compile();

    service = module.get<EventbriteService>(EventbriteService);
    httpService = module.get<HttpService>(HttpService);
 });

 afterEach(() => {
  
    delete process.env.EVENTBRITE_API_KEY;
 });

 it('should create an event', async () => {
    const createEventDto: CreateEventDto = {
      event: {
        name: {
          html: 'Test Event',
        },
        start: {
          timezone: 'America/New_York',
          utc: new Date('2024-04-03T10:00:00Z'),
        },
        end: {
          timezone: 'America/New_York',
          utc: new Date('2024-04-03T12:00:00Z'),
        },
        currency: 'USD',
      },
    };
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
