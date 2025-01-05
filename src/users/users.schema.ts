import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  _id: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: Date.now })
  createdAt?: Date;
}

export type UserDocument = User;

export const UserSchema = SchemaFactory.createForClass(User);
