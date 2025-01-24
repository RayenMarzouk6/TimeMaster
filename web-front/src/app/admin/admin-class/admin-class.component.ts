import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ClassService } from 'src/app/services/class.service';
import { StudentService } from 'src/app/services/student.service';
interface UserDetails {
  username: string;
  email: string;
  cin: string;
  id: string;
  role: string;
  classId: string; // Assuming classId is part of user details

}
@Component({
  selector: 'app-admin-class',
  templateUrl: './admin-class.component.html',
  styleUrls: ['./admin-class.component.css']
})
export class AdminClassComponent implements OnInit {
  classes: any[] = [];
  students: any[] = [];
  newClass: { name: string; level: string; studentNames: string[] } = { name: '', level: '', studentNames: [] };
  editingClass: any = null; // To store the class being edited
  searchQuery: string = '';
  userDetails: UserDetails = { username: '', email: '', cin: '', id: '', role: '', classId: '' };  // Include classId in userDetails

  constructor(
    private classService: ClassService,
    private studentService: StudentService,
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
      
   
    this.getClasses();
    this.getStudents();
  }
  }
  getClasses(): void {
    this.classService.getClasses().subscribe({
      next: (data: any[]) => {
        this.classes = data;
        console.log('Classes:', this.classes);
      },
      error: (err) => {
        console.error('Error fetching classes:', err);
      }
    });
  }

  getStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (data: any[]) => {
        this.students = data;
        console.log('Students:', this.students);
      },
      error: (err) => {
        console.error('Error fetching students:', err);
      }
    });
  }
  addClass(): void {
    if (!this.newClass.name || !this.newClass.level || this.newClass.studentNames.length === 0) {
      console.warn('All fields are required to add a class.');
      return;
    }

    if (this.editingClass) {
      // Update existing class
      this.classService.updateClass(this.editingClass.id, this.newClass).subscribe({
        next: (updatedClass) => {
          // Update the class in the list
          const index = this.classes.findIndex(c => c.id === updatedClass.id);
          if (index !== -1) {
            this.classes[index] = updatedClass;
          }

          // Reset the form and stop editing
          this.resetForm();
          console.log('Class updated successfully:', updatedClass);
        },
        error: (err) => {
          console.error('Error updating class:', err);
        }
      });
    } else {
      // Add new class
      this.classService.addClass(this.newClass).subscribe({
        next: (createdClass) => {
          this.classes.push(createdClass);
          this.resetForm();
          console.log('Class added successfully:', createdClass);
        },
        error: (err) => {
          console.error('Error adding class:', err);
        }
      });
    }
  }

  resetForm(): void {
    this.newClass = { name: '', level: '', studentNames: [] };
    this.editingClass = null; // Clear editing state
  }

  deleteClass(classId: number): void {
    this.classService.deleteClass(classId).subscribe({
      next: () => {
        this.classes = this.classes.filter(c => c.id !== classId);
        console.log('Class deleted successfully:', classId);
      },
      error: (err) => {
        console.error('Error deleting class:', err);
      }
    });
  }

  editClass(classId: number): void {
    const classToEdit = this.classes.find(c => c.id === classId);
    if (classToEdit) {
      this.editingClass = classToEdit;
      this.newClass = { 
        name: classToEdit.name,
        level: classToEdit.level,
        studentNames: classToEdit.students.map((student: any) => student.username)
      };
    }
  }
}
