import { Schedule } from 'src/schedule/schedule.entity';
import { Student } from 'src/students/students.entity';
import { Teacher } from 'src/teachers/teachers.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity("classes")
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  level: string; 
 

  @OneToMany(() => Student, (student) => student.class)
  students: Student[];
  @OneToMany(() => Schedule, (schedule) => schedule.class)
  schedules: Schedule[];
}
