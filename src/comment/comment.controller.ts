import { Controller, Post, Body, Param, Get, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(@Body() commentData: Partial<Comment>): Promise<Comment> {
    return this.commentService.create(commentData);
  }

  @Get('approve/:id')
  async approve(@Param('id') id: number): Promise<Comment> {
    return this.commentService.approve(id);
  }

  @Delete('reject/:id')
  async reject(@Param('id') id: number): Promise<void> {
    return this.commentService.reject(id);
  }

  @Get('pending')
  async findAllPending(): Promise<Comment[]> {
    return this.commentService.findAllPending();
  }

  @Get('approved')
  async findAllApproved(): Promise<Comment[]> {
    return this.commentService.findAllApproved();
  }
}
