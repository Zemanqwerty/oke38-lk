import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { UserRoles } from './user-roles.entity';
import { UserRolesService } from './user-roles.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserRoles])
    ],
    providers: [UserRolesService],
    exports: [
        UserRolesService
    ]
})
export class UserRolesModule {}
