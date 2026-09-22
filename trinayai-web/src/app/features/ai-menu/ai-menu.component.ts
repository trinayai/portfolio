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
  takingTooLong = false;

  ngOnInit(): void {
    this.contentService.getSettings().subscribe(settings => this.settings = { ...this.settings, ...settings });
    this.loadPlans();
  }

  loadPlans() {
    this.syncing = true;
    this.takingTooLong = false;

    // Safety timeout
    const timeout = setTimeout(() => {
      if (this.items.length === 0) this.takingTooLong = true;
    }, 5000);

    this.contentService.getAiMenuItems().pipe(
      map(items => items.filter(i => i.isVisible !== false))
    ).subscribe(items => {
      clearTimeout(timeout);
      this.items = items;
      this.syncing = false;
      this.takingTooLong = false;
    });
  }

  retrySync() {
    this.contentService.refreshCollection('aiMenuItems');
    this.loadPlans();
  }

  openWorkspace(item: ContentItem): void {
    this.authService.user$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.router.navigate(['/profile'], { queryParams: { upgrade: item.id } });
      } else {
        this.router.navigate(['/login'], { queryParams: { returnUrl: '/ai-menu' } });
      }
    });
  }
}
