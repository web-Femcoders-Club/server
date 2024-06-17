/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { VolunteerService } from './volunteer.service';
import { VolunteerController } from './volunteer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Volunteer } from './entities/volunteer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Volunteer])],
  controllers: [VolunteerController],
  providers: [VolunteerService],
  exports: [VolunteerService]
})
export class VolunteerModule {}
