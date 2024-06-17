/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Volunteer } from './entities/volunteer.entity';

@Injectable()
export class VolunteerService {

  constructor(
    @InjectRepository(Volunteer)
    private readonly volunteerRepository: Repository<Volunteer>
  ){}

  async create(createVolunteerDto: CreateVolunteerDto) {
    return await this.volunteerRepository.save(this.volunteerRepository.create(createVolunteerDto));
  }

  async findVolunteers() {
    return this.volunteerRepository.find({})
  
  }

  async findOneById(idVolunteer: number): Promise<Volunteer> {
    return this.volunteerRepository.findOneBy({idVolunteer});
  }

  update(id: number, updateVolunteerDto: UpdateVolunteerDto) {
    return this.volunteerRepository.update(id, updateVolunteerDto);
  }

  async remove(idVolunteer: number) {
    return await this.volunteerRepository.delete(idVolunteer);
  }
}
