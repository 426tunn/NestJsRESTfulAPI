/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schema/book.schema';
import * as mongoose from 'mongoose';
import { CreateBookDTO } from './dto/CreateBookDTO';
import { UpdateBookDTO } from './dto/UpdateBookDTO';
import { Query } from 'express-serve-static-core';
import { User } from '../auth/schema/user.schema';

@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name)
        private bookModel: mongoose.Model<Book>
    ) {}

    async findAll( query: Query ): Promise<Book[]> {

        const resultPerPage = 2;
        const currentPage = Number(query.page) || 1;
        const skip = (currentPage - 1) * resultPerPage

        const keyword = query.keyword ? {
            title: {
                $regex: query.keyword,
                $options: 'i'
            }
        } : {};
     const books = await this.bookModel
     .find({...keyword})
     .limit(resultPerPage)
     .skip(skip);
        return books;
    }

    async create(book: CreateBookDTO, user: User): Promise<Book> {
        const data = Object.assign(book, { user: user._id });
        const newBook = await this.bookModel.create(data) as Book; 
        return newBook as Book;
    }

    async findById(id: string): Promise<Book> {

        const isValidId = mongoose.Types.ObjectId.isValid(id);

        if(!isValidId) {
            throw new BadRequestException('Invalid id used');
        }

        const book = await this.bookModel.findById(id); 

        if(!book) {
            throw new NotFoundException('Book not found');
        }

        return book
    }

    async updateBookById(id: string, book: UpdateBookDTO): Promise<Book> {

        const isValidId = mongoose.Types.ObjectId.isValid(id);

        if(!isValidId) {
            throw new BadRequestException('Invalid id used');
        }

        const Updatedbook = await this.bookModel.findByIdAndUpdate(id, book, {
            new: true,
            runValidators: true
        }
        ); 
        if(!Updatedbook) {
            throw new NotFoundException('Error while updating book');
        }
        return Updatedbook
    }

    async deleteById(id: string): Promise<{deleted: boolean}> {

        const isValidId = mongoose.Types.ObjectId.isValid(id);

        if(!isValidId) {
            throw new BadRequestException('Invalid id used');
        }

        const book = await this.bookModel.findByIdAndDelete(id); 
        if(!book) {
            throw new NotFoundException('Book not found');
        }
        return {deleted: true}
    }
}