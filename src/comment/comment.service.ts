import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { EmailService } from '../comment/email.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly emailService: EmailService,
  ) {}

  async create(commentData: Partial<Comment>): Promise<Comment> {
    const comment = this.commentRepository.create(commentData);
    await this.commentRepository.save(comment);

    try {
      await this.emailService.sendMail(
        'admin@example.com',
        'Nuevo comentario pendiente de aprobación',
        `Nuevo comentario en el post ${comment.postId}:\n\n${comment.content}\n\nHaz clic aquí para aprobar: http://localhost:3000/comments/approve/${comment.id}\n\nHaz clic aquí para rechazar: http://localhost:3000/comments/reject/${comment.id}`,
      );

      await this.emailService.sendMail(
        comment.userEmail,
        'Tu comentario está pendiente de aprobación',
        `Gracias por tu comentario en el post ${comment.postId}. Tu comentario:\n\n${comment.content}\n\nEstá pendiente de aprobación.`,
      );
    } catch (error) {
      // Log error or handle accordingly
    }

    return comment;
  }

  async approve(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Comentario no encontrado');
    }
    comment.approved = true;
    return this.commentRepository.save(comment);
  }

  async reject(id: number): Promise<void> {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Comentario no encontrado');
    }
    await this.commentRepository.remove(comment);
  }

  async findAllPending(): Promise<Comment[]> {
    return this.commentRepository.find({ where: { approved: false } });
  }

  async findAllApproved(): Promise<Comment[]> {
    return this.commentRepository.find({ where: { approved: true } });
  }
}
