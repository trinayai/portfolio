import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ProfileService } from '../../core/services/profile.service';
import { SiteContentService } from '../../core/services/site-content.service';
import { combineLatest } from 'rxjs';

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
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="4" class="p-12 text-center text-slate-300 font-bold uppercase tracking-widest text-xs border-dashed border-2">
                No subscriber records found.
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
  private profileService = inject(ProfileService);
  private contentService = inject(SiteContentService);

  ngOnInit() {
    combineLatest([
      this.profileService.getSubscribers(),
      this.profileService.getAllUsers(),
      this.contentService.getAiMenuItems()
    ]).subscribe(([subDocs, users, services]) => {
      const mergedMap = new Map<string, Subscriber>();

      // First add explicit subscribers collection docs
      (subDocs || []).forEach((doc: any) => {
        if (doc.email) {
          const key = doc.id || `${doc.email}_${doc.plan}`;
          mergedMap.set(key, {
            id: doc.id,
            email: doc.email,
            plan: doc.plan || 'Standard Tier',
            status: doc.status || 'active',
            joinDate: doc.joinDate || new Date().toISOString()
          });
        }
      });

      // Second, iterate users and their subscriptions array as fallback
      (users || []).forEach(user => {
        if (user.subscriptions && user.subscriptions.length > 0) {
          user.subscriptions.forEach(sub => {
            const serviceName = services.find(s => s.id === sub.serviceId)?.title || sub.serviceId;
            const planName = services.find(s => s.id === sub.serviceId)?.plans?.find(p => p.id === sub.planId)?.name || sub.planId;
            const key = `${user.uid}_${sub.serviceId}`;

            if (!mergedMap.has(key)) {
              mergedMap.set(key, {
                id: key,
                email: user.email,
                plan: `${serviceName} (${planName})`,
                status: sub.status || 'active',
                joinDate: sub.startDate || user.createdAt || new Date().toISOString()
              });
            }
          });
        }
      });

      this.subscribers = Array.from(mergedMap.values());
    });
  }
}
