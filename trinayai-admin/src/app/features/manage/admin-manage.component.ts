import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin-manage',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule],
  template: `
    <div class="p-8 bg-white min-h-screen">
      <div class="mb-10 text-center">
        <span class="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block">Access Control</span>
        <h1 class="text-3xl font-black tracking-tighter text-slate-900">System Administrators</h1>
      </div>

      <div class="max-w-4xl mx-auto card-white p-0 overflow-hidden shadow-2xl border-slate-100">
        <p-table [value]="admins">
          <ng-template pTemplate="header">
            <tr>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Identity</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Clearance Level</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-adm>
            <tr class="border-t border-slate-50">
              <td class="p-6 font-bold text-slate-900">{{ adm.email }}</td>
              <td class="p-6 text-right">
                <p-tag [value]="adm.role || 'Full Access'" severity="success" [rounded]="true"></p-tag>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `
})
export class AdminManageComponent implements OnInit {
  admins: any[] = [];
  private firestore = inject(Firestore);

  ngOnInit() {
    collectionData(collection(this.firestore, 'admins'), { idField: 'id' }).subscribe(d => this.admins = d);
  }
}
