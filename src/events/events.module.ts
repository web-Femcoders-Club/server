import { Module } from '@nestjs/common';
import { EventbriteService } from './events.service';
import { EventsController } from './events.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    })
  ],
  controllers: [EventsController],
  providers: [EventbriteService],
})
export class EventsModule {}
