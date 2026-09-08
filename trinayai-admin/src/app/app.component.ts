import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { SiteContentService } from './core/services/site-content.service';
import { SiteSettings } from './core/models/site-content';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MenubarModule, ButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'trinayai-web';
  private contentService = inject(SiteContentService);
  items: MenuItem[] = [];
  settings: SiteSettings = {
    brandName: 'TRINAYAI',
    logoUrl: 'assets/logo/Trinay-AI-Logo.png',
    footerText: '© 2026 Trinayai Technologies Private Limited. All rights reserved. Tamil Nadu, India.',
    contactEmail: 'admin@trinayai.com',
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
        footerText: this.compactFooterText(settings.footerText),
        menuItems: settings?.menuItems?.length ? settings.menuItems : this.settings.menuItems
      };
      this.updateMenuItems();
    });
  }

  private compactFooterText(footerText?: string): string {
    const fallback = '© 2026 Trinayai Technologies Private Limited. All rights reserved. Tamil Nadu, India.';
    if (!footerText) return fallback;
    return footerText.replace(/SF No\..*?(Tamil Nadu\s*[–-]\s*\d{6}|Tamil Nadu,?\s*India)\.?/i, 'Tamil Nadu, India.');
  }

  private updateMenuItems(): void {
    this.items = this.settings.menuItems.map(item => ({
      label: item.label,
      routerLink: item.route,
      routerLinkActiveOptions: { exact: true }
    }));
  }
}
