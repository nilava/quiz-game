import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Question {
  @Prop({ required: true })
  text: string;

  @Prop({ type: [String], required: true })
  options: string[];

  @Prop({ required: true })
  correctAnswer: string;
}

export type QuestionDocument = Question & Document;
export const QuestionSchema = SchemaFactory.createForClass(Question);
