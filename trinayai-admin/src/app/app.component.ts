import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SiteContentService } from './core/services/site-content.service';
import { SiteSettings, MenuItem as SiteMenuItem } from './core/models/site-content';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { MenuItem } from 'primeng/api';
import { AuthService } from './core/services/auth.service';
import { User } from '@angular/fire/auth';

import { MenubarModule } from 'primeng/menubar';
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    ButtonModule,
    SidebarModule,
    MenubarModule,
    PanelMenuModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'trinayai-admin';
  private contentService = inject(SiteContentService);
  private authService = inject(AuthService);

  items: MenuItem[] = [];
  sidebarVisible = false;
  authUser: User | null = null;

  private readonly DEFAULT_MENU: SiteMenuItem[] = [
    { label: 'App Management', route: '/admin', order: 1, isVisible: true },
    {
      label: 'Documents', order: 2, isVisible: true,
      items: [
        { label: 'Trinayai', route: '/documents/trinayai', order: 1, isVisible: true },
        { label: 'Directors', route: '/documents/directors', order: 2, isVisible: true },
        { label: 'Tenders', route: '/documents/tenders', order: 3, isVisible: true }
      ]
    },
    {
      label: 'Investors', order: 3, isVisible: true,
      items: [
        { label: 'Non-Government', route: '/investors/non-gov', order: 1, isVisible: true },
        { label: 'Government', route: '/investors/gov', order: 2, isVisible: true }
      ]
    },
    {
      label: 'Manage', order: 4, isVisible: true,
      items: [
        { label: 'Employee', route: '/manage/employee', order: 1, isVisible: true },
        { label: 'Admin', route: '/manage/admin', order: 2, isVisible: true },
        { label: 'Vendors', route: '/manage/vendors', order: 3, isVisible: true },
        { label: 'Assets', route: '/manage/assets', order: 4, isVisible: true },
        { label: 'Clients', route: '/manage/clients', order: 5, isVisible: true },
        { label: 'Subscribers', route: '/manage/subscribers', order: 6, isVisible: true }
      ]
    },
    {
      label: 'Finance', order: 5, isVisible: true,
      items: [
        { label: 'Investment', route: '/finance/investment', order: 1, isVisible: true },
        { label: 'Funds', route: '/finance/funds', order: 2, isVisible: true },
        { label: 'Expenses', route: '/finance/expenses', order: 3, isVisible: true },
        { label: 'Salaries', route: '/finance/salaries', order: 4, isVisible: true },
        { label: 'Report', route: '/finance/report', order: 5, isVisible: true }
      ]
    }
  ];

  settings: SiteSettings = {
    brandName: 'TRINAY AI',
    logoUrl: 'assets/logo/Trinay-AI-Logo.png',
    footerText: '© 2026 Trinayai Technologies Private Limited. All rights reserved. SF No. 224/8F8, Attur main road, Kumbakottai, Namagiripettai, Rasipuram, Namakkal, Tamil Nadu – 637406.',
    contactEmail: 'info@trinayai.com',
    menuItems: this.DEFAULT_MENU
  };

  ngOnInit(): void {
    this.updateMenuItems();
    this.authService.user$.subscribe(user => this.authUser = user);
    this.contentService.getSettings().subscribe((settings: SiteSettings) => {
      const menuInStore = settings?.menuItems || [];
      const isOldMenu = !menuInStore.some(m => m.label === 'App Management' || m.label === 'Finance');

      this.settings = {
        ...this.settings,
        ...settings,
        menuItems: isOldMenu ? this.DEFAULT_MENU : menuInStore
      };
      this.updateMenuItems();
    });
  }

  private updateMenuItems(): void {
    const mapMenuItem = (item: SiteMenuItem): MenuItem => {
      const mapped: MenuItem = {
        label: item.route === '/ai-menu' ? 'Subscription' : item.label,
        routerLinkActiveOptions: { exact: true }
      };

      if (item.route) {
        mapped.routerLink = item.route;
      }

      if (item.items && item.items.length > 0) {
        mapped.items = item.items
          .filter(child => child.isVisible !== false)
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map(child => mapMenuItem(child));
      }

      return mapped;
    };

    this.items = this.settings.menuItems
      .filter(item => item.isVisible !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(item => mapMenuItem(item));
  }

  logout() {
    this.authService.logout().subscribe();
  }
}
