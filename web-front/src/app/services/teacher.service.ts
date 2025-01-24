import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private baseUrl = 'http://localhost:3000/teachers'; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  getAllTeachers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  addTeacher(teacher: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, teacher);
  } 
  getTeacherByCIN(cin: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/cin/${cin}`);
  }

// Update an existing teacher
updateTeacher(cin: string, teacher: Partial<any>): Observable<any> {
  const url = `${this.baseUrl}/cin/${cin}`;
  return this.http.put<any>(url, teacher);
}



  // Delete teacher by CIN
  deleteTeacher(cin: string): Observable<any> {
    const url = `${this.baseUrl}/${cin}`;
    return this.http.delete<any>(url);
  }
 
}
