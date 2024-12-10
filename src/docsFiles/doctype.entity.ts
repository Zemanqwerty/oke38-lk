import { OneToOne, JoinColumn, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Documents } from './documents.entity';

@Entity({
  name: 'tbldoctype'
})
export class Doctype {
  @PrimaryGeneratedColumn({
    name: 'id_doctype'
  })
  id_doctype: number;

  @Column({
    name: 'caption_doctype',
    nullable: true
  })
  caption_doctype: string;

  @OneToMany(() => Documents, (documents) => documents.doctype, {cascade: true})
  documents: Documents[];
}