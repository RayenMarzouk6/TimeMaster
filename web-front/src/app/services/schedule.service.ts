import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private apiUrl = 'http://localhost:3000/schedule'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  // Add schedule method
  addSchedule(newSchedule: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, newSchedule);
  }

  // Other methods like fetching schedules
  getSchedules(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Fetch schedules by classId
  getSchedulesByClassId(classId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/schedules/${classId}`);
  }

  // Update an existing schedule
  updateSchedule(scheduleId: string, updatedSchedule: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${scheduleId}`, updatedSchedule);
  }

  // Delete a schedule
  deleteSchedule(scheduleId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${scheduleId}`);
  }

  // Fetch schedules by date (optional)
  getSchedulesByDate(date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/date/${date}`);
  }
}
