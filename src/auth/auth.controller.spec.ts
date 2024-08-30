/* eslint-disable prettier/prettier */
import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";


describe('AuthController', () => {
    let authService: AuthService;
    let authController: AuthController;

    // const mockUser = {
    //     _id: '61c0ccf11d7bf83d153d7c06',
    //     name: 'Ghulam',
    //     email: 'ghulam1@gmail.com',
    //   };

    const jwtToken = "jwtToken";

      const mockAuthService = {
        login: jest.fn(),
        signup: jest.fn(),
      };

      beforeEach( async ()=> {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        authController = module.get<AuthController>(AuthController);
      })

      it("should be defined", () => {
        expect(authController).toBeDefined();
      })

      describe('signup', () => {
        const signUpDTO = {
            name: 'Ghulam',
            email: 'ghulam1@gmail.com',
            password: '1234'
        }
        it('sign up a user abd return a token', async () => {
            const result = await authController.signUp(signUpDTO);
            expect(authService.signUp).toHaveBeenCalled();
            expect(result).toEqual(jwtToken);
        })
      })


      describe('login', () => {
        const loginDto = {
            email: 'ghulam1@gmail.com',
            password: '12345678',
        }

        it('should login user and return the token', async () => {
            const result = await authController.Login(loginDto);
            expect(authService.login).toHaveBeenCalled();
            expect(result).toEqual(jwtToken);
        })
      })
})