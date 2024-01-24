import { Role } from 'src/roles/roles.enum';
import { Users } from 'src/users/users.entity';
import { OneToOne, JoinColumn, ManyToMany, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Tokens {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @OneToOne(() => Users)
  @JoinColumn()
  user: Users;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}