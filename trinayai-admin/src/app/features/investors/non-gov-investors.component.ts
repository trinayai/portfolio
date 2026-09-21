import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-non-gov-investors',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Non-Government Investors</h2>
      <p class="text-slate-400">Manage information for non-government investors.</p>
    </div>
  `
})
export class NonGovInvestorsComponent {}
