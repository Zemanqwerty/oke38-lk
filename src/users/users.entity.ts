import { Applications } from 'src/applications/applications.entity';
import { Role } from 'src/roles/roles.enum';
import { ManyToMany, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string

  @Column()
  lastname: string;

  @Column()
  firstname: string;

  @Column()
  surname: string;

  @Column()
  email: string;

  @Column({
    nullable: false
  })
  activationLink: string;

  @Column({
    nullable: true,
    default: null
  })
  resetPasswordLink: string | null;

  @Column({
    default: false
  })
  isActive: boolean;

  @Column()
  phoneNumber: string;

  @Column()
  password: string;

  @Column({
    default: Role.Client
  })
  roles: Role;

  @OneToMany(() => Applications, (application) => application.user, {cascade: true})
  applications: Applications[]

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}