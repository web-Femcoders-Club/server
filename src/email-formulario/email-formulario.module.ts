/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { EmailFormularioController } from './email-formulario.controller';
import { EmailFormularioService } from './email-formulario.service';

@Module({
  controllers: [EmailFormularioController],
  providers: [EmailFormularioService],
})
export class EmailFormularioModule {}
