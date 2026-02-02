/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Quizzes')
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get()
  async getAllQuizzes() {
    return await this.quizzesService.getAllQuizzes();
  }

  @Get(':id/user/:userId')
  async getQuiz(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return await this.quizzesService.getQuizForUser(id, userId);
  }

  @Post('submit/:userId')
  async submitQuiz(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() submitQuizDto: SubmitQuizDto,
  ) {
    return await this.quizzesService.submitQuiz(userId, submitQuizDto);
  }

  @Get('user/:userId/results')
  async getUserResults(@Param('userId', ParseIntPipe) userId: number) {
    return await this.quizzesService.getUserQuizResults(userId);
  }

  /**
   * Endpoint simple para el frontend existente.
   * POST /quizzes/complete/:userId
   * Body: { quizType: "html" | "css" | "javascript" }
   */
  @Post('complete/:userId')
  async completeQuiz(
    @Param('userId', ParseIntPipe) userId: number,
    @Body('quizType') quizType: 'html' | 'css' | 'javascript',
  ) {
    return await this.quizzesService.completeQuizByType(userId, quizType);
  }
}
