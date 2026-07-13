import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SiteContentService } from './core/services/site-content.service';
import { MenuItem, SiteSettings } from './core/models/site-content';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'trinayai-web';
  private contentService = inject(SiteContentService);
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
    this.contentService.getSettings().subscribe((settings) => {
      this.settings = {
        ...this.settings,
        ...settings,
        menuItems: settings?.menuItems?.length ? settings.menuItems : this.settings.menuItems
      };
    });
  }
}
