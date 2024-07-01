/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Member')
@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.memberService.create(createMemberDto);
  }

  @Get()
  findAll() {
    return this.memberService.findAll();
  }

  @Get(':idMember')
  findOne(@Param('idMember') idMember: number) {
    return this.memberService.findOne(idMember);
  }

  @Put(':idMember')
  update(@Param('idMember') idMember: number, @Body() updateMemberDto: UpdateMemberDto) {
    return this.memberService.update(idMember, updateMemberDto);
  }

  @Delete(':idMember')
  remove(@Param('idMember') idMember: number) {
    return this.memberService.remove(idMember);
  }
}




