import { HttpException, HttpStatus, Injectable, Redirect } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "./users.entity";
import * as bcrypt from 'bcrypt';
import { Repository } from "typeorm";
import { CreateUser } from "src/dtos/users/CreateUser.dto";
import { ResponseUser } from "src/dtos/users/ResponseUser.dto";
import { Payload } from "src/dtos/auth/Payload.dto";
import { SmtpService } from "src/smtp/smtp.service";
import {v4 as uuidv4} from 'uuid';
import { ResetPassword } from "src/dtos/users/ResetPassword.dto";
import { RequestForResetPassword } from "src/dtos/users/RequestForResetPassword.dto";


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        private smtpService: SmtpService
    ) {};

    async createNewUser(userData: CreateUser): Promise<ResponseUser> {
        const condidate = await this.usersRepository.findOne({where: {
            email: userData.email,
            isActive: true
        }});

        if (condidate) {
            throw new HttpException('Пользователь с такой почтой уже зарегистрирован', HttpStatus.BAD_REQUEST);
        }

        userData.password = await bcrypt.hash(userData.password, 10);

        const activationLink = uuidv4();

        userData.activationLink = activationLink;

        console.log(userData);

        const newUser = this.usersRepository.create(userData);
        await this.usersRepository.save(newUser);

        await this.smtpService.sendSmtp(`http://localhost:5010/users/activate/${activationLink}`, newUser.email, 'activation');

        return new ResponseUser({email: newUser.email});
    }

    async getUserByEmail(email: string): Promise<Users> {
        return await this.usersRepository.findOneBy({email: email});
    }

    async getActivatedUserByEmail(email: string): Promise<Users> {
        return await this.usersRepository.findOne({where: {
            email: email,
            isActive: true
        }})
    }

    async getUserById(userId: number) {
        return await this.usersRepository.findOneBy({id: userId});
    }

    async getRoleByEmail(user: Payload) {
        return (await this.usersRepository.findOneBy({email: user.publickUserEmail})).roles;
    }

    async activateAccount(link: string) {
        const user = await this.usersRepository.findOne({where: {
            activationLink: link
        }})

        if (!user) {
            throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST);
        }

        user.isActive = true;

        await this.usersRepository.save(user);

        return {url: 'http://localhost:3000/sign-in'}
    }

    async sendRequestForResetPassword(requestData: RequestForResetPassword) {
        const user = await this.usersRepository.findOne({where: {
            email: requestData.email
        }});

        if (!user) {
            throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST);
        }

        const resetPasswordLink = uuidv4();

        user.resetPasswordLink = resetPasswordLink;

        await this.usersRepository.save(user);

        return await this.smtpService.sendSmtp(`http://localhost:3000/reset-password/${resetPasswordLink}`, requestData.email, 'reset');
    }

    async resetPassword(link: string, resetData: ResetPassword) {
        const user = await this.usersRepository.findOne({where: {
            resetPasswordLink: link
        }});

        if (!user) {
            throw new HttpException('Восстановление пароля для данного пользователя невозможно', HttpStatus.BAD_REQUEST);
        }

        user.password = await bcrypt.hash(resetData.password, 3);
        user.resetPasswordLink = null;

        await this.usersRepository.save(user);

        return {message: 'Устоновлен новый пароль'};
    }
}