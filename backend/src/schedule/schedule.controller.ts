import { Controller, Post, Body, Get } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  async generateTimetable(@Body() createScheduleDtos: any[]) {
    console.log('Données reçues:', createScheduleDtos);
    const timetables = [];
    for (const createScheduleDto of createScheduleDtos) {
      const timetable = await this.scheduleService.generateTimetable(createScheduleDto);
      timetables.push(timetable);
    }
    return timetables;
  }

  @Get()
  async getTimetable() {
    return this.scheduleService.getTimetable();
  }
}