import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Filials } from './filials.entity';
import { FilialService } from './filials.service';

@Module({
    imports: [
        // UsersModule,
        TypeOrmModule.forFeature([Filials])
    ],
    providers: [FilialService],
    exports: [
        FilialService
    ]
})
export class FilialsModule {}
