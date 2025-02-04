import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { JobOffersService } from './job-offers.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';

@Controller('jobs')
export class JobOffersController {
  constructor(private readonly jobOffersService: JobOffersService) {}

  @Get()
  async findAll() {
    return this.jobOffersService.findAll();
  }

  @Get('/history')
  async findAllWithHistory() {
    return this.jobOffersService.findAllWithHistory();
  }

  @Post()
  async create(@Body() jobOfferDto: CreateJobOfferDto) {
    return this.jobOffersService.create(jobOfferDto);
  }

  @Patch(':id/archive')
  async archive(@Param('id') id: number) {
    return this.jobOffersService.archiveOffer(id);
  }

  @Patch(':id/restore')
  async restore(@Param('id') id: number) {
    return this.jobOffersService.restoreOffer(id);
  }
}
