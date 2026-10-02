import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SiteContentService } from './core/services/site-content.service';
import { SiteSettings } from './core/models/site-content';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { MenuItem } from 'primeng/api';

import { AuthService } from './core/services/auth.service';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    ButtonModule,
    SidebarModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'trinayai-web';
  private contentService = inject(SiteContentService);
  private authService = inject(AuthService);

  sidebarVisible = false;
  authUser: User | null = null;

  settings$: Observable<SiteSettings & { navItems: MenuItem[] }> = this.contentService.getSettings().pipe(
    map(settings => {
      const items = settings?.menuItems?.length ? settings.menuItems : [
        { label: 'Home', route: '/', order: 0, isVisible: true },
        { label: 'Subscription', route: '/ai-menu', order: 1, isVisible: true },
        { label: 'About', route: '/about', order: 2, isVisible: true },
        { label: 'Services', route: '/services', order: 3, isVisible: true },
        { label: 'Clients', route: '/clients', order: 4, isVisible: true },
        { label: 'Contact', route: '/contact', order: 5, isVisible: true }
      ];

      const navItems: MenuItem[] = items
        .filter(item => item.isVisible !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(item => ({
          label: item.route === '/ai-menu' ? 'Subscription' : item.label,
          routerLink: item.route,
          routerLinkActiveOptions: { exact: true }
        }));

      return {
        ...settings,
        menuItems: items,
        navItems
      };
    })
  );

  ngOnInit(): void {
    this.authService.user$.subscribe(user => this.authUser = user);
  }

  getNavItems(settings: SiteSettings): MenuItem[] {
    return (settings.menuItems || [])
      .filter(item => item.isVisible !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(item => ({
        label: item.route === '/ai-menu' ? 'Subscription' : item.label,
        routerLink: item.route,
        routerLinkActiveOptions: { exact: true }
      }));
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.sidebarVisible = false;
    });
  }
}
