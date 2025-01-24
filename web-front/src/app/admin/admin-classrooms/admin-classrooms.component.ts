import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ClassroomService } from 'src/app/services/classroom.service';
interface UserDetails {
  username: string;
  email: string;
  cin: string;
  id: string;
  role: string;
  classId: string; // Assuming classId is part of user details

}
@Component({
  selector: 'app-admin-classrooms',
  templateUrl: './admin-classrooms.component.html',
  styleUrls: ['./admin-classrooms.component.css']
})
export class AdminClassroomsComponent {
  classrooms: any[] = [];  // Array to hold classrooms
  newClassroom: any = { name: '', institutionId: '' };  // Model for creating a new classroom
  isEditing: boolean = false;  // Flag to track if we're editing a classroom
  editingClassroom: any = {};  // Holds the classroom being edited
  searchQuery: string = '';
  userDetails: UserDetails = { username: '', email: '', cin: '', id: '', role: '', classId: '' };  // Include classId in userDetails

  constructor(private classroomService: ClassroomService, private router: Router,private authService: AuthService) {}

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
      
   
    this.fetchClassrooms();  // Fetch classrooms on initialization
  }}

  // Fetch classrooms from the backend
  fetchClassrooms(): void {
    console.log('Fetching classrooms...');
    this.classroomService.getClassrooms().subscribe(
      (data) => {
        console.log('Classrooms fetched:', data);
        this.classrooms = data;
      },
      (error) => {
        console.error('Error fetching classrooms:', error);
      }
    );
  }

  // Create a new classroom
  createClassroom(): void {
    if (this.newClassroom.name && this.newClassroom.institutionId) {
      console.log('Creating classroom:', this.newClassroom);
      this.classroomService.createClassroom(this.newClassroom).subscribe(
        (data) => {
          console.log('Classroom created:', data);
          this.fetchClassrooms();  // Re-fetch classrooms after creation
          this.newClassroom = { name: '', institutionId: '' };  // Reset form
        },
        (error) => {
          console.error('Error creating classroom:', error);
        }
      );
    } else {
      console.error('Form data is invalid');
    }
  }

  // Edit a classroom
  editClassroom(classroom: any): void {
    this.isEditing = true;
    this.editingClassroom = { ...classroom };  // Copy the classroom data for editing
    console.log('Editing classroom:', this.editingClassroom);
  }

  // Update a classroom
  updateClassroom(): void {
    if (this.editingClassroom.name && this.editingClassroom.institutionId) {
      console.log('Updating classroom:', this.editingClassroom);
      this.classroomService.updateClassroom(this.editingClassroom.id, this.editingClassroom).subscribe(
        (data) => {
          console.log('Classroom updated:', data);
          this.fetchClassrooms();  // Re-fetch classrooms after update
          this.isEditing = false;
          this.editingClassroom = {};  // Reset the editing form
        },
        (error) => {
          console.error('Error updating classroom:', error);
        }
      );
    } else {
      console.error('Form data is invalid');
    }
  }

  // Delete a classroom
  deleteClassroom(id: number): void {
    if (confirm('Are you sure you want to delete this classroom?')) {
      console.log('Deleting classroom with id:', id);
      this.classroomService.deleteClassroom(id).subscribe(
        () => {
          console.log('Classroom deleted');
          this.fetchClassrooms();  // Re-fetch classrooms after deletion
        },
        (error) => {
          console.error('Error deleting classroom:', error);
        }
      );
    }
  }
}
