import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { hash, compare } from 'bcryptjs';
import { Repository } from "typeorm";
import { CreateUser } from "src/dtos/users/CreateUser.dto";
import { ResponseUser } from "src/dtos/users/ResponseUser.dto";
import { Payload } from "src/dtos/auth/Payload.dto";
import { Tokens } from "./tokens.entity";
import { Users } from "src/users/users.entity";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import { ResponseAuth } from "src/dtos/auth/ResponseAuth.dto";


@Injectable()
export class TokensService {
    constructor(
        @InjectRepository(Tokens)
        private tokensRepositoty: Repository<Tokens>,
        private jwtService: JwtService,
        private usersService: UsersService,
    ) {};

    async saveToken(refreshToken: string, user: Users) {
        const token = await this.tokensRepositoty.findOne({
            relations: {
                user: true,
            },
            where: {
                user: {id: user.id}
            }
        })

        // const tokenR = await this.tokensRepositoty.createQueryBuilder("tokens").where(`tokens.user = ${user}`).leftJoinAndSelect('tokens.user', 'user').getOne()
        console.log(token);

        if (token) {
            console.log('token');
            token.token = refreshToken;
            await this.tokensRepositoty.save(token);
            return token
        }

        console.log('not token');
        const newToken = this.tokensRepositoty.create({token: refreshToken, user: user});
        await this.tokensRepositoty.save(newToken);

        return newToken;
    }

    async verifyRefreshToken(refreshToken: string | undefined): Promise<Payload> {
        if (!refreshToken) {
            throw new UnauthorizedException();
        }
        try {
            const payload: Payload = await this.jwtService.verifyAsync(
                refreshToken,
                {
                  secret: process.env.JWT_REFRESH_SECRET_KEY,
                }
            );

            return payload;
        } catch {
            throw new UnauthorizedException();
        }
    }
}