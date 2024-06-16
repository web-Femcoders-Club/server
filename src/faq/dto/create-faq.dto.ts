/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class CreateFaqDto {
  @ApiProperty({description:'Frequent question', example: 'Where do we originate from?'})
    faqQuestion: string = ''; 
  @ApiProperty({description:'Answer to the frequent question', example:'We come from Barcelona...'})
    faqAnswer: string = '';  
  
    constructor(faqQuestion: string, faqAnswer: string) {
      this.faqQuestion = faqQuestion;
      this.faqAnswer = faqAnswer;
    }
  }
  