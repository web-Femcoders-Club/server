/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnconnectedComment } from './unconnected-comment.entity';

@Injectable()
export class UnconnectedCommentService {
  constructor(
    @InjectRepository(UnconnectedComment)
    private readonly unconnectedCommentRepository: Repository<UnconnectedComment>,
  ) {}

  async create(commentData: Partial<UnconnectedComment>): Promise<UnconnectedComment> {
    const comment = this.unconnectedCommentRepository.create(commentData);
    return this.unconnectedCommentRepository.save(comment);
  }

  async approve(id: number): Promise<UnconnectedComment> {
    const comment = await this.unconnectedCommentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Comentario no encontrado');
    }
    comment.approved = true;
    return this.unconnectedCommentRepository.save(comment);
  }

  async reject(id: number): Promise<void> {
    const comment = await this.unconnectedCommentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Comentario no encontrado');
    }
    await this.unconnectedCommentRepository.remove(comment);
  }

  async findAllPending(): Promise<UnconnectedComment[]> {
    return this.unconnectedCommentRepository.find({ where: { approved: false } });
  }

  async findAllApproved(): Promise<UnconnectedComment[]> {
    return this.unconnectedCommentRepository.find({ where: { approved: true } });
  }
}
