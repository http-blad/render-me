import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar';
import { StatsComponent } from './stats';
import { LogFormComponent } from './log-form';
import { MatIconModule } from '@angular/material/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [CommonModule, CalendarComponent, StatsComponent, LogFormComponent, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
