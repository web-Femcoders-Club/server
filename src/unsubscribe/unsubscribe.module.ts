/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnsubscribedEmail } from '../emails/entities/unsubscribed-email.entity';
import { EmailModule } from '../emails/email.module';
import { UnsubscribeController } from './unsubscribe.controller';
import { UnsubscribeService } from './unsubscribe.service';

@Module({
  imports: [TypeOrmModule.forFeature([UnsubscribedEmail]), EmailModule],
  controllers: [UnsubscribeController],
  providers: [UnsubscribeService],
  exports: [UnsubscribeService],
})
export class UnsubscribeModule {}
