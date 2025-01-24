import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScheduleService } from 'src/app/services/schedule.service';
import { AuthService } from 'src/app/services/auth.service';
import { ClassService } from 'src/app/services/class.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { SubjectService } from 'src/app/services/subject.services';

@Component({
  selector: 'app-admin-schedule',
  templateUrl: './admin-schedule.component.html',
  styleUrls: ['./admin-schedule.component.css'],
})
export class AdminScheduleComponent implements OnInit {
  schedules: any[] = [];
  timeSlots = [
    { time: '08:00 - 09:00' },
    { time: '09:00 - 10:00' },
    { time: '10:00 - 11:00' },
    { time: '11:00 - 12:00' },
    { time: '12:00 - 13:00' },
    { time: '13:00 - 14:00' },
    { time: '14:00 - 15:00' },
    { time: '15:00 - 16:00' },
  ];
  days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  selectedDay = '';
  selectedTeacher = '';
  selectedClass = '';
  searchQuery = '';
  currentDate = new Date();
  isModalOpen = false;

  newSchedule = {
    teacherName: '',
    subjectName: '',
    className: '',
    duration: '',
  };
  teachers: any[] = [];
  subjects: any[] = [];
  classes: any[] = [];

  userDetails = { username: '', email: '', cin: '', id: '', role: '', classId: '' };

  constructor(
    private scheduleService: ScheduleService,
    private router: Router,
    private authService: AuthService,
    private teacherService: TeacherService,
    private subjectService: SubjectService,
    private classService: ClassService
  ) {}

  ngOnInit(): void {
    this.loadUserDetails();
    this.loadTeachers();
    this.loadSubjects();
    this.loadClasses();
    this.fetchSchedules();
  }

  loadUserDetails(): void {
    this.userDetails = this.authService.getUserDetails() || this.userDetails;
  }

  loadTeachers(): void {
    this.teacherService.getAllTeachers().subscribe(
      (data) => (this.teachers = data),
      (error) => console.error('Error fetching teachers:', error)
    );
  }

  loadSubjects(): void {
    this.subjectService.getAllSubjects().subscribe(
      (data) => (this.subjects = data),
      (error) => console.error('Error fetching subjects:', error)
    );
  }

  loadClasses(): void {
    this.classService.getClasses().subscribe(
      (data) => (this.classes = data),
      (error) => console.error('Error fetching classes:', error)
    );
  }

  fetchSchedules(): void {
    this.scheduleService.getSchedules().subscribe(
      (data) => (this.schedules = data),
      (error) => console.error('Error fetching schedules:', error)
    );
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveSchedule(): void {
    if (this.newSchedule.teacherName && this.newSchedule.subjectName && this.newSchedule.className && this.newSchedule.duration) {
      this.scheduleService.addSchedule([this.newSchedule]).subscribe(
        () => {
          this.fetchSchedules();
          this.closeModal();
        },
        (error) => console.error('Error saving schedule:', error)
      );
    } else {
      alert('Please fill in all fields.');
    }
  }

  printSchedule(): void {
    window.print();
  }

  get filteredSchedules(): any[] {
    return this.schedules.filter((schedule) => {
      return (
        (!this.selectedDay || schedule.day === this.selectedDay) &&
        (!this.selectedTeacher ||
          schedule.teacher?.name.toLowerCase().includes(this.selectedTeacher.toLowerCase())) &&
        (!this.selectedClass ||
          schedule.class?.name.toLowerCase().includes(this.selectedClass.toLowerCase()))
      );
    });
  }

  getCoursesForSlotAndDay(slot: any, day: string): any[] {
    return this.filteredSchedules.filter((schedule) => {
      const [slotStart, slotEnd] = slot.time.split(' - ');
      return (
        schedule.startTime === slotStart &&
        schedule.endTime === slotEnd &&
        schedule.day === day
      );
    });
  }
  logout() {
    this.authService.logout(); // Call the logout method from AuthService
  }
  onSearch() {
    const query = this.searchQuery.toLowerCase().trim();

    if (query.includes('schedule') || query.includes('emploi')) {
      this.router.navigate(['/admin/schedule']);
    } else if (query.includes('student') || query.includes('students')) {
      this.router.navigate(['/admin/student']);
    } else if (query.includes('teacher') || query.includes('teachers')) {
      this.router.navigate(['/admin/teachers']);
    } else if (query.includes('emploi') || query.includes('classes')) {
      this.router.navigate(['/admin/classes']);
    } else if (query.includes('subject') || query.includes('courses')) {
      this.router.navigate(['/admin/courses']);
    } else if (query.includes('classrooms') || query.includes('salle') || query.includes('salles')) {
      this.router.navigate(['/admin/classrooms']);
    }else if (query.includes('home') || query.includes('admin')){
      this.router.navigate(['/admin/home']);
    }
  }
  
} 