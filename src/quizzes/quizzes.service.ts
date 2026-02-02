/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from './entities/quiz.entity';
import { Question } from './entities/question.entity';
import { UserQuizResult } from './entities/user-quiz-result.entity';
import { UserAchievement } from '../admin/entities/user-achievements.entity';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

const ACHIEVEMENT_FULLSTACK_BASIC = 6;
const QUIZ_HTML_ACHIEVEMENT = 3;
const QUIZ_CSS_ACHIEVEMENT = 4;
const QUIZ_JS_ACHIEVEMENT = 5;

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(UserQuizResult)
    private readonly userQuizResultRepository: Repository<UserQuizResult>,
    @InjectRepository(UserAchievement)
    private readonly userAchievementRepository: Repository<UserAchievement>,
  ) {}

  async getAllQuizzes(): Promise<Quiz[]> {
    return await this.quizRepository.find({
      relations: ['achievement'],
    });
  }

  async getQuizById(id: number): Promise<Quiz> {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: ['questions', 'achievement'],
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz con ID ${id} no encontrado`);
    }

    return quiz;
  }

  async getQuizForUser(quizId: number, userId: number) {
    const quiz = await this.getQuizById(quizId);

    const existingResult = await this.userQuizResultRepository.findOne({
      where: { userId, quizId },
    });

    const questionsWithoutAnswers = quiz.questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
    }));

    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      questions: questionsWithoutAnswers,
      alreadyCompleted: !!existingResult,
      previousScore: existingResult?.score || null,
    };
  }

  async submitQuiz(userId: number, submitQuizDto: SubmitQuizDto) {
    const { quizId, answers } = submitQuizDto;

    const quiz = await this.getQuizById(quizId);

    if (answers.length !== quiz.questions.length) {
      throw new BadRequestException('El número de respuestas no coincide con las preguntas');
    }

    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (question.correctAnswer === answers[index]) {
        correctAnswers++;
      }
    });

    const existingResult = await this.userQuizResultRepository.findOne({
      where: { userId, quizId },
    });

    if (existingResult) {
      existingResult.score = correctAnswers;
      existingResult.totalQuestions = quiz.questions.length;
      existingResult.completedAt = new Date();
      await this.userQuizResultRepository.save(existingResult);
    } else {
      const newResult = this.userQuizResultRepository.create({
        userId,
        quizId,
        completed: true,
        score: correctAnswers,
        totalQuestions: quiz.questions.length,
      });
      await this.userQuizResultRepository.save(newResult);
    }

    await this.assignAchievementIfNotExists(userId, quiz.achievementId);
    await this.checkAndAssignFullStackAchievement(userId);

    return {
      score: correctAnswers,
      totalQuestions: quiz.questions.length,
      passed: true,
      achievementUnlocked: quiz.achievement?.title || null,
    };
  }

  async getUserQuizResults(userId: number) {
    return await this.userQuizResultRepository.find({
      where: { userId },
      relations: ['quiz'],
    });
  }

  /**
   * Endpoint simplificado para el frontend existente.
   * Solo registra que el usuario completó un quiz y asigna el logro.
   */
  async completeQuizByType(userId: number, quizType: 'html' | 'css' | 'javascript') {
    const achievementMap: Record<string, number> = {
      html: QUIZ_HTML_ACHIEVEMENT,
      css: QUIZ_CSS_ACHIEVEMENT,
      javascript: QUIZ_JS_ACHIEVEMENT,
    };

    const achievementId = achievementMap[quizType.toLowerCase()];
    if (!achievementId) {
      throw new BadRequestException(`Tipo de quiz inválido: ${quizType}`);
    }

    const wasNew = await this.assignAchievementIfNotExists(userId, achievementId);
    await this.checkAndAssignFullStackAchievement(userId);

    const achievementTitles: Record<string, string> = {
      html: 'Quiz HTML Completo',
      css: 'Quiz CSS Completado',
      javascript: 'Quiz JavaScript Aprobado',
    };

    return {
      success: true,
      quizType,
      achievementUnlocked: wasNew ? achievementTitles[quizType.toLowerCase()] : null,
      message: wasNew
        ? `¡Felicidades! Has desbloqueado el logro "${achievementTitles[quizType.toLowerCase()]}"`
        : 'Quiz completado (ya tenías este logro)',
    };
  }

  private async assignAchievementIfNotExists(userId: number, achievementId: number): Promise<boolean> {
    const existing = await this.userAchievementRepository.findOne({
      where: { userId, achievementId },
    });

    if (!existing) {
      const userAchievement = this.userAchievementRepository.create({
        userId,
        achievementId,
      });
      await this.userAchievementRepository.save(userAchievement);
      return true;
    }
    return false;
  }

  private async checkAndAssignFullStackAchievement(userId: number): Promise<void> {
    const requiredAchievements = [QUIZ_HTML_ACHIEVEMENT, QUIZ_CSS_ACHIEVEMENT, QUIZ_JS_ACHIEVEMENT];

    const userAchievements = await this.userAchievementRepository.find({
      where: { userId },
    });

    const userAchievementIds = userAchievements.map((ua) => ua.achievementId);
    const hasAllBasicQuizzes = requiredAchievements.every((id) => userAchievementIds.includes(id));

    if (hasAllBasicQuizzes) {
      await this.assignAchievementIfNotExists(userId, ACHIEVEMENT_FULLSTACK_BASIC);
    }
  }
}
