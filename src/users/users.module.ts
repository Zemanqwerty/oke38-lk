import { Module } from '@nestjs/common';
import { Users } from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Users]),],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService]
})
export class UsersModule {}