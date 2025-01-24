import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ReclamationService } from 'src/app/services/reclamation.service';
interface UserDetails {
  username: string;
  email: string;
  cin: string;
  id: string;
  role: string;
  classId: string; // Assuming classId is part of user details

}
@Component({
  selector: 'app-admin-reclamation',
  templateUrl: './admin-reclamation.component.html',
  styleUrls: ['./admin-reclamation.component.css']
})
export class AdminReclamationComponent {
  reclamationData = { name: '', email: '', message: '' };
  reclamations: any[] = [];

  searchQuery: string = '';
  userDetails: UserDetails = { username: '', email: '', cin: '', id: '', role: '', classId: '' };  // Include classId in userDetails


  constructor(private reclamationService: ReclamationService, private router: Router,private authService: AuthService) {}
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
  

  // Method to handle form submission
  submitReclamation() {
    this.reclamationService.createReclamation(this.reclamationData).subscribe(
      (response) => {
        console.log('Reclamation sent successfully', response);
        this.loadReclamations();  // Reload the list of reclamations
      },
      (error) => {
        console.error('Error sending reclamation', error);
      }
    );
  }

  // Method to load all reclamations
  loadReclamations() {
    this.reclamationService.getAllReclamations().subscribe(
      (reclamations) => {
        this.reclamations = reclamations;
      },
      (error) => {
        console.error('Error loading reclamations', error);
      }
    );
  }

  ngOnInit() {
    const fetchedDetails = this.authService.getUserDetails();
    if (fetchedDetails) {
      this.userDetails = fetchedDetails;
      console.log('Logged in user details:', this.userDetails);
      
   
    this.loadReclamations();  // Load reclamations on component initialization
  }
}}


