import { Applications } from '../applications/applications.entity';
import { Files } from '../files/Files.entity';
import { Message } from '../messages/messages.entity';
import { Role } from '../roles/roles.enum';
import { Users } from '../users/users.entity';
import { OneToOne, JoinColumn, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @OneToOne(() => Applications)
  @JoinColumn({ name: 'applicationId' }) // Указываем явно поле для связи
  application: Applications;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[]

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

