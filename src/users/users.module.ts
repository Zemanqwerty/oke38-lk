import { Module } from '@nestjs/common';
import { Users } from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SmtpModule } from 'src/smtp/smtp.module';
import { UserRolesModule } from 'src/user-roles/user-roles.module';
import { UserTypesModule } from 'src/user-types/user-types.module';
import { FilialsModule } from 'src/filials/filials.module';
import { DocumentsModule } from 'src/docsFiles/documents.module';

@Module({
    imports: [
        SmtpModule,
        UserRolesModule,
        UserTypesModule,
        FilialsModule,
        DocumentsModule,
        TypeOrmModule.forFeature([Users])
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService]
})
export class UsersModule {}
