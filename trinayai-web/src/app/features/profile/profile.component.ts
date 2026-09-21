import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';
import { SiteContentService } from '../../core/services/site-content.service';
import { AuthService } from '../../core/services/auth.service';
import { UserProfile, ContentItem } from '../../core/models/site-content';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, CalendarModule, DropdownModule, ToastModule, CardModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  services: ContentItem[] = [];
  loading = false;

  private profileService = inject(ProfileService);
  private contentService = inject(SiteContentService);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private router = inject(Router);

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
    this.profileService.userProfile$.subscribe(p => {
      this.profile = p ? { ...p, dob: p.dob ? new Date(p.dob) : undefined } as any : null;
    });
    this.contentService.getAiMenuItems().subscribe(items => {
      this.services = items;
    });
  }

  async onUpdateProfile() {
    if (!this.profile) return;
    this.loading = true;
    try {
      await this.profileService.updateProfile(this.profile.uid, {
        ...this.profile,
        dob: (this.profile.dob as any)?.toISOString()
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
    return this.services.find(s => s.id === id)?.title || 'Service';
  }

  getPlanName(serviceId: string, planId: string) {
    const service = this.services.find(s => s.id === serviceId);
    return service?.plans?.find(p => p.id === planId)?.name || 'Standard';
  }
}
