import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OjtService } from './ojt.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-log-form',
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Settings Card -->
      <div class="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
        <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <mat-icon class="text-indigo-600">settings</mat-icon>
          Internship Settings
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="requiredHours" class="block text-xs font-bold text-slate-400 uppercase mb-1">Total Required Hours</label>
            <input 
              id="requiredHours"
              type="number" 
              [ngModel]="ojtService.requiredHours()" 
              (ngModelChange)="ojtService.setRequiredHours($event)"
              class="input-field"
            >
          </div>
          <div>
            <label for="dailyHours" class="block text-xs font-bold text-slate-400 uppercase mb-1">Daily Working Hours</label>
            <input 
              id="dailyHours"
              type="number" 
              [ngModel]="ojtService.dailyScheduleHours()" 
              (ngModelChange)="ojtService.setDailyScheduleHours($event)"
              class="input-field"
            >
          </div>
        </div>

        <div class="mt-6">
          <div class="block text-xs font-bold text-slate-400 uppercase mb-3">Weekly Schedule</div>
          <div class="flex flex-wrap gap-2">
            @for (day of days; track day) {
              <button 
                (click)="toggleDay(day)"
                [class]="ojtService.weeklySchedule()[day] ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'"
                class="px-3 py-1.5 rounded-lg border text-xs font-bold transition-all capitalize"
              >
                {{ day.substring(0, 3) }}
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Log Attendance Card -->
      <div class="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
        <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <mat-icon class="text-emerald-600">add_task</mat-icon>
          Log Attendance
        </h3>
        <form (submit)="onSubmit($event)" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label for="logDate" class="block text-xs font-bold text-slate-400 uppercase mb-1">Date</label>
              <input id="logDate" type="date" [(ngModel)]="formData.date" name="date" class="input-field" required>
            </div>
            <div>
              <label for="logTimeIn" class="block text-xs font-bold text-slate-400 uppercase mb-1">Time In</label>
              <input id="logTimeIn" type="time" [(ngModel)]="formData.timeIn" name="timeIn" class="input-field" required>
            </div>
            <div>
              <label for="logTimeOut" class="block text-xs font-bold text-slate-400 uppercase mb-1">Time Out</label>
              <input id="logTimeOut" type="time" [(ngModel)]="formData.timeOut" name="timeOut" class="input-field" required>
            </div>
          </div>
          <button type="submit" class="btn-primary w-full flex items-center justify-center gap-2">
            <mat-icon>save</mat-icon>
            Log Day
          </button>
        </form>
      </div>

      <!-- Recent Logs -->
      <div class="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
        <h3 class="text-lg font-bold text-slate-800 mb-4">Recent Logs</h3>
        <div class="space-y-3">
          @if (ojtService.logs().length === 0) {
            <div class="text-center py-8 text-slate-400 italic text-sm">
              No logs yet. Start by adding your first attendance.
            </div>
          }
          @for (log of sortedLogs(); track log.date) {
            <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 group">
              <div class="flex items-center gap-4">
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-slate-700">{{ log.date | date:'mediumDate' }}</span>
                  <span class="text-[10px] text-slate-400 uppercase font-bold">{{ log.timeIn }} - {{ log.timeOut }}</span>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <span class="text-sm font-bold text-indigo-600">{{ log.hours }} hrs</span>
                <button (click)="ojtService.removeLog(log.date)" class="p-1 text-slate-300 hover:text-rose-500 transition-colors">
                  <mat-icon class="text-lg">delete</mat-icon>
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class LogFormComponent {
  ojtService = inject(OjtService);
  
  days: (keyof ReturnType<OjtService['weeklySchedule']>)[] = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ];

  formData = {
    date: new Date().toISOString().split('T')[0],
    timeIn: '08:00',
    timeOut: '17:00'
  };

  sortedLogs = computed(() => {
    return [...this.ojtService.logs()].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  });

  toggleDay(day: keyof ReturnType<OjtService['weeklySchedule']>) {
    const current = this.ojtService.weeklySchedule();
    this.ojtService.updateSchedule({
      ...current,
      [day]: !current[day]
    });
  }

  onSubmit(e: Event) {
    e.preventDefault();
    
    // Calculate hours
    const start = new Date(`2000-01-01T${this.formData.timeIn}`);
    const end = new Date(`2000-01-01T${this.formData.timeOut}`);
    
    let diff = (end.getTime() - start.getTime()) / 1000 / 60 / 60;
    
    // Deduct 1 hour for lunch if more than 5 hours
    if (diff > 5) diff -= 1;
    
    if (diff <= 0) {
      alert('Time out must be after time in');
      return;
    }

    this.ojtService.addLog({
      date: this.formData.date,
      timeIn: this.formData.timeIn,
      timeOut: this.formData.timeOut,
      hours: Number(diff.toFixed(2))
    });

    // Reset date to today for next entry (optional)
    this.formData.date = new Date().toISOString().split('T')[0];
  }
}
