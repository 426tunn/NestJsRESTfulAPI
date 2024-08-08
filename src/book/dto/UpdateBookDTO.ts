/* eslint-disable prettier/prettier */
import { Category } from "../schema/book.schema";
import { IsString, IsEnum, IsOptional } from 'class-validator';

export class UpdateBookDTO {
  @IsOptional()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly author: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsOptional()
  @IsEnum(Category)
  readonly category: Category;
}