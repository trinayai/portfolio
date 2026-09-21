import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gov-investors',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Government Investors</h2>
      <p class="text-slate-400">Manage information for government investors and grants.</p>
    </div>
  `
})
export class GovInvestorsComponent {}
