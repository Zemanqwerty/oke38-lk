import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { compare } from 'bcryptjs';
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { LoginUser } from "src/dtos/auth/LoginUser.dto";
import { Payload } from "src/dtos/auth/Payload.dto";
import { ResponseAuth } from "src/dtos/auth/ResponseAuth.dto";
import { Request, Response } from "express";
import { TokensService } from "src/tokens/tokens.service";



@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService,
        private tokensService: TokensService
    ) {};

    async login(userData: LoginUser, response: Response) {
        const user = await this.usersService.getUserByEmail(userData.email);

        if (!user) {
            throw new HttpException('Пользователь с такой почтой не найден', HttpStatus.BAD_REQUEST);
        }

        if (!compare(user.password, userData.password)) {
            throw new HttpException(`Неправильный пароль`, HttpStatus.BAD_REQUEST)
        }

        const accessToken = await this.jwtService.signAsync({publickUserEmail: user.email, publickUserRoles: user.roles}, {secret: process.env.JWT_ACCESS_SECRET_KEY, expiresIn: '20s'});
        const refreshToken = await this.jwtService.signAsync({publickUserEmail: user.email, publickUserRoles: user.roles}, {secret: process.env.JWT_REFRESH_SECRET_KEY, expiresIn: '60s'});

        await this.tokensService.saveToken(refreshToken, user);

        response.cookie('refreshToken', refreshToken, {httpOnly: true});

        return new ResponseAuth({accessToken: accessToken, refreshToken: refreshToken, email: user.email});
    }

    async refresh(refsreshToken: string | undefined, response: Response) {
        const payload = await this.tokensService.verifyRefreshToken(refsreshToken);

        const user = await this.usersService.getUserByEmail(payload.publickUserEmail)

        const newAccessToken = await this.jwtService.signAsync({publickUserEmail: user.email, publickUserRoles: user.roles}, {secret: process.env.JWT_ACCESS_SECRET_KEY, expiresIn: '20s'});
        const NewRefreshToken = await this.jwtService.signAsync({publickUserEmail: user.email, publickUserRoles: user.roles}, {secret: process.env.JWT_REFRESH_SECRET_KEY, expiresIn: '60s'});
        
        await this.tokensService.saveToken(NewRefreshToken, user);

        response.cookie('refreshToken', NewRefreshToken, {httpOnly: true});
        
        return new ResponseAuth({accessToken: newAccessToken, refreshToken: NewRefreshToken, email: user.email});
    }
}