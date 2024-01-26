import { Module } from '@nestjs/common';
import { Users } from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SmtpModule } from 'src/smtp/smtp.module';

@Module({
    imports: [
        SmtpModule,
        TypeOrmModule.forFeature([Users])
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService]
})
export class UsersModule {}
