import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteContentService } from '../../core/services/site-content.service';
import { AboutCard } from '../../core/models/site-content';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mx-auto max-w-4xl px-4 py-16">
      <h2 class="mb-8 text-4xl font-bold text-accent">About {{ settings.brandName || 'Trinay AI' }}</h2>
      <div class="space-y-6 leading-relaxed text-gray-300">
        <p>
          Trinay AI is a forward-thinking technology enterprise rooted in Tamil Nadu, dedicated to bridging the gap between cutting-edge AI and global needs.
        </p>
        <div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div *ngFor="let card of cards" class="rounded-lg bg-secondary p-6">
            <h3 class="mb-2 text-xl font-bold text-white">{{ card.title }}</h3>
            <p>{{ card.description }}</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AboutComponent implements OnInit {
  private contentService = inject(SiteContentService);
  cards: AboutCard[] = [];
  settings: any = { brandName: 'Trinay AI' };

  ngOnInit(): void {
    this.contentService.getSettings().subscribe((settings) => this.settings = settings || this.settings);
    this.contentService.getAboutCards().subscribe((cards) => this.cards = cards);
  }
}
