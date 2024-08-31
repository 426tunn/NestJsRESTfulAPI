/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing'
import { BookService } from './book.service'
import { Book, Category } from './schema/book.schema'
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
// import { CreateBookDTO } from './dto/CreateBookDTO';
// import { User } from '../auth/schema/user.schema';

describe('BookService', () => {

         let bookService: BookService;
         let model: Model<Book>;

         const mockBook = {
            _id: '61c0ccf11d7bf83d153d7c06',
            user: '61c0ccf11d7bf83d153d7c06',
            title: 'New Book',
            description: 'Book Description',
            author: 'Author',
            price: 100,
            category: Category.FANTASY,
          };

        //  const mockUser = {
        //     _id: '61c0ccf11d7bf83d153d7c06',
        //     name: 'Ghulam',
        //     email: 'ghulam1@gmail.com',
        //   };

          const mockBookService = {
            find: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          };

          beforeEach(async() => {
            const module: TestingModule = await Test.createTestingModule({
              providers: [BookService,
                {
                    provide: getModelToken(Book.name),
                    useValue: mockBookService
                }
              ],
            }).compile();

            bookService = module.get<BookService>(BookService);
            model = module.get<Model<Book>>(getModelToken(Book.name));
    });
    

    // describe('create', () => {
    //     it('should create a new book', async () => {
    //         const newBook = {
    //             title: 'New Book',
    //             description: 'Book Description',
    //             author: 'Author',
    //             price: 100,
    //             category: Category.FANTASY,
    //         };
    
    //         jest
    //         .spyOn(model, 'create')
    //         .mockImplementationOnce(() => Promise.resolve(mockBook as Book)); // Ensure this is returning a single `Book`
          
    //       const result = await bookService.create(newBook as CreateBookDTO, mockUser as User);
          
    //       expect(result).toEqual(mockBook);
    //     });
    // });
    

    describe('find', () => {
        it('it should return an array of books', async () => {
            const query = { page: '1', keyword: 'test' };

            jest.spyOn(model, 'find').mockImplementation(
                () =>
                ({
                    limit: () => ({
                    skip: jest.fn().mockResolvedValue([mockBook]),
                    }),
                } as any),
            )

            const result = await bookService.findAll(query);

            expect(result).toEqual([mockBook]);
    })

    

    describe('findById', () => {
        it("should find and return a book  by id ", async () => { 
            jest.spyOn(model, 'findById').mockResolvedValue(mockBook);

            const result = bookService.findById(mockBook._id);

            expect(model.findById).toHaveBeenCalledWith(mockBook._id);
            expect(result).resolves.toEqual(mockBook);

        });

        it("should throw BadRequestException if invalid ID is provided", async () => {
            const id = "invalid-id";
            const isValidObjectIDMock = jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false);

            await expect(bookService.findById(id)).rejects.toThrow(BadRequestException)

            expect(isValidObjectIDMock).toHaveBeenCalledWith(id);
            isValidObjectIDMock.mockRestore();

        });

            it('should throw NotFoundException if book is not found', async () => {
                jest.spyOn(model, 'findById').mockResolvedValue(null);
                await expect(bookService.findById(mockBook._id)).rejects.toThrow(NotFoundException);

                expect(model.findById).toHaveBeenCalledWith(mockBook._id);
            });
    });

    describe('updatById', () => {
        it("should update a book by id", async () => {
            const updatedBook = {...mockBook, title: "Updated title"};
            const Book = { title: "Updated title" }

            jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatedBook)
            const result = await bookService.updateBookById(mockBook._id, Book as any)

            expect(model.findByIdAndUpdate).toHaveBeenCalledWith(mockBook._id, Book,  {
                new: true,
                runValidators: true
            });

            expect(result.title).toEqual(Book.title)

        });
        

        it('should throw NotFoundException if book is not found', async () => {
            jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(null);
            await expect(bookService.updateBookById(mockBook._id, Book as any)).rejects.toThrow(NotFoundException);

            expect(model.findByIdAndUpdate).toHaveBeenCalledWith(mockBook._id, Book as any);
        });
    })


    describe('deleteById', () => {
        const resp = {deleted: true}
        it('should delete a book by id', async () => {
            jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockBook)

            const result = await expect(bookService.deleteById(mockBook._id))

            expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockBook._id)

            expect(result).toEqual(resp)
        })
    })
})
})