import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Teacher {
  id: number;
  name: string;
  cin: string;
  subjects: string[];
}

@Injectable({
  providedIn: 'root',
})
export class InstructorService {
  private apiUrl = 'http://localhost:3000/teachers'; // Adjust the API URL as needed

  constructor(private http: HttpClient) {}

  // Get all teachers
  getAllTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.apiUrl);
  }

  getTeacherById(id: number): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.apiUrl}/${id}`);
  }

  // Create a new teacher
  createTeacher(name: string, cin: string, subjects: string[]): Observable<Teacher> {
    const teacherData = { name, cin, subjects };
    return this.http.post<Teacher>(this.apiUrl, teacherData);
  }

  // Update an existing teacher
  updateTeacher(id: number, name: string, cin: string, subjects: string[]): Observable<Teacher> {
    const teacherData = { name, cin, subjects };
    return this.http.put<Teacher>(`${this.apiUrl}/${id}`, teacherData);
  }

  // Delete a teacher
  deleteTeacher(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get teacher by CIN
  getTeacherByCIN(cin: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cin/${cin}`);
  }
}
