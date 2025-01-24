import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  cin: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const userData = { email: this.email, cin: this.cin };

    this.http.post('http://localhost:3000/users/verify', userData, { responseType: 'text' }).subscribe(
      (response: string) => {
        console.log('Response received:', response); // Debugging line
        if (response === 'Email envoyé avec succès.') {
          this.router.navigate(['/checkemail']);
        }
      },
      (error) => {
        console.log('Error:', error); // Debugging line
        if (error.status === 500) {
          this.errorMessage = 'Sorry, you do not exist in the database.';
        } else {
          this.errorMessage = 'An error occurred. Please try again later.';
        }
      }
    );
  }
}
