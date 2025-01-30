import { Files } from '../files/Files.entity';
import { Role } from '../roles/roles.enum';
import { Users } from '../users/users.entity';
import { OneToOne, JoinColumn, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApplicationTypes } from '../application-type/application-type.entity';
import { Filials } from '../filials/filials.entity';
import { stat } from 'fs';
import { Applications } from '../applications/applications.entity';
import { Doctype } from './doctype.entity';
import { Contract } from './contract.entity';

@Entity({
  name: 'tblcontractdoc'
})
export class ContractDoc {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id_contractdoc'
  })
  id_contractdoc: string;

  @ManyToOne(() => Contract, (contract) => contract.contractDoc, {nullable: false})
  @JoinColumn({name: 'id_contract'})
  id_contract: Contract;

  @ManyToOne(() => Doctype, (doctype) => doctype.contractDoc, {nullable: false})
  @JoinColumn({name: 'id_doctype'})
  id_doctype: Doctype;

  @Column({
    name: 'date_doc_add',
    nullable: false,
    type: 'timestamp'
  })
  date_doc_add: Date;

  @Column({
    name: 'doc_file_name',
    type: 'varchar',
    nullable: false
  })
  doc_file_name: string;

  @Column({
    name: 'doc_file_path',
    type: 'varchar',
    nullable: false
  })
  doc_file_path: string;
}