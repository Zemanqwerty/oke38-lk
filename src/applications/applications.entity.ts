import { Files } from 'src/files/Files.entity';
import { Role } from 'src/roles/roles.enum';
import { Users } from 'src/users/users.entity';
import { OneToOne, JoinColumn, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApplicationStatus } from './applicationsStatus.enum';
import { ApplicationTypes } from 'src/application-type/application-type.entity';
import { Filials } from 'src/filials/filials.entity';

@Entity()
export class Applications {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id_zayavka'
  })
  uuid: string;

  // @Column()
  // @Generated("uuid")
  // uuid: string;

  @ManyToOne(() => Users, (user) => user.applications)
  @JoinColumn({name: 'id_user'})
  user: Users;

  @ManyToOne(() => ApplicationTypes, (appliType) => appliType.applications)
  @JoinColumn({name: 'id_zayavkatype'})
  id_zayavkatype: ApplicationTypes;

  @Column({
    nullable: true,
    default: null
  })
  comment: string | null;

  @CreateDateColumn({
    name: 'date_create_zayavka'
  })
  createdAt: Date;

  @ManyToOne(() => Filials, (filial) => filial.applications)
  @JoinColumn({name: 'id_filial'})
  filial: Filials;

  @Column({
    nullable: true,
    default: null,
    name: 'zayavka_number_1c'
  })
  applicationNumber: string;

  @Column({
    nullable: true,
    default: null,
    name: 'zayavka_date_1c'
  })
  applicationDate: Date;

  @Column({
    default: false
  })
  is_viewed: boolean;

  @Column({
    type: 'uuid',
    nullable: true,
    default: null
  })
  viewed_operator: string | null;

  @Column({
    default: false
  })
  is_temp: boolean

  @Column({
    nullable: true,
    default: null,
    name: 'id_zayavkastatus'
  })
  status: number | null;

  // 1c

  @Column({
    nullable: true,
    default: null,
    name: 'id1c_enumurovenu',
    type: 'bytea'
  })
  powerLevel: Buffer;

  @Column({
    nullable: true,
    default: null,
    type: 'bytea'
  })
  id1c_cenovayakategoriya: Buffer;

  @Column({
    nullable: true,
    default: null,
    name: 'id1c_vidrassrochki',
    type: 'bytea'
  })
  paymentsOption: Buffer;

  @Column({
    nullable: true,
    default: null,
    type: 'bytea'
  })
  id1c_vidzayavki: Buffer

  @Column({
    nullable: true,
    default: null,
    type: 'bytea',
    name: 'id1c_statusoplaty'
  })
  paymantStatus: Buffer;

  @Column({
    nullable: true,
    default: null,
    type: 'bytea',
  })
  v1c_statuszayavki: Buffer;

  @Column({
    nullable: true,
    default: null,
    name: 'v1c_adresepu'
  })
  address: string

  @Column({
    nullable: true,
    type: 'numeric',
    precision: 10,
    scale: 3,
    name: 'v1c_maxmoschnostepu'
  })
  maxPower: number

  @Column({
    nullable: true,
    type: 'uuid',
    name: 'id_gp'
  })
  provider: string;

  @Column({
    nullable: true,
  })
  v1c_nomerdogovora: string;

  @Column({
    nullable: true,
    type: 'timestamp'
  })
  v1c_datadogovora: Date

  @Column({
    nullable: true,
    default: null,
    type: 'bytea'
  })
  v1c_statusdogovora: Buffer;

  @Column({
    nullable: true,
    default: null,
  })
  v1c_epu: string;

  @Column({
    nullable: true,
    default: null,
    type: 'bytea'
  })
  v1c_statusoplaty: Buffer;

  @Column({
    nullable: true,
    default: null
  })
  status_prikreplenakttp: boolean;

  @Column({
    nullable: true,
    default: null
  })
  status_prikreplenaktdopuskapu: boolean;

  @Column({
    nullable: true,
    default: null,
    type: 'uuid',
    name: 'id_prichinapodachiz'
  })
  reason: string

  @Column({
    nullable: true,
    default: null
  })
  v1c_zayavitel: string;

  @Column({
    nullable: true,
    default: null
  })
  status_gp_regnewz: boolean

  @Column({
    nullable: true,
    default: null
  })
  status_gp_regnewdtp: boolean

  @Column({
    nullable: true,
    default: null
  })
  status_zannulirovana: boolean

  @Column({
    nullable: true,
    default: null
  })
  is_vremennaya: boolean

  @Column({
    nullable: true,
    default: null,
    type: 'uuid'
  })
  id_ordersource: string

  @Column({
    nullable: true,
    default: null,
    type: 'timestamp'
  })
  date_copy_from1c: Date

  @Column({
    nullable: true,
    default: null,
    type: 'uuid'
  })
  id_fiasregioncity: string



  // @Column({
  //   nullable: true,
  //   default: null
  // })
  // applicationType?: string;

  @OneToMany(() => Files, (file) => file.application, {cascade: true})
  files: Files[]
}