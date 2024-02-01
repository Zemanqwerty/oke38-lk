import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUser } from "src/dtos/auth/LoginUser.dto";
import { Request, Response } from "express";
import { get } from "http";



@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {};

    @Post('sign-in')
    async login(@Body() userData: LoginUser, @Res({ passthrough: true }) response: Response) {
        try {
            return await this.authService.login(userData, response)
        } catch (e) {
            console.log(e);
            return e
        }
    }

    @Get('refresh')
    async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        try {
            return await this.authService.refresh(request.cookies['refreshToken'], response)
        } catch (e) {
            console.log(e);
            return e
        }
    }

    @Get('logout')
    async logout(@Req() request: Request) {
        try {
            return await this.authService.logout(request.cookies['refreshToken']);
        } catch (e) {
            console.log(e);
            return e
        }
    }
}