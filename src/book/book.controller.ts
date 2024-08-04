/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schema/book.schema';
import { CreateBookDTO } from './dto/CreateBookDTO';
import { UpdateBookDTO } from './dto/UpdateBookDTO';

@Controller('books')
export class BookController {
    constructor(
     private readonly bookService: BookService
    ) {}

    @Get()
    async getAllBooks(): Promise<Book[]> {
        return this.bookService.findAll();
    }

    @Post('create')
    async createBook(
        @Body()
         book: CreateBookDTO
        ): Promise<Book> {
        return this.bookService.create(book);
    }

    @Get(':id')
    async findBookById(
        @Param('id')
        id: string
     ): Promise<Book> {
        return this.bookService.findById(id);
    }

    @Put(':id')
    async updateBook(
        @Param('id')
        id: string,
        @Body()
        book: UpdateBookDTO
     ): Promise<Book> {
        return this.bookService.updateBookById(id, book);
    }

    @Delete(':id')
    async deleteBook(
        @Param('id')
        id: string
     ): Promise<string> {
        return this.bookService.deleteById(id);
    }
}
