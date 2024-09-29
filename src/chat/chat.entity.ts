import { Applications } from '../applications/applications.entity';
import { Files } from '../files/Files.entity';
import { Message } from '../messages/messages.entity';
import { Role } from '../roles/roles.enum';
import { Users } from '../users/users.entity';
import { OneToOne, JoinColumn, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Applications)
  @JoinColumn()
  application: Applications

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[]

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// import { OneToOne, JoinColumn, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// @Entity({
//   name: 'tblzayavkachat'
// })
// export class Doctype {
//   @PrimaryGeneratedColumn('uuid', {
//     name: 'id_doctype'
//   })
//   id_doctype: string;

//   @Column({
//     name: 'caption_doctype',
//     type: 'char varying',
//     nullable: false
//   })
//   caption_doctype: string;

//   @OneToMany(() => Documents, (documents) => documents.doctype, {cascade: true})
//   documents: Documents[];
// }