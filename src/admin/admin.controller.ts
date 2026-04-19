/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AdminService } from './admin.service';
import { EventbriteService } from '../events/events.service';
import { CreateSponsorDto } from '../sponsor/dto/create-sponsor.dto';
import { ModifySponsorDto } from '../sponsor/dto/modify-sponsor.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Admin Dashboard')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly eventbriteService: EventbriteService,
  ) {}

  // ---------------------------
  // Sponsor-related endpoints
  // ---------------------------
  @Get('sponsors')
  @ApiOperation({ summary: 'Get all sponsors' })
  @ApiResponse({ status: 200, description: 'List of all sponsors' })
  @ApiNotFoundResponse({ status: 404, description: 'No sponsors found' })
  findAllSponsors() {
    return this.adminService.findAllSponsors();
  }

  @Get('sponsors/:sponsor_id')
  @ApiOperation({ summary: 'Get sponsor by ID' })
  @ApiResponse({ status: 200, description: 'Sponsor details' })
  @ApiNotFoundResponse({ status: 404, description: 'Sponsor not found' })
  findSponsorById(@Param('sponsor_id') sponsor_id: number) {
    return this.adminService.findSponsorById(sponsor_id);
  }

  @Post('sponsors')
  @ApiOperation({ summary: 'Add a new sponsor' })
  @ApiResponse({ status: 201, description: 'Sponsor successfully added' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  addSponsor(@Body() addSponsor: CreateSponsorDto) {
    return this.adminService.addSponsor(addSponsor);
  }

  @Put('sponsors/:sponsor_Id')
  @ApiOperation({ summary: 'Edit a sponsor by ID' })
  @ApiResponse({ status: 200, description: 'Sponsor successfully edited' })
  @ApiNotFoundResponse({ status: 404, description: 'Sponsor not found' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
  editSponsor(
    @Param('sponsor_Id') sponsor_Id: number,
    @Body() editSponsor: ModifySponsorDto,
  ) {
    return this.adminService.editSponsor(sponsor_Id, editSponsor);
  }

  @Delete('sponsors/:sponsorId')
  @ApiOperation({ summary: 'Delete a sponsor by ID' })
  @ApiResponse({ status: 200, description: 'Sponsor successfully deleted' })
  @ApiNotFoundResponse({ status: 404, description: 'Sponsor not found' })
  deleteSponsor(@Param('sponsorId') sponsor_Id: number) {
    return this.adminService.deleteSponsor(sponsor_Id);
  }

  // ---------------------------
  // Statistics endpoints
  // ---------------------------
  @Get('stats')
  @ApiOperation({ summary: 'Get user registration statistics' })
  @ApiResponse({
    status: 200,
    description: 'User statistics including total, weekly and monthly registrations',
  })
  async getUserStats() {
    return this.adminService.getUserStats();
  }

  // ---------------------------
  // User-related endpoints
  // ---------------------------
  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  @ApiNotFoundResponse({ status: 404, description: 'No users found' })
  findAllUsers() {
    return this.adminService.findAllUsers();
  }

  @Get('users/:user_id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User details' })
  @ApiNotFoundResponse({ status: 404, description: 'User not found' })
  findUserById(@Param('user_id') user_id: number) {
    return this.adminService.findUserById(user_id);
  }

  @Put('users/:user_id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  @ApiNotFoundResponse({ status: 404, description: 'User not found' })
  updateUser(
    @Param('user_id') user_id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.adminService.updateUser(user_id, updateUserDto);
  }

  @Delete('users/:user_id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  @ApiNotFoundResponse({ status: 404, description: 'User not found' })
  deleteUser(@Param('user_id') user_id: number) {
    return this.adminService.deleteUser(user_id);
  }
  // ---------------------------
  // User-Achievement-related endpoints
  // ---------------------------
  @Post('users/:user_id/achievements')
  @ApiOperation({ summary: 'Assign an achievement to a user' })
  @ApiResponse({
    status: 201,
    description: 'Achievement successfully assigned',
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User or Achievement not found',
  })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
  assignAchievementToUser(
    @Param('user_id') userId: number,
    @Body() achievementData: { achievementId: number },
  ) {
    return this.adminService.assignAchievementToUser(
      userId,
      achievementData.achievementId,
    );
  }

  @Get('users/:user_id/achievements')
  async getUserAchievements(@Param('user_id') userId: number) {
    return await this.adminService.getUserAchievements(userId);
  }

  @Get('achievements')
  @ApiOperation({ summary: 'Get all achievements' })
  @ApiResponse({ status: 200, description: 'List of all achievements' })
  async findAllAchievements() {
    return this.adminService.findAllAchievements();
  }
  @Delete('users/:user_id/achievements/:achievement_id')
  async removeUserAchievement(
    @Param('user_id') userId: number,
    @Param('achievement_id') achievementId: number,
  ) {
    return this.adminService.removeAchievementFromUser(userId, achievementId);
  }

  // ---------------------------
  // Achievement Statistics (Dashboard)
  // ---------------------------
  @Get('stats/achievements')
  @ApiOperation({ summary: 'Get achievement statistics' })
  @ApiResponse({
    status: 200,
    description: 'Achievement statistics for admin dashboard',
  })
  async getAchievementStats() {
    return this.adminService.getAchievementStats();
  }

  @Get('users-with-achievements')
  @ApiOperation({ summary: 'Get all users with their achievements (paginated)' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of users with their achievements',
  })
  async getAllUsersWithAchievements(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.adminService.getAllUsersWithAchievements(
      parseInt(page, 10) || 1,
      parseInt(limit, 10) || 10,
    );
  }

  @Get('recent-achievements')
  @ApiOperation({ summary: 'Get recent achievement assignments' })
  @ApiResponse({
    status: 200,
    description: 'List of recently assigned achievements',
  })
  async getRecentAchievements() {
    return this.adminService.getRecentAchievements(10);
  }

  // ---------------------------
  // CRM - Asistentes a eventos
  // ---------------------------
  @Get('crm/attendees')
  @ApiOperation({ summary: 'CRM: lista de asistentes únicos con conteo de eventos' })
  @ApiResponse({ status: 200, description: 'Lista paginada de asistentes' })
  async getCrmAttendees(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('eventId') eventId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('name') name?: string,
  ) {
    return this.adminService.getCrmAttendees(
      parseInt(page, 10) || 1,
      parseInt(limit, 10) || 20,
      { eventId, dateFrom, dateTo, name },
    );
  }

  // IMPORTANTE: /export debe ir ANTES que /:email para que NestJS no lo confunda
  @Get('crm/attendees/export')
  @ApiOperation({ summary: 'CRM: exportar asistentes en CSV o PDF' })
  async exportCrmAttendees(
    @Query('format') format: string = 'csv',
    @Query('eventId') eventId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Res() res?: Response,
  ) {
    const filters = { eventId, dateFrom, dateTo };
    const date = new Date().toISOString().substring(0, 10);

    if (format === 'pdf') {
      const buffer = await this.adminService.exportCrmPdf(filters);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="femcoders-asistentes-${date}.pdf"`,
        'Content-Length': buffer.length,
      });
      res.end(buffer);
    } else {
      const csv = await this.adminService.exportCrmCsv(filters);
      res.set({
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="femcoders-asistentes-${date}.csv"`,
      });
      res.send('\uFEFF' + csv); // BOM para que Excel abra bien el UTF-8
    }
  }

  // IMPORTANTE: rutas estáticas antes que /:email
  @Get('crm/attendees/by-dni/:dni')
  @ApiOperation({ summary: 'CRM: buscar persona por DNI (agrupa todas sus emails)' })
  @ApiResponse({ status: 200, description: 'Perfil completo por DNI' })
  @ApiNotFoundResponse({ status: 404, description: 'DNI no encontrado' })
  async getCrmAttendeeByDni(
    @Param('dni') dni: string,
    @Query('eventsPage') eventsPage: string = '1',
    @Query('eventsLimit') eventsLimit: string = '20',
  ) {
    return this.adminService.getCrmAttendeeByDni(
      dni,
      parseInt(eventsPage, 10) || 1,
      parseInt(eventsLimit, 10) || 20,
    );
  }

  @Get('crm/attendees/:email')
  @ApiOperation({ summary: 'CRM: historial de eventos de una asistente por email' })
  @ApiResponse({ status: 200, description: 'Historial de asistencia' })
  @ApiNotFoundResponse({ status: 404, description: 'Asistente no encontrada' })
  async getCrmAttendeeByEmail(
    @Param('email') email: string,
    @Query('eventsPage') eventsPage: string = '1',
    @Query('eventsLimit') eventsLimit: string = '20',
  ) {
    return this.adminService.getCrmAttendeeByEmail(
      email,
      parseInt(eventsPage, 10) || 1,
      parseInt(eventsLimit, 10) || 20,
    );
  }

  @Get('crm/events/:eventId/attendees')
  @ApiOperation({ summary: 'CRM: asistentes de un evento concreto' })
  @ApiResponse({ status: 200, description: 'Lista de asistentes del evento' })
  @ApiNotFoundResponse({ status: 404, description: 'Evento no encontrado' })
  async getCrmEventAttendees(@Param('eventId') eventId: string) {
    return this.adminService.getCrmEventAttendees(eventId);
  }

  @Get('crm/stats')
  @ApiOperation({ summary: 'CRM: estadísticas globales de asistencia' })
  @ApiResponse({ status: 200, description: 'Estadísticas CRM' })
  async getCrmStats() {
    return this.adminService.getCrmStats();
  }

  @Get('crm/users-crosscheck')
  @ApiOperation({ summary: 'CRM: cruce de usuarios registrados vs asistentes a eventos' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios con su asistencia a eventos' })
  async getCrmUsersCrosscheck() {
    return this.adminService.getCrmUsersCrosscheck();
  }

  @Post('crm/sync')
  @ApiOperation({ summary: 'CRM: forzar sincronización manual de asistentes desde Eventbrite' })
  @ApiResponse({ status: 200, description: 'Sync completado' })
  async forceSyncAttendees() {
    await this.eventbriteService.syncAttendees();
    return { ok: true, message: 'Sync completado' };
  }

  // ---------------------------
  // Unsubscribe management
  // ---------------------------
  @Get('unsubscribed')
  @ApiOperation({ summary: 'Lista de emails dados de baja' })
  @ApiResponse({ status: 200, description: 'Lista de bajas de email' })
  async getUnsubscribedEmails() {
    return this.adminService.getUnsubscribedEmails();
  }

  @Get('unsubscribed/check')
  @ApiOperation({ summary: 'Verificar si un email está dado de baja' })
  @ApiResponse({ status: 200, description: 'Estado de suscripción del email' })
  async checkUnsubscribed(@Query('email') email: string) {
    if (!email) throw new BadRequestException('El parámetro email es obligatorio');
    const isUnsubscribed = await this.adminService.isEmailUnsubscribed(email);
    return { email, isUnsubscribed };
  }
}
