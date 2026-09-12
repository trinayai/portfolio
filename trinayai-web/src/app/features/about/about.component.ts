import { Component, OnInit, inject } from '@angular/core';
import { SiteContentService } from '../../core/services/site-content.service';
import { AboutCard, AboutEvent, SiteSettings } from '../../core/models/site-content';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TimelineModule, CardModule],
  template: `
    <div class="min-h-[calc(100vh-5rem)] bg-white px-5 py-14 relative overflow-x-clip sm:px-8 sm:py-16 lg:px-10">
      <!-- Background Elements -->
      <div class="absolute top-[20%] -left-[10%] h-[500px] w-[500px] bg-blue-50 blur-[150px] rounded-full"></div>
      <div class="absolute bottom-[10%] -right-[10%] h-[500px] w-[500px] bg-cyan-50 blur-[150px] rounded-full"></div>

      <div class="mx-auto max-w-7xl relative z-10">
        <div class="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div class="space-y-7">
            <span class="inline-block rounded-full bg-blue-100 px-6 py-2 text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              {{ settings.aboutEyebrow }}
            </span>
            <h2 class="text-4xl font-black tracking-tighter text-slate-900 sm:text-6xl leading-[0.98]">
              {{ settings.aboutTitle }}
            </h2>
            <div class="space-y-5 text-base leading-relaxed text-slate-600 font-medium sm:text-xl">
              <p>
                {{ settings.aboutIntro }}
              </p>
              <p>
                {{ settings.aboutBody }}
              </p>
            </div>
          </div>

          <div class="relative">
             <div class="grid gap-6 sm:grid-cols-2">
                <ng-container *ngFor="let card of cards">
                  <p-card styleClass="border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <h3 class="text-2xl font-black text-slate-900 mb-3 tracking-tight">{{ card.title }}</h3>
                    <p class="text-base text-slate-500 leading-relaxed font-medium">{{ card.description }}</p>
                  </p-card>
                </ng-container>
             </div>
          </div>
        </div>

        <!-- Vision/Values Timeline -->
        <div class="mt-20 sm:mt-24">
          <h3 class="text-3xl font-black text-slate-900 text-center mb-12 tracking-tighter sm:text-4xl">{{ settings.aboutTimelineTitle }}</h3>
          <p-timeline [value]="events" align="alternate" styleClass="customized-timeline">
            <ng-template pTemplate="marker" let-event>
                <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
                    <i [class]="event.icon" class="text-xl"></i>
                </span>
            </ng-template>
            <ng-template pTemplate="content" let-event>
                <p-card styleClass="border border-slate-100 bg-white mb-12 shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex items-center justify-between mb-4">
                      <span class="text-2xl font-black text-slate-900 tracking-tight">{{event.status}}</span>
                      <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">{{event.date}}</span>
                    </div>
                    <p class="text-slate-600 text-lg leading-relaxed font-medium">{{event.description}}</p>
                </p-card>
            </ng-template>
          </p-timeline>
        </div>
      </div>
    </div>
  `,
  styles: [
    `::ng-deep .customized-timeline .p-timeline-event-opposite { flex: 0; padding: 0; }`,
    `@media screen and (min-width: 960px) { ::ng-deep .customized-timeline .p-timeline-event-opposite { flex: 1; padding: 0 1rem; } }`,
    `::ng-deep .p-card { border-radius: 24px; }`,
    `::ng-deep .p-card .p-card-body { padding: 1.5rem; }`
  ]
})
export class AboutComponent implements OnInit {
  private contentService = inject(SiteContentService);
  cards: AboutCard[] = [];
  settings: SiteSettings = { brandName: '', logoUrl: '', footerText: '', menuItems: [] };
  events: AboutEvent[] = [];

  ngOnInit(): void {
    this.contentService.getSettings().subscribe((settings: SiteSettings) => this.settings = settings || this.settings);
    this.contentService.getAboutCards().subscribe((cards: AboutCard[]) => this.cards = cards);
    this.contentService.getAboutEvents().subscribe((events: AboutEvent[]) => this.events = events);
  }
}
