import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SiteContentService } from '../../core/services/site-content.service';
import { ClientItem, SiteSettings } from '../../core/models/site-content';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, RouterLink],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent {
  private contentService = inject(SiteContentService);

  settings$: Observable<SiteSettings> = this.contentService.getSettings();
  clients$: Observable<ClientItem[]> = this.contentService.getClients().pipe(
    map(items => items.filter(c => c.isVisible !== false))
  );
}
