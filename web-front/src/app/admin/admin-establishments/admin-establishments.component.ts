import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { InstitutionService } from 'src/app/services/institution.service';
interface UserDetails {
  username: string;
  email: string;
  cin: string;
  id: string;
  role: string;
  classId: string; // Assuming classId is part of user details

}
@Component({
  selector: 'app-admin-establishments',
  templateUrl: './admin-establishments.component.html',
  styleUrls: ['./admin-establishments.component.css']
})
export class AdminEstablishmentsComponent implements OnInit {
  searchQuery: string = '';
  newInstitution = {
    id: undefined,
    name: '',
    address: '',
    phone: '',
    email: '',
    classroomNames: [''], // Default with one classroom name input
    classrooms: [] as { name: string }[] // Explicitly type classrooms as an array of objects with a 'name' property
  };
  institutions: any[] = [];
  isEditMode: boolean = false;
  userDetails: UserDetails = { username: '', email: '', cin: '', id: '', role: '', classId: '' };  // Include classId in userDetails

  constructor(
    private router: Router,
    private institutionService: InstitutionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const fetchedDetails = this.authService.getUserDetails();
    if (fetchedDetails) {
      this.userDetails = fetchedDetails;
      console.log('Logged in user details:', this.userDetails);
      
   
    this.loadInstitutions();
  }}

  loadInstitutions() {
    this.institutionService.getAll().subscribe(
      (data) => {
        console.log('Institutions loaded:', data);
        this.institutions = data;
      },
      (error) => {
        console.error('Error loading institutions', error);
      }
    );
  }

  addInstitution() {
    this.institutionService.create(this.newInstitution).subscribe(
      (data) => {
        this.institutions.push(data);
        this.resetForm();
      },
      (error) => {
        console.error('Error adding institution', error);
      }
    );
  }

  deleteInstitution(id: number) {
    this.institutionService.delete(id).subscribe(
      () => {
        this.institutions = this.institutions.filter(institution => institution.id !== id);
      },
      (error) => {
        console.error('Error deleting institution', error);
      }
    );
  }

  getClassroomsNames(classrooms: any[]): string {
    if (classrooms && classrooms.length > 0) {
      const names = classrooms.map((classroom: { name: string }) => classroom.name || 'Unnamed Classroom');
      return names.join(', ');
    }
    return 'No classrooms ';
  }

  editInstitution(institution: any) {
    this.isEditMode = true;
    this.newInstitution = { 
      ...institution, 
      classroomNames: institution.classrooms.map((classroom: { name: string }) => classroom.name || '') // Pre-fill classroom names
    };
  }

  addOrUpdateInstitution() {
    if (this.isEditMode) {
      this.updateInstitution();
    } else {
      this.addInstitution();
    }
  }

  updateInstitution() {
    if (this.newInstitution.id) {
      // Update classroom names if any
      this.newInstitution.classrooms = this.newInstitution.classroomNames.map(name => ({ name }));

      this.institutionService.update(this.newInstitution.id, this.newInstitution).subscribe(
        (data) => {
          const index = this.institutions.findIndex(institution => institution.id === data.id);
          if (index !== -1) {
            this.institutions[index] = data;
          }
          this.resetForm();
        },
        (error) => {
          console.error('Error updating institution', error);
        }
      );
    }
  }

  resetForm() {
    this.isEditMode = false;
    this.newInstitution = { id: undefined, name: '', address: '', phone: '', email: '', classroomNames: [''], classrooms: [] };
  }

  addClassroom() {
    this.newInstitution.classroomNames.push(''); // Add a new classroom name input
  }

  removeClassroom(index: number) {
    this.newInstitution.classroomNames.splice(index, 1); // Remove a classroom name input
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
}
