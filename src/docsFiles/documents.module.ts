import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Documents } from './documents.entity';
import { Doctype } from './doctype.entity';
import { Contract } from './contract.entity';
import { ContractDoc } from './contractdoc.entity';
import { ContractSatatus } from './contractstatus.entity';
import { FilialsModule } from '../filials/filials.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Documents, Doctype, Contract, ContractDoc, ContractSatatus]),
  ],
  providers: [DocumentsService],
  controllers: [DocumentsController],
  exports: [DocumentsService]
})
export class DocumentsModule {}
