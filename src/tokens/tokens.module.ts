import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tokens } from './tokens.entity';
import { TokensService } from './tokens.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [UsersModule,
                TypeOrmModule.forFeature([Tokens]),
                JwtModule.register({
                    global: true,
                }),],
    providers: [TokensService],
    exports: [TokensService]
})
export class TokensModule {}
