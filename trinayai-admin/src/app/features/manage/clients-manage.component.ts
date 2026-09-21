import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clients-manage',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Clients Management</h2>
      <p class="text-slate-400">Manage client information and projects.</p>
    </div>
  `
})
export class ClientsManageComponent {}
