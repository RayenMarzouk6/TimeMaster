import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Student {
  id: number;
  username: string; // Updated to match the backend's `username` attribute
  cin: string;      // CIN attribute from the backend
  email: string;    // Email attribute from the backend
}

interface Class {
  id: number;
  name: string;
  level: string;
  students: Student[]; // Updated to include the full student object
}

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private apiUrl = 'http://localhost:3000/classes'; // Adjust the URL to your backend API

  constructor(private http: HttpClient) {}

  // Fetch all classes
  getClasses(): Observable<Class[]> {
    return this.http.get<Class[]>(this.apiUrl);
  }

  // Fetch a single class by ID
  getClassById(id: number): Observable<Class> {
    return this.http.get<Class>(`${this.apiUrl}/${id}`);
  }

  // Add a new class
  addClass(newClass: { name: string; level: string; studentNames: string[] }): Observable<Class> {
    return this.http.post<Class>(this.apiUrl, newClass);
  }

  // Update an existing class
  updateClass(id: number, updatedClass: { name?: string; level?: string; studentNames?: string[] }): Observable<Class> {
    return this.http.put<Class>(`${this.apiUrl}/${id}`, updatedClass);
  }

  // Delete a class by ID
  deleteClass(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
