import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteContentService } from '../../core/services/site-content.service';
import { ContentItem } from '../../core/models/site-content';
import { CardModule } from 'primeng/card';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, CardModule, AnimateOnScrollModule],
  template: `
    <div class="min-h-screen bg-slate-950 px-6 py-32 relative overflow-hidden">
      <!-- Background Accents -->
      <div class="absolute top-0 right-0 h-96 w-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-0 left-0 h-96 w-96 bg-cyan-600/10 blur-[120px] rounded-full"></div>

      <div class="mx-auto max-w-7xl relative z-10">
        <div class="mb-24 text-center" pAnimateOnScroll enterClass="fadein" leaveClass="fadeout">
          <span class="inline-block rounded-full bg-cyan-500/10 px-6 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-400 ring-1 ring-cyan-500/30 mb-8 shadow-lg shadow-cyan-500/10">
            Expertise & Capabilities
          </span>
          <h2 class="text-5xl font-black tracking-tighter text-white sm:text-7xl">
            Our <span class="bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent">AI Ecosystem</span>
          </h2>
          <p class="mx-auto mt-8 max-w-3xl text-xl text-slate-400 font-medium leading-relaxed opacity-90">
            Comprehensive AI solutions designed to scale your business and automate complex workflows with precision and ethical integrity.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          <p-card *ngFor="let item of services; let i = index"
                  styleClass="h-full border border-white/5 bg-slate-900/40 backdrop-blur-xl transition-all duration-700 hover:-translate-y-3 hover:bg-slate-800/60 hover:border-cyan-500/40 overflow-hidden group shadow-2xl"
                  pAnimateOnScroll [enterClass]="'fadeinup'" [leaveClass]="'fadeout'">
            <ng-template pTemplate="header">
               <div class="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-fuchsia-600 opacity-80"></div>
               <div class="pt-10 px-10">
                 <div class="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-800 text-cyan-400 ring-1 ring-white/10 group-hover:from-cyan-500 group-hover:to-blue-600 group-hover:text-white group-hover:bg-gradient-to-br transition-all duration-500 shadow-xl">
                   <i [class]="item.icon || 'pi pi-cog'" class="text-2xl"></i>
                 </div>
               </div>
            </ng-template>
            <h3 class="text-2xl font-black text-white mb-4 group-hover:text-cyan-300 transition-colors">{{ item.title }}</h3>
            <p class="text-slate-400 text-lg leading-relaxed font-medium group-hover:text-slate-200 transition-colors">{{ item.description }}</p>
            <ng-template pTemplate="footer">
              <button class="mt-4 text-sm font-black uppercase tracking-widest text-cyan-400 hover:text-white transition-all flex items-center gap-3 group/btn">
                <span>Discover More</span>
                <i class="pi pi-arrow-right text-xs transition-transform group-hover/btn:translate-x-2"></i>
              </button>
            </ng-template>
          </p-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    ::ng-deep {
      .p-card {
        border-radius: 24px;
        .p-card-title {
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }
        .p-card-body {
          padding: 2rem;
        }
        .p-card-content {
          padding: 0;
        }
      }
    }

    @keyframes fadeinup {
      0% { opacity: 0; transform: translateY(30px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    .fadeinup {
      animation: fadeinup 0.8s ease-out forwards;
    }
  `]
})
export class ServicesComponent implements OnInit {
  private contentService = inject(SiteContentService);
  services: ContentItem[] = [];

  ngOnInit(): void {
    this.contentService.getServices().subscribe((services: ContentItem[]) => {
      this.services = services.length ? services : [
        { title: 'AI Model Tuning', description: 'Fine-tuning foundational models for domain-specific accuracy and efficiency.', icon: 'pi pi-sliders-h' },
        { title: 'NLP Solutions', description: 'Advanced natural language processing for sentiment analysis, translation, and more.', icon: 'pi pi-comment' },
        { title: 'Data Analytics', description: 'Transforming raw data into actionable insights using predictive AI modeling.', icon: 'pi pi-chart-bar' },
        { title: 'Cloud Infrastructure', description: 'Scalable cloud architectures optimized for heavy AI workloads and fast inference.', icon: 'pi pi-cloud' }
      ];
    });
  }
}
