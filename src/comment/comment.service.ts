/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(commentData: Partial<Comment>): Promise<Comment> {
    const comment = this.commentRepository.create(commentData);
    return this.commentRepository.save(comment);
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

  async findAllPending(postId?: number): Promise<Comment[]> {
    const query = this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.approved = :approved', { approved: false });

    if (postId !== undefined) {
      query.andWhere('comment.postId = :postId', { postId });
    }

    return query.getMany();
  }

  async findAllApproved(postId?: number): Promise<Comment[]> {
    const query = this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.approved = :approved', { approved: true });

    if (postId !== undefined) {
      query.andWhere('comment.postId = :postId', { postId });
    }

    return query.getMany();
  }
}
