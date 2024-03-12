import { Files } from 'src/files/Files.entity';
import { Role } from 'src/roles/roles.enum';
import { Users } from 'src/users/users.entity';
import { OneToOne, JoinColumn, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApplicationStatus } from './applicationsStatus.enum';

@Entity()
export class Applications {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reason: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @Column()
  maxPower: string;

  @Column()
  powerLevel: string;

  @Column()
  paymentsOption: string;

  @Column()
  provider: string;

  @Column({
    default: ApplicationStatus.inProcess
  })
  status: ApplicationStatus

  @ManyToOne(() => Users, (user) => user.applications)
  user: Users;

  @OneToMany(() => Files, (file) => file.application, {cascade: true})
  files: Files[]

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}