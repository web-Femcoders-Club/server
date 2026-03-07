/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { EventAttendee } from '../events/entities/event-attendee.entity';
import { Event } from '../events/entities/event.entity';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(EventAttendee)
    private readonly attendeeRepository: Repository<EventAttendee>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {
    this.apiKey = this.configService.get<string>('EVENTBRITE_API_KEY');
  }

  async handleOrderPlaced(apiUrl: string): Promise<void> {
    try {
      this.logger.log(`Processing order webhook: ${apiUrl}`);

      // Llamamos a la API de Eventbrite para obtener los datos del pedido
      const response = await firstValueFrom(
        this.httpService.get(apiUrl, {
          headers: { Authorization: `Bearer ${this.apiKey}` },
        }),
      );

      const order = response.data;
      const eventId = String(order.event_id);
      const attendees: any[] = order.attendees || [];

      if (attendees.length === 0) {
        this.logger.warn(`Order from ${apiUrl} has no attendees, skipping.`);
        return;
      }

      // Asegurarnos de que el evento existe en nuestra BD
      const eventExists = await this.eventRepository.findOne({
        where: { id: eventId },
      });

      if (!eventExists) {
        this.logger.warn(
          `Event ${eventId} not found in DB. Run sync-events.ts first.`,
        );
        // No bloqueamos — guardamos igualmente el asistente con el eventId
      }

      const rows = attendees.map((attendee: any) => {
        const dniAnswer = attendee.answers?.find((a: any) =>
          a.question?.toLowerCase().includes('dni'),
        );
        return {
          eventbriteAttendeeId: String(attendee.id),
          firstName: attendee.profile?.first_name || '',
          lastName: attendee.profile?.last_name || '',
          email: attendee.profile?.email || '',
          dni: dniAnswer?.answer || null,
          eventId,
        };
      });

      await this.attendeeRepository.upsert(rows, ['eventbriteAttendeeId']);

      this.logger.log(
        `Webhook: saved ${rows.length} attendee(s) for event ${eventId}`,
      );
    } catch (error) {
      this.logger.error(
        `Error processing webhook: ${(error as Error).message}`,
      );
      throw error;
    }
  }
}
