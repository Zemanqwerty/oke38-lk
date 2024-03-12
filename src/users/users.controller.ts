import { Body, Controller, Get, Param, Post, Redirect, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUser } from "src/dtos/users/CreateUser.dto";
import { AuthGuard } from "src/auth/auth.middleware";
import { RequestForResetPassword } from "src/dtos/users/RequestForResetPassword.dto";
import { ResetPassword } from "src/dtos/users/ResetPassword.dto";



@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {};

    @Post('sign-up')
    async createNewUser(@Body() userData: CreateUser) {
        try {
            return await this.usersService.createNewUser(userData);
        } catch (e) {
            console.log(e);
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Get('role')
    async getRole(@Req() request: Request) {
        try {
            return await this.usersService.getRoleByEmail(request['user']);
        } catch (e) {
            return e
        }
    }

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
    async sendRequestForResetPassword(@Body() requestData: RequestForResetPassword) {
        try {
            return await this.usersService.sendRequestForResetPassword(requestData);
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
}