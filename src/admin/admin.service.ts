/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSponsorDto } from '../sponsor/dto/create-sponsor.dto';
import { ModifySponsorDto } from '../sponsor/dto/modify-sponsor.dto';
import { SponsorService } from '../sponsor/sponsor.service';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Achievement } from '../achievements/entities/achievements.entity';
import { UserAchievement } from './entities/user-achievements.entity';

@Injectable()
export class AdminService {
  constructor(
    private readonly sponsorService: SponsorService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Achievement)
    private readonly achievementsRepository: Repository<Achievement>,
    @InjectRepository(UserAchievement)
    private readonly userAchievementsRepository: Repository<UserAchievement>,
  ) {}

  // -------------------------------
  // Sponsors Management
  // -------------------------------
  async addSponsor(addSponsor: CreateSponsorDto) {
    const sponsor = await this.sponsorService.findOneByName(
      addSponsor.sponsorsName,
    );

    if (sponsor !== null) {
      throw new BadRequestException('Sponsor already exists');
    }

    try {
      await this.sponsorService.create(addSponsor);
      return addSponsor;
    } catch (err) {
      console.error('Something went wrong:', err);
      throw new BadRequestException('Something went wrong');
    }
  }

  async editSponsor(sponsor_Id: number, editSponsor: ModifySponsorDto) {
    try {
      await this.sponsorService.modifySponsor(sponsor_Id, editSponsor);
      return { message: 'Sponsor modification successful' };
    } catch (err) {
      console.error('Something went wrong:', err);
      throw new BadRequestException('Something went wrong');
    }
  }

  async deleteSponsor(sponsor_Id: number) {
    try {
      await this.sponsorService.removeSponsor(sponsor_Id);
      return { message: 'Sponsor deleted' };
    } catch (err) {
      console.error('Something went wrong:', err);
      throw new BadRequestException('Something went wrong');
    }
  }

  async findAllSponsors() {
    try {
      const sponsors = await this.sponsorService.findAll();
      return sponsors;
    } catch (err) {
      console.error('Something went wrong:', err);
      throw new BadRequestException('Something went wrong');
    }
  }

  async findSponsorById(sponsor_id: number) {
    try {
      const sponsor = await this.sponsorService.findOneById(sponsor_id);
      if (!sponsor) {
        throw new NotFoundException('Sponsor does not exist');
      }
      return sponsor;
    } catch (err) {
      console.error('Something went wrong:', err);
      throw new BadRequestException('Something went wrong');
    }
  }

  // -------------------------------
  // Users Management
  // -------------------------------
  async findAllUsers() {
    try {
      const users = await this.userRepository.find();
      return users;
    } catch (err) {
      console.error('Something went wrong fetching users:', err);
      throw new BadRequestException('Unable to fetch users');
    }
  }

  async findUserById(userId: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { idUser: userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (err) {
      console.error('Something went wrong:', err);
      throw new BadRequestException('Unable to fetch user');
    }
  }

  async updateUser(userId: number, updateUserDto: Partial<User>) {
    try {
      const user = await this.findUserById(userId);
      Object.assign(user, updateUserDto);
      await this.userRepository.save(user);
      return { message: 'User updated successfully' };
    } catch (err) {
      console.error('Something went wrong updating user:', err);
      throw new BadRequestException('Unable to update user');
    }
  }

  async deleteUser(userId: number) {
    try {
      const user = await this.findUserById(userId);
      await this.userRepository.delete(user.idUser);
      return { message: 'User deleted successfully' };
    } catch (err) {
      console.error('Something went wrong deleting user:', err);
      throw new BadRequestException('Unable to delete user');
    }
  }

  // -------------------------------
  // User-Achievement Management
  // -------------------------------
  async assignAchievementToUser(
    userId: number,
    achievementId: number,
  ): Promise<UserAchievement> {
    const user = await this.userRepository.findOneBy({ idUser: userId });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const achievement = await this.achievementsRepository.findOneBy({
      id: achievementId,
    });
    if (!achievement) {
      throw new NotFoundException(
        `Logro con ID ${achievementId} no encontrado`,
      );
    }

    const existingAchievement = await this.userAchievementsRepository.findOne({
      where: { userId, achievementId },
    });
    if (existingAchievement) {
      throw new BadRequestException('El usuario ya tiene asignado este logro');
    }

    const userAchievement = this.userAchievementsRepository.create({
      userId,
      achievementId,
    });
    return await this.userAchievementsRepository.save(userAchievement);
  }

  async getUserAchievements(idUser: number) {
    const userAchievements = await this.userAchievementsRepository.find({
      where: { userId: idUser },
      relations: ['achievement'],
    });

    return userAchievements.map((ua) => ({
      id: ua.achievement.id,
      title: ua.achievement.title,
      icon: ua.achievement.icon,
      description: ua.achievement.description,
    }));
  }
  async findAllAchievements(): Promise<Achievement[]> {
    return await this.achievementsRepository.find();
  }
  async removeAchievementFromUser(userId: number, achievementId: number) {
    const userAchievement = await this.userAchievementsRepository.findOne({
      where: { userId, achievementId },
    });
    if (!userAchievement) {
      throw new NotFoundException('El logro no está asignado a este usuario.');
    }
    await this.userAchievementsRepository.remove(userAchievement);
    return { message: 'Logro eliminado correctamente del usuario.' };
  }

  // -------------------------------
  // Statistics
  // -------------------------------
  async getUserStats() {
    const now = new Date();

    // Inicio de la semana (lunes)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
    startOfWeek.setHours(0, 0, 0, 0);

    // Inicio del mes
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Total de usuarios
    const totalUsers = await this.userRepository.count();

    // Nuevos esta semana
    const newThisWeek = await this.userRepository.count({
      where: { createdAt: MoreThanOrEqual(startOfWeek) },
    });

    // Nuevos este mes
    const newThisMonth = await this.userRepository.count({
      where: { createdAt: MoreThanOrEqual(startOfMonth) },
    });

    // Últimos 5 registros (ordenado por ID desc ya que es incremental)
    const recentRegistrations = await this.userRepository.find({
      select: ['idUser', 'userName', 'userLastName', 'userEmail', 'createdAt'],
      order: { idUser: 'DESC' },
      take: 5,
    });

    return {
      totalUsers,
      newThisWeek,
      newThisMonth,
      recentRegistrations,
    };
  }

  // -------------------------------
  // Achievement Statistics (Admin Dashboard)
  // -------------------------------
  async getAchievementStats() {
    // Obtener todos los logros
    const achievements = await this.achievementsRepository.find();

    // Contar cuántos usuarios tienen cada logro
    const achievementStats = await Promise.all(
      achievements.map(async (achievement) => {
        const count = await this.userAchievementsRepository.count({
          where: { achievementId: achievement.id },
        });
        return {
          id: achievement.id,
          title: achievement.title,
          icon: achievement.icon,
          usersCount: count,
        };
      }),
    );

    // Total de logros asignados
    const totalAchievementsAssigned = await this.userAchievementsRepository.count();

    // Usuarios con al menos un logro
    const usersWithAchievements = await this.userAchievementsRepository
      .createQueryBuilder('ua')
      .select('COUNT(DISTINCT ua.userId)', 'count')
      .getRawOne();

    return {
      totalAchievementsAssigned,
      usersWithAchievements: parseInt(usersWithAchievements.count, 10),
      achievementsByType: achievementStats.sort((a, b) => b.usersCount - a.usersCount),
    };
  }

  async getAllUsersWithAchievements(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [users, total] = await this.userRepository.findAndCount({
      select: ['idUser', 'userName', 'userLastName', 'userEmail', 'userAvatar', 'createdAt'],
      order: { idUser: 'DESC' },
      skip,
      take: limit,
    });

    const usersWithAchievements = await Promise.all(
      users.map(async (user) => {
        const achievements = await this.userAchievementsRepository.find({
          where: { userId: user.idUser },
          relations: ['achievement'],
        });

        return {
          idUser: user.idUser,
          userName: user.userName,
          userLastName: user.userLastName,
          userEmail: user.userEmail,
          hasAvatar: !!user.userAvatar,
          createdAt: user.createdAt,
          achievementsCount: achievements.length,
          achievements: achievements.map((ua) => ({
            id: ua.achievement.id,
            title: ua.achievement.title,
            icon: ua.achievement.icon,
          })),
        };
      }),
    );

    const totalPages = Math.ceil(total / limit);

    return {
      data: usersWithAchievements,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getRecentAchievements(limit: number = 10) {
    const recentAchievements = await this.userAchievementsRepository.find({
      relations: ['user', 'achievement'],
      order: { id: 'DESC' },
      take: limit,
    });

    return recentAchievements.map((ua) => ({
      odUser: ua.userId,
      userName: ua.user?.userName,
      userLastName: ua.user?.userLastName,
      achievementId: ua.achievementId,
      achievementTitle: ua.achievement?.title,
      achievementIcon: ua.achievement?.icon,
    }));
  }
}
