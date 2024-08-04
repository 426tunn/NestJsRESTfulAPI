/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
}

export const BookSchema = SchemaFactory.createForClass(Book);