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
  name: 'tblzayavkadoc'
})
export class Documents {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id_zayavkadoc'
  })
  id_zayavkadoc: string;

  @ManyToOne(() => Applications, (application) => application.documents, {nullable: false})
  @JoinColumn({name: 'id_zayavka'})
  application: Applications;

  @ManyToOne(() => Doctype, (doctype) => doctype.documents, {nullable: false})
  @JoinColumn({name: 'id_doctype'})
  doctype: Doctype;

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


//   
// relation
// 
  @Column()
  id_chatrec: string;


  @Column({
    name: 'is_temp',
    type: 'boolean'
  })
  is_temp: boolean;


//   
// relation
// 
@ManyToOne(() => Contract, (contract) => contract.documents, {nullable: true})
@JoinColumn({name: 'id_contract'})
id_contract: Contract;

//
// relation
// 
  // @Column({
  //   name: 'id_user',
  //   type: 'uuid',
  //   nullable: true
  // })
  // id_user: string;


  @ManyToOne(() => Users, (user) => user.documents, {nullable: true})
  @JoinColumn({name: 'id_user'})
  id_user: Users | null;


//   check
  @Column({
    type: 'uuid',
    name: 'esign_oke',
    nullable: true
  })
  esign_oke: string

  @Column({
    type: 'uuid',
    name: 'esign_kontr',
    nullable: true
  })
  esign_kontr: string;
}