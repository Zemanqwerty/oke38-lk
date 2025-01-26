import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Documents } from './documents.entity';
import { Doctype } from './doctype.entity';
import { Contract } from './contract.entity';
import { ContractDoc } from './contractdoc.entity';
import { ContractSatatus } from './contractstatus.entity';
import { DogovorEnergo } from './dogovorenergo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Documents, Doctype, Contract, ContractDoc, ContractSatatus, DogovorEnergo]),
  ],
  providers: [DocumentsService],
  controllers: [DocumentsController],
  exports: [DocumentsService]
})
export class DocumentsModule {}
