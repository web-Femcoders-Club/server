/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { HttpService } from '@nestjs/axios';
import { Observable, catchError, map, tap } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EventbriteService {
  private readonly apiKey: string;
  private readonly createEventUrl: string;
  private readonly findAllEventUrl: string;
  private readonly updateEventUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('EVENTBRITE_API_KEY');
    this.createEventUrl = this.configService.get<string>('EVENTBRITE_URL_CREATE_EVENT');
    this.findAllEventUrl = this.configService.get<string>('EVENTBRITE_URL_FINDALL_EVENT');
    this.updateEventUrl = this.configService.get<string>('EVENTBRITE_URL_UPDATE_EVENT');
    
    console.log('Eventbrite API Key:', this.apiKey);
    console.log('Eventbrite Organization ID:', this.configService.get<string>('EVENTBRITE_ID_ORGANIZATION'));
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
          throw error;
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
          throw error;
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
          throw error;
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
          throw error;
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
          throw error;
        }),
      );      
  }
}





