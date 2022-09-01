import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class User {

  @Prop()
  name!: string;

  @Prop()
  password!: string;

  @Prop()
  email!: string;

  @Prop({ default: 'user' })
  role?: 'string' | 'admin';
}

export const UserSchema = SchemaFactory.createForClass(User);
