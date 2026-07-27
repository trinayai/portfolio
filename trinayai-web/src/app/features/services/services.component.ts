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
    <div class="min-h-screen bg-[#050c1f] px-6 py-24">
      <div class="mx-auto max-w-7xl">
        <div class="mb-20 text-center" pAnimateOnScroll enterClass="fadein" leaveClass="fadeout">
          <span class="inline-block rounded-full bg-cyan-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-400 ring-1 ring-cyan-500/20 mb-6">
            Capabilities
          </span>
          <h2 class="text-4xl font-black tracking-tight text-white sm:text-6xl">
            Our <span class="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">AI Ecosystem</span>
          </h2>
          <p class="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Comprehensive AI solutions designed to scale your business and automate complex workflows with precision.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <p-card *ngFor="let item of services; let i = index"
                  [header]="item.title"
                  styleClass="h-full border border-white/10 bg-white/5 transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 hover:border-cyan-500/30 overflow-hidden"
                  pAnimateOnScroll [enterClass]="'fadeinup'" [leaveClass]="'fadeout'">
            <ng-template pTemplate="header">
               <div class="h-2 w-full bg-gradient-to-r from-cyan-500 to-transparent"></div>
               <div class="pt-8 px-8">
                 <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
                   <i [class]="item.icon || 'pi pi-cog'" class="text-xl"></i>
                 </div>
               </div>
            </ng-template>
            <p class="text-slate-400 leading-relaxed">{{ item.description }}</p>
            <ng-template pTemplate="footer">
              <button class="text-sm font-bold uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2">
                Learn More <i class="pi pi-arrow-right text-xs"></i>
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
    this.contentService.getServices().subscribe((services) => {
      this.services = services.length ? services : [
        { title: 'AI Model Tuning', description: 'Fine-tuning foundational models for domain-specific accuracy and efficiency.', icon: 'pi pi-sliders-h' },
        { title: 'NLP Solutions', description: 'Advanced natural language processing for sentiment analysis, translation, and more.', icon: 'pi pi-comment' },
        { title: 'Data Analytics', description: 'Transforming raw data into actionable insights using predictive AI modeling.', icon: 'pi pi-chart-bar' },
        { title: 'Cloud Infrastructure', description: 'Scalable cloud architectures optimized for heavy AI workloads and fast inference.', icon: 'pi pi-cloud' }
      ];
    });
  }
}
