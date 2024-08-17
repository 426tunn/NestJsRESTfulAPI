/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../auth/schema/user.schema';

export enum Category {
  FANTASY = 'FANTASY',
  HORROR = 'HORROR',
  ROMANCE = 'ROMANCE',
  THRILLER = 'THRILLER',
  MYSTERY = 'MYSTERY',
}
@Schema({
  timestamps: true,
})
export class Book extends Document {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  author: string;

  @Prop()
  price: number;

  @Prop()
  category: Category;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  user: User;
}

export const BookSchema = SchemaFactory.createForClass(Book);