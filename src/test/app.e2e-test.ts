/* eslint-disable prettier/prettier */
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import mongoose from "mongoose";
import { AppModule } from "src/app.module";


describe('Auth & Book e2e tests', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    beforeAll(async () => {
        await mongoose.connect(process.env.DB_URI);
        await mongoose.connection.db.dropDatabase();
    });

    afterAll(() => mongoose.disconnect());

    const user = {
        name: 'Ghulam',
        email: 'ghulam@gmail.com',
        password: '12345678',
    };

    const book = {
        user: '61c0ccf11d7bf83d153d7c06',
        title: 'New Book',
        description: 'Book Description',
        author: 'Author',
        price: 100,
        category: 'FANTASY',
    };

    let jwtToken = '';
    let bookCreated;

    describe('Auth', () => {
        it('(POST) should signup a new user', () => {
            return request(app.getHttpServer())
                .post('/auth/signup')
                .send(user)
                .expect(201)
                .then((res) => {
                    expect(res.body.token).toBeDefined();
                });
        });

        it('(GET) should login a user', () => {
            return request(app.getHttpServer())
                .get('/auth/login')
                .send({ email: user.email, password: user.password })
                .expect(200)
                .then((res) => {
                    expect(res.body.token).toBeDefined();
                    jwtToken = res.body.token; // Capture the token correctly here
                });
        });
    });

    describe('Book', () => {
        it('(POST) should create a new book', () => {
            return request(app.getHttpServer())
                .post('/books')
                .set('Authorization', `Bearer ${jwtToken}`) 
                .send(book)
                .expect(201)
                .then((res) => {
                    expect(res.body).toHaveProperty('title', 'New Book');
                    bookCreated = res.body;
                });
        });

        it('(GET) should get all books', () => {
            return request(app.getHttpServer())
                .get('/books')
                .expect(200)
                .then((res) => {
                    expect(res.body).toBeDefined();
                    expect(res.body.length).toBeGreaterThan(0);
                });
        });

        it('(GET) should get a single book by id', () => {
            return request(app.getHttpServer())
                .get(`/books/${bookCreated._id}`)
                .expect(200)
                .then((res) => {
                    expect(res.body).toBeDefined();
                    expect(res.body._id).toEqual(bookCreated._id);
                });
        });

        it('(PUT) should edit a book by id', () => {
            return request(app.getHttpServer())
            .put(`/books/${bookCreated._id}`)
            .set('Authorization', `Bearer ${jwtToken}`) 
            .send({ title: 'Edited Book' })
            .expect(200)
            .then((res) => {
                expect(res.body).toBeDefined();
                expect(res.body.title).toEqual('Edited Book');
            });
        });

        it('(DELETE) should delete a book by id', () => {
            return request(app.getHttpServer())
                .delete(`/books/${bookCreated._id}`)
                .set('Authorization', `Bearer ${jwtToken}`) 
                .expect(200)
                .then((res) => {
                    expect(res.body).toBeDefined();
                    expect(res.body.deleted).toEqual(true);
                });
        });
    });
});
