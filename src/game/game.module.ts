import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GameSession, GameSessionSchema } from './dto/gameSession.dto';
import { QuestionModule } from 'src/question/question.module';
import { ConfigService } from 'src/config/config.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GameSession.name, schema: GameSessionSchema },
    ]),
    QuestionModule,
  ],
  controllers: [GameController],
  providers: [GameGateway, GameService, ConfigService],
})
export class GameModule {}
