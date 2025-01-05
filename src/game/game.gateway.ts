import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { forwardRef, Inject } from '@nestjs/common';

@WebSocketGateway()
export class GameGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => GameService))
    private readonly gameService: GameService,
  ) {}

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  notifyGameStart(
    gameId: string,
    players: { socketId: string }[],
    questions: any[],
  ) {
    players.forEach((player) => {
      if (typeof player.socketId === 'string') {
        this.server
          .to(player.socketId)
          .emit('game:init', { gameId, players, questions });
      } else {
        console.error(
          `Invalid socketId for player ${player}:`,
          player.socketId,
        );
      }
    });
  }

  sendQuestion(socketId: string, question: any) {
    this.server.to(socketId).emit('question:send', question);
  }

  sendWait(socketId: string) {
    this.server.to(socketId).emit('game:wait');
  }

  @SubscribeMessage('answer:submit')
  async handleAnswerSubmit(
    @MessageBody()
    data: {
      gameId: string;
      socketId: string;
      questionId: string;
      answer: string;
    },
  ) {
    await this.gameService.handleAnswerSubmit(
      data.gameId,
      data.socketId,
      data.questionId,
      data.answer,
    );
  }

  notifyGameEnd(
    gameId: string,
    players: { socketId: string }[],
    winner: { socketId: string },
  ) {
    players.forEach((player) => {
      if (typeof player.socketId === 'string') {
        this.server.to(player.socketId).emit('game:end', { gameId, winner });
      } else {
        console.error(
          `Invalid socketId for player ${player}:`,
          player.socketId,
        );
      }
    });
  }
}

// import {
//   WebSocketGateway,
//   SubscribeMessage,
//   MessageBody,
//   ConnectedSocket,
// } from '@nestjs/websockets';
// import { GameService } from './game.service';
// import { Socket } from 'socket.io';

// @WebSocketGateway()
// export class GameGateway {
//   constructor(private readonly gameService: GameService) {}

//   // @SubscribeMessage('game:init')
//   // handleGameInit(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
//   //   return this.gameService.initializeGame(data, client);
//   // }

//   // @SubscribeMessage('question:send')
//   // handleSendQuestion(
//   //   @MessageBody() data: any,
//   //   @ConnectedSocket() client: Socket,
//   // ) {
//   //   return this.gameService.sendQuestion(data, client);
//   // }

//   // @SubscribeMessage('answer:submit')
//   // handleSubmitAnswer(
//   //   @MessageBody() data: any,
//   //   @ConnectedSocket() client: Socket,
//   // ) {
//   //   return this.gameService.submitAnswer(data, client);
//   // }

//   // @SubscribeMessage('game:end')
//   // handleGameEnd(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
//   //   return this.gameService.endGame(data, client);
//   // }
// }
