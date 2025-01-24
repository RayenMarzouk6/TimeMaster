import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from 'src/app/services/student.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { InstitutionService } from 'src/app/services/institution.service'; // Import InstitutionService
import { AuthService } from 'src/app/services/auth.service';
interface UserDetails {
  username: string;
  email: string;
  cin: string;
  id: string;
  role: string;
  classId: string; // Assuming classId is part of user details

}
@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  totalTeachers: number = 0;
  totalStudents: number = 0;
  totalInstitutions: number = 0; // Add institution count property
  todayDate: string = '';
  searchQuery: string = '';
  userDetails: UserDetails = { username: '', email: '', cin: '', id: '', role: '', classId: '' };  // Include classId in userDetails

  constructor(
    private teacherService: TeacherService,
    private studentService: StudentService,
    private institutionService: InstitutionService, // Inject InstitutionService
    private router: Router,
    private authService: AuthService
  ) {}

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
    } else if (query.includes('home') || query.includes('admin')) {
      this.router.navigate(['/admin/home']);
    }
  }

  ngOnInit(): void { 
    const fetchedDetails = this.authService.getUserDetails();
    if (fetchedDetails) {
      this.userDetails = fetchedDetails;
      console.log('Logged in user details:', this.userDetails);
      
      
    this.getTeachersCount();
    this.getStudentsCount();
    this.getInstitutionsCount(); // Fetch institution count
    this.formatTodayDate();
    }}
  

  // Fetch total teachers count
  getTeachersCount(): void {
    this.teacherService.getAllTeachers().subscribe((teachers: any[]) => {
      this.totalTeachers = teachers.length; // Assuming the response is an array
    });
  }

  // Fetch total students count
  getStudentsCount(): void {
    this.studentService.getAllStudents().subscribe(students => {
      this.totalStudents = students.length;  // Assuming the response is an array
    });
  }

  // Fetch total institutions count
  getInstitutionsCount(): void {
    this.institutionService.getAll().subscribe(institutions => {
      this.totalInstitutions = institutions.length;  // Assuming the response is an array
    });
  }

  // Format today's date as "January 4, 2025"
  formatTodayDate(): void {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    this.todayDate = new Date().toLocaleDateString('en-US', options);
  }
}