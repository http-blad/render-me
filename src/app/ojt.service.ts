import { Injectable, signal, computed } from '@angular/core';

export interface AttendanceLog {
  date: string; // ISO date string
  timeIn: string; // HH:mm
  timeOut: string; // HH:mm
  hours: number;
}

export interface WeeklySchedule {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class OjtService {
  // State
  requiredHours = signal<number>(400);
  dailyScheduleHours = signal<number>(8);
  weeklySchedule = signal<WeeklySchedule>({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false
  });
  logs = signal<AttendanceLog[]>([]);

  // Computed
  totalRenderedHours = computed(() => {
    return this.logs().reduce((acc, log) => acc + log.hours, 0);
  });

  remainingHours = computed(() => {
    const remaining = this.requiredHours() - this.totalRenderedHours();
    return remaining > 0 ? remaining : 0;
  });

  progressPercentage = computed(() => {
    if (this.requiredHours() === 0) return 0;
    const percentage = (this.totalRenderedHours() / this.requiredHours()) * 100;
    return Math.min(percentage, 100);
  });

  estimatedCompletionDate = computed(() => {
    const remaining = this.remainingHours();
    if (remaining <= 0) return new Date();

    const dailyHours = this.dailyScheduleHours();
    if (dailyHours <= 0) return null;

    const schedule = this.weeklySchedule();
    const activeDaysCount = Object.values(schedule).filter(v => v).length;
    if (activeDaysCount === 0) return null;

    let currentDate = new Date();
    let hoursLeft = remaining;

    // Simple prediction: iterate day by day
    while (hoursLeft > 0) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);
      currentDate = nextDate;
      const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof WeeklySchedule;
      
      if (schedule[dayName]) {
        hoursLeft -= dailyHours;
      }
    }

    return currentDate;
  });

  addLog(log: AttendanceLog) {
    this.logs.update(prev => [...prev, log]);
  }

  removeLog(date: string) {
    this.logs.update(prev => prev.filter(l => l.date !== date));
  }

  updateSchedule(schedule: WeeklySchedule) {
    this.weeklySchedule.set(schedule);
  }

  setRequiredHours(hours: number) {
    this.requiredHours.set(hours);
  }

  setDailyScheduleHours(hours: number) {
    this.dailyScheduleHours.set(hours);
  }
}
