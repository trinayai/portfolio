import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-directors-docs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Directors Documents</h2>
      <p class="text-slate-400">Manage documents related to company directors.</p>
    </div>
  `
})
export class DirectorsDocsComponent {}
