import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { Achievement } from './entities/achievements.entity';

@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get()
  async getAllAchievements(): Promise<Achievement[]> {
    return await this.achievementsService.getAllAchievements();
  }

  @Get(':id')
  async getAchievementById(@Param('id') id: number): Promise<Achievement> {
    return await this.achievementsService.getAchievementById(id);
  }

  @Post()
  async createAchievement(
    @Body() achievementData: Partial<Achievement>,
  ): Promise<Achievement> {
    return await this.achievementsService.createAchievement(achievementData);
  }

  // Actualizar un logro existente
  @Put(':id')
  async updateAchievement(
    @Param('id') id: number,
    @Body() achievementData: Partial<Achievement>,
  ): Promise<Achievement> {
    return await this.achievementsService.updateAchievement(
      id,
      achievementData,
    );
  }
  @Delete(':id')
  async deleteAchievement(
    @Param('id') id: number,
  ): Promise<{ message: string }> {
    await this.achievementsService.deleteAchievement(id);
    return { message: 'Logro eliminado con éxito' };
  }
}
