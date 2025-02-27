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
import { Role } from "src/roles/roles.enum";
import { Request } from "express";
import { AllUsersResponse } from "src/dtos/users/AllUsersResponse";
import { SetUserData } from "src/dtos/users/SetUserData.dto";
import { UserRolesService } from "src/user-roles/user-roles.service";
import { UserTypesService } from "src/user-types/user-types.service";
import { FilialService } from "src/filials/filials.service";
// import { UsersRelationsResponse } from "src/dtos/users/UsersRelationsResponse";
import { UserRolesResponse } from "src/dtos/users/UserRolesResponse";
import { UserTypesResponse } from "src/dtos/users/UserTypesResponse";


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        private smtpService: SmtpService,
        private userRolesService: UserRolesService,
        private userTypesService: UserTypesService,
        private filialService: FilialService
    ) {};

    async createNewUser(userData: CreateUser, ip: string): Promise<ResponseUser> {
        // console.log(ip);
        const condidate = await this.usersRepository.findOne({where: {
            email: userData.email,
            isActive: true
        }});

        if (condidate) {
            throw new HttpException('Пользователь с такой почтой уже зарегистрирован', HttpStatus.BAD_REQUEST);
        }

        userData.id_userrole = await this.userRolesService.getRoleByCaption('заявитель');
        userData.id_usertype = await this.userTypesService.getUserTypeByCaption('физическое лицо');
        userData.id_filial = await this.filialService.getFilialById(-1)


        userData.password = await bcrypt.hash(userData.password, 10);

        const activationLink = uuidv4();
        const idUser = uuidv4();

        userData.activationLink = activationLink;
        userData.id_user = idUser;
        userData.user_login = userData.email;

        const newUser = this.usersRepository.create(userData);
        await this.usersRepository.save(newUser);

        await this.smtpService.sendSmtp(`http://${process.env.BASE_BACKEND_URL}/users/activate/${activationLink}`, newUser.email, 'activation');

        return new ResponseUser({email: newUser.email});
    }

    async getUserByEmail(email: string): Promise<Users> {
        return await this.usersRepository.findOne({
            relations: {
                id_userrole: true,
                id_usertype: true
            },
            where: {
                email: email,
                isActive: true,
            }
        })
    }

    async getActivatedUserByEmail(email: string): Promise<Users> {
        return await this.usersRepository.findOne({
            relations: {
                id_userrole: true,
                id_usertype: true,
                id_filial: true
            },
            where: {
                email: email,
                isActive: true
            }
        })
    }

    async getUserById(userId: string) {
        return await this.usersRepository.findOneBy({id_user: userId});
    }

    async getRoleByEmail(user: Payload) {
        return (await this.usersRepository.findOneBy({email: user.publickUserEmail})).id_userrole;
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

        return {url: `http://${process.env.BASE_CLIENT_URL}/sign-in`}
    }

    async sendRequestForResetPassword(requestData: RequestForResetPassword, ip: string) {
        console.log(ip);
        const user = await this.usersRepository.findOne({where: {
            email: requestData.email
        }});

        if (!user) {
            throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST);
        }

        const resetPasswordLink = uuidv4();

        user.resetPasswordLink = resetPasswordLink;

        await this.usersRepository.save(user);

        return await this.smtpService.sendSmtp(`http://${process.env.BASE_CLIENT_URL}/reset-password/${resetPasswordLink}`, requestData.email, 'reset');
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

    async getAll(pageNumber: number, userData: Payload, filters: any) {
        const user = await this.getActivatedUserByEmail(userData.publickUserEmail);

        if (user.id_userrole.caption_userrole !== Role.Admin) {
            throw new HttpException('permission denied', HttpStatus.BAD_GATEWAY)
        };

        const skip = (pageNumber - 1) * 20;
        const take = 20;

        // const users = await this.usersRepository.find({
        //     relations: {
        //         id_userrole: true,
        //         id_usertype: true,
        //         id_filial: true
        //     },
        //     where: {
        //         isActive: true
        //     },
        //     order: { date_create_user: 'DESC' },
        //     skip,
        //     take
        // })

        const queryBuilder = this.usersRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.id_userrole', 'id_userrole')
        .leftJoinAndSelect('user.id_usertype', 'id_usertype')
        .leftJoinAndSelect('user.id_filial', 'id_filial')
        // .leftJoinAndSelect('application.paymentsOption', 'vidrassrochki')
        .orderBy('user.date_create_user', 'DESC')
        .skip(skip)
        .take(take);

        if (filters.user) {
            queryBuilder.andWhere(
                '(user.lastname LIKE :user OR ' +
                'user.firstname LIKE :user OR ' +
                'user.surname LIKE :user OR ' +
                'user.yl_fullname LIKE :user OR ' +
                'user.yl_shortname LIKE :user)',
                { user: `%${filters.user}%` }
            );
        }
        if (filters.type) {
            queryBuilder.andWhere('id_usertype.id_usertype = :type', { type: filters.type });
        }
        if (filters.role) {
            queryBuilder.andWhere('id_userrole.id_userrole = :role', { role: filters.role });
        }
        if (filters.email) {
            queryBuilder.andWhere('user.email LIKE :email', { email: `%${filters.email}%` });
        }
        if (filters.phone) {
            queryBuilder.andWhere('user.phoneNumber LIKE :phone', { phone: `%${filters.phone}%` });
        }

        const users = await queryBuilder.getMany();

        return users.map((oneUser) => {
            return new AllUsersResponse(oneUser);
        })
    }

    async getUsersCount(userData: Payload) {
        const user = await this.getUserByEmail(userData.publickUserEmail);
    
        if (user.id_userrole.caption_userrole !== Role.Admin) {
          throw new HttpException('permission denied', HttpStatus.BAD_GATEWAY);
        }

        const users = await this.usersRepository.find();

        return users.length;
    }

    async adminGetRolesList(userData: Payload) {
        const user = await this.getUserByEmail(userData.publickUserEmail);
    
        if (user.id_userrole.caption_userrole !== Role.Admin) {
          throw new HttpException('permission denied', HttpStatus.BAD_GATEWAY);
        }

        const roles = await this.userRolesService.getRolesList();

        return roles.map((role) => {
            return new UserRolesResponse(role);
        })
    }

    async adminGetTypesList(userData: Payload) {
        const user = await this.getUserByEmail(userData.publickUserEmail);
    
        if (user.id_userrole.caption_userrole !== Role.Admin) {
          throw new HttpException('permission denied', HttpStatus.BAD_GATEWAY);
        }

        const types = await this.userTypesService.getTypesList();

        return types.map((type) => {
            return new UserTypesResponse(type);
        })
    }

    async adminCreateNewUser(userData: CreateUser, creator: Payload) {
        const user = await this.getUserByEmail(creator.publickUserEmail);
    
        if (user.id_userrole.caption_userrole !== Role.Admin) {
          throw new HttpException('permission denied', HttpStatus.BAD_GATEWAY);
        }
    
        const condidate = await this.usersRepository.findOne({where: {
            email: userData.email,
            isActive: true
        }});

        if (condidate) {
            throw new HttpException('Пользователь с такой почтой уже зарегистрирован', HttpStatus.BAD_REQUEST);
        }

        console.log(userData.type);
        console.log(userData.roles);
        const userType = await this.userTypesService.getUserTypeByCaption(userData.type);
        const userRole = await this.userRolesService.getRoleByCaption(userData.roles);

        userData.password = await bcrypt.hash(userData.password, 10);
        userData.isActive = true;

        const activationLink = '';
        const idUser = uuidv4();

        userData.activationLink = activationLink;
        userData.id_user = idUser;
        userData.id_userrole = userRole;
        userData.id_usertype = userType;
        userData.id_filial = await this.filialService.getFilialById(-1);
        userData.user_login = userData.email;
        userData.isActive = true;

        console.log(userData);

        const newUser = this.usersRepository.create(userData);
        return await this.usersRepository.save(newUser);
    }

    async adminSetUserRole(userData: Payload, setData: SetUserData) {
        const creator = await this.getUserByEmail(userData.publickUserEmail);
    
        if (creator.id_userrole.caption_userrole !== Role.Admin) {
          throw new HttpException('permission denied', HttpStatus.BAD_GATEWAY);
        }

        const user = await this.getUserByEmail(setData.email);
        
        if (!user) {
            throw new HttpException('Пользователь с такой почтой незарегистрирован', HttpStatus.BAD_REQUEST)
        }

        // FIX
        user.id_userrole.caption_userrole = setData.role;

        return await this.usersRepository.save(user);
    }

    async adminSetNameRole(userData: Payload, setData: SetUserData) {
        const creator = await this.getUserByEmail(userData.publickUserEmail);
    
        if (creator.id_userrole.caption_userrole !== Role.Admin) {
          throw new HttpException('permission denied', HttpStatus.BAD_GATEWAY);
        }

        const user = await this.getUserByEmail(setData.email);
        
        if (!user) {
            throw new HttpException('Пользователь с такой почтой незарегистрирован', HttpStatus.BAD_REQUEST)
        }

        user.firstname = setData.firstName;
        user.lastname = setData.lastName;
        user.surname = setData.surname;

        return await this.usersRepository.save(user);
    }

    async adminSetPhoneNumberRole(userData: Payload, setRoleData: SetUserData) {
        const creator = await this.getUserByEmail(userData.publickUserEmail);
    
        if (creator.id_userrole.caption_userrole !== Role.Admin) {
          throw new HttpException('permission denied', HttpStatus.BAD_GATEWAY);
        }

        const user = await this.getUserByEmail(setRoleData.email);
        
        if (!user) {
            throw new HttpException('Пользователь с такой почтой незарегистрирован', HttpStatus.BAD_REQUEST)
        }

        user.phoneNumber = setRoleData.phoneNumber;

        return await this.usersRepository.save(user);
    }

    async adminDeleteUser(userData: Payload, deleteData: SetUserData) {
        const creator = await this.getUserByEmail(userData.publickUserEmail);
    
        if (creator.id_userrole.caption_userrole !== Role.Admin) {
          throw new HttpException('permission denied', HttpStatus.BAD_GATEWAY);
        }

        const user = await this.getUserByEmail(deleteData.email);
        
        if (!user) {
            throw new HttpException('Пользователь с такой почтой незарегистрирован', HttpStatus.BAD_REQUEST)
        }

        console.log('try to delete');
        return await this.usersRepository.remove(user);
    }

    // async onModuleInit() {
    //     try {
    //         const adminRole = await this.userRolesService.getRoleByCaption(Role.Admin)
    //         const adminType = await this.userTypesService.getUserTypeByCaption('физическое лицо')
    //         const adminFilial = await this.filialService.getFilialById(-1)

    //         const adminHashedPassword = await bcrypt.hash(process.env.BASE_ADMIN_PASSWORD, 10);

    //         const idUser = uuidv4();
            
    //         const baseAdmin = this.usersRepository.create({
    //             id_user: idUser,
    //             id_usertype: adminType,
    //             email: process.env.BASE_ADMIN_EMAIL,
    //             isActive: true,
    //             password: adminHashedPassword,
    //             id_userrole: adminRole,
    //             id_filial: adminFilial,
    //             user_login: 'admin'
    //         });

    //         await this.usersRepository.save(baseAdmin);
    //         console.log('BASE ADMIN CREATED');
    //     } catch (e) {
    //         console.log(e);
    //     }
    //     return
    // }
}