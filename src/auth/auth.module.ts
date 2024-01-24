import { Module } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
    imports: [
        UsersModule,
        TokensModule,
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
      
        JwtModule.register({
          global: true,
        }),
    ],
    providers: [AuthService],
    controllers: [AuthController]
})
export class AuthModule {}