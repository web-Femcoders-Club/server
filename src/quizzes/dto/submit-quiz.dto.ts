/* eslint-disable prettier/prettier */
import { IsArray, IsNumber } from 'class-validator';

export class SubmitQuizDto {
  @IsNumber()
  quizId: number;

  @IsArray()
  answers: number[]; // índice de la respuesta seleccionada para cada pregunta
}
