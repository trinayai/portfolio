import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-salaries-finance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Salaries Finance</h2>
      <p class="text-slate-400">Manage employee salaries and payroll.</p>
    </div>
  `
})
export class SalariesFinanceComponent {}
