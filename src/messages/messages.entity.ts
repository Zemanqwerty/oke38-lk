import { Applications } from '../applications/applications.entity';
import { Chat } from '../chat/chat.entity';
import { Files } from '../files/Files.entity';
import { Role } from '../roles/roles.enum';
import { Users } from '../users/users.entity';
import { OneToOne, JoinColumn, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat

  @Column({
    nullable: true
  })
  messageText: string;

  @Column({
    nullable: true
  })
  fileUrl: string;

  @Column({
    nullable: true
  })
  fileName: string;

  // @Column()
  // senderRole: Role;

  @ManyToOne(() => Users, (user) => user.messages)
  @JoinColumn({name: 'sender'})
  sender: Users;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}