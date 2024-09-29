import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
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

    // async hashPassword(password: string, salt: string): string {
    //     const hash = crypto.pbkdf2Sync(password, salt, this.iterations, this.keyLength, this.digest);
    //     return hash.toString('base64');
    // }
    
    // async verifyPassword(password: string, salt: string, hashedPassword: string): boolean {
    //     const hash = crypto.pbkdf2Sync(password, salt, this.iterations, this.keyLength, this.digest);
    //     return hash.toString('base64') === hashedPassword;
    // }

    // async oldLoginASP(password: string) {

    // }

    async login(userData: LoginUser, response: Response) {
        const user = await this.usersService.getActivatedUserByEmail(userData.email);
        console.log(user);

        if (!user) {
            throw new HttpException('Пользователь с такой почтой не найден', HttpStatus.BAD_REQUEST);
        }

        let passwordsEqual;

        try {
            passwordsEqual = await bcrypt.compare(userData.password, user.password)
        } catch (e) {
            console.log(userData.password, user.password);
            passwordsEqual = userData.password == user.password;
        }

        if (!passwordsEqual) {
            console.log(userData.password, user.password);
            console.log('------------------');
            console.log('incorrect password');
            console.log('------------------');
            throw new HttpException(`Неправильный пароль`, HttpStatus.BAD_REQUEST)
        }

        console.log('------------------');
        console.log('correct password');
        console.log('------------------');


        const accessToken = await this.jwtService.signAsync({publickUserEmail: user.email, publickUserRoles: user.id_userrole.caption_userrole}, {secret: process.env.JWT_ACCESS_SECRET_KEY, expiresIn: '20m'});
        const refreshToken = await this.jwtService.signAsync({publickUserEmail: user.email, publickUserRoles: user.id_userrole.caption_userrole}, {secret: process.env.JWT_REFRESH_SECRET_KEY, expiresIn: '30d'});

        const savedRefreshToken = await this.tokensService.saveToken(refreshToken, user);
        
        console.log(`THIS REFRESHTOKEN SETTED AFTER LOGIN - ${refreshToken}`);

        response.cookie('refreshToken', refreshToken, {
            // domain: 'localhost',
            httpOnly: true,
            // sameSite: 'none',
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 30,
        });

        return new ResponseAuth({accessToken: accessToken, role: user.id_userrole.caption_userrole, email: user.email});
    }

    async refresh(refsreshToken: string | undefined, response: Response) {
        const payload = await this.tokensService.verifyRefreshToken(refsreshToken);

        const user = await this.usersService.getActivatedUserByEmail(payload.publickUserEmail)

        const newAccessToken = await this.jwtService.signAsync({publickUserEmail: user.email, publickUserRoles: user.id_userrole.caption_userrole}, {secret: process.env.JWT_ACCESS_SECRET_KEY, expiresIn: '20m'});
        const NewRefreshToken = await this.jwtService.signAsync({publickUserEmail: user.email, publickUserRoles: user.id_userrole.caption_userrole}, {secret: process.env.JWT_REFRESH_SECRET_KEY, expiresIn: '30d'});
        
        const savedRefreshToken = await this.tokensService.saveToken(NewRefreshToken, user);

        response.cookie('refreshToken', NewRefreshToken, {
            // domain: 'localhost',
            httpOnly: true,
            // sameSite: 'none',
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 30,
        });
        
        return new ResponseAuth({accessToken: newAccessToken, role: user.id_userrole.caption_userrole, email: user.email});
    }

    async logout(refreshToken: string | undefined, response: Response) {
        if (!refreshToken) {
            throw new UnauthorizedException();
        }

        response.clearCookie('refreshToken');
        const removedToken = await this.tokensService.removeToken(refreshToken);

        return removedToken.user;
    }
}