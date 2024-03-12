import { Applications } from 'src/applications/applications.entity';
import { Role } from 'src/roles/roles.enum';
import { Users } from 'src/users/users.entity';
import { OneToOne, JoinColumn, ManyToOne, JoinTable, Entity, Column, PrimaryGeneratedColumn, Generated, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Files {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @Column()
  filePath: string;

  @Column()
  fileType: string;

  @ManyToOne(() => Applications, (application) => application.files)
  application: Applications;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}