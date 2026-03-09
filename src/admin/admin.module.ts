/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sponsors } from '../sponsor/entities/sponsor.entity';
import { SponsorModule } from '../sponsor/sponsor.module';
import { User } from '../user/entities/user.entity';
import { Achievement } from '../achievements/entities/achievements.entity';
import { UserAchievement } from './entities/user-achievements.entity';
import { EventAttendee } from '../events/entities/event-attendee.entity';
import { Event } from '../events/entities/event.entity';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sponsors, User, Achievement, UserAchievement, EventAttendee, Event]),
    SponsorModule,
    EventsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
