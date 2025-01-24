import { Class } from 'src/class/class.entity';
import { Schedule } from 'src/schedule/schedule.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  username: string;
  @Column({ unique: true })
  cin: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ type: 'enum', enum: ['admin', 'teacher', 'student'], default: 'student' })
  role: 'admin' | 'teacher' | 'student';

 
}
