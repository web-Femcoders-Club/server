/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnconnectedComment } from './unconnected-comment.entity';
import { UnconnectedCommentService } from './unconnected-comment.service';
import { UnconnectedCommentController } from './unconnected-comment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UnconnectedComment])],
  controllers: [UnconnectedCommentController],
  providers: [UnconnectedCommentService],
})
export class UnconnectedCommentModule {}
