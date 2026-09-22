import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';
import { SiteContentService } from '../../core/services/site-content.service';
import { AuthService } from '../../core/services/auth.service';
import { UserProfile, ContentItem, ServicePlan } from '../../core/models/site-content';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, CalendarModule, DropdownModule, ToastModule, CardModule, RouterLink, DialogModule, TableModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  profile: UserProfile | null = null;
  services: ContentItem[] = [];
  loading = false;
  takingTooLong = false;

  showUpgradeDialog = false;
  selectedServiceForUpgrade: ContentItem | null = null;

  private profileService = inject(ProfileService);
  private contentService = inject(SiteContentService);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private subs = new Subscription();

  countries = [
    { label: 'India', value: 'India' },
    { label: 'USA', value: 'USA' },
    { label: 'UK', value: 'UK' },
    { label: 'UAE', value: 'UAE' }
  ];

  genders = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' }
  ];

  ngOnInit() {
    // Timeout check: If profile not loaded in 10s
    this.subs.add(timer(10000).subscribe(() => {
      if (!this.profile) this.takingTooLong = true;
    }));

    this.subs.add(this.profileService.userProfile$.subscribe(p => {
      if (p === undefined) return; // Still loading/checking auth

      if (p === null) {
        // Not logged in or error
        this.router.navigate(['/login'], { queryParams: { returnUrl: '/profile' } });
        return;
      }

      this.profile = p;
      if (this.profile.dob) this.profile.dob = new Date(this.profile.dob) as any;
      this.checkQueryParams();
    }));

    this.subs.add(this.contentService.getAiMenuItems().subscribe(items => {
      this.services = items;
    }));
  }

  private checkQueryParams() {
    const upgradeId = this.route.snapshot.queryParams['upgrade'];
    if (upgradeId && this.services.length > 0) {
      const service = this.services.find(s => s.id === upgradeId);
      if (service) this.openUpgrade(service);
    }
  }

  async onUpdateProfile() {
    if (!this.profile) return;

    if (!this.profile.displayName?.trim()) {
      this.messageService.add({ severity: 'warn', summary: 'Missing Info', detail: 'Display name is required.' });
      return;
    }

    this.loading = true;
    try {
      await this.profileService.updateProfile(this.profile.uid, {
        ...this.profile,
        dob: (this.profile.dob as any)?.toISOString()
      });
      this.messageService.add({ severity: 'success', summary: 'Profile Synced', detail: 'Your changes have been saved securely.' });
    } catch (e: any) {
      this.messageService.add({ severity: 'error', summary: 'Sync Error', detail: e.message });
    } finally {
      this.loading = false;
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.router.navigate(['/'])
    });
  }

  getServiceName(id: string) {
    return this.services.find(s => s.id === id)?.title || 'Service';
  }

  getPlanName(serviceId: string, planId: string) {
    const service = this.services.find(s => s.id === serviceId);
    return service?.plans?.find(p => p.id === planId)?.name || 'Standard';
  }

  openUpgrade(service: {id?: string, title?: string}) {
    if (!service.id) return;
    const fullService = this.services.find(s => s.id === service.id);
    this.selectedServiceForUpgrade = fullService || null;
    this.showUpgradeDialog = true;
  }

  async selectPlan(plan: ServicePlan) {
    if (!this.profile || !this.selectedServiceForUpgrade) return;

    this.loading = true;
    try {
      await this.profileService.addSubscription(
        this.profile.uid,
        {
          serviceId: this.selectedServiceForUpgrade.id!,
          planId: plan.id!,
          status: 'active',
          startDate: new Date().toISOString()
        },
        plan.cost,
        this.selectedServiceForUpgrade.title
      );
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `Subscribed to ${plan.name}!` });
      this.showUpgradeDialog = false;
    } catch (e: any) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: e.message });
    } finally {
      this.loading = false;
    }
  }

  async cancelSub(serviceId: string) {
    if (!this.profile) return;
    try {
      await this.profileService.cancelSubscription(this.profile.uid, serviceId);
      this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Plan will end at cycle completion.' });
    } catch (e: any) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: e.message });
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
