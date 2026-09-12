import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SiteContentService } from './core/services/site-content.service';
import { SiteSettings } from './core/models/site-content';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MenubarModule,
    ButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'trinayai-admin';
  private contentService = inject(SiteContentService);
  items: MenuItem[] = [];
  settings: SiteSettings = {
    brandName: 'TRINAY AI',
    logoUrl: 'assets/logo/Trinay-AI-Logo.png',
    footerText: '© 2026 Trinayai Technologies Private Limited. All rights reserved. SF No. 224/8F8, Attur main road, Kumbakottai, Namagiripettai, Rasipuram, Namakkal, Tamil Nadu – 637406.',
    contactEmail: 'info@trinayai.com',
    menuItems: [
      { label: 'Admin', route: '/admin', order: 1, isVisible: true },
      { label: 'View Subscription', route: '/ai-menu', order: 2, isVisible: true }
    ]
  };

  ngOnInit(): void {
    this.updateMenuItems();
    this.contentService.getSettings().subscribe((settings: SiteSettings) => {
      this.settings = {
        ...this.settings,
        ...settings,
        menuItems: settings?.menuItems?.length ? settings.menuItems : this.settings.menuItems
      };
      this.updateMenuItems();
    });
  }

  private updateMenuItems(): void {
    this.items = this.settings.menuItems
      .filter(item => item.isVisible !== false)
      .map(item => ({
        label: item.route === '/ai-menu' ? 'Subscription' : item.label,
        routerLink: item.route,
        routerLinkActiveOptions: { exact: true }
      }));
  }
}
