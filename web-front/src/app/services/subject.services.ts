import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  private apiUrl = 'http://localhost:3000/subjects';

  constructor(private http: HttpClient) {}

  // Create a new subject
  createSubject(name: string, classroomIds: number[]): Observable<any> {
    const body = { name, classroomIds };
    return this.http.post<any>(this.apiUrl, body);
  }

  // Get all subjects
  getAllSubjects(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Get a subject by ID
  getSubjectById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Update a subject
  updateSubject(id: number, name: string, classroomIds: number[]): Observable<any> {
    const body = { name, classroomIds };
    return this.http.put<any>(`${this.apiUrl}/${id}`, body);
  }

  // Delete a subject
  deleteSubject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}