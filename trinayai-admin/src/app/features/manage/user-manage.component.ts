import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../core/services/profile.service';
import { UserProfile, ContentItem, AuditLog } from '../../core/models/site-content';
import { SiteContentService } from '../../core/services/site-content.service';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-user-manage',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, ButtonModule, DialogModule, TabViewModule],
  template: `
    <div class="p-8 bg-white min-h-screen">
      <div class="mb-10">
        <span class="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block">Identity Management</span>
        <h1 class="text-3xl font-black tracking-tighter text-slate-900">User Directory</h1>
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
                     <span class="text-xs text-slate-300 italic">No Active Plans</span>
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
    <p-dialog [(visible)]="showDetail" [header]="'User Profile: ' + (selectedUser?.email || '')" [modal]="true"
              [style]="{width: '60vw', maxWidth: '900px'}" styleClass="custom-dialog">
      <div *ngIf="selectedUser">
         <p-tabView>
            <p-tabPanel header="General Info">
               <div class="grid grid-cols-2 gap-8 p-4">
                  <div>
                    <label class="text-[9px] font-black uppercase text-slate-400">Full Name</label>
                    <p class="font-bold text-slate-900">{{ selectedUser.displayName }}</p>
                  </div>
                  <div>
                    <label class="text-[9px] font-black uppercase text-slate-400">Phone</label>
                    <p class="font-bold text-slate-900">{{ selectedUser.phoneNumber || 'N/A' }}</p>
                  </div>
                  <div>
                    <label class="text-[9px] font-black uppercase text-slate-400">Country</label>
                    <p class="font-bold text-slate-900">{{ selectedUser.country || 'N/A' }}</p>
                  </div>
                  <div>
                    <label class="text-[9px] font-black uppercase text-slate-400">DOB</label>
                    <p class="font-bold text-slate-900">{{ selectedUser.dob | date }}</p>
                  </div>
                  <div class="col-span-2">
                    <label class="text-[9px] font-black uppercase text-slate-400 block mb-2">Corporate / Billing Address</label>
                    <p class="text-sm border p-4 rounded-2xl bg-slate-50 text-slate-700">{{ selectedUser.billingAddress || 'No address provided' }}</p>
                  </div>
               </div>
            </p-tabPanel>

            <p-tabPanel header="Subscriptions">
               <div class="space-y-4 p-4">
                  @for (sub of selectedUser.subscriptions; track sub.serviceId) {
                    <div class="flex justify-between items-center p-6 border border-slate-100 rounded-3xl bg-white shadow-sm">
                       <div>
                          <p class="font-black text-slate-900 mb-0">{{ getServiceName(sub.serviceId) }}</p>
                          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0">{{ sub.planId }} Tier</p>
                       </div>
                       <p-tag [value]="sub.status" [severity]="sub.status === 'active' ? 'success' : 'warning'"></p-tag>
                    </div>
                  }
                  @if (!selectedUser.subscriptions?.length) {
                     <div class="p-12 text-center text-slate-300 font-bold uppercase tracking-widest text-xs border-dashed border-2 rounded-3xl">
                        No subscription records
                     </div>
                  }
               </div>
            </p-tabPanel>

            <p-tabPanel header="Audit Logs">
               <div class="p-2">
                  <p-table [value]="userLogs" [rows]="5" [paginator]="true" styleClass="p-datatable-sm">
                     <ng-template pTemplate="header">
                        <tr>
                           <th class="p-4 bg-slate-50 text-[9px] font-black uppercase text-slate-400">Action</th>
                           <th class="p-4 bg-slate-50 text-[9px] font-black uppercase text-slate-400">Details</th>
                           <th class="p-4 bg-slate-50 text-[9px] font-black uppercase text-slate-400 text-right">Timestamp</th>
                        </tr>
                     </ng-template>
                     <ng-template pTemplate="body" let-log>
                        <tr class="border-t border-slate-50">
                           <td class="p-4 font-bold text-xs"><p-tag [value]="log.action" severity="secondary"></p-tag></td>
                           <td class="p-4 text-xs text-slate-600">{{ log.details }}</td>
                           <td class="p-4 text-[10px] text-slate-400 text-right">{{ log.timestamp | date:'short' }}</td>
                        </tr>
                     </ng-template>
                  </p-table>
               </div>
            </p-tabPanel>
         </p-tabView>
      </div>
    </p-dialog>
  `
})
export class UserManageComponent implements OnInit {
  users: UserProfile[] = [];
  services: ContentItem[] = [];
  allLogs: AuditLog[] = [];
  userLogs: AuditLog[] = [];

  selectedUser: UserProfile | null = null;
  showDetail = false;

  private profileService = inject(ProfileService);
  private contentService = inject(SiteContentService);

  ngOnInit() {
    this.profileService.getAllUsers().subscribe(u => this.users = u);
    this.contentService.getAiMenuItems().subscribe(s => this.services = s);
    this.profileService.getAuditLogs().subscribe(l => this.allLogs = l);
  }

  getServiceName(id: string) {
    return this.services.find(s => s.id === id)?.title || id;
  }

  viewUser(user: UserProfile) {
    this.selectedUser = user;
    this.userLogs = this.allLogs
      .filter(l => l.userId === user.uid)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    this.showDetail = true;
  }
}
