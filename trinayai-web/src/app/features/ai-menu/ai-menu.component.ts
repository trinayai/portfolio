import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteContentService } from '../../core/services/site-content.service';
import { ContentItem } from '../../core/models/site-content';

@Component({
  selector: 'app-ai-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-secondary p-8">
      <h2 class="mb-6 text-3xl font-bold text-accent">AI Menu & Analytics</h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div *ngFor="let item of items" class="rounded-xl border border-gray-800 bg-primary p-6 transition-colors hover:border-accent">
          <div class="mb-3 text-3xl">{{ item.icon || '🤖' }}</div>
          <h3 class="mb-2 text-xl font-semibold">{{ item.title }}</h3>
          <p class="text-gray-400">{{ item.description }}</p>
        </div>
      </div>
    </div>
  `
})
export class AiMenuComponent implements OnInit {
  private contentService = inject(SiteContentService);
  items: ContentItem[] = [];

  ngOnInit(): void {
    this.contentService.getAiMenuItems().subscribe((items) => this.items = items);
  }
}
