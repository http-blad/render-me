import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OjtService, WeeklySchedule } from './ojt.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm h-full">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-slate-800">Attendance Calendar</h2>
        <div class="flex gap-2">
          <button (click)="prevMonth()" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <mat-icon>chevron_left</mat-icon>
          </button>
          <span class="text-lg font-medium min-w-[120px] text-center">
            {{ currentMonthName }} {{ currentYear }}
          </span>
          <button (click)="nextMonth()" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <mat-icon>chevron_right</mat-icon>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-7 gap-2 mb-2">
        @for (day of weekDays; track day) {
          <div class="text-center text-xs font-bold text-slate-400 uppercase tracking-wider py-2">
            {{ day }}
          </div>
        }
      </div>

      <div class="grid grid-cols-7 gap-2">
        @for (blank of blanks; track $index) {
          <div class="aspect-square"></div>
        }
        @for (day of daysInMonth; track day) {
          <div 
            [class]="getDayClasses(day)"
            class="aspect-square flex flex-col items-center justify-center rounded-xl border relative transition-all group cursor-default"
          >
            <span class="text-sm font-semibold">{{ day }}</span>
            @if (hasLog(day)) {
              <div class="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            }
            
            <!-- Tooltip/Info on hover -->
            <div class="absolute invisible group-hover:visible z-10 bottom-full mb-2 p-2 bg-slate-800 text-white text-[10px] rounded shadow-lg whitespace-nowrap pointer-events-none">
              {{ getDayStatus(day) }}
            </div>
          </div>
        }
      </div>

      <div class="mt-8 flex flex-wrap gap-4 text-xs font-medium text-slate-500">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded bg-emerald-100 border border-emerald-200"></div>
          <span>Completed</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded bg-indigo-50 border border-indigo-200"></div>
          <span>Scheduled</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded bg-slate-50 border border-slate-200"></div>
          <span>Off Day</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class CalendarComponent {
  private ojtService = inject(OjtService);
  
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  currentDate = new Date();
  
  get currentMonth() { return this.currentDate.getMonth(); }
  get currentYear() { return this.currentDate.getFullYear(); }
  get currentMonthName() { return this.currentDate.toLocaleString('default', { month: 'long' }); }

  get daysInMonth() {
    const days = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  }

  get blanks() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    return Array.from({ length: firstDay });
  }

  prevMonth() {
    this.currentDate = new Date(this.currentYear, this.currentMonth - 1, 1);
  }

  nextMonth() {
    this.currentDate = new Date(this.currentYear, this.currentMonth + 1, 1);
  }

  hasLog(day: number): boolean {
    const dateStr = this.getDateString(day);
    return this.ojtService.logs().some(l => l.date === dateStr);
  }

  isScheduled(day: number): boolean {
    const date = new Date(this.currentYear, this.currentMonth, day);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof WeeklySchedule;
    return this.ojtService.weeklySchedule()[dayName];
  }

  getDateString(day: number): string {
    const d = new Date(this.currentYear, this.currentMonth, day);
    return d.toISOString().split('T')[0];
  }

  getDayClasses(day: number): string {
    const isToday = this.isToday(day);
    const hasLog = this.hasLog(day);
    const isScheduled = this.isScheduled(day);

    let classes = '';
    
    if (hasLog) {
      classes = 'bg-emerald-50 border-emerald-200 text-emerald-700';
    } else if (isScheduled) {
      classes = 'bg-indigo-50/50 border-indigo-100 text-indigo-600';
    } else {
      classes = 'bg-slate-50 border-slate-100 text-slate-400 opacity-60';
    }

    if (isToday) {
      classes += ' ring-2 ring-indigo-500 ring-offset-2';
    }

    return classes;
  }

  getDayStatus(day: number): string {
    if (this.hasLog(day)) return 'Rendered';
    if (this.isScheduled(day)) return 'Scheduled';
    return 'Off Day';
  }

  private isToday(day: number): boolean {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === this.currentMonth && 
           today.getFullYear() === this.currentYear;
  }
}
