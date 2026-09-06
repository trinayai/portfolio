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
  title = 'trinayai-web';
  private contentService = inject(SiteContentService);
  items: MenuItem[] = [];
  settings: SiteSettings = {
    brandName: 'TRINAY AI',
    logoUrl: '',
    footerText: '© 2026 Trinay AI. All rights reserved. MSME Registered | Women-Owned Enterprise',
    menuItems: [
      { label: 'AI Menu', route: '/ai-menu', order: 1 },
      { label: 'About', route: '/about', order: 2 },
      { label: 'Services', route: '/services', order: 3 },
      { label: 'Clients', route: '/clients', order: 4 },
      { label: 'Contact', route: '/contact', order: 5 }
    ]
  };

  ngOnInit(): void {
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
    this.items = this.settings.menuItems.map(item => ({
      label: item.label,
      routerLink: item.route,
      routerLinkActiveOptions: { exact: true }
    }));
  }
}
