import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],  // Optional, if you have custom styles
})
export class LoginComponent {
  identifier: string = '';  // For CIN input
  password: string = '';    // For password input
  errorMessage: string = '';  // For error messages

  constructor(private authService: AuthService, private router: Router) {}

  // Handle form submission
  onSubmit() {
    this.authService.login(this.identifier, this.password).subscribe(
      (response) => {
        // No need to manually navigate here
        console.log('Login successful:', response);
      },
      (error) => {
        this.errorMessage = 'Invalid credentials or an error occurred.';
        console.error('Login error:', error);
      }
    );
  }
}
