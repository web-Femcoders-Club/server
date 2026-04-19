/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UnsubscribeService } from './unsubscribe.service';

@ApiTags('Unsubscribe')
@Controller('unsubscribe')
export class UnsubscribeController {
  constructor(private readonly unsubscribeService: UnsubscribeService) {}

  @Get()
  @ApiOperation({ summary: 'Dar de baja un email via enlace de correo (con token)' })
  @ApiResponse({ status: 200, description: 'Resultado de la baja: ok | already | invalid' })
  async unsubscribe(
    @Query('email') email: string,
    @Query('token') token: string,
  ) {
    if (!email || !token) {
      throw new BadRequestException('Los parámetros email y token son obligatorios');
    }
    return this.unsubscribeService.processUnsubscribe(email, token);
  }

  @Post('request')
  @ApiOperation({ summary: 'Solicitar enlace de baja por email' })
  @ApiResponse({ status: 200, description: 'Resultado: sent | already' })
  async requestUnsubscribe(@Body('email') email: string) {
    if (!email) {
      throw new BadRequestException('El campo email es obligatorio');
    }
    return this.unsubscribeService.requestUnsubscribeLink(email);
  }
}
