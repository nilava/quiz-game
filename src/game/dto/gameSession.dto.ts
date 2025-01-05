import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class GameSession {
  @Prop({ required: true })
  gameId: string;

  @Prop({
    type: [
      {
        userId: { type: String },
        socketId: { type: String },
        progress: { type: Number, default: 0 },
      },
    ],
    required: true,
  })
  players: { userId: string; socketId: string; progress: number }[];

  @Prop({
    type: [
      {
        id: Number,
        text: String,
        options: [String],
        correctAnswer: String,
      },
    ],
  })
  questions: {
    _id: number;
    text: string;
    options: string[];
    correctAnswer: string;
  }[];

  @Prop({ type: [Number] })
  scores: number[];

  @Prop({ type: String })
  winnerId: string;

  @Prop({ required: true, enum: ['waiting', 'active', 'completed'] })
  status: string;
}

export type GameSessionDocument = GameSession & Document;
export const GameSessionSchema = SchemaFactory.createForClass(GameSession);
