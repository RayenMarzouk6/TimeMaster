import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private apiUrl = 'http://localhost:3000/students'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getAllStudents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addStudent(student: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, student);
  }

  deleteStudent(studentId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${studentId}`);
  }
}
