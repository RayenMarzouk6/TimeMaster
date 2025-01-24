import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherService } from 'src/app/services/teacher.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { SubjectService } from 'src/app/services/subject.services';

interface UserDetails {
  username: string;
  email: string;
  cin: string;
  id: string;
  role: string;
  classId: string; // Supposons que classId fait partie des détails de l'utilisateur
}

@Component({
  selector: 'app-admin-teachers',
  templateUrl: './admin-teachers.component.html',
  styleUrls: ['./admin-teachers.component.css']
})
export class AdminTeachersComponent implements OnInit {
  teachers: any[] = [];
  teacherName: string = '';
  teacherSubjects: string[] = [];
  searchQuery: string = '';
  subjects: any[] = [];
  newSubject: string = '';
  isEditing: boolean = false;
  currentTeacherCIN: string | null = null;
  teacherCIN: string = ''; // Pour l'entrée CIN
  selectedTeacher: any = null; // Pour contenir les détails de l'enseignant récupéré
  userDetails: UserDetails = { username: '', email: '', cin: '', id: '', role: '', classId: '' };

  // Attribuer manuellement l'ID de départ
  private nextId: number = 9;

  constructor(
    private teacherService: TeacherService,
    private subjectService: SubjectService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const fetchedDetails = this.authService.getUserDetails();
    if (fetchedDetails) {
      this.userDetails = fetchedDetails;
      console.log('Détails de l\'utilisateur connecté:', this.userDetails);
      this.fetchTeachers();
      this.fetchSubjects();
    }
  }

  // Method to edit teacher details
  editTeacher(teacher: any): void {
    this.isEditing = true;
    this.currentTeacherCIN = teacher.cin;  // Store the original CIN for updating
    this.teacherName = teacher.name;
    this.teacherCIN = teacher.cin;
    this.teacherSubjects = teacher.subjects ? teacher.subjects.map((subject: any) => subject.name) : [];
  }

  saveTeacher(): void {
    // Create the teacher data object
    const teacherData: any = {
      name: this.teacherName,
      cin: this.teacherCIN,
    };
  
    // Only include subjects if there are any selected
    if (this.teacherSubjects.length > 0) {
      teacherData.subjects = this.teacherSubjects;
    } else if (this.newSubject.trim() !== '') {
      // If there is a new subject entered, add it
      teacherData.subjects = [this.newSubject];
    }
  
    // Check if we are editing an existing teacher
    if (this.isEditing && this.currentTeacherCIN !== null) {
      // Update the teacher with the CIN
      this.teacherService.updateTeacher(this.currentTeacherCIN, teacherData).subscribe(
        () => {
          this.fetchTeachers();
          this.cancelEdit();
        },
        (error: HttpErrorResponse) => {
          console.error('Error updating teacher:', error);
        }
      );
    } else if (!this.isEditing) {
      // Create a new teacher
      this.teacherService.addTeacher(teacherData).subscribe(
        (newTeacher: any) => {
          this.fetchTeachers();
          this.cancelEdit();
        },
        (error: HttpErrorResponse) => {
          console.error('Error adding teacher:', error);
        }
      );
    }
  }
  

  // Method to cancel editing and reset form
  cancelEdit(): void {
    this.isEditing = false;
    this.currentTeacherCIN = null;
    this.resetForm();
  }

  fetchTeachers(): void {
    this.teacherService.getAllTeachers().subscribe(
      (teachers) => {
        console.log('Enseignants récupérés:', teachers);
        this.teachers = teachers;
      },
      (error: HttpErrorResponse) => {
        console.error('Erreur lors de la récupération des enseignants:', error);
      }
    );
  }

  fetchSubjects(): void {
    this.subjectService.getAllSubjects().subscribe(
      (subjects) => {
        this.subjects = subjects;
      },
      (error: HttpErrorResponse) => {
        console.error('Erreur lors de la récupération des matières:', error);
      }
    );
  }

  fetchTeacherByCIN(): void {
    if (!this.teacherCIN.trim()) {
      alert('Please enter a CIN.');
      return;
    }

    this.teacherService.getTeacherByCIN(this.teacherCIN).subscribe(
      (teacher: any) => {
        this.selectedTeacher = teacher;
        console.log('Fetched teacher by CIN:', teacher);
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching teacher by CIN:', error);
        alert('Teacher not found.');
      }
    );
  }

  deleteTeacher(cin: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) {
      this.teacherService.deleteTeacher(cin).subscribe(
        () => {
          this.fetchTeachers();
        },
        (error: HttpErrorResponse) => {
          console.error('Erreur lors de la suppression de l\'enseignant:', error);
        }
      );
    }
  }

  // Reset form fields
  resetForm(): void {
    this.teacherName = '';
    this.teacherCIN = '';
    this.teacherSubjects = [];
    this.newSubject = '';
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
