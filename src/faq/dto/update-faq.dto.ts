/* eslint-disable prettier/prettier */
export class UpdateFaqDto {
    faqQuestion: string = '';
    faqAnswer: string = '';  
  
    constructor(faqQuestion: string, faqAnswer: string) {
      this.faqQuestion = faqQuestion;
      this.faqAnswer = faqAnswer;
    }
  }
  