import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from 'src/class/class.entity';
import { Classroom } from 'src/classroom/classroom.entity';
import { Subject } from 'src/subject/subject.entity';
import { Teacher } from 'src/teachers/teachers.entity';
import { Schedule } from './schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule) private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Class) private classRepository: Repository<Class>,
    @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
    @InjectRepository(Classroom) private classroomRepository: Repository<Classroom>,
    @InjectRepository(Subject) private subjectRepository: Repository<Subject>,
  ) {}

  async generateTimetable(createScheduleDto: any): Promise<Schedule[]> {
    const { teacherName, subjectName, className, duration } = createScheduleDto;

    // Find teacher, subject, and class
    const teacher = await this.teacherRepository.findOne({ where: { name: teacherName } });
    if (!teacher) {
      throw new NotFoundException(`Teacher "${teacherName}" not found.`);
    }

    const subject = await this.subjectRepository.findOne({ where: { name: subjectName } });
    if (!subject) {
      throw new NotFoundException(`Subject "${subjectName}" not found.`);
    }

    const classEntity = await this.classRepository.findOne({ where: { name: className } });
    if (!classEntity) {
      throw new NotFoundException(`Class "${className}" not found.`);
    }

    // Find available classrooms for the subject
    const availableClassrooms = await this.classroomRepository.find({
      where: { subjects: { id: subject.id } },
    });
    if (availableClassrooms.length === 0) {
      throw new NotFoundException(`No available classrooms for subject "${subjectName}".`);
    }

    // Check for conflicts
    const existingTeacherSchedule = await this.scheduleRepository.findOne({
      where: {
        teacher: { id: teacher.id },
        class: { id: classEntity.id },
        day: createScheduleDto.day,
      },
    });
    if (existingTeacherSchedule) {
      throw new ConflictException(`Teacher "${teacherName}" is already assigned to another subject for class "${className}" on ${createScheduleDto.day}.`);
    }

    const existingSchedule = await this.scheduleRepository.findOne({
      where: {
        class: { id: classEntity.id },
        subject: { id: subject.id },
      },
    });
    if (existingSchedule) {
      throw new ConflictException(`Subject "${subjectName}" is already assigned to another teacher for class "${className}".`);
    }

    // Generate timetable
    const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const teacherWeeklyLimit = 8; // Teacher's weekly hour limit
    let teacherHoursAssigned = 0;

    const timetable: Schedule[] = [];
    const maxDuration = this.parseDuration(duration)[0];

    for (const day of daysOfWeek) {
      if (teacherHoursAssigned >= teacherWeeklyLimit) break;

      let startTime = '08:00';
      let dayDuration = 0;

      while (dayDuration < maxDuration && teacherHoursAssigned < teacherWeeklyLimit) {
        const availableDuration = Math.min(maxDuration - dayDuration, 1);
        const currentDuration = `${availableDuration}h`;
        const endTime = this.addTime(startTime, currentDuration);

        // Skip lunch break (12:00-13:00)
        if (startTime >= '12:00' && startTime < '13:00') {
          startTime = '13:00';
          continue;
        }

        // Check teacher and classroom availability
        const isTeacherAvailable = await this.checkTeacherAvailability(teacher.id, day, startTime, endTime);
        let classroomAssigned = null;

        for (const classroom of availableClassrooms) {
          const isClassroomAvailable = await this.checkClassroomAvailability(classroom.id, day, startTime, endTime);

          if (isTeacherAvailable && isClassroomAvailable) {
            const isSubjectAssigned = await this.checkSubjectAssignedToClass(classEntity.id, subject.id, day, startTime, endTime);
            if (!isSubjectAssigned) {
              classroomAssigned = classroom;
              break;
            }
          }
        }

        if (classroomAssigned && teacherHoursAssigned + availableDuration <= teacherWeeklyLimit) {
          const schedule = new Schedule();
          schedule.day = day;
          schedule.startTime = startTime;
          schedule.endTime = endTime;
          schedule.duree = currentDuration;
          schedule.teacher = teacher;
          schedule.subject = subject;
          schedule.classroom = classroomAssigned;
          schedule.class = classEntity;

          timetable.push(schedule);
          teacherHoursAssigned += availableDuration;
          dayDuration += availableDuration;
          startTime = endTime;
        } else {
          startTime = this.addTime(startTime, '1h');
        }
      }
    }

    // Save timetable
    await this.scheduleRepository.save(timetable);
    return timetable;
  }

  async checkSubjectAssignedToClass(classId: number, subjectId: number, day: string, startTime: string, endTime: string): Promise<boolean> {
    const existingSchedules = await this.scheduleRepository.find({
      where: { class: { id: classId }, subject: { id: subjectId }, day },
    });

    return existingSchedules.some(
      (schedule) => schedule.startTime < endTime && schedule.endTime > startTime,
    );
  }

  addTime(startTime: string, duration: string): string {
    const [hoursToAdd, minutesToAdd] = this.parseDuration(duration);
    const [hours, minutes] = startTime.split(':').map(Number);

    const newTime = new Date();
    newTime.setHours(hours + hoursToAdd);
    newTime.setMinutes(minutes + minutesToAdd);

    return newTime.toTimeString().slice(0, 5);
  }

  parseDuration(duration: string): [number, number] {
    if (!duration) {
      throw new Error('Duration is missing or invalid.');
    }

    const match = duration.match(/^(\d+)(h|m)$/);
    if (!match) {
      throw new Error('Duration is missing or invalid.');
    }

    const value = parseInt(match[1], 10);
    return match[2] === 'h' ? [value, 0] : [0, value];
  }

  async checkTeacherAvailability(teacherId: number, day: string, startTime: string, endTime: string): Promise<boolean> {
    const existingSchedules = await this.scheduleRepository.find({
      where: { teacher: { id: teacherId }, day },
    });

    return !existingSchedules.some(
      (schedule) => schedule.startTime < endTime && schedule.endTime > startTime,
    );
  }

  async checkClassroomAvailability(classroomId: number, day: string, startTime: string, endTime: string): Promise<boolean> {
    const existingSchedules = await this.scheduleRepository.find({
      where: { classroom: { id: classroomId }, day },
    });

    return !existingSchedules.some(
      (schedule) => schedule.startTime < endTime && schedule.endTime > startTime,
    );
  }

  async getTimetable(): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      relations: ['teacher', 'subject', 'classroom', 'class'],
    });
  }
}