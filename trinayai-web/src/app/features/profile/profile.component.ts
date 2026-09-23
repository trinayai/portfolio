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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, CalendarModule, DropdownModule, ToastModule, CardModule, RouterLink, DialogModule, TableModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  profile: UserProfile | null = null;
  loadingState = true;
  services: ContentItem[] = [];
  loading = false;

  showUpgradeDialog = false;
  selectedServiceForUpgrade: ContentItem | null = null;
  targetPlanId: string | null = null;

  private profileService = inject(ProfileService);
  private contentService = inject(SiteContentService);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private sub = new Subscription();

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
    this.sub.add(this.profileService.userProfile$.subscribe(p => {
      // undefined means still checking auth/profile
      if (p === undefined) {
        this.loadingState = true;
        return;
      }

      // null means definitively logged out
      if (p === null) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: '/profile' } });
        return;
      }

      // We have a profile
      this.profile = { ...p };
      if (this.profile.dob) {
        const parsedDate = new Date(this.profile.dob);
        this.profile.dob = isNaN(parsedDate.getTime()) ? null as any : parsedDate;
      }
      this.loadingState = false;
      this.checkQueryParams();
    }));

    this.sub.add(this.contentService.getAiMenuItems().subscribe(items => {
      this.services = items;
      this.checkQueryParams();
    }));

    this.sub.add(this.route.queryParams.subscribe(params => {
      if (params['upgrade']) {
        this.checkQueryParams();
      }
    }));
  }

  private checkQueryParams() {
    const upgradeId = this.route.snapshot.queryParams['upgrade'];
    const planId = this.route.snapshot.queryParams['plan'];
    if (upgradeId && this.services.length > 0) {
      const service = this.services.find(s => s.id === upgradeId);
      if (service) {
        this.targetPlanId = planId || null;
        this.openUpgrade(service, planId);
      }
    }
  }

  async onUpdateProfile() {
    if (!this.profile) return;
    this.loading = true;
    try {
      let formattedDob: string | undefined = undefined;
      if (this.profile.dob) {
        const dobObj = new Date(this.profile.dob);
        if (!isNaN(dobObj.getTime())) {
          formattedDob = dobObj.toISOString();
        }
      }

      await this.profileService.updateProfile(this.profile.uid, {
        ...this.profile,
        dob: formattedDob
      });
      this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Profile saved successfully.' });
    } catch (e: any) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: e.message });
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
    return this.services.find(s => s.id === id)?.title || id;
  }

  getPlanName(serviceId: string, planId: string) {
    const service = this.services.find(s => s.id === serviceId);
    return service?.plans?.find(p => p.id === planId)?.name || planId;
  }

  openUpgrade(service: any, preferredPlanId?: string) {
    const fullService = this.services.find(s => s.id === (service.id || service));
    this.selectedServiceForUpgrade = fullService || null;
    if (preferredPlanId) {
      this.targetPlanId = preferredPlanId;
    }
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
        this.selectedServiceForUpgrade.title,
        plan.name
      );

      // Optimistically update local profile subscriptions for instant feedback
      const currentSubs = [...(this.profile.subscriptions || [])];
      const existingIdx = currentSubs.findIndex(s => s.serviceId === this.selectedServiceForUpgrade!.id);
      const newSub = {
        serviceId: this.selectedServiceForUpgrade.id!,
        planId: plan.id!,
        status: 'active' as const,
        startDate: new Date().toISOString()
      };
      if (existingIdx > -1) {
        currentSubs[existingIdx] = newSub;
      } else {
        currentSubs.push(newSub);
      }
      this.profile.subscriptions = currentSubs;

      this.messageService.add({ severity: 'success', summary: 'Success', detail: `Subscribed to ${plan.name}!` });
      this.showUpgradeDialog = false;
      this.targetPlanId = null;
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

      if (this.profile.subscriptions) {
        this.profile.subscriptions = this.profile.subscriptions.map(s => {
          if (s.serviceId === serviceId) {
            return { ...s, status: 'cancelled_pending' as const };
          }
          return s;
        });
      }

      this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Plan will end at cycle completion.' });
    } catch (e: any) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: e.message });
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
