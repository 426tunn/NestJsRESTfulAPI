/* eslint-disable prettier/prettier */
import mongoose, { Model } from "mongoose";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "./schema/user.schema";
import * as bcrypt from 'bcryptjs';
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { ConflictException, UnauthorizedException } from "@nestjs/common";


describe('AuthService', () => {
    let authService: AuthService;
    let model: Model<User>;
    let jwtService: JwtService;

    const mockUser = {
        _id: '61c0ccf11d7bf83d153d7c06',
        name: 'Ghulam',
        email: 'ghulam1@gmail.com',
    }

    const token = "jwtToken";

    const mockAuthService = {
        create: jest.fn(),
        findall: jest.fn(),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                 JwtService,
                {
                    provide: getModelToken(User.name),
                    useValue: mockAuthService
                },
                ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        model = module.get<Model<User>>(getModelToken(User.name));
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    })

    describe('signup', () => {
        const signUpDTO = {
            name: 'Ghulam',
            email: 'ghulam1@gmail.com',
            password: '1234'
        };
        it('should create a new user', async () => {
            jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
        
            const mockUserDocument = Object.assign(mockUser, {
                _id: new mongoose.Types.ObjectId().toString(),
                save: jest.fn(),
                populate: jest.fn().mockResolvedValue(mockUser),
            });
        
            jest.spyOn(model, 'create').mockImplementationOnce(() => {
                return Promise.resolve(mockUserDocument as any); // Cast as any to match the expected type
            });
        
            jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');
        
            const result = await authService.signUp(signUpDTO);
        
            expect(model.create).toHaveBeenCalledWith(signUpDTO);
            expect(result).toEqual({ token: 'jwtToken' });
        });

        it('should throw duplicate email entered', async () => {
            jest
              .spyOn(model, 'create')
              .mockImplementationOnce(() => Promise.reject({ code: 11000 }));
      
            await expect(authService.signUp(signUpDTO)).rejects.toThrow(
              ConflictException,
            );
          });
        
    })


    describe('login', () => {
        const loginDto = {
            email: 'ghulam1@gmail.com',
            password: '12345678',
          };

          it('should login user and return the token', async () => {
            jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);
      
            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
            jest.spyOn(jwtService, 'sign').mockReturnValue(token);
      
            const result = await authService.login(loginDto);
      
            expect(result).toEqual({ token });
          });
      
          it('should throw invalid email error', async () => {
            jest.spyOn(model, 'findOne').mockResolvedValueOnce(null);
      
            expect(authService.login(loginDto)).rejects.toThrow(
              UnauthorizedException,
            );
          });

          it('should throw invalid password error', async () => {
            jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);
            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);
      
            expect(authService.login(loginDto)).rejects.toThrow(
              UnauthorizedException,
            );
          });
    })
    
    })
