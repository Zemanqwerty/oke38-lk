import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUser } from "src/dtos/users/CreateUser.dto";
import { AuthGuard } from "src/auth/auth.middleware";



@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {};

    @Post('sign-up')
    async createNewUser(@Body() userData: CreateUser) {
        try {
            return await this.usersService.createNewUser(userData);
        } catch (e) {
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
}