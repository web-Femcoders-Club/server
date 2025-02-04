import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobOffer } from './entities/job-offers.entity';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';

@Injectable()
export class JobOffersService {
  constructor(
    @InjectRepository(JobOffer)
    private jobOffersRepository: Repository<JobOffer>,
  ) {}

  // Obtener todas las ofertas activas
  async findAll(): Promise<JobOffer[]> {
    return this.jobOffersRepository.find({ where: { is_active: true } });
  }

  // Obtener todas las ofertas, incluyendo archivadas
  async findAllWithHistory(): Promise<JobOffer[]> {
    return this.jobOffersRepository.find();
  }

  // Crear nueva oferta
  async create(jobOfferDto: CreateJobOfferDto): Promise<JobOffer> {
    const jobOffer = this.jobOffersRepository.create(jobOfferDto);
    return this.jobOffersRepository.save(jobOffer);
  }

  async archiveOffer(id: number): Promise<{ message: string }> {
    await this.jobOffersRepository.update(id, { is_active: false });
    return { message: `Oferta con ID ${id} archivada.` };
  }

  async restoreOffer(id: number): Promise<{ message: string }> {
    await this.jobOffersRepository.update(id, { is_active: true });
    return { message: `Oferta con ID ${id} restaurada.` };
  }
}
