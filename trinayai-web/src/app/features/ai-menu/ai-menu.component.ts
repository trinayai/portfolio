import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteContentService } from '../../core/services/site-content.service';
import { ContentItem, SiteSettings } from '../../core/models/site-content';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-ai-menu',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './ai-menu.component.html',
  styleUrls: ['./ai-menu.component.scss']
})
export class AiMenuComponent implements OnInit {
  private contentService = inject(SiteContentService);
  private authService = inject(AuthService);
  private router = inject(Router);

  items: ContentItem[] = [];
  settings: SiteSettings = { brandName: '', logoUrl: '', footerText: '', menuItems: [] };
  syncing = true;

  ngOnInit(): void {
    this.contentService.getSettings().subscribe(settings => this.settings = { ...this.settings, ...settings });
    this.loadPlans();
  }

  loadPlans() {
    this.syncing = true;
    this.contentService.getAiMenuItems().pipe(
      map(items => {
        const visible = (items || []).filter(i => i.isVisible !== false);
        if (visible.length === 0) {
          return [
            {
              id: 'ai_std_1',
              title: 'General Reasoning & Workflow AI',
              description: 'Flexible AI reasoning models tailored for MSMEs and global enterprise teams.',
              icon: 'pi pi-android',
              isVisible: true,
              plans: [
                {
                  id: 'plan_std',
                  name: 'Standard Tier',
                  cost: '₹999',
                  billingCycle: '/ mo',
                  features: ['Full AI Features Access', 'Priority Response Time', '24/7 System Availability'],
                  isVisible: true
                },
                {
                  id: 'plan_pro',
                  name: 'Professional Tier',
                  cost: '₹2,499',
                  billingCycle: '/ mo',
                  features: ['Advanced Multi-modal AI', 'Dedicated Workflow Integration', 'Custom Analytics & SLA'],
                  isVisible: true
                }
              ]
            }
          ];
        }
        return visible;
      })
    ).subscribe(items => {
      this.items = items;
      this.syncing = false;
    });
  }

  subscribeToPlan(service: ContentItem, planId?: string): void {
    const queryParams: any = { upgrade: service.id };
    if (planId) queryParams.plan = planId;

    this.authService.user$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.router.navigate(['/profile'], { queryParams });
      } else {
        const returnUrl = `/profile?upgrade=${service.id}${planId ? '&plan=' + planId : ''}`;
        this.router.navigate(['/login'], { queryParams: { returnUrl } });
      }
    });
  }

  openWorkspace(service: ContentItem): void {
    this.subscribeToPlan(service);
  }
}
