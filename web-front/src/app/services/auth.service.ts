import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';  // Update with your backend URL
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private token: string | null = null;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')!));
    this.currentUser = this.currentUserSubject.asObservable();
    this.token = localStorage.getItem('accessToken');
  }

  login(cin: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { cin, password }).pipe(
      catchError(this.handleError),
      tap(response => {
        if (response && response.accessToken) {
          this.setToken(response.accessToken);
          console.log('Login successful:', response);
          
          // Decode the token to get the user details
          const decodedToken: any = jwtDecode(response.accessToken);
          this.setCurrentUser({
            username: decodedToken.username,
            email: decodedToken.email || 'No email found',
            cin: decodedToken.cin || 'No CIN found',
            id: decodedToken.sub,
            role: decodedToken.role,
            classId: decodedToken.classId || 'No class ID found'  // Adding classId from the decoded token
          });

          // Redirect based on the user's role
          this.redirectUser(decodedToken.role);
        }
      })
    );
  }

  // Method to redirect the user based on their role
  private redirectUser(role: string): void {
    if (role === 'student') {
      this.router.navigate(['/user']);
    } else if (role === 'teacher') {
      this.router.navigate(['/teacher']);
    } else if (role === 'admin') {
      this.router.navigate(['/admin/home']);
    } else {
      console.error('Unknown role:', role);
    }
  }

  setCurrentUser(user: any): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  getUserDetails(): any {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);
      return {
        username: decodedToken.username || 'No username found',
        email: decodedToken.email || 'No email found',
        cin: decodedToken.cin || 'No CIN found',
        id: decodedToken.sub || 'No ID found',
        role: decodedToken.role || 'No role found',
        classId: decodedToken.classId || 'No class ID found'  // Adding classId from the decoded token
      };
    }
    return null;
  }
   

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('accessToken', token);
  }

  private handleError(error: any): Observable<never> {
    console.error('Error occurred:', error);
    throw error;
  }
}
