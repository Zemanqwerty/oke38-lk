import { Applications } from 'src/applications/applications.entity';
import { Chat } from 'src/chat/chat.entity';
import { Files } from 'src/files/Files.entity';
import { Role } from 'src/roles/roles.enum';
import { Users } from 'src/users/users.entity';
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

  @Column()
  senderRole: Role;

  @Column()
  sender: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}