import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id?: number;
  username: string;
  cin: string;
  email: string;
  password?: string;
  role: 'admin' | 'teacher' | 'student';
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `http://localhost:3000/users`; // Base URL for the backend API

  constructor(private http: HttpClient) {}

  // Get all users
  findAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Get a user by ID
  findOne(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Create a new user
  create(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // Update an existing user
  update(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // Delete a user
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Verify user and send email
  verifyUserAndSendEmail(cin: string, email: string): Observable<string> {
    const body = { cin, email };
    return this.http.post<string>(`${this.apiUrl}/verify`, body);
  }
}
