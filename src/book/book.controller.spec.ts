/* eslint-disable prettier/prettier */
import { PassportModule } from "@nestjs/passport";
import { BookController } from "./book.controller";
import { BookService } from "./book.service";
import { Category } from "./schema/book.schema";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateBookDTO } from "./dto/CreateBookDTO";
import { User } from "src/auth/schema/user.schema";
import { UpdateBookDTO } from "./dto/UpdateBookDTO";



describe('BookController', () => {
    let bookController: BookController;
    let bookService: BookService;

    const mockBook = {
        _id: '61c0ccf11d7bf83d153d7c06',
        user: '61c0ccf11d7bf83d153d7c06',
        title: 'New Book',
        description: 'Book Description',
        author: 'Author',
        price: 100,
        category: Category.FANTASY,
      };

    const mockUser = {
        _id: '61c0ccf11d7bf83d153d7c06',
        name: 'Ghulam',
        email: 'ghulam1@gmail.com',
      };

    const mockBookService = {
        findAll: jest.fn().mockResolvedValue([mockBook]),
        create: jest.fn(),
        findById: jest.fn().mockResolvedValueOnce(mockBook._id),
        updateBookById: jest.fn(),
        deleteById: jest.fn().mockResolvedValueOnce({deleted: true}),
    };

    beforeEach( async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports:[ PassportModule.register({ defaultStrategy: 'jwt' })],
            controllers: [BookController],
            providers: [
                {
                    provide: BookService,
                    useValue: mockBookService
                }
            ]
        }).compile();

        bookService = module.get<BookService>(BookService);
        bookController = module.get<BookController>(BookController);
    })

    it('should be defined', () => {
        expect(bookController).toBeDefined();
    })

    describe('findAll', () => {
        it('should return an array of books', async () => {
            const result = await bookController.getAllBooks({
                page: '1',
                keyword: 'test'
            });
            expect(bookService.findAll).toHaveBeenCalled();
            expect(result).toEqual([mockBook]);
        })
    })

    describe('create', () => {
        it('should create a book', async () => {
            const newBook = {
                title: 'New Book',
                description: 'Book Description',
                author: 'Author',
                price: 100,
                category: Category.FANTASY,
              };

              mockBookService.create = jest.fn().mockResolvedValueOnce(mockBook);

            const result = await bookController.createBook( newBook as CreateBookDTO, mockUser as User);
            expect(bookService.create).toHaveBeenCalled();
            expect(result).toEqual(mockBook);
        })
    })

    describe('findBookById', () => {
        it('should get a book by Id', async () => {
            const result = await bookController.findBookById(mockBook._id);

            expect(bookService.findById).toHaveBeenCalled();
            expect(result).toEqual(mockBook);
        })
    })

    describe('updateBook', () => {
        it('should update a book by Id', async () => {
            const updatedBook = {...mockBook, title: "Updated title"};
            const book = {title: "Updated title"};

            mockBookService.updateBookById = jest.fn().mockResolvedValueOnce(updatedBook);

            const result = await bookController.updateBook(mockBook._id, book as UpdateBookDTO);

            expect(bookService.updateBookById).toHaveBeenCalled();
            expect(result).toEqual(updatedBook);
        })
    })

    describe('deleteBook', () => {
        it('should delete a book by Id', async () => {

            const result = await bookController.deleteBook(mockBook._id);

            expect(bookService.updateBookById).toHaveBeenCalled();
            expect(result).toEqual({ deleted: true});
        })
    })
})