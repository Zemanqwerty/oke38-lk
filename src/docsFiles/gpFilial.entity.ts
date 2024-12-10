import { OneToOne, JoinColumn, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';
import { Documents } from './documents.entity';
import { Gp } from '../applications/gp.entity';

@Entity({
  name: 'tblgp_filial'
})
export class GpFilial {
  @PrimaryColumn({
    name: 'id_gp_filial',
    type: 'uuid'
  })
  id_gp_filial: string;

  @ManyToOne(() => Gp, (gp) => gp.gpFilial, {nullable: false})
  @JoinColumn({name: 'id_gp'})
  id_gp: Gp;

  @Column({
    name: 'caption_gp_filial',
    nullable: false
  })
  caption_gp_filial: string;
}