import { IsNotEmpty, IsArray, IsString } from 'class-validator';

export class StartGameDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  playerIds: string[]; // List of player IDs participating in the game

  @IsNotEmpty()
  @IsString()
  gameId: string; // Unique game session identifier
}
