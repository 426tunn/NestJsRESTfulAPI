/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class LoginDTO { 
    @IsNotEmpty()
    @IsEmail({}, {message: 'Please enter a valid email'})
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    readonly password: string;
}