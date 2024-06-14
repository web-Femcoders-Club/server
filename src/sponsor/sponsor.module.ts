import { Module } from '@nestjs/common';
import { SponsorService } from './sponsor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sponsors } from './entities/sponsor.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Sponsors])],
    providers: [SponsorService],
    exports: [SponsorService]
})
export class SponsorModule {}
