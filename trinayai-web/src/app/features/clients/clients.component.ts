import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteContentService } from '../../core/services/site-content.service';
import { ClientItem } from '../../core/models/site-content';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="mb-12 text-3xl font-bold text-accent">Global Partners & Clients</h2>
      <div class="flex flex-wrap justify-center gap-8 opacity-70 grayscale transition-all hover:grayscale-0">
        <a *ngFor="let client of clients" [href]="client.website || null" target="_blank" class="flex h-24 w-32 items-center justify-center rounded bg-gray-800 p-3 text-center text-xs text-gray-200">
          <img *ngIf="client.imageUrl" [src]="client.imageUrl" [alt]="client.name" class="max-h-full max-w-full object-contain" />
          <span *ngIf="!client.imageUrl">{{ client.name }}</span>
        </a>
      </div>
    </div>
  `
})
export class ClientsComponent implements OnInit {
  private contentService = inject(SiteContentService);
  clients: ClientItem[] = [];

  ngOnInit(): void {
    this.contentService.getClients().subscribe((clients) => this.clients = clients);
  }
}
