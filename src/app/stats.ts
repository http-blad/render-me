import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OjtService } from './ojt.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stats',
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Required Hours -->
      <div class="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="p-2 bg-indigo-50 rounded-xl">
            <mat-icon class="text-indigo-600">assignment</mat-icon>
          </div>
          <span class="text-xs font-bold text-slate-400 uppercase">Target</span>
        </div>
        <div class="flex flex-col">
          <span class="text-2xl font-bold text-slate-800">{{ ojtService.requiredHours() }}</span>
          <span class="text-sm text-slate-500">Total Required Hours</span>
        </div>
      </div>

      <!-- Rendered Hours -->
      <div class="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="p-2 bg-emerald-50 rounded-xl">
            <mat-icon class="text-emerald-600">timer</mat-icon>
          </div>
          <span class="text-xs font-bold text-slate-400 uppercase">Rendered</span>
        </div>
        <div class="flex flex-col">
          <span class="text-2xl font-bold text-slate-800">{{ ojtService.totalRenderedHours() }}</span>
          <span class="text-sm text-slate-500">Accumulated Hours</span>
        </div>
      </div>

      <!-- Remaining Hours -->
      <div class="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="p-2 bg-amber-50 rounded-xl">
            <mat-icon class="text-amber-600">pending_actions</mat-icon>
          </div>
          <span class="text-xs font-bold text-slate-400 uppercase">Remaining</span>
        </div>
        <div class="flex flex-col">
          <span class="text-2xl font-bold text-slate-800">{{ ojtService.remainingHours() }}</span>
          <span class="text-sm text-slate-500">Hours to Finish</span>
        </div>
      </div>

      <!-- Prediction -->
      <div class="p-6 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 text-white">
        <div class="flex items-center justify-between mb-4">
          <div class="p-2 bg-white/20 rounded-xl">
            <mat-icon>auto_awesome</mat-icon>
          </div>
          <span class="text-xs font-bold text-white/60 uppercase">Prediction</span>
        </div>
        <div class="flex flex-col">
          <span class="text-xl font-bold">
            {{ ojtService.estimatedCompletionDate() | date:'mediumDate' }}
          </span>
          <span class="text-sm text-white/80">Estimated Completion</span>
        </div>
      </div>
    </div>

    <!-- Progress Bar Section -->
    <div class="mt-6 p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-slate-800">Overall Progress</h3>
        <span class="text-sm font-bold text-indigo-600">{{ ojtService.progressPercentage() | number:'1.0-1' }}%</span>
      </div>
      <div class="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
        <div 
          class="h-full bg-indigo-600 transition-all duration-1000 ease-out rounded-full"
          [style.width.%]="ojtService.progressPercentage()"
        ></div>
      </div>
      <div class="mt-4 flex justify-between text-xs font-medium text-slate-400">
        <span>0 Hours</span>
        <span>{{ ojtService.requiredHours() }} Hours</span>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class StatsComponent {
  ojtService = inject(OjtService);
}
