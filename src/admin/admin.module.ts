import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sponsors } from '../sponsor/entities/sponsor.entity';
import { SponsorModule } from '../sponsor/sponsor.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Sponsors]),
        SponsorModule,

    ],
    controllers: [AdminController],
    providers: [AdminService]
})
export class AdminModule {}
