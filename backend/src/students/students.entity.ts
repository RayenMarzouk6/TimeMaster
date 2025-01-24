import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Class } from '../class/class.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;



  @ManyToOne(() => Class, (classEntity) => classEntity.students, { nullable: true })
  class: Class;
}
