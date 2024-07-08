/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';

@Injectable()
export class EventbriteService {
  private readonly apiKey: string;
  private readonly createEventUrl: string;
  private readonly findAllEventUrl: string;
  private readonly updateEventUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {
    this.apiKey = this.configService.get<string>('EVENTBRITE_API_KEY');
    this.createEventUrl = this.configService.get<string>('EVENTBRITE_URL_CREATE_EVENT');
    this.findAllEventUrl = this.configService.get<string>('EVENTBRITE_URL_FINDALL_EVENT');
    this.updateEventUrl = this.configService.get<string>('EVENTBRITE_URL_UPDATE_EVENT');
  }

  createEvent(createEventDto: CreateEventDto): Observable<any> {
    return this.httpService
      .post(
        this.createEventUrl,
        createEventDto,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      )
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error('Error creating event:', error);
          return throwError(() => new Error('Error creating event'));
        }),
      );
  }

  async findAll() {
    return this.httpService
      .get(this.findAllEventUrl,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      )
      .pipe(
        tap((response) => console.log(response.data)),
        map((response) => response.data),
        catchError((error) => {
          console.error('Error fetching all events:', error);
          return throwError(() => new Error('Error fetching all events'));
        }),
      );
  }

  async findAllPastEvents() {
    return this.httpService
      .get(`${this.findAllEventUrl}?status=ended&expand=venue`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      )
      .pipe(
        tap((response) => console.log(response.data)),
        map((response) => response.data),
        catchError((error) => {
          console.error('Error fetching past events:', error);
          return throwError(() => new Error('Error fetching past events'));
        }),
      );
  }

  async findAllUpcomingEvents() {
    return this.httpService
      .get(`${this.findAllEventUrl}?status=live&expand=venue`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      )
      .pipe(
        tap((response) => console.log(response.data)),
        map((response) => response.data),
        catchError((error) => {
          console.error('Error fetching upcoming events:', error);
          return throwError(() => new Error('Error fetching upcoming events'));
        }),
      );
  }

  updateEvent(idEvent: number, updateEventDto: UpdateEventDto): Observable<any> {
    return this.httpService
      .post(
        this.updateEventUrl.replace('${idEvent}', idEvent.toString()),
        updateEventDto,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            Accept: 'application/json',
          },
        },
      )
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          console.error('Error updating event:', error);
          return throwError(() => new Error('Error updating event'));
        }),
      );      
  }

  async syncEvents(): Promise<void> {
    try {
      const response = await this.httpService
        .get(this.findAllEventUrl, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        })
        .toPromise();
  
      const events = response.data.events;
  
      for (const event of events) {
        const existingEvent = await this.eventRepository.findOne({ where: { id: Number(event.id) } });
        if (!existingEvent) {
          const newEvent = this.eventRepository.create({
            id: Number(event.id),
            name: event.name.text,
            start_time: event.start.utc,
            end_time: event.end.utc,
            timezone: event.start.timezone,
            currency: event.currency,
            status: event.status,
          });
          await this.eventRepository.save(newEvent);
        }
      }
    } catch (error) {
      console.error('Error syncing events:', error);
      throw new Error('Error syncing events');
    }
  }
}  