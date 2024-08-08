/* eslint-disable prettier/prettier */
import { Category } from "../schema/book.schema";
import { IsString, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateBookDTO {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly author: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  @IsEnum(Category, {message: "Invalid category"})
  readonly category: Category;
}