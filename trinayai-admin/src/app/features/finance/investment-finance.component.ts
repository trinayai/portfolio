import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-investment-finance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Investment Finance</h2>
      <p class="text-slate-400">Track and manage company investments.</p>
    </div>
  `
})
export class InvestmentFinanceComponent {}
