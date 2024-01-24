import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "./users.entity";
import { hash, compare } from 'bcryptjs';
import { Repository } from "typeorm";
import { CreateUser } from "src/dtos/users/CreateUser.dto";
import { ResponseUser } from "src/dtos/users/ResponseUser.dto";
import { Payload } from "src/dtos/auth/Payload.dto";


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
    ) {};

    async createNewUser(userData: CreateUser): Promise<ResponseUser> {
        const condidate = await this.getUserByEmail(userData.email);
        if (condidate) {
            throw new HttpException('Пользователь с такой почтой уже зарегистрирован', HttpStatus.BAD_REQUEST);
        }

        userData.password = await hash(userData.password, 3);

        const newUser = this.usersRepository.create(userData);
        await this.usersRepository.save(newUser);

        return new ResponseUser({email: newUser.email});
    }

    async getUserByEmail(email: string): Promise<Users> {
        return await this.usersRepository.findOneBy({email: email});
    }

    async getUserById(userId: number) {
        return await this.usersRepository.findOneBy({id: userId});
    }

    async getRoleByEmail(user: Payload) {
        return (await this.usersRepository.findOneBy({email: user.publickUserEmail})).roles;
    }
}