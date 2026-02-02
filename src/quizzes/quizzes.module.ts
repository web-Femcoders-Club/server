/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { Quiz } from './entities/quiz.entity';
import { Question } from './entities/question.entity';
import { UserQuizResult } from './entities/user-quiz-result.entity';
import { UserAchievement } from '../admin/entities/user-achievements.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, Question, UserQuizResult, UserAchievement]),
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService],
  exports: [QuizzesService],
})
export class QuizzesModule {}
