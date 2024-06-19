/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { HttpService } from '@nestjs/axios';
import { Observable, catchError, map } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Event } from './entities/event.entity';

@Injectable()
export class EventbriteService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  createEvent(createEventDto: CreateEventDto): Observable<any> {
    // Guardar en la base de datos
    const newEvent = this.eventRepository.create({
      eventName: createEventDto.eventName,
      eventStart: createEventDto.eventStart,
      eventEnd: createEventDto.eventEnd,
      eventTimezone: createEventDto.eventTimezone,
      eventCurrency: createEventDto.eventCurrency,
    });
    this.eventRepository.save(newEvent);

    // Enviar a Eventbrite
    return this.httpService
      .post(
        'https://www.eventbriteapi.com/v3/organizations/2076189237573/events/',
        createEventDto,
        {
          headers: {
            Authorization: `Bearer ${process.env.EVENTBRITE_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      )
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          throw error;
        }),
      );
  }

  async findAll() {
    return this.eventRepository.find();
  }

  async findAllPastEvents() {
    const currentDate = new Date();
    return this.eventRepository.find({ where: { eventEnd: LessThan(currentDate) } });
  }

  async findAllUpcomingEvents() {
    const currentDate = new Date();
    return this.eventRepository.find({ where: { eventStart: MoreThan(currentDate) } });
  }

  updateEvent(idEvent: number, updateEventDto: UpdateEventDto): Observable<any> {
    this.eventRepository.update(idEvent, {
      eventName: updateEventDto.eventName,
      eventStart: updateEventDto.eventStart,
      eventEnd: updateEventDto.eventEnd,
      eventTimezone: updateEventDto.eventTimezone,
      eventCurrency: updateEventDto.eventCurrency,
    });

    return this.httpService
      .post(
        `https://www.eventbriteapi.com/v3/events/${idEvent}`,
        updateEventDto,
        {
          headers: {
            Authorization: `Bearer ${process.env.EVENTBRITE_API_KEY}`,
            Accept: 'application/json',
          },
        },
      )
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          throw error;
        }),
      );      
  }
}


