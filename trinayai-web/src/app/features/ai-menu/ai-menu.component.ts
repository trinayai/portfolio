import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteContentService } from '../../core/services/site-content.service';
import { ContentItem } from '../../core/models/site-content';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-ai-menu',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule, ButtonModule],
  template: `
    <div class="min-h-screen bg-[#050c1f] px-6 py-24">
      <div class="mx-auto max-w-7xl">
        <div class="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span class="inline-block rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-400 ring-1 ring-blue-500/20 mb-6">
              AI Tools Dashboard
            </span>
            <h2 class="text-4xl font-black tracking-tight text-white sm:text-5xl">
              Advanced <span class="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">LLM Suite</span>
            </h2>
          </div>
          <div class="flex gap-4">
             <p-button label="Filter" icon="pi pi-filter" styleClass="p-button-outlined p-button-sm border-white/10 text-white"></p-button>
             <p-button label="Sort" icon="pi pi-sort" styleClass="p-button-outlined p-button-sm border-white/10 text-white"></p-button>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <p-card *ngFor="let item of items" styleClass="relative overflow-hidden border border-white/10 bg-white/5 transition-all duration-300 hover:border-blue-500/50 hover:bg-white/10 group">
            <div class="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl group-hover:bg-blue-500/20 transition-all"></div>

            <ng-template pTemplate="header">
               <div class="pt-8 px-8 flex justify-between items-start">
                 <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                   <i [class]="item.icon || 'pi pi-android'" class="text-2xl"></i>
                 </div>
                 <p-tag value="PRO" severity="info" [rounded]="true" styleClass="text-[10px] font-bold tracking-widest px-3 bg-blue-500/20 text-blue-300 border-none"></p-tag>
               </div>
            </ng-template>

            <h3 class="text-xl font-bold text-white mb-2">{{ item.title }}</h3>
            <p class="text-slate-400 text-sm leading-relaxed mb-6">{{ item.description }}</p>

            <ng-template pTemplate="footer">
              <p-button label="Launch Model" icon="pi pi-external-link" styleClass="w-full p-button-sm bg-white/5 border-white/10 text-white hover:bg-blue-600 hover:border-blue-600 transition-all"></p-button>
            </ng-template>
          </p-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    ::ng-deep {
      .p-card {
        border-radius: 20px;
        .p-card-body { padding: 1.5rem 2rem 2rem 2rem; }
      }
    }
  `]
})
export class AiMenuComponent implements OnInit {
  private contentService = inject(SiteContentService);
  items: ContentItem[] = [];

  ngOnInit(): void {
    this.contentService.getAiMenuItems().subscribe((items) => {
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
