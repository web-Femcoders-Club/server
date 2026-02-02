/* eslint-disable prettier/prettier */

import { Injectable, Logger } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Repository } from 'typeorm';
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

  async findAllFromDatabase(): Promise<Event[]> {
    try {
      const events = await this.eventRepository.find();
      if (events.length === 0) {
        this.logger.warn('No events found in the database');
      }
      return events;
    } catch (error) {
      this.logger.error('Error fetching events from database:', error);
      throw new Error('Error fetching events from database');
    }
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

  async findPastEvents(): Promise<Event[]> {
    const currentDate = new Date();
    try {
      const events = await this.eventRepository.find({
        where: {
          start_local: LessThan(currentDate.toISOString()),
        },
      });
      if (events.length === 0) {
        this.logger.warn('No past events found in the database');
      }
      return events;
    } catch (error) {
      this.logger.error('Error fetching past events from database:', error);
      throw new Error('Error fetching past events from database');
    }
  }

  async findUpcomingEvents(): Promise<Event[]> {
    const currentDate = new Date();
    try {
      const events = await this.eventRepository.find({
        where: {
          start_local: MoreThan(currentDate.toISOString()),
        },
      });
      if (events.length === 0) {
        this.logger.warn('No upcoming events found in the database');
      }
      return events;
    } catch (error) {
      this.logger.error('Error fetching upcoming events from database:', error);
      throw new Error('Error fetching upcoming events from database');
    }
  }

  // Método de sincronización de eventos con Eventbrite (manual)
  /*pnpm ts-node src/sync-events.ts*/
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
