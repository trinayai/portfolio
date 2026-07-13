import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteContentService } from '../../core/services/site-content.service';
import { ContentItem } from '../../core/models/site-content';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-primary p-8">
      <h2 class="mb-12 text-center text-3xl font-bold text-accent">Our Services</h2>
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div *ngFor="let item of services" class="service-card">
          <div class="mb-4 text-3xl">{{ item.icon || '⚙️' }}</div>
          <h3 class="mb-4 text-xl font-bold">{{ item.title }}</h3>
          <p class="text-gray-400">{{ item.description }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .service-card {
      @apply rounded-t-lg border-b-4 border-accent bg-secondary p-6 transition-transform hover:-translate-y-2;
    }
  `]
})
export class ServicesComponent implements OnInit {
  private contentService = inject(SiteContentService);
  services: ContentItem[] = [];

  ngOnInit(): void {
    this.contentService.getServices().subscribe((services) => this.services = services);
  }
}
