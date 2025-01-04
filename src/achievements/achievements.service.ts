/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from './entities/achievements.entity';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementsRepository: Repository<Achievement>,
  ) {}

  async getAllAchievements(): Promise<Achievement[]> {
    return await this.achievementsRepository.find();
  }
  async getAchievementById(id: number): Promise<Achievement> {
    const achievement = await this.achievementsRepository.findOneBy({ id });
    if (!achievement) {
      throw new NotFoundException(`Logro con ID ${id} no encontrado`);
    }
    return achievement;
  }

  async createAchievement(data: Partial<Achievement>): Promise<Achievement> {
    const newAchievement = this.achievementsRepository.create(data);
    return await this.achievementsRepository.save(newAchievement);
  }

  async updateAchievement(
    id: number,
    data: Partial<Achievement>,
  ): Promise<Achievement> {
    const achievement = await this.getAchievementById(id);
    Object.assign(achievement, data);
    return await this.achievementsRepository.save(achievement);
  }
  async deleteAchievement(id: number): Promise<void> {
    const achievement = await this.getAchievementById(id);
    await this.achievementsRepository.remove(achievement);
  }
}
