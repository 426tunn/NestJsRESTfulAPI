/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from "./schema/user.schema";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
     constructor(
        @InjectModel(User.name)
        private UserModel: Model<User>
     ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        })
     }

     async validate(payload) {
        const {id} = payload
        const user = await this.UserModel.findById(id);
        if(!user) {
            throw new UnauthorizedException("You need to login first");
        }
        return user;
     }
     
}