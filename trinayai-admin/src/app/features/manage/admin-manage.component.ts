import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-manage',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Admin Management</h2>
      <p class="text-slate-400">Manage administrator accounts and permissions.</p>
    </div>
  `
})
export class AdminManageComponent {}
