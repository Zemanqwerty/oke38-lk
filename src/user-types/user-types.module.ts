import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { UserTypes } from './user-types.entity';
import { UserTypesService } from './user-types.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserTypes])
    ],
    providers: [UserTypesService],
    exports: [
        UserTypesService
    ]
})
export class UserTypesModule {}
