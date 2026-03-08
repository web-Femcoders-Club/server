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
import { EventAttendee } from '../events/entities/event-attendee.entity';
import { Event } from '../events/entities/event.entity';

@Injectable()
export class AdminService {
  constructor(
    private readonly sponsorService: SponsorService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Achievement)
    private readonly achievementsRepository: Repository<Achievement>,
    @InjectRepository(UserAchievement)
    private readonly userAchievementsRepository: Repository<UserAchievement>,
    @InjectRepository(EventAttendee)
    private readonly attendeeRepository: Repository<EventAttendee>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
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

  // -------------------------------
  // CRM - Asistentes a eventos
  // -------------------------------

  async getCrmAttendees(
    page: number = 1,
    limit: number = 20,
    filters: { eventId?: string; dateFrom?: string; dateTo?: string; name?: string } = {},
  ) {
    const skip = (page - 1) * limit;

    const buildBase = () => {
      const qb = this.attendeeRepository
        .createQueryBuilder('a')
        .where("a.email != 'Info Requested'");

      if (filters.name) {
        qb.andWhere(
          "(LOWER(a.firstName) LIKE :name OR LOWER(a.lastName) LIKE :name OR LOWER(CONCAT(a.firstName, ' ', a.lastName)) LIKE :name)",
          { name: `%${filters.name.toLowerCase()}%` },
        );
      }
      if (filters.eventId) {
        qb.andWhere('a.eventId = :eventId', { eventId: filters.eventId });
      }
      if (filters.dateFrom || filters.dateTo) {
        qb.innerJoin('a.event', 'e');
        if (filters.dateFrom) {
          qb.andWhere('e.start_local >= :dateFrom', { dateFrom: filters.dateFrom });
        }
        if (filters.dateTo) {
          qb.andWhere('e.start_local <= :dateTo', { dateTo: filters.dateTo });
        }
      }
      return qb;
    };

    const raw = await buildBase()
      .select('a.email', 'email')
      .addSelect('MAX(a.firstName)', 'firstName')
      .addSelect('MAX(a.lastName)', 'lastName')
      .addSelect('MAX(a.dni)', 'dni')
      .addSelect('COUNT(a.eventId)', 'eventsAttended')
      .groupBy('a.email')
      .orderBy('eventsAttended', 'DESC')
      .offset(skip)
      .limit(limit)
      .getRawMany();

    const total = await buildBase()
      .select('COUNT(DISTINCT a.email)', 'count')
      .getRawOne();

    const totalItems = parseInt(total.count, 10);
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: raw.map((r) => ({
        email: r.email,
        firstName: r.firstName,
        lastName: r.lastName,
        dni: r.dni,
        eventsAttended: parseInt(r.eventsAttended, 10),
      })),
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getCrmAttendeeByEmail(email: string, eventsPage = 1, eventsLimit = 20) {
    const all = await this.attendeeRepository
      .createQueryBuilder('a')
      .innerJoinAndSelect('a.event', 'e')
      .where('a.email = :email', { email })
      .orderBy('e.start_local', 'DESC')
      .getMany();

    if (all.length === 0) {
      throw new NotFoundException(`No se encontró ningún asistente con el email ${email}`);
    }

    const { firstName, lastName, dni } = all[0];
    const totalEvents = all.length;
    const totalPages = Math.ceil(totalEvents / eventsLimit);
    const skip = (eventsPage - 1) * eventsLimit;
    const pageEvents = all.slice(skip, skip + eventsLimit);

    return {
      email,
      firstName,
      lastName,
      dni,
      totalEvents,
      events: pageEvents.map((a) => ({
        eventId: a.eventId,
        name: a.event?.name,
        date: a.event?.start_local,
        location: a.event?.location,
        eventUrl: a.event?.event_url,
      })),
      eventsPagination: {
        currentPage: eventsPage,
        itemsPerPage: eventsLimit,
        totalItems: totalEvents,
        totalPages,
        hasNextPage: eventsPage < totalPages,
        hasPreviousPage: eventsPage > 1,
      },
    };
  }

  async getCrmAttendeeByDni(dni: string, eventsPage = 1, eventsLimit = 20) {
    const all = await this.attendeeRepository
      .createQueryBuilder('a')
      .innerJoinAndSelect('a.event', 'e')
      .where('a.dni = :dni', { dni })
      .andWhere("a.email != 'Info Requested'")
      .orderBy('e.start_local', 'DESC')
      .getMany();

    if (all.length === 0) {
      throw new NotFoundException(`No se encontró ningún asistente con DNI ${dni}`);
    }

    const { firstName, lastName } = all[0];
    const emails = [...new Set(all.map((a) => a.email))];

    // Deduplicar eventos (misma persona puede tener múltiples registros en el mismo evento con distinto email)
    const seenEventIds = new Set<string>();
    const uniqueEvents = all.filter((a) => {
      if (seenEventIds.has(a.eventId)) return false;
      seenEventIds.add(a.eventId);
      return true;
    });

    const totalEvents = uniqueEvents.length;
    const totalPages = Math.ceil(totalEvents / eventsLimit);
    const skip = (eventsPage - 1) * eventsLimit;
    const pageEvents = uniqueEvents.slice(skip, skip + eventsLimit);

    return {
      firstName,
      lastName,
      dni,
      emails,
      totalEvents,
      events: pageEvents.map((a) => ({
        eventId: a.eventId,
        name: a.event?.name,
        date: a.event?.start_local,
        location: a.event?.location,
        eventUrl: a.event?.event_url,
      })),
      eventsPagination: {
        currentPage: eventsPage,
        itemsPerPage: eventsLimit,
        totalItems: totalEvents,
        totalPages,
        hasNextPage: eventsPage < totalPages,
        hasPreviousPage: eventsPage > 1,
      },
    };
  }

  async getCrmEventAttendees(eventId: string) {
    const event = await this.eventRepository.findOne({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException(`Evento con ID ${eventId} no encontrado`);
    }

    const attendees = await this.attendeeRepository.find({
      where: { eventId },
      order: { lastName: 'ASC' },
    });

    const dniPattern = /^(\d{8}|[XYZ]\d{7})[A-Za-z]$/;

    // Detectar emails duplicados (misma persona, más de una entrada)
    const emailCount = new Map<string, number>();
    for (const a of attendees) {
      if (a.email && a.email !== 'Info Requested') {
        emailCount.set(a.email, (emailCount.get(a.email) ?? 0) + 1);
      }
    }

    const enriched = attendees.map((a) => {
      const isInfoRequested = a.firstName === 'Info' && a.lastName === 'Requested';
      const dniMissing = !isInfoRequested && !a.dni;
      const dniInvalid = !isInfoRequested && !!a.dni && !dniPattern.test(a.dni);
      const hasMultipleEntries = (emailCount.get(a.email) ?? 0) > 1;

      return {
        firstName: a.firstName,
        lastName: a.lastName,
        email: a.email,
        dni: a.dni,
        buyer: isInfoRequested ? {
          firstName: a.orderFirstName,
          lastName: a.orderLastName,
          email: a.orderEmail,
        } : null,
        alerts: {
          isInfoRequested,
          dniMissing,
          dniInvalid,
          hasMultipleEntries,
        },
      };
    });

    const summary = {
      infoRequested: enriched.filter((a) => a.alerts.isInfoRequested).length,
      dniMissing: enriched.filter((a) => a.alerts.dniMissing).length,
      dniInvalid: enriched.filter((a) => a.alerts.dniInvalid).length,
      multipleEntries: enriched.filter((a) => a.alerts.hasMultipleEntries).length,
    };

    return {
      event: {
        id: event.id,
        name: event.name,
        date: event.start_local,
        location: event.location,
      },
      totalAttendees: attendees.length,
      summary,
      attendees: enriched,
    };
  }

  async getCrmStats() {
    const totalAttendees = await this.attendeeRepository
      .createQueryBuilder('a')
      .select('COUNT(DISTINCT a.email)', 'count')
      .where("a.email != 'Info Requested'")
      .getRawOne();

    const repeatRows = await this.attendeeRepository
      .createQueryBuilder('a')
      .select('a.email', 'email')
      .addSelect('COUNT(a.eventId)', 'cnt')
      .where("a.email != 'Info Requested'")
      .groupBy('a.email')
      .having('COUNT(a.eventId) > 1')
      .getRawMany();
    const repeatAttendees = repeatRows.length;

    const totalRegistrations = await this.attendeeRepository
      .createQueryBuilder('a')
      .where("a.email != 'Info Requested'")
      .getCount();

    const topAttendees = await this.attendeeRepository
      .createQueryBuilder('a')
      .select('a.email', 'email')
      .addSelect('MAX(a.firstName)', 'firstName')
      .addSelect('MAX(a.lastName)', 'lastName')
      .addSelect('COUNT(a.eventId)', 'eventsAttended')
      .where("a.email != 'Info Requested'")
      .groupBy('a.email')
      .orderBy('eventsAttended', 'DESC')
      .limit(10)
      .getRawMany();

    const eventStats = await this.attendeeRepository
      .createQueryBuilder('a')
      .select('a.eventId', 'eventId')
      .addSelect('COUNT(a.id)', 'count')
      .innerJoin('a.event', 'e')
      .addSelect('e.name', 'eventName')
      .where("a.email != 'Info Requested'")
      .groupBy('a.eventId')
      .addGroupBy('e.name')
      .orderBy('count', 'DESC')
      .getRawMany();

    return {
      uniqueAttendees: parseInt(totalAttendees.count, 10),
      repeatAttendees,
      totalRegistrations,
      topAttendees: topAttendees.map((r) => ({
        email: r.email,
        firstName: r.firstName,
        lastName: r.lastName,
        eventsAttended: parseInt(r.eventsAttended, 10),
      })),
      eventStats: eventStats.map((r) => ({
        eventId: r.eventId,
        eventName: r.eventName,
        attendeesCount: parseInt(r.count, 10),
      })),
    };
  }

  // -------------------------------
  // CRM - Exportación
  // -------------------------------

  private async getAllAttendeesForExport(
    filters: { eventId?: string; dateFrom?: string; dateTo?: string } = {},
  ) {
    const qb = this.attendeeRepository
      .createQueryBuilder('a')
      .innerJoin('a.event', 'e')
      .select('a.firstName', 'firstName')
      .addSelect('a.lastName', 'lastName')
      .addSelect('a.email', 'email')
      .addSelect('a.dni', 'dni')
      .addSelect('e.name', 'eventName')
      .addSelect('e.start_local', 'eventDate')
      .where("a.email != 'Info Requested'")
      .orderBy('a.lastName', 'ASC')
      .addOrderBy('a.firstName', 'ASC');

    if (filters.eventId) {
      qb.andWhere('a.eventId = :eventId', { eventId: filters.eventId });
    }
    if (filters.dateFrom) {
      qb.andWhere('e.start_local >= :dateFrom', { dateFrom: filters.dateFrom });
    }
    if (filters.dateTo) {
      qb.andWhere('e.start_local <= :dateTo', { dateTo: filters.dateTo });
    }

    return qb.getRawMany();
  }

  async exportCrmCsv(
    filters: { eventId?: string; dateFrom?: string; dateTo?: string } = {},
  ): Promise<string> {
    const rows = await this.getAllAttendeesForExport(filters);

    const header = 'Nombre,Apellidos,Email,DNI,Evento,Fecha';
    const lines = rows.map((r) => {
      const date = r.eventDate ? r.eventDate.substring(0, 10) : '';
      const escape = (v: string) => `"${(v || '').replace(/"/g, '""')}"`;
      return [
        escape(r.firstName),
        escape(r.lastName),
        escape(r.email),
        escape(r.dni || ''),
        escape(r.eventName),
        date,
      ].join(',');
    });

    return [header, ...lines].join('\n');
  }

  async exportCrmPdf(
    filters: { eventId?: string; dateFrom?: string; dateTo?: string } = {},
  ): Promise<Buffer> {
    const rows = await this.getAllAttendeesForExport(filters);
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const PDFDocument = require('pdfkit');

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Cabecera
      doc
        .fontSize(16)
        .font('Helvetica-Bold')
        .text('FemCoders Club — Asistentes a eventos', { align: 'center' });
      doc.moveDown(0.5);
      doc
        .fontSize(9)
        .font('Helvetica')
        .text(`Exportado: ${new Date().toLocaleDateString('es-ES')} · Total registros: ${rows.length}`, { align: 'center' });
      doc.moveDown(1);

      // Cabecera de tabla
      const colX = [40, 160, 280, 370, 450];
      const headers = ['Nombre', 'Apellidos', 'Email', 'DNI', 'Fecha'];
      doc.fontSize(8).font('Helvetica-Bold');
      headers.forEach((h, i) => doc.text(h, colX[i], doc.y, { continued: i < headers.length - 1, width: colX[i + 1] ? colX[i + 1] - colX[i] - 4 : 80 }));
      doc.moveDown(0.3);
      doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
      doc.moveDown(0.3);

      // Filas
      doc.fontSize(7).font('Helvetica');
      for (const r of rows) {
        if (doc.y > 760) {
          doc.addPage();
          doc.fontSize(7).font('Helvetica');
        }
        const y = doc.y;
        const date = r.eventDate ? r.eventDate.substring(0, 10) : '';
        const vals = [r.firstName || '', r.lastName || '', r.email || '', r.dni || '', date];
        vals.forEach((v, i) => {
          doc.text(v, colX[i], y, { width: colX[i + 1] ? colX[i + 1] - colX[i] - 4 : 80, lineBreak: false });
        });
        doc.moveDown(0.6);
      }

      doc.end();
    });
  }
}
