import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../core/services/profile.service';
import { UserProfile, ContentItem } from '../../core/models/site-content';
import { SiteContentService } from '../../core/services/site-content.service';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-user-manage',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, ButtonModule, DialogModule],
  template: `
    <div class="p-8 bg-white min-h-screen">
      <div class="mb-10">
        <span class="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block">System Administration</span>
        <h1 class="text-3xl font-black tracking-tighter text-slate-900">User Management</h1>
      </div>

      <div class="card-white p-0 overflow-hidden shadow-2xl border-slate-100">
        <p-table [value]="users" [paginator]="true" [rows]="10" styleClass="p-datatable-sm">
          <ng-template pTemplate="header">
            <tr>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Subscriptions</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Joined</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-user>
            <tr class="border-t border-slate-50">
              <td class="p-6">
                <div class="font-bold text-slate-900">{{ user.displayName || 'Unnamed User' }}</div>
                <div class="text-xs text-slate-400">{{ user.email }}</div>
              </td>
              <td class="p-6">
                <div class="flex flex-wrap gap-2">
                   @for (sub of user.subscriptions; track sub.serviceId) {
                     <p-tag [value]="getServiceName(sub.serviceId)" severity="info" [rounded]="true"></p-tag>
                   }
                   @if (!user.subscriptions?.length) {
                     <span class="text-xs text-slate-300 italic">None</span>
                   }
                </div>
              </td>
              <td class="p-6 text-sm text-slate-500 font-medium">
                {{ user.createdAt | date:'MMM dd, yyyy' }}
              </td>
              <td class="p-6 text-right">
                <p-button icon="pi pi-eye" (onClick)="viewUser(user)" styleClass="p-button-text p-button-rounded"></p-button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>

    <!-- User Detail Dialog -->
    <p-dialog [(visible)]="showDetail" [header]="'User Profile: ' + (selectedUser?.email || '')" [modal]="true" [style]="{width: '50vw'}">
      <div *ngIf="selectedUser" class="space-y-8 p-4">
         <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="text-[9px] font-black uppercase text-slate-400">Full Name</label>
              <p class="font-bold">{{ selectedUser.displayName }}</p>
            </div>
            <div>
              <label class="text-[9px] font-black uppercase text-slate-400">Phone</label>
              <p class="font-bold">{{ selectedUser.phoneNumber || 'N/A' }}</p>
            </div>
            <div>
              <label class="text-[9px] font-black uppercase text-slate-400">Country</label>
              <p class="font-bold">{{ selectedUser.country || 'N/A' }}</p>
            </div>
            <div>
              <label class="text-[9px] font-black uppercase text-slate-400">DOB</label>
              <p class="font-bold">{{ selectedUser.dob | date }}</p>
            </div>
         </div>

         <div>
            <label class="text-[9px] font-black uppercase text-slate-400 block mb-3">Billing Address</label>
            <p class="text-sm border p-4 rounded-xl bg-slate-50">{{ selectedUser.billingAddress || 'No address provided' }}</p>
         </div>

         <div>
            <h4 class="text-xs font-black uppercase tracking-widest text-blue-600 mb-4">Subscription History</h4>
            <div class="space-y-3">
               @for (sub of selectedUser.subscriptions; track sub.serviceId) {
                 <div class="flex justify-between items-center p-4 border border-slate-100 rounded-2xl bg-white shadow-sm">
                    <span class="font-bold">{{ getServiceName(sub.serviceId) }}</span>
                    <p-tag [value]="sub.planId" [severity]="sub.status === 'active' ? 'success' : 'warning'"></p-tag>
                 </div>
               }
            </div>
         </div>
      </div>
    </p-dialog>
  `
})
export class UserManageComponent implements OnInit {
  users: UserProfile[] = [];
  services: ContentItem[] = [];
  selectedUser: UserProfile | null = null;
  showDetail = false;

  private profileService = inject(ProfileService);
  private contentService = inject(SiteContentService);

  ngOnInit() {
    this.profileService.getAllUsers().subscribe(u => this.users = u);
    this.contentService.getAiMenuItems().subscribe(s => this.services = s);
  }

  getServiceName(id: string) {
    return this.services.find(s => s.id === id)?.title || id;
  }

  viewUser(user: UserProfile) {
    this.selectedUser = user;
    this.showDetail = true;
  }
}
