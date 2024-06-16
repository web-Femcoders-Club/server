/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Faq } from './entities/faq.entity';
import { DataSource, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq) 
    private readonly faqRepository: Repository<Faq>,
    @InjectDataSource()
    private dataSource: DataSource,
  ){}
  create(createFaqDto: CreateFaqDto) {
    return this.faqRepository.save(createFaqDto);
    
  }

async findAll() {
    return await this.faqRepository.find();
  }

  async findOne(idFaq: number) {
    const faq = await this.faqRepository.findOne({ where: { idFaq } } as FindOneOptions<Faq>);
    if (!faq) {
      throw new NotFoundException(`La pregunta frecuente ${idFaq} no existe`);
    }
    return faq;
  }
  
  async update(idFaq: number, updateFaqDto: UpdateFaqDto) {
    await this.findOne(idFaq);
    await this.faqRepository.update(idFaq,updateFaqDto);
    return "La pregunta frecuente fue actualizada";
  }

  async remove(idFaq: number) {
    const faq = await this.findOne(idFaq);
    await this.faqRepository.delete(faq);
    return "Pregunta frecuente eliminada exitosamente";
  }
}
