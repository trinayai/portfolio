import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trinayai-docs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Trinayai Documents</h2>
      <p class="text-slate-400">Manage organizational documents for Trinayai.</p>
    </div>
  `
})
export class TrinayaiDocsComponent {}
