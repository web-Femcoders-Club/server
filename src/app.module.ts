/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementsModule } from './achievements/achievements.module';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { EmailFormularioModule } from './email-formulario/email-formulario.module';
import { EmailModule } from './emails/email.module';
import { EventsModule } from './events/events.module';
import { EventbriteService } from './events/events.service';
import { FaqModule } from './faq/faq.module';
import { JobOffersModule } from './job-offers/job-offers.module';
import { MemberModule } from './member/member.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { SponsorModule } from './sponsor/sponsor.module';
import { UserModule } from './user/user.module';
import { VolunteerModule } from './volunteer/volunteer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 3306,
        username: process.env.DB_USERNAME || 'tu_usuario',
        password: process.env.DB_PASSWORD || 'tu_contraseña',
        database: process.env.DB_DATABASE || 'tu_base_de_datos',
        entities: [__dirname + '/**/*.entity{.ts,.js}'], 
        synchronize: true, 
        charset: 'utf8mb4',
      }),
    }),
    AdminModule,
    SponsorModule,
    AuthModule,
    FaqModule,
    MemberModule,
    UserModule, 
    VolunteerModule, 
    EventsModule,
    CommentModule,
    EmailModule,
    AchievementsModule,
    EmailFormularioModule,
    JobOffersModule,
    QuizzesModule,
  ],
  controllers: [AppController],
  providers: [AppService, EventbriteService],
})
export class AppModule {}


