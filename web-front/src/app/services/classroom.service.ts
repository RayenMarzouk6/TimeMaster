import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClassroomService {
    private apiUrl = 'http://localhost:3000/classrooms';  // Adjust the URL if needed

  constructor(private http: HttpClient) {}
 // Get all classrooms
 getClassrooms(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Create a new classroom
  createClassroom(classroom: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, classroom);
  }

  // Update an existing classroom
  updateClassroom(id: number, classroom: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, classroom);
  }
  

  // Delete a classroom
  deleteClassroom(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}