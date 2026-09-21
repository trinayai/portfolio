import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-manage',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Employee Management</h2>
      <p class="text-slate-400">Manage employee records and information.</p>
    </div>
  `
})
export class EmployeeManageComponent {}
