/* eslint-disable prettier/prettier */
import { Category } from "../schema/book.schema";
import { IsString, IsEnum } from 'class-validator';

export class CreateBookDTO {
  @IsString()
  readonly title: string;

  @IsString()
  readonly author: string;

  @IsString()
  readonly description: string;

  @IsEnum(Category)
  readonly category: Category;
}