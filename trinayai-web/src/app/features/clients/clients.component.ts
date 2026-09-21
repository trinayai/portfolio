import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SiteContentService } from '../../core/services/site-content.service';
import { ClientItem, SiteSettings } from '../../core/models/site-content';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, RouterLink],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  private contentService = inject(SiteContentService);
  settings: SiteSettings = { brandName: '', logoUrl: '', footerText: '', menuItems: [] };
  clients: ClientItem[] = [];

  ngOnInit(): void {
    this.contentService.getSettings().subscribe(settings => this.settings = { ...this.settings, ...settings });
    this.contentService.getClients().pipe(
      map(items => items.filter(c => c.isVisible !== false))
    ).subscribe((clients: ClientItem[]) => {
      this.clients = clients;
    });
  }
}
