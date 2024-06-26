import { Applications } from 'src/applications/applications.entity';
import { Role } from 'src/roles/roles.enum';
import { Users } from 'src/users/users.entity';
import { ManyToMany, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'tblprichinapodachiz'
})
export class PrichinaPodachi {
  @PrimaryGeneratedColumn('uuid')
  id_prichinapodachiz: string;

  @Column()
  caption_short: string;

  @Column()
  caption_long: string;

  @OneToMany(() => Applications, (application) => application.reason, {cascade: true})
  applications: Applications[]
}