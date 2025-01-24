import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Institution {
  id?: number; // Make id optional
  name: string;
  address: string;
  phone: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class InstitutionService {
  private apiUrl = 'http://localhost:3000/institutions'; // Adjust to your backend URL

  constructor(private http: HttpClient) {}

  create(institution: Institution): Observable<Institution> {
    return this.http.post<Institution>(this.apiUrl, institution);
  }

  getAll(): Observable<Institution[]> {
    return this.http.get<Institution[]>(this.apiUrl);
  }

  update(id: number, institution: Institution): Observable<Institution> {
    return this.http.put<Institution>(`${this.apiUrl}/${id}`, institution);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
