/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schema/book.schema';
import * as mongoose from 'mongoose';
import { CreateBookDTO } from './dto/CreateBookDTO';
import { UpdateBookDTO } from './dto/UpdateBookDTO';

@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name)
        private bookModel: mongoose.Model<Book>
    ) {}

    async findAll(): Promise<Book[]> {
        const books = await this.bookModel.find();
        return books;
    }

    async create(book: CreateBookDTO): Promise<Book> {
        const newBook = await this.bookModel.create(book); 
        return newBook.save();
    }

    async findById(id: string): Promise<Book> {
        const book = await this.bookModel.findById(id); 
        if(!book) {
            throw new NotFoundException('Book not found');
        }
        return book
    }

    async updateBookById(id: string, book: UpdateBookDTO): Promise<Book> {
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

    async deleteById(id: string): Promise<string> {
        const book = await this.bookModel.findByIdAndDelete(id); 
        if(!book) {
            throw new NotFoundException('Book not found');
        }
        return 'Book deleted successfully'
    }
}