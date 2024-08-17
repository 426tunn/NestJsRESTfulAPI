/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schema/book.schema';
import { CreateBookDTO } from './dto/CreateBookDTO';
import { UpdateBookDTO } from './dto/UpdateBookDTO';
import { Query as ExpressQuery} from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';

@Controller('books')
export class BookController {
    constructor(
     private readonly bookService: BookService
    ) {}

    @Get()
    async getAllBooks(@Query() query: ExpressQuery): Promise<Book[]> {
        return this.bookService.findAll(query);
    }

    @Post('create')
    @UseGuards(AuthGuard())
    async createBook(
        @Body()
         book: CreateBookDTO,
         @Req()
         req,
        ): Promise<Book> {
        return this.bookService.create(book, req.user);
    }

    @Get(':id')
    @UseGuards(AuthGuard())
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
