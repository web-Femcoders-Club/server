/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { SponsorModule } from './sponsor/sponsor.module';
import { AppController } from './app.controller'; 
import { AppService } from './app.service';
import { CommentModule } from './comment/comment.module'; 
import { AuthModule } from './auth/auth.module';
import { FaqModule } from './faq/faq.module';
import { MemberModule } from './member/member.module';
import { VolunteerModule } from './volunteer/volunteer.module'; 
import { UserModule } from './user/user.module';
import { EventsModule } from './events/events.module';
import { EmailModule } from './emails/email.module';
import { AchievementsModule } from './achievements/achievements.module';


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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


