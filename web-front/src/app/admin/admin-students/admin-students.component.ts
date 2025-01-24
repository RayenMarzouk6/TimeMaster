import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service'; // Ensure UserService is imported
interface UserDetails {
  username: string;
  email: string;
  cin: string;
  id: string;
  role: string;
  classId: string; // Assuming classId is part of user details
}
@Component({
  selector: 'app-admin-students',
  templateUrl: './admin-students.component.html',
  styleUrls: ['./admin-students.component.css']
})
export class AdminStudentsComponent implements OnInit {
  students: any[] = [];
  searchQuery: string = '';

  constructor(
    private userService: UserService, // Inject UserService
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const fetchedDetails = this.authService.getUserDetails();
    if (fetchedDetails) {
      this.userDetails = fetchedDetails;
      console.log('Logged in user details:', this.userDetails);
      
   
    this.getStudents(); // Fetch students when the component loads
  }}
  userDetails: UserDetails = { username: '', email: '', cin: '', id: '', role: '', classId: '' };  // Include classId in userDetails

  getStudents(): void {
    this.userService.findAll().subscribe((data: any[]) => {
      // Filter out only students
      const studentsData = data.filter(user => user.role === 'student');
      console.log('Filtered Students:', studentsData);

      // Add class names to students
      this.students = studentsData.map(student => {
        const studentClass = student.class; // Directly access the class from the user entity
        return {
          name: student.username, // Assuming username is the student's name
          class: studentClass ? studentClass.name : 'No class'
        };
      });
      console.log('Students with class names:', this.students);
    });
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
    } else if (query.includes('home') || query.includes('admin')) {
      this.router.navigate(['/admin/home']);
    }
  }

 
  deleteStudent(studentId: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this student?');
    if (confirmDelete) {
      this.userService.delete(studentId).subscribe(() => {
        this.getStudents(); // Refresh the student list after deleting
      });
    }
  }
}
