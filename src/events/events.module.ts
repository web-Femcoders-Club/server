/* eslint-disable prettier/prettier */
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventAttendee } from './entities/event-attendee.entity';
import { EventsController } from './events.controller';
import { EventbriteService } from './events.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forFeature([Event, EventAttendee]),
  ],
  controllers: [EventsController],
  providers: [EventbriteService],
  exports: [EventbriteService],
})
export class EventsModule {}

