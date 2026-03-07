/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EventbriteService } from './events/events.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('SyncAttendeesScript');
  const app = await NestFactory.createApplicationContext(AppModule);
  const eventbriteService = app.get(EventbriteService);

  let retries = 3;

  while (retries > 0) {
    try {
      logger.log('Starting manual attendee sync with Eventbrite...');
      const startTime = Date.now();
      await eventbriteService.syncAttendees();
      const endTime = Date.now();
      logger.log(
        `Attendee sync completed successfully in ${(endTime - startTime) / 1000} seconds.`,
      );
      process.exit(0);
    } catch (error) {
      retries--;
      logger.error(
        `Error during sync attempt (${3 - retries}/3):`,
        (error as Error).message,
      );
      if (retries === 0) {
        logger.error('Failed to sync attendees after multiple attempts.');
        process.exit(1);
      }
    } finally {
      await app.close();
    }
  }
}

bootstrap();
