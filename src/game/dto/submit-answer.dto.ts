import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class SubmitAnswerDto {
  @IsNotEmpty()
  @IsString()
  gameId: string; // Game session identifier

  @IsNotEmpty()
  @IsString()
  playerId: string; // Player's unique identifier

  @IsNotEmpty()
  @IsString()
  questionId: string; // Identifier of the question being answered

  @IsNotEmpty()
  @IsString()
  selectedAnswer: string; // Answer selected by the player

  @IsNotEmpty()
  @IsNumber()
  timeTaken: number; // Time taken to submit the answer (in seconds)
}
