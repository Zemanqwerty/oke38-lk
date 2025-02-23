import { Body, Controller, Get, Param, Post, Query, Redirect, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUser } from "src/dtos/users/CreateUser.dto";
import { AuthGuard } from "src/auth/auth.middleware";
import { RequestForResetPassword } from "src/dtos/users/RequestForResetPassword.dto";
import { ResetPassword } from "src/dtos/users/ResetPassword.dto";
import { Request } from "express";
import { SetUserData } from "src/dtos/users/SetUserData.dto";



@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {};

    @Post('sign-up')
    async createNewUser(@Body() userData: CreateUser, @Req() request: Request) {
        try {
            return await this.usersService.createNewUser(userData, request.ip);
        } catch (e) {
            console.log(e);
            return e
        }
    }

    // @UseGuards(AuthGuard)
    // @Get('role')
    // async getRole(@Req() request: Request) {
    //     try {
    //         return await this.usersService.getRoleByEmail(request['user']);
    //     } catch (e) {
    //         return e
    //     }
    // }

    @Get('activate/:link')
    @Redirect(`http://${process.env.BASE_CLIENT_URL}/sign-in`, 301)
    async activateAccount(@Param() params: any) {
        try {
            return await this.usersService.activateAccount(params.link);
        } catch (e) {
            return e
        }
    }

    @Post('request-for-reset')
    async sendRequestForResetPassword(@Body() requestData: RequestForResetPassword, @Req() request: Request) {
        try {
            return await this.usersService.sendRequestForResetPassword(requestData, request.ip);
        } catch (e) {
            return e
        }
    }

    @Post('reset-password/:link')
    async resetPassword(@Body() resetData: ResetPassword, @Param() params: any) {
        try {
            return await this.usersService.resetPassword(params.link, resetData);
        } catch (e) {
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Get('admin/all')
    async getAll(
        @Req() request: Request,
        @Query('page') page: number,
        @Query('user') user: string,
        @Query('email') email: string,
        @Query('phone') phone: string,
        @Query('type') type: number,
        @Query('role') role: number,
    ) {
        try {
            const filters = {
                user,
                email,
                phone,
                type,
                role
            };
            return await this.usersService.getAll(page, request['user'], filters)
        } catch (e) {
            console.log(e);
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Post('admin/create')
    async adminCreateNewUser(@Req() request: Request, @Body() userData: CreateUser) {
        try {
            return await this.usersService.adminCreateNewUser(userData, request['user'])
        } catch (e) {
            console.log(e);
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Post('admin/setRole')
    async adminSetUserRole(@Req() request: Request, @Body() setRoleData: SetUserData) {
        try {
            return await this.usersService.adminSetUserRole(request['user'], setRoleData)
        } catch (e) {
            console.log(e);
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Post('admin/setName')
    async adminSetUserName(@Req() request: Request, @Body() setNameData: SetUserData) {
        try {
            return await this.usersService.adminSetNameRole(request['user'], setNameData)
        } catch (e) {
            console.log(e);
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Post('admin/setPhoneNumber')
    async adminSetUserPhoneNumber(@Req() request: Request, @Body() setPhoneNumberData: SetUserData) {
        try {
            return await this.usersService.adminSetPhoneNumberRole(request['user'], setPhoneNumberData)
        } catch (e) {
            console.log(e);
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Post('admin/delete')
    async adminDeleteUser(@Req() request: Request, @Body() deleteData: SetUserData) {
        try {
            return await this.usersService.adminDeleteUser(request['user'], deleteData)
        } catch (e) {
            console.log(e);
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Get('roles')
    async getRolesList(@Req() request: Request) {
        try {
            return await this.usersService.adminGetRolesList(request['user'])
        } catch (e) {
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Get('userscount')
    async getAllUsersCount(@Req() request: Request) {
        try {
            return await this.usersService.getUsersCount(request['user'])
        } catch (e) {
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Get('types')
    async getTypesList(@Req() request: Request) {
        try {
            return await this.usersService.adminGetTypesList(request['user'])
        } catch (e) {
            return e
        }
    }
}