import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vendors-manage',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Vendors Management</h2>
      <p class="text-slate-400">Manage vendor relationships and contracts.</p>
    </div>
  `
})
export class VendorsManageComponent {}
