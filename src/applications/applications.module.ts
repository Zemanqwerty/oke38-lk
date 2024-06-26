import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Applications } from './applications.entity';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { FilesModule } from 'src/files/files.module';
import { Files } from 'src/files/Files.entity';
import { FilesService } from 'src/files/files.service';
import { ChatModule } from 'src/chat/chat.module';
import { CenovayaKategoriya } from './cenovayakategoriya.entity';
import { EnumUrovenU } from './enumurovenu.entity';
import { StatusOplaty } from './statusoplaty.entity';
import { VidRassrochki } from './vidrassrochki.entity';
import { VidZayavki } from './vidzayavki.entity';
import { ZayavkaStatus } from './zayavkaststus.entity';
import { Gp } from './gp.entity';
import { PrichinaPodachi } from './prichinapodachi.entity';

@Module({
    imports: [
        UsersModule,
        FilesModule,
        ChatModule,
        TypeOrmModule.forFeature([Applications, Files, CenovayaKategoriya, EnumUrovenU, StatusOplaty, VidRassrochki, VidZayavki, ZayavkaStatus, Gp, PrichinaPodachi]),
        ],
    providers: [ApplicationsService, FilesService],
    controllers: [ApplicationsController],
    exports: [ApplicationsService]
})
export class ApplicationsModule {}
