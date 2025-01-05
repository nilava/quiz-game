import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuestionService } from '../question/question.service';
import { GameSession, GameSessionDocument } from './dto/gameSession.dto';
import { GameGateway } from './game.gateway';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(GameSession.name)
    private gameSessionModel: Model<GameSessionDocument>,
    @Inject(forwardRef(() => GameGateway))
    private readonly gameGateway: GameGateway,
    private readonly questionService: QuestionService,
  ) {}

  async startGame(user: {
    userId: string;
    socketId: string;
    progress: number;
  }): Promise<{ message: string; roomId?: string }> {
    // Check if the user is already in a room with status 'waiting'
    const existingRoomForUser = await this.gameSessionModel.findOne({
      status: 'waiting',
      'players.userId': user.userId, // Check if the user is already part of a waiting room
    });

    if (existingRoomForUser) {
      // Update the socketId of the existing user in the room
      const playerIndex = existingRoomForUser.players.findIndex(
        (player) => player.userId === user.userId,
      );

      if (playerIndex !== -1) {
        existingRoomForUser.players[playerIndex].socketId = user.socketId; // Update socketId
        await existingRoomForUser.save(); // Save the updated room
      }

      return {
        message:
          'You are already in a waiting room. Waiting for another player...',
        roomId: existingRoomForUser.gameId,
      };
    }

    // Check for an existing waiting room where the user is not already a player
    const existingSession = await this.gameSessionModel.findOne({
      status: 'waiting',
      'players.userId': { $ne: user.userId }, // Ensure current userId is not in players
    });

    if (existingSession) {
      const questions = await this.questionService.getRandomQuestions();
      existingSession.players.push(user);
      existingSession.status = 'active';
      existingSession.questions = questions;
      existingSession.scores = existingSession.players.map(() => 0);
      await existingSession.save();

      this.gameGateway.notifyGameStart(
        existingSession.gameId,
        existingSession.players,
        existingSession.questions,
      );

      return { message: 'Game started!', roomId: existingSession.gameId };
    }

    // Create a new waiting room if no suitable room exists
    const gameId = this.generateGameId();

    const newSession = new this.gameSessionModel({
      gameId,
      players: [user],
      status: 'waiting',
    });
    await newSession.save();

    return { message: 'Waiting for another player...', roomId: gameId };
  }

  async handleAnswerSubmit(
    gameId: string,
    socketId: string,
    questionId: string,
    answer: string,
  ) {
    const session = await this.gameSessionModel.findOne({ gameId });
    if (!session) {
      console.error('Game session not found:', gameId);
      return;
    }

    // Find the current question
    const currentIndex = session.questions.findIndex(
      (q) => q._id.toString() === questionId,
    );
    console.log('Current question index:', currentIndex);

    if (currentIndex === -1) {
      console.error('Question not found for questionId:', questionId);
      return;
    }

    const question = session.questions[currentIndex];
    if (question && question.correctAnswer === answer) {
      const playerIndex = session.players.findIndex(
        (p) => p.socketId === socketId,
      );
      if (playerIndex !== -1) {
        session.scores[playerIndex] += 1;
      }
    }

    // Update player's progress
    const playerIndex = session.players.findIndex(
      (p) => p.socketId === socketId,
    );
    if (playerIndex !== -1) {
      session.players[playerIndex].progress =
        (session.players[playerIndex].progress || 0) + 1;
    }

    // Check if the player has completed all questions
    const playerProgress = session.players[playerIndex]?.progress || 0;
    if (playerProgress >= session.questions.length) {
      console.log(`Player ${socketId} has completed all questions.`);
      this.gameGateway.sendWait(socketId);
    }

    // Check if all players have completed
    const allPlayersCompleted = session.players.every(
      (player) => (player.progress || 0) >= session.questions.length,
    );

    if (allPlayersCompleted) {
      console.log('All players have completed. Ending game.');
      this.handleGameEnd(session);
      return;
    }

    // Send the next question if the player hasn't finished
    if (playerProgress < session.questions.length) {
      const nextQuestion = session.questions[playerProgress];
      console.log('Next question:', nextQuestion);
      this.gameGateway.sendQuestion(socketId, nextQuestion);
    }

    await session.save();
  }

  async handleGameEnd(session: GameSessionDocument) {
    const winnerIndex = session.scores.indexOf(Math.max(...session.scores));
    const winner = session.players[winnerIndex];

    this.gameGateway.notifyGameEnd(session.gameId, session.players, winner);
    session.status = 'completed';
    session.winnerId = winner.userId;
    await session.save();
  }

  generateGameId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
