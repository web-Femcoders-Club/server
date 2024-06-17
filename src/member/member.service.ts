/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member) 
    private readonly memberRepository: Repository<Member>,
  ){}

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const newMember = this.memberRepository.create(createMemberDto);
    await this.memberRepository.save(newMember);
    return newMember; 
  }

  async findAll(): Promise<Member[]> {
    return await this.memberRepository.find();
  }

  async findOne(idMember: number): Promise<Member> {
    const member = await this.memberRepository.findOneBy({idMember});
    if (!member) {
      throw new NotFoundException(`La integrante ${idMember} no existe`);
    }
    return member;
  }

  async update(idMember: number, updateMemberDto: UpdateMemberDto): Promise<Member> {
    await this.findOne(idMember);
    await this.memberRepository.update(idMember, updateMemberDto);
    const updatedMember = await this.findOne(idMember);
    return updatedMember; 
  }

  async remove(idMember: number): Promise<{ message: string }> {
    await this.findOne(idMember);
    await this.memberRepository.delete(idMember);
    return { message: `La integrante ${idMember} fue eliminada` }; 
  }
}
