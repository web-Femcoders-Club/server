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

@Module({
  imports: [
    TypeOrmModule.forFeature([Sponsors, User, Achievement, UserAchievement]),
    SponsorModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
