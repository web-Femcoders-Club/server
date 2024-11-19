/* eslint-disable prettier/prettier */

import { Injectable, Logger } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, map, tap, retryWhen, delay, take } from 'rxjs/operators';
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
  private readonly logger = new Logger(EventbriteService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {
    this.apiKey = this.configService.get<string>('EVENTBRITE_API_KEY');
    this.createEventUrl = this.configService.get<string>(
      'EVENTBRITE_URL_CREATE_EVENT',
    );
    this.findAllEventUrl = this.configService.get<string>(
      'EVENTBRITE_URL_FINDALL_EVENT',
    );
    this.updateEventUrl = this.configService.get<string>(
      'EVENTBRITE_URL_UPDATE_EVENT',
    );
  }

  createEvent(createEventDto: CreateEventDto): Observable<any> {
    return this.httpService
      .post(this.createEventUrl, createEventDto, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          this.logger.error('Error creating event:', error);
          return throwError(() => new Error('Error creating event'));
        }),
      );
  }

  findAll(): Observable<any> {
    return this.httpService
      .get(this.findAllEventUrl, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      })
      .pipe(
        tap(() => this.logger.log('Fetched all events')),
        map((response) => response.data),
        catchError((error) => {
          this.logger.error('Error fetching all events:', error);
          return throwError(() => new Error('Error fetching all events'));
        }),
      );
  }

  findAllPastEvents(): Observable<any> {
    return this.httpService
      .get(`${this.findAllEventUrl}?status=ended&expand=venue`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      })
      .pipe(
        tap(() => this.logger.log('Fetched past events')),
        map((response) => response.data),
        retryWhen((errors) =>
          errors.pipe(
            tap((error) => {
              if (error.response?.status === 429) {
                this.logger.warn(
                  'Rate limit exceeded. Retrying in 10 seconds...',
                );
              }
            }),
            delay(10000),
            take(3),
          ),
        ),
        catchError((error) => {
          this.logger.error('Error fetching past events:', {
            message: error.message,
            data: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers,
          });
          return throwError(() => new Error('Error fetching past events'));
        }),
      );
  }

  findAllUpcomingEvents(): Observable<any> {
    return this.httpService
      .get(`${this.findAllEventUrl}?status=live&expand=venue`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      })
      .pipe(
        tap(() => this.logger.log('Fetched upcoming events')),
        map((response) => response.data),
        retryWhen((errors) =>
          errors.pipe(
            tap((error) => {
              if (error.response?.status === 429) {
                this.logger.warn(
                  'Rate limit exceeded. Retrying in 10 seconds...',
                );
              }
            }),
            delay(10000),
            take(3),
          ),
        ),
        catchError((error) => {
          this.logger.error('Error fetching upcoming events:', {
            message: error.message,
            data: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers,
          });
          return throwError(() => new Error('Error fetching upcoming events'));
        }),
      );
  }

  updateEvent(
    idEvent: string,
    updateEventDto: UpdateEventDto,
  ): Observable<any> {
    return this.httpService
      .post(
        this.updateEventUrl.replace('${idEvent}', idEvent),
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
          this.logger.error('Error updating event:', error);
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

      if (!response || !response.data || !response.data.events) {
        throw new Error('No events received from Eventbrite API');
      }

      const events = response.data.events;

      this.logger.log(`Fetched ${events.length} events from Eventbrite.`);

      for (const event of events) {
        if (!event.id || event.id.trim() === '') {
          this.logger.warn(
            `Skipping event without a valid ID: ${event.name?.text || 'Unnamed event'}`,
          );
          continue;
        }

        const existingEvent = await this.eventRepository.findOne({
          where: { id: event.id },
        });

        if (!existingEvent) {
          const newEvent = this.eventRepository.create({
            id: event.id,
            name: event.name?.text || 'Untitled Event',
            start_local: event.start?.local || '',
            location: event.venue?.address?.localized_address_display || '',
            description: event.description?.text || '',
            event_url: event.url || '',
            logo_url: event.logo?.original?.url || null,
          });

          try {
            await this.eventRepository.save(newEvent);
            this.logger.log(`Event with ID ${event.id} created successfully.`);
          } catch (saveError) {
            this.logger.error(
              `Failed to save event with ID ${event.id}: ${(saveError as Error).message}`,
            );
          }
        } else {
          this.logger.log(
            `Event with ID ${event.id} already exists, skipping creation.`,
          );
        }
      }

      this.logger.log('Sync with Eventbrite API completed successfully.');
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Error syncing events:', error.message);
        throw new Error(`Error syncing events: ${error.message}`);
      } else {
        this.logger.error('Unknown error occurred during event syncing');
        throw new Error('Error syncing events: Unknown error occurred');
      }
    }
  }
}
