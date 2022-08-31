import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  @Exclude()
  password: string;

  @Prop()
  email: string;

  @Prop({ default: 'user', select: false })
  @Exclude()
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
