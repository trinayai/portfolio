import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tenders-docs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Tenders Documents</h2>
      <p class="text-slate-400">Manage documents related to tenders and bids.</p>
    </div>
  `
})
export class TendersDocsComponent {}
