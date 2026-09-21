import { Component, OnInit, inject } from '@angular/core';
import { SiteContentService } from '../../core/services/site-content.service';
import { AboutCard, SiteSettings, AboutEvent } from '../../core/models/site-content';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TimelineModule, CardModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  private contentService = inject(SiteContentService);
  cards: AboutCard[] = [];
  settings: SiteSettings = { brandName: 'Trinay AI', logoUrl: '', footerText: '', menuItems: [] };
  events: AboutEvent[] = [];

  ngOnInit(): void {
    this.contentService.getSettings().subscribe((settings: SiteSettings) => this.settings = { ...this.settings, ...settings });
    this.contentService.getAboutCards().pipe(
      map(cards => cards.filter(c => c.isVisible !== false))
    ).subscribe((cards: AboutCard[]) => {
      this.cards = cards.length ? cards : [
        { title: 'Women-Led', description: 'Empowering diversity and innovation in the tech landscape.' },
        { title: 'MSME Focused', description: 'Tailored solutions for small and medium enterprises.' },
        { title: 'AI Driven', description: 'Leveraging LLMs for complex automation.' },
        { title: 'IndiaAI Mission', description: 'Aligned with national goals for AI sovereignty.' }
      ];
    });

    this.contentService.getAboutEvents().pipe(
      map(events => events.filter(e => e.isVisible !== false))
    ).subscribe((events: AboutEvent[]) => {
      this.events = events;
    });
  }
}
