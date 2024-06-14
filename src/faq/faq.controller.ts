import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse } from '@nestjs/swagger';

@ApiTags('FAQ')
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post()
  @ApiOperation({ summary: 'Create an FAQ' })
  @ApiResponse({ status: 201, description: 'A FAQ has been successfully created' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ status: 500, description: 'Internal Server Error' })
  create(@Body() createFaqDto: CreateFaqDto) {
    return this.faqService.create(createFaqDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all FAQs' })
  @ApiResponse({ status: 200, description: 'List of FAQs' })
  @ApiNotFoundResponse({ status: 404, description: 'No FAQs found' })
  findAll() {
    return this.faqService.findAll();
  }

  @Get(':idFaq')
  @ApiOperation({ summary: 'Get an FAQ by id' })
  @ApiResponse({ status: 200, description: 'FAQ details' })
  @ApiNotFoundResponse({ status: 404, description: 'FAQ not found' })
  findOne(@Param('idFaq') idFaq: number) {
    return this.faqService.findOne(idFaq);
  }

  @Put(':idFaq')
  @ApiOperation({ summary: 'Update an FAQ by id' })
  @ApiResponse({ status: 200, description: 'FAQ updated' })
  @ApiNotFoundResponse({ status: 404, description: 'FAQ not found' })
  update(@Param('idFaq') idFaq: number, @Body() updateFaqDto: UpdateFaqDto) {
    return this.faqService.update(idFaq, updateFaqDto);
  }

  @Delete(':idFaq')
  @ApiOperation({ summary: 'Delete an FAQ by id' })
  @ApiResponse({ status: 200, description: 'FAQ deleted' })
  @ApiNotFoundResponse({ status: 404, description: 'FAQ not found' })
  remove(@Param('idFaq') idFaq: number) {
    return this.faqService.remove(idFaq);
  }
}
