/* eslint-disable prettier/prettier */
import { User } from "../../auth/schema/user.schema";
import { Category } from "../schema/book.schema";
import { IsString, IsEnum, IsNotEmpty, IsEmpty, IsNumber } from 'class-validator';

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
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @IsEnum(Category, {message: "Invalid category"})
  readonly category: Category;

  @IsEmpty({message: "You can not pass user id"})
  readonly user: User
}