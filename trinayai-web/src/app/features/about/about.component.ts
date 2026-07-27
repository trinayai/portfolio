import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteContentService } from '../../core/services/site-content.service';
import { AboutCard } from '../../core/models/site-content';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TimelineModule, CardModule],
  template: `
    <div class="min-h-screen bg-[#050c1f] px-6 py-24">
      <div class="mx-auto max-w-5xl">
        <div class="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <span class="inline-block rounded-full bg-fuchsia-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-fuchsia-400 ring-1 ring-fuchsia-500/20 mb-6">
              Our Mission
            </span>
            <h2 class="text-4xl font-black tracking-tight text-white sm:text-6xl mb-8">
              Pioneering <span class="bg-gradient-to-r from-fuchsia-400 to-violet-500 bg-clip-text text-transparent">Ethical AI</span> for Global Impact.
            </h2>
            <div class="space-y-6 text-lg leading-relaxed text-slate-400">
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
             <div class="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-fuchsia-500 opacity-20 blur-3xl rounded-full"></div>
             <div class="relative grid gap-6 sm:grid-cols-2">
                <p-card *ngFor="let card of cards" styleClass="border border-white/10 bg-white/5 backdrop-blur-xl">
                  <h3 class="text-xl font-bold text-white mb-2">{{ card.title }}</h3>
                  <p class="text-sm text-slate-400 leading-relaxed">{{ card.description }}</p>
                </p-card>
             </div>
          </div>
        </div>

        <!-- Vision/Values Timeline -->
        <div class="mt-32">
          <h3 class="text-3xl font-bold text-white text-center mb-16">Our Journey & Vision</h3>
          <p-timeline [value]="events" align="alternate" styleClass="customized-timeline">
            <ng-template pTemplate="marker" let-event>
                <span class="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 ring-2 ring-cyan-500/50 shadow-lg shadow-cyan-500/20">
                    <i [class]="event.icon"></i>
                </span>
            </ng-template>
            <ng-template pTemplate="content" let-event>
                <p-card [header]="event.status" [subheader]="event.date" styleClass="border border-white/10 bg-white/5 mb-8">
                    <p class="text-slate-400">{{event.description}}</p>
                </p-card>
            </ng-template>
          </p-timeline>
        </div>
      </div>
    </div>
  `,
  styles: [`
    ::ng-deep {
      .customized-timeline {
        .p-timeline-event-opposite {
          flex: 0;
          padding: 0;
        }
        @media screen and (min-width: 960px) {
          .p-timeline-event-opposite {
            flex: 1;
            padding: 0 1rem;
          }
        }
      }
      .p-card {
        border-radius: 20px;
        .p-card-title { color: white; font-size: 1.25rem; }
        .p-card-subtitle { color: #38bdf8; font-size: 0.875rem; margin-top: 0.25rem; }
        .p-card-body { padding: 1.5rem; }
      }
    }
  `]
})
export class AboutComponent implements OnInit {
  private contentService = inject(SiteContentService);
  cards: AboutCard[] = [];
  settings: any = { brandName: 'Trinay AI' };
  events: any[] = [];

  ngOnInit(): void {
    this.contentService.getSettings().subscribe((settings) => this.settings = settings || this.settings);
    this.contentService.getAboutCards().subscribe((cards) => {
      this.cards = cards.length ? cards : [
        { title: 'Women-Led', description: 'Empowering diversity and innovation in the tech landscape.' },
        { title: 'MSME Focused', description: 'Tailored solutions for small and medium enterprises.' },
        { title: 'AI Driven', description: 'Leveraging LLMs for complex automation.' },
        { title: 'IndiaAI Mission', description: 'Aligned with national goals for AI sovereignty.' }
      ];
    });

    this.events = [
      { status: 'Foundation', date: '2024', icon: 'pi pi-flag', description: 'Establishment of Trinayai Technologies with a vision for ethical AI.', color: '#9C27B0' },
      { status: 'MSME Launch', date: '2025', icon: 'pi pi-rocket', description: 'Rolling out first set of LLM tools for small businesses.', color: '#673AB7' },
      { status: 'Scaling Up', date: '2026', icon: 'pi pi-chart-line', description: 'Expanding compliance automation platform across India.', color: '#FF9800' }
    ];
  }
}
