/* eslint-disable prettier/prettier */
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventAttendee } from '../events/entities/event-attendee.entity';
import { Event } from '../events/entities/event.entity';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([EventAttendee, Event]),
  ],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
