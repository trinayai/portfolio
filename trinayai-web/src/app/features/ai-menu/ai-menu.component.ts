import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteContentService } from '../../core/services/site-content.service';
import { ContentItem } from '../../core/models/site-content';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';

@Component({
  selector: 'app-ai-menu',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule, ButtonModule, AnimateOnScrollModule],
  template: `
    <div class="min-h-screen bg-slate-950 px-6 py-32 relative overflow-hidden">
      <!-- Background Accents -->
      <div class="absolute top-[10%] left-[20%] h-[400px] w-[400px] bg-blue-600/10 blur-[130px] rounded-full"></div>
      <div class="absolute bottom-[20%] right-[10%] h-[400px] w-[400px] bg-indigo-600/10 blur-[130px] rounded-full animate-pulse"></div>

      <div class="mx-auto max-w-7xl relative z-10">
        <div class="mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-10" pAnimateOnScroll enterClass="fadein" leaveClass="fadeout">
          <div>
            <span class="inline-block rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-6 py-2 text-xs font-black uppercase tracking-[0.2em] text-blue-400 ring-1 ring-blue-500/30 mb-8 shadow-lg shadow-blue-500/10">
              Intelligence Dashboard
            </span>
            <h2 class="text-6xl font-black tracking-tighter text-white sm:text-7xl">
              Advanced <span class="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">LLM Suite</span>
            </h2>
          </div>
          <div class="flex gap-4">
             <p-button label="Filter" icon="pi pi-filter" styleClass="p-button-outlined p-button-sm border-white/10 text-white hover:bg-white/5"></p-button>
             <p-button label="Sort" icon="pi pi-sort" styleClass="p-button-outlined p-button-sm border-white/10 text-white hover:bg-white/5"></p-button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[280px]">
          <ng-container *ngFor="let item of items; let i = index">
            <p-card class="relative overflow-hidden border border-white/5 bg-slate-900/40 backdrop-blur-3xl transition-all duration-700 hover:border-blue-500/40 hover:bg-slate-800/60 group shadow-2xl" [ngClass]="i === 0 ? 'md:col-span-2 md:row-span-2' : i === 3 ? 'md:col-span-2' : ''">
              <div class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>

              <ng-template pTemplate="header">
                 <div class="pt-10 px-10 flex justify-between items-start">
                   <div class="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-800 text-blue-400 ring-1 ring-white/10 group-hover:from-blue-500 group-hover:to-indigo-600 group-hover:text-white group-hover:bg-gradient-to-br transition-all duration-500 shadow-xl">
                     <i [class]="item.icon || 'pi pi-android'" class="text-2xl"></i>
                   </div>
                   <p-tag [value]="i === 0 ? 'FLAGSHIP' : 'PREMIUM'" severity="info" [rounded]="true"
                          styleClass="text-[10px] font-black tracking-[0.15em] px-4 py-1.5 bg-blue-500/15 text-blue-300 border border-blue-500/20"></p-tag>
                 </div>
              </ng-template>

              <div class="h-full flex flex-col" [class.justify-end]="i === 0" [class.pb-8]="i === 0">
                <h3 [class]="i === 0 ? 'text-3xl font-black' : 'text-xl font-bold'" class="text-white mb-3 tracking-tight group-hover:text-blue-300 transition-colors">{{ item.title }}</h3>
                <p [class]="i === 0 ? 'text-lg leading-relaxed' : 'text-sm leading-normal'" class="text-slate-400 font-medium group-hover:text-slate-200 transition-colors mb-6">{{ item.description }}</p>

                <ng-container *ngIf="i !== 0">
                  <p-button label="Launch Model" icon="pi pi-external-link"
                            styleClass="w-full p-button-sm bg-white/5 border border-white/10 text-white hover:bg-blue-600 hover:border-blue-600 transition-all font-bold uppercase tracking-widest"></p-button>
                </ng-container>

                <ng-container *ngIf="i === 0">
                  <div class="mt-4">
                     <p-button label="Configure Flagship Flow" icon="pi pi-cog"
                               styleClass="bg-gradient-to-r from-blue-600 to-indigo-600 border-none px-8 py-4 font-black uppercase tracking-widest text-white shadow-xl hover:scale-105 transition-transform"></p-button>
                  </div>
                </ng-container>
              </div>
            </p-card>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: [
    `::ng-deep .p-card { border-radius: 20px; }`,
    `::ng-deep .p-card .p-card-body { padding: 1.5rem 2rem 2rem 2rem; }`
  ]
})
export class AiMenuComponent implements OnInit {
  private contentService = inject(SiteContentService);
  items: ContentItem[] = [];

  ngOnInit(): void {
    this.contentService.getAiMenuItems().subscribe((items: ContentItem[]) => {
      this.items = items.length ? items : [
        { title: 'Sentiment Analysis', description: 'Analyze customer feedback and social media sentiment with high precision.', icon: 'pi pi-heart-fill' },
        { title: 'Document Summarizer', description: 'Compress long legal and financial documents into concise, actionable summaries.', icon: 'pi pi-file-edit' },
        { title: 'Chat Intelligence', description: 'Conversational AI models fine-tuned for customer support and lead generation.', icon: 'pi pi-comments' },
        { title: 'Translation Engine', description: 'Real-time translation for 100+ languages optimized for technical terminology.', icon: 'pi pi-globe' },
        { title: 'Risk Assessment', description: 'Identify potential compliance risks in business operations using predictive modeling.', icon: 'pi pi-exclamation-triangle' }
      ];
    });
  }
}
