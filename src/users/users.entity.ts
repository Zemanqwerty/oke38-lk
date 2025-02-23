import { Applications } from '../applications/applications.entity';
import { Filials } from '../filials/filials.entity';
import { Role } from 'src/roles/roles.enum';
import { UserRoles } from '../user-roles/user-roles.entity';
import { UserTypes } from '../user-types/user-types.entity';
import { JoinColumn, ManyToMany, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Documents } from '../docsFiles/documents.entity';
import { Message } from '../messages/messages.entity';

@Entity({
  name: 'tbluserinfo'
})
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id_user: string;

  @CreateDateColumn({
    nullable: true
  })
  date_create_user: Date;

  @Column({
    name: 'fl_familiya',
    nullable: true,
    default: null
  })
  lastname: string | null;

  @Column({
    name: 'fl_name',
    nullable: true,
    default: null,
  })
  firstname: string | null;

  @Column({
    name: 'fl_otchestvo',
    nullable: true,
    default: null
  })
  surname: string | null;

  @Column({
    nullable: true,
    default: null
  })
  email: string | null;

  @Column({
    name: 'telefon',
    nullable: true,
    default: null
  })
  phoneNumber: string | null;

  // ---
  @Column({
    nullable: true,
    default: null
  })
  activationLink: string | null;
  // ---

  // ---
  @Column({
    nullable: true,
    default: null
  })
  resetPasswordLink: string | null;
  // ---

  @Column({
    name: 'isapproved',
    default: false,
    nullable: true
  })
  isActive: boolean;

  @Column({
    name: 'password_text',
    nullable: true,
    default: null
  })
  password: string | null;

  @Column({
    nullable: true,
    default: null
  })
  yl_fullname: string | null;

  @Column({
    nullable: true,
    default: null
  })
  yl_shortname: string | null;

  @Column({
    nullable: true,
    default: null
  })
  inn: string | null;

  @Column({
    nullable: true,
    default: null
  })
  contact_familiya: string | null;

  @Column({
    nullable: true,
    default: null
  })
  contact_name: string | null;

  @Column({
    nullable: true,
    default: null
  })
  contact_otchestvo: string | null;

  @Column({
    nullable: true,
    default: null
  })
  confirm_code: string | null;

  @Column({
    nullable: true,
    default: null
  })
  confirm_code_date_send: Date | null;

  @Column({
    nullable: true,
    default: null
  })
  comment: string | null;

  @ManyToOne(() => UserTypes, (userType) => userType.users, {nullable: true})
  @JoinColumn({ name: 'id_usertype' })
  id_usertype: UserTypes | null;

  @ManyToOne(() => UserRoles, (userRole) => userRole.users, {nullable: true})
  @JoinColumn({ name: 'id_userrole' })
  id_userrole: UserRoles | null;

  @ManyToOne(() => Filials, (filial) => filial.users, {nullable: true})
  @JoinColumn({ name: 'id_filial' })
  id_filial: Filials | null;

  // @Column({
  //   default: Role.Client
  // })
  // roles: Role;

  @Column({
    nullable: true,
    default: null
  })
  user_login: string | null;

  @Column({
    nullable: true,
    default: null
  })
  user_nameingrid: string | null;

  @Column('uuid', {
    nullable: true,
    default: null
  })
  id_registration_typeid: string | null;

  @Column({
    nullable: true,
    default: false,
  })
  islockedout: boolean | null;

  @OneToMany(() => Applications, (application) => application.user, {cascade: true})
  applications: Applications[]

  @OneToMany(() => Documents, (docs) => docs.id_user, {cascade: true})
  documents: Documents[]

  @OneToMany(() => Message, (message) => message.sender, {cascade: true})
  messages: Message[]
}
