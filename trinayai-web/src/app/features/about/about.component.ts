import { Component, OnInit, inject } from '@angular/core';
import { SiteContentService } from '../../core/services/site-content.service';
import { AboutCard, SiteSettings } from '../../core/models/site-content';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TimelineModule, CardModule],
  template: `
    <div class="min-h-screen bg-white px-6 py-32 relative overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute top-[20%] -left-[10%] h-[500px] w-[500px] bg-blue-50 blur-[150px] rounded-full"></div>
      <div class="absolute bottom-[10%] -right-[10%] h-[500px] w-[500px] bg-cyan-50 blur-[150px] rounded-full"></div>

      <div class="mx-auto max-w-7xl relative z-10">
        <div class="grid gap-20 lg:grid-cols-2 lg:items-center">
          <div class="space-y-10">
            <span class="inline-block rounded-full bg-blue-100 px-6 py-2 text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              Our Vision & Mission
            </span>
            <h2 class="text-6xl font-black tracking-tighter text-slate-900 sm:text-7xl leading-[0.95]">
              Pioneering <span class="text-blue-600">Ethical AI</span> for Global Impact.
            </h2>
            <div class="space-y-8 text-xl leading-relaxed text-slate-600 font-medium">
              <p>
                Trinayai Technologies Private Limited is a women-owned enterprise driving innovation in software development and artificial intelligence.
                We specialize in building advanced LLMs and AI models tailored for MSMEs, empowering businesses with compliance automation and digital transformation.
              </p>
              <p>
                As part of the India Startup ecosystem and aligned with the IndiaAI Mission, Trinayai is committed to delivering cutting-edge technology
                with a focus on accessibility, efficiency, and impact across India’s growing MSME sector.
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
        <div class="mt-40">
          <h3 class="text-4xl font-black text-slate-900 text-center mb-24 tracking-tighter">Our Evolution</h3>
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
  settings: SiteSettings = { brandName: 'Trinay AI', logoUrl: '', footerText: '', menuItems: [] };
  events: any[] = [];

  ngOnInit(): void {
    this.contentService.getSettings().subscribe((settings: SiteSettings) => this.settings = settings || this.settings);
    this.contentService.getAboutCards().subscribe((cards: AboutCard[]) => {
      this.cards = cards.length ? cards : [
        { title: 'Women-Led', description: 'Empowering diversity and innovation in the tech landscape.' },
        { title: 'MSME Focused', description: 'Tailored solutions for small and medium enterprises.' },
        { title: 'AI Driven', description: 'Leveraging LLMs for complex automation.' },
        { title: 'IndiaAI Mission', description: 'Aligned with national goals for AI sovereignty.' }
      ];
    });

    this.events = [
      { status: 'Foundation', date: '2024', icon: 'pi pi-flag', description: 'Establishment of Trinayai Technologies with a vision for ethical AI.' },
      { status: 'MSME Launch', date: '2025', icon: 'pi pi-rocket', description: 'Rolling out first set of LLM tools for small businesses.' },
      { status: 'Scaling Up', date: '2026', icon: 'pi pi-chart-line', description: 'Expanding compliance automation platform across India.' }
    ];
  }
}
