/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventbriteService } from './events.service';
import { EventsController } from './events.controller';
import { HttpModule } from '@nestjs/axios';
import { Event } from './entities/event.entity';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forFeature([Event]),
  ],
  controllers: [EventsController],
  providers: [EventbriteService],
})
export class EventsModule {}


