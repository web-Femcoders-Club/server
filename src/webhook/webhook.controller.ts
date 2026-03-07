/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WebhookService } from './webhook.service';

@ApiTags('Webhooks')
@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private readonly webhookService: WebhookService,
    private readonly configService: ConfigService,
  ) {}

  @Post('eventbrite')
  @HttpCode(200)
  @ApiOperation({ summary: 'Webhook de Eventbrite — registro automático de asistentes' })
  async handleEventbriteWebhook(
    @Body() body: any,
    @Headers('x-eventbrite-token') token: string,
  ) {
    // Verificación opcional con token secreto
    // Configura WEBHOOK_SECRET en tu .env y en Eventbrite como endpoint URL param
    const secret = this.configService.get<string>('WEBHOOK_SECRET');
    if (secret && token !== secret) {
      throw new UnauthorizedException('Invalid webhook token');
    }

    const action: string = body?.config?.action;
    const apiUrl: string = body?.api_url;

    this.logger.log(`Eventbrite webhook received — action: ${action}`);

    if (!apiUrl) {
      this.logger.warn('Webhook received without api_url, ignoring.');
      return { received: true };
    }

    // Procesamos cuando alguien se registra en un evento
    if (action === 'order.placed' || action === 'attendee.updated') {
      // Procesamos en background para responder rápido a Eventbrite (< 5s)
      this.webhookService.handleOrderPlaced(apiUrl).catch((err) =>
        this.logger.error(`Background webhook processing failed: ${err.message}`),
      );
    }

    // Eventbrite espera 200 OK rápido
    return { received: true };
  }
}
