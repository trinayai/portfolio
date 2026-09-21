import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report-finance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Finance Reports</h2>
      <p class="text-slate-400">Generate and view financial reports.</p>
    </div>
  `
})
export class ReportFinanceComponent {}
