import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GameService } from './game.service';

@Controller('game')
@UseGuards(AuthGuard('jwt'))
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('start')
  async startGame(
    @Request() req,
    @Body() body: { userId: string; socketId: string },
  ) {
    const user = {
      userId: body.userId,
      socketId: body.socketId,
      progress: 0,
    };
    return this.gameService.startGame(user);
  }
}
