import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerifyService {

  private apiUrl = 'http://localhost:3000/users/verify';  // Backend URL

  constructor(private http: HttpClient) { }

  verifyEmailAndCIN(email: string, cin: string): Observable<any> {
    const body = { email, cin };  // Sending email and cin in the request body
    return this.http.post<any>(this.apiUrl, body);
  }
}
