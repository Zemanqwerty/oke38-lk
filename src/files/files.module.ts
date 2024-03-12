import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsModule } from 'src/applications/applications.module';
import { FilesService } from './files.service';
import { Files } from './Files.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        UsersModule,
        TypeOrmModule.forFeature([Files]),
        ],
    providers: [FilesService],
    exports: [FilesService]
})
export class FilesModule {}
