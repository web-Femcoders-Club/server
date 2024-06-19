/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventbriteService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { UpdateEventDto } from './dto/update-event.dto';

describe('EventsController', () => {
  let controller: EventsController;
  let eventbriteService: EventbriteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventbriteService,
          useValue: {
            createEvent: jest.fn().mockImplementation(() => {
              return of({} as AxiosResponse<any, any>);
            }),
            updateEvent: jest.fn().mockImplementation(() => {
              return of({} as AxiosResponse<any, any>);
            }),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    eventbriteService = module.get<EventbriteService>(EventbriteService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new event', async () => {
      const createEventDto: CreateEventDto = {
        eventName: 'Example Event Name',
        eventStart: new Date('2024-04-10T08:00:00Z'),
        eventEnd: new Date('2024-04-10T17:00:00Z'),
        eventTimezone: 'UTC',
        eventCurrency: 'USD',
      };

      const createdEvent = of({} as AxiosResponse<any, any>);

      jest.spyOn(eventbriteService, 'createEvent').mockReturnValue(createdEvent);

      expect(await controller.create(createEventDto)).toBe(createdEvent);
    });
  });

  describe('updateEvent', () => {
    it('should update an existing event', async () => {
      const eventId = 1;
      const updateEventDto: UpdateEventDto = {
        eventName: 'Updated Event Name',
        eventStart: new Date('2024-04-10T10:00:00Z'),
        eventEnd: new Date('2024-04-10T19:00:00Z'),
        eventTimezone: 'UTC',
        eventCurrency: 'USD',
      };

      const updatedEvent = of({} as AxiosResponse<any, any>);

      jest.spyOn(eventbriteService, 'updateEvent').mockReturnValue(updatedEvent);

      expect(await controller.updateEvent(eventId, updateEventDto)).toBe(updatedEvent);
    });
  });

  describe('findAll', () => {
    it('should return all events', async () => {
      
    });
  });
});


