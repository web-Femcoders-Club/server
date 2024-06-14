import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Member')
@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  @ApiOperation({ summary: 'Create a member' })
  @ApiResponse({ status: 201, description: 'A Member has been successfully created' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ status: 500, description: 'Internal Server Error' })
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.memberService.create(createMemberDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all members' })
  @ApiResponse({ status: 200, description: 'List of members' })
  @ApiNotFoundResponse({ status: 404, description: 'No members found' })
  findAll() {
    return this.memberService.findAll();
  }

  @Get(':idMember')
  @ApiOperation({ summary: 'Get a member by id' })
  @ApiResponse({ status: 200, description: 'Member details' })
  @ApiNotFoundResponse({ status: 404, description: 'Member not found' })
  findOne(@Param('idMember') idMember: number) {
    return this.memberService.findOne(idMember);
  }
  @Put(':idMember')
  @ApiOperation({ summary: 'Update a member by id' })
  @ApiResponse({ status: 200, description: 'Member updated' })
  @ApiNotFoundResponse({ status: 404, description: 'Member not found' })
  update(@Param('idMember') idMember: number, @Body() updateMemberDto: UpdateMemberDto) {
    return this.memberService.update(idMember, updateMemberDto);
  }


  @Delete(':id')
  @ApiOperation({ summary: 'Delete a member by id' })
  @ApiResponse({ status: 200, description: 'Member deleted' })
  @ApiNotFoundResponse({ status: 404, description: 'Member not found' })
  remove(@Param('id') id: number) {
    return this.memberService.remove(id);
  }
}
