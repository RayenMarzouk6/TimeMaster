import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ClassroomService } from 'src/app/services/classroom.service';
import { SubjectService } from 'src/app/services/subject.services';
interface UserDetails {
  username: string;
  email: string;
  cin: string;
  id: string;
  role: string;
  classId: string; // Assuming classId is part of user details

}
@Component({
  selector: 'app-admin-course',
  templateUrl: './admin-course.component.html',
  styleUrls: ['./admin-course.component.css']
})
export class AdminCourseComponent implements OnInit {
  courses: any[] = [];
  courseName: string = '';
  searchQuery: string = '';
  courseToUpdate: any = null; // Property for course to update
  classrooms: any[] = []; // Array to hold classrooms
  selectedClassrooms: number[] = []; // Array to hold selected classroom IDs
  userDetails: UserDetails = { username: '', email: '', cin: '', id: '', role: '', classId: '' };  // Include classId in userDetails

  constructor(
    private courseService: SubjectService, 
    private router: Router, 
    private classroomService: ClassroomService,
    private authService: AuthService
  ) {}

  // Search functionality to navigate based on query
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

  // Load classrooms from the ClassroomService
  loadClassrooms(): void {
    this.classroomService.getClassrooms().subscribe((data) => {
      this.classrooms = data;  // Populate the classrooms array with the fetched data
    });
  }

  ngOnInit(): void {
    const fetchedDetails = this.authService.getUserDetails();
    if (fetchedDetails) {
      this.userDetails = fetchedDetails;
      console.log('Logged in user details:', this.userDetails);
      
   
    this.loadCourses();
    this.loadClassrooms();  // Fetch classrooms when the component initializes
  }}

  loadCourses(): void {
    this.courseService.getAllSubjects().subscribe((data) => {
      console.log(data); // Log the data to check the structure
      this.courses = data;
    });
  }
  

  // Add a new course
  addCourse(): void {
    if (!this.courseName.trim()) {
      alert('Course name is required!');
      return;
    }

    const newCourse = {
      name: this.courseName,
      classroomIds: this.selectedClassrooms // Add selected classroom IDs
    };

    this.courseService.createSubject(newCourse.name, newCourse.classroomIds).subscribe(() => {
      this.loadCourses();
      this.courseName = ''; // Clear input field after adding course
      this.selectedClassrooms = []; // Clear selected classrooms after adding course
    });
  }

  // Delete a course with confirmation prompt
  deleteCourse(id: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this course?');
    if (confirmDelete) {
      this.courseService.deleteSubject(id).subscribe(() => {
        this.loadCourses(); // Refresh course list after deleting
      });
    }
  }

  // Method to open the update form with the selected course data
  openUpdateForm(course: any) {
    this.courseToUpdate = { ...course };  // Copy the course data to courseToUpdate
    this.courseName = course.name;  // Set the course name in the input field
    this.selectedClassrooms = course.classroomIds || [];  // Set selected classrooms for the course
  }

  // Method to update the course
  updateCourse(): void {
    if (!this.courseName.trim()) {
      alert('Course name is required!');
      return;
    }

    const updatedCourseData = {
      name: this.courseName,
      classroomIds: this.selectedClassrooms // Use selected classrooms for update
    };

    if (this.courseToUpdate) {
      this.courseService.updateSubject(this.courseToUpdate.id, updatedCourseData.name, updatedCourseData.classroomIds).subscribe(() => {
        this.loadCourses();
        this.courseName = ''; // Clear input field after updating
        this.selectedClassrooms = []; // Clear selected classrooms after updating
        this.courseToUpdate = null; // Reset the courseToUpdate after updating
      });
    }
  }
}
