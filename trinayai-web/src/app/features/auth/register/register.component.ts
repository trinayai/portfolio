import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SiteContentService } from '../../../core/services/site-content.service';
import { ContentItem, ServicePlan, UserSubscription } from '../../../core/models/site-content';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, InputTextModule, ButtonModule, DropdownModule, MultiSelectModule, CalendarModule, ToastModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  step = 1;
  email = '';
  password = '';
  profile: any = {
    displayName: '',
    gender: '',
    dob: null,
    country: '',
    billingAddress: '',
    phoneNumber: ''
  };

  services: ContentItem[] = [];
  selectedServices: ContentItem[] = [];
  serviceSubscriptions: { [key: string]: ServicePlan } = {};

  loading = false;
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

  private authService = inject(AuthService);
  private contentService = inject(SiteContentService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  ngOnInit() {
    this.contentService.getAiMenuItems().subscribe(items => {
      this.services = items.filter(i => i.isVisible !== false);
    });
  }

  nextStep() {
    if (this.step === 1 && (!this.email || !this.password || !this.profile.displayName)) {
      this.messageService.add({ severity: 'warn', summary: 'Missing Info', detail: 'Please fill in account details.' });
      return;
    }
    this.step++;
  }

  prevStep() { this.step--; }

  async onRegister() {
    this.loading = true;
    try {
      const subscriptions: UserSubscription[] = Object.keys(this.serviceSubscriptions).map(serviceId => ({
        serviceId,
        planId: this.serviceSubscriptions[serviceId].id || 'standard',
        status: 'pending',
        startDate: new Date().toISOString()
      }));

      await this.authService.register(this.email, this.password, {
        ...this.profile,
        dob: this.profile.dob?.toISOString(),
        subscriptions
      });

      this.router.navigate(['/']);
    } catch (err: any) {
      this.messageService.add({ severity: 'error', summary: 'Registration Failed', detail: err.message });
    } finally {
      this.loading = false;
    }
  }

  onServiceToggle(service: ContentItem) {
    const idx = this.selectedServices.findIndex(s => s.id === service.id);
    if (idx > -1) {
      this.selectedServices.splice(idx, 1);
      delete this.serviceSubscriptions[service.id!];
    } else {
      this.selectedServices.push(service);
      if (service.plans && service.plans.length > 0) {
        this.serviceSubscriptions[service.id!] = service.plans[0];
      }
    }
  }
}
