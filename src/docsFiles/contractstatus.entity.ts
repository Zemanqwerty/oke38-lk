import { OneToOne, JoinColumn, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Documents } from './documents.entity';
import { Contract } from './contract.entity';

@Entity({
  name: 'tblcontractstatus'
})
export class ContractSatatus {
  @PrimaryGeneratedColumn({
    name: 'id_contractstatus'
  })
  id_contractstatus: number;

  @Column({
    name: 'caption_contractstatus',
    nullable: true
  })
  caption_contractstatus: string;

  @Column({
    name: 'id_contractstatus_1c',
    type: 'bytea',
    nullable: true
  })
  id_contractstatus_1c: Buffer

  @OneToMany(() => Contract, (contract) => contract.contractStatus, {cascade: true})
  contract: Contract[];
}