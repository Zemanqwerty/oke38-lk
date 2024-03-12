import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Applications } from './applications.entity';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { FilesModule } from 'src/files/files.module';
import { Files } from 'src/files/Files.entity';
import { FilesService } from 'src/files/files.service';

@Module({
    imports: [
        UsersModule,
        FilesModule,
        TypeOrmModule.forFeature([Applications, Files]),
        ],
    providers: [ApplicationsService, FilesService],
    controllers: [ApplicationsController],
    exports: [ApplicationsService]
})
export class ApplicationsModule {}
