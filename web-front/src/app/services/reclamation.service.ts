import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Reclamation {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReclamationService {
  private apiUrl = 'http://localhost:3000/reclamations';  // Replace with your backend URL

  constructor(private http: HttpClient) {}

  // Method to create a reclamation
  createReclamation(reclamationData: { name: string; email: string; message: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, reclamationData);
  }

  // Method to get all reclamations
  getAllReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(this.apiUrl);
  }
}
