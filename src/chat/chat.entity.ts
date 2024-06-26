import { Applications } from 'src/applications/applications.entity';
import { Files } from 'src/files/Files.entity';
import { Message } from 'src/messages/messages.entity';
import { Role } from 'src/roles/roles.enum';
import { Users } from 'src/users/users.entity';
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