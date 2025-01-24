import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../services/schedule.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
})
export class ScheduleComponent implements OnInit {
  schedules: any[] = [];
  selectedDay: string = '';
  selectedTeacher: string = '';
  selectedClass: string = '';

  constructor(private scheduleService: ScheduleService) {}

  ngOnInit(): void {
    this.fetchSchedules();
  }

  fetchSchedules(): void {
    this.scheduleService.getSchedules().subscribe(
      (data) => {
        this.schedules = data;
      },
      (error) => {
        console.error('Error fetching schedules:', error);
      }
    );
  }

  // Getter method to filter schedules
  get filteredSchedules() {
    return this.schedules.filter(schedule => {
      return (
        (this.selectedDay ? schedule.day === this.selectedDay : true) &&
        (this.selectedTeacher ? schedule.teacher?.name.toLowerCase().includes(this.selectedTeacher.toLowerCase()) : true) &&
        (this.selectedClass ? schedule.class?.name.toLowerCase().includes(this.selectedClass.toLowerCase()) : true)
      );
    });
  }
}
