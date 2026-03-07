/* eslint-disable prettier/prettier */
/**
 * Script para corregir datos incorrectos en la tabla event_attendee.
 *
 * Correcciones:
 * 1. Shima Naderi: typo "gamil.com" → "gmail.com"
 * 2. Teresa Villa: registros con email ajeno (coderalsc@gmail.com) → su email real (teresavillamir@gmail.com)
 * 3. Silvina Lucero: eliminar entradas de prueba con nombre "PRUEBA UNO/DOS/TRES"
 *
 * Uso:
 *   pnpm ts-node src/fix-crm-data.ts
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventAttendee } from './events/entities/event-attendee.entity';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('FixCrmData');
  const app = await NestFactory.createApplicationContext(AppModule);
  const repo: Repository<EventAttendee> = app.get(getRepositoryToken(EventAttendee));

  try {
    // -----------------------------------------------
    // 1. Shima: corregir typo gamil.com → gmail.com
    // -----------------------------------------------
    const shima = await repo.find({ where: { email: 'shima.naderii@gamil.com' } });
    logger.log(`Shima (gamil.com): ${shima.length} registros encontrados`);

    let shimaFixed = 0;
    let shimaDuplicates = 0;

    for (const record of shima) {
      // Comprobar si ya existe un registro con gmail.com para el mismo evento
      const existing = await repo.findOne({
        where: { email: 'shima.naderii@gmail.com', eventId: record.eventId },
      });

      if (existing) {
        // Duplicado — el registro correcto ya existe, eliminar el erróneo
        await repo.delete(record.id);
        shimaDuplicates++;
        logger.log(`  Eliminado duplicado eventId=${record.eventId}`);
      } else {
        // No hay duplicado — actualizar el email
        await repo.update(record.id, { email: 'shima.naderii@gmail.com' });
        shimaFixed++;
        logger.log(`  Corregido eventId=${record.eventId}`);
      }
    }

    logger.log(`Shima: ${shimaFixed} corregidos, ${shimaDuplicates} duplicados eliminados`);

    // -----------------------------------------------
    // 2. Teresa Villa: mover sus registros de coderalsc@gmail.com a teresavillamir@gmail.com
    // -----------------------------------------------
    const teresa = await repo.find({
      where: { email: 'coderalsc@gmail.com' },
    });

    // Filtrar solo los que son de Teresa (por nombre)
    const teresaRecords = teresa.filter(
      (r) =>
        r.firstName?.toLowerCase().includes('teresa') ||
        r.lastName?.toLowerCase().includes('villa'),
    );

    logger.log(`Teresa Villa (en coderalsc): ${teresaRecords.length} registros encontrados`);

    let teresaFixed = 0;
    let teresaDuplicates = 0;

    for (const record of teresaRecords) {
      // Comprobar si ya existe un registro de Teresa con su email real para el mismo evento
      const existing = await repo.findOne({
        where: { email: 'teresavillamir@gmail.com', eventId: record.eventId },
      });

      if (existing) {
        await repo.delete(record.id);
        teresaDuplicates++;
        logger.log(`  Eliminado duplicado eventId=${record.eventId}`);
      } else {
        await repo.update(record.id, { email: 'teresavillamir@gmail.com' });
        teresaFixed++;
        logger.log(`  Movido a teresavillamir@gmail.com eventId=${record.eventId}`);
      }
    }

    logger.log(`Teresa: ${teresaFixed} corregidos, ${teresaDuplicates} duplicados eliminados`);

    // -----------------------------------------------
    // 3. Silvina Lucero: eliminar entradas de prueba (PRUEBA UNO/DOS/TRES)
    // -----------------------------------------------
    const prueba = await repo
      .createQueryBuilder('a')
      .where('a.email = :email', { email: 'silvinalucerobcn@gmail.com' })
      .andWhere("UPPER(a.firstName) LIKE 'PRUEBA%'")
      .getMany();

    logger.log(`Silvina - entradas de prueba encontradas: ${prueba.length}`);
    for (const record of prueba) {
      await repo.delete(record.id);
      logger.log(`  Eliminado: "${record.firstName} ${record.lastName}" eventId=${record.eventId}`);
    }

    // -----------------------------------------------
    // Resumen final
    // -----------------------------------------------
    logger.log('-----------------------------------------------');
    logger.log('Correcciones completadas:');
    logger.log(`  Shima Naderi:    ${shimaFixed} registros corregidos`);
    logger.log(`  Teresa Villa:    ${teresaFixed} registros movidos a su email real`);
    logger.log(`  Silvina Lucero:  ${prueba.length} entradas de prueba eliminadas`);

    process.exit(0);
  } catch (error) {
    logger.error('Error durante la corrección:', (error as Error).message);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
