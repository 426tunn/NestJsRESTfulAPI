/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDTO } from './dto/signupDTO';
import { LoginDTO } from './dto/loginDTO';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private UserModel: Model<User>,
        private jwtService: JwtService
    ){}


    async signUp(signUpDTO: SignUpDTO): Promise<{token : string}> {
        const { name, email, password } = signUpDTO;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.UserModel.create({
            name,
            email,
            password: hashedPassword
        });

        const token = await this.jwtService.sign({ id: user._id });
        return { token };
    }

    async login (loginDTO: LoginDTO): Promise<{token: string}> {
        const {email, password} = loginDTO;
        const user = await this.UserModel.findOne({email})
        if(!user){
            throw new UnauthorizedException("Invalid email")
        }

        const isPassword = await bcrypt.compare(password, user.password)

        if(!isPassword){
            throw new UnauthorizedException("Invalid password")
        }

        const token = await this.jwtService.sign({ id: user._id });
        return { token };
    }

}
