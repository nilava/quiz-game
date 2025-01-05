import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { forwardRef, Inject } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '../config/config.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => GameService))
    private readonly gameService: GameService,
    private readonly configService: ConfigService,
  ) {}

  private activeConnections = new Map<string, Set<string>>(); // Map<userId, Set<socketIds>>

  async handleConnection(client: Socket) {
    try {
      const jwtSecret = this.configService.getJwtSecret();

      const token = client.handshake.auth.token?.split(' ')[1];
      const decoded = jwt.verify(token, jwtSecret) as any;
      const userId = decoded.userId;

      // Add the user's socket ID to the active connections
      if (!this.activeConnections.has(userId)) {
        this.activeConnections.set(userId, new Set());
      }

      const userSockets = this.activeConnections.get(userId);
      userSockets?.add(client.id);

      console.log(`User connected: ${userId}, Socket: ${client.id}`);
      console.log('Active connections:', this.activeConnections);

      // If multiple connections detected for the same user, take action (e.g., notify or disconnect)
      if (userSockets && userSockets.size > 1) {
        console.warn(`Multiple sessions detected for user: ${userId}`);
        client.emit('multiple-sessions', {
          message: 'You have connected from another tab or device.',
        });

        //  Disconnect older sessions
        userSockets.forEach((socketId) => {
          if (socketId !== client.id) {
            this.server.sockets.sockets.get(socketId)?.disconnect();
            userSockets.delete(socketId);
          }
        });
      }
    } catch (err) {
      console.error('Connection error:', err.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    let disconnectedUserId: string | null = null;

    // Remove the socket ID from the active connections
    this.activeConnections.forEach((socketIds, userId) => {
      if (socketIds.has(client.id)) {
        socketIds.delete(client.id);
        disconnectedUserId = userId;

        // If no more sockets are connected for the user, remove the user from the map
        if (socketIds.size === 0) {
          this.activeConnections.delete(userId);
        }
      }
    });

    console.log(
      `Socket disconnected: ${client.id}, User: ${disconnectedUserId}`,
    );
    console.log('Active connections:', this.activeConnections);
  }

  // Utility function to get active sessions for a user
  getActiveSessions(userId: string): Set<string> | undefined {
    return this.activeConnections.get(userId);
  }

  // handleConnection(client: Socket) {
  //   console.log('Client connected:', client.id);
  // }

  // handleDisconnect(client: Socket) {
  //   console.log('Client disconnected:', client.id);
  // }

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
