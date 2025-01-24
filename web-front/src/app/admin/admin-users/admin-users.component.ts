import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User, UserService } from 'src/app/services/user.service';
interface UserDetails {
  username: string;
  email: string;
  cin: string;
  id: string;
  role: string;
  classId: string; // Assuming classId is part of user details

}
@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent {
  users: User[] = [];
  searchQuery: string = '';
  userForm: Partial<User> = {
    username: '',
    cin: '',
    email: '',
    password: '',
    role: 'admin',
  };
  isUpdating: boolean = false;
  currentUserId: number | null = null;
  userDetails: UserDetails = { username: '', email: '', cin: '', id: '', role: '', classId: '' };  // Include classId in userDetails

  constructor(private userService: UserService,private authService: AuthService) {}
  ngOnInit(): void {
    const fetchedDetails = this.authService.getUserDetails();
    if (fetchedDetails) {
      this.userDetails = fetchedDetails;
      console.log('Détails de l\'utilisateur connecté:', this.userDetails);
      this.loadUsers();

    }
  }
  // Load all users
  loadUsers(): void {
    this.userService.findAll().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error loading users:', err);
      },
    });
  }

  // Search users
  onSearch(): void {
    const query = this.searchQuery.toLowerCase();
    this.users = this.users.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.cin.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  }
  createUser(): void {
    // Check if the email already exists
    const existingUser = this.users.find(user => user.email === this.userForm.email);
    if (existingUser) {
      console.error('Error: Email already exists');
      return; // Prevent user creation if email exists
    }
  
    this.userService.create(this.userForm).subscribe({
      next: (data) => {
        this.users.push(data);
        this.resetForm();
      },
      error: (err) => {
        console.error('Error creating user:', err);
      },
    });
  }
  

  // Open update form with pre-filled data
  openUpdateForm(user: User): void {
    this.isUpdating = true;
    this.currentUserId = user.id || null;
    this.userForm = { ...user };
  }

  // Update user details
  updateUser(): void {
    if (this.currentUserId !== null) {
      this.userService.update(this.currentUserId, this.userForm).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex((u) => u.id === this.currentUserId);
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
          this.resetForm();
        },
        error: (err) => {
          console.error('Error updating user:', err);
        },
      });
    }
  }

  // Delete a user
  deleteUser(userId: number): void {
    this.userService.delete(userId).subscribe({
      next: () => {
        this.users = this.users.filter((user) => user.id !== userId);
      },
      error: (err) => {
        console.error('Error deleting user:', err);
      },
    });
  }

  // Reset form and state
  resetForm(): void {
    this.isUpdating = false;
    this.currentUserId = null;
    this.userForm = {
      username: '',
      cin: '',
      email: '',
      password: '',
      role: 'admin',
    };
  }
  
}