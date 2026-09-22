import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

interface Subscriber {
  id?: string;
  email: string;
  status: string;
  plan: string;
  joinDate: string;
}

@Component({
  selector: 'app-subscribers-manage',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, ButtonModule],
  template: `
    <div class="p-8 bg-white min-h-screen">
      <div class="mb-10">
        <span class="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block">Revenue Dashboard</span>
        <h1 class="text-3xl font-black tracking-tighter text-slate-900">Active Subscribers</h1>
      </div>

      <div class="card-white p-0 overflow-hidden shadow-2xl border-slate-100">
        <p-table [value]="subscribers" [paginator]="true" [rows]="10">
          <ng-template pTemplate="header">
            <tr>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Subscriber Email</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Plan Tier</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Join Date</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-sub>
            <tr class="border-t border-slate-50">
              <td class="p-6 font-bold text-slate-900">{{ sub.email }}</td>
              <td class="p-6">
                <p-tag [value]="sub.plan" severity="info"></p-tag>
              </td>
              <td class="p-6">
                <p-tag [value]="sub.status" [severity]="sub.status === 'active' ? 'success' : 'warning'"></p-tag>
              </td>
              <td class="p-6 text-sm text-slate-500 font-medium text-right">
                {{ sub.joinDate | date:'MMM dd, yyyy' }}
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `
})
export class SubscribersManageComponent implements OnInit {
  subscribers: Subscriber[] = [];
  private firestore = inject(Firestore);

  ngOnInit() {
    collectionData(collection(this.firestore, 'subscribers'), { idField: 'id' }).subscribe(data => {
      this.subscribers = data as Subscriber[];
    });
  }
}
