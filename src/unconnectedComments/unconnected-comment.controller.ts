/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Param, Get, Delete } from '@nestjs/common';
import { UnconnectedCommentService } from './unconnected-comment.service';
import { UnconnectedComment } from './unconnected-comment.entity';

@Controller('unconnected-comments')
export class UnconnectedCommentController {
  constructor(private readonly unconnectedCommentService: UnconnectedCommentService) {}

  @Post()
  async create(@Body() commentData: Partial<UnconnectedComment>): Promise<UnconnectedComment> {
    return this.unconnectedCommentService.create(commentData);
  }

  @Get('approve/:id')
  async approve(@Param('id') id: number): Promise<UnconnectedComment> {
    return this.unconnectedCommentService.approve(id);
  }

  @Delete('reject/:id')
  async reject(@Param('id') id: number): Promise<void> {
    return this.unconnectedCommentService.reject(id);
  }

  @Get('pending')
  async findAllPending(): Promise<UnconnectedComment[]> {
    return this.unconnectedCommentService.findAllPending();
  }

  @Get('approved')
  async findAllApproved(): Promise<UnconnectedComment[]> {
    return this.unconnectedCommentService.findAllApproved();
  }
}
