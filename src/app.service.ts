/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { EventbriteService } from './events/events.service';


import { OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly eventbriteService: EventbriteService) {}

  async onModuleInit() {
    try {
      await this.eventbriteService.syncEvents();
      // Puedes agregar logs aquí si lo deseas
    } catch (error) {
      // Manejo de error opcional
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
