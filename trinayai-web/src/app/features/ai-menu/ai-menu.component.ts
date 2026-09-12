import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteContentService } from '../../core/services/site-content.service';
import { ContentItem } from '../../core/models/site-content';
import { SiteSettings } from '../../core/models/site-content';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ai-menu',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="ai-page min-h-[calc(100vh-20rem)] bg-white px-6 py-24 relative overflow-x-clip">
      <div class="mx-auto max-w-7xl relative z-10">
        <div class="mb-16 text-center">
          <p class="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-4">{{ settings.aiMenuEyebrow || 'AI-Powered Solutions' }}</p>
          <h2 class="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">{{ settings.aiMenuTitle || 'Intelligent AI Menu' }}</h2>
          <p class="mt-6 text-xl text-slate-500 max-w-2xl mx-auto">{{ settings.aiMenuDescription || 'Select from our range of advanced AI tools to transform your business operations.' }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <ng-container *ngFor="let item of items; let i = index">
            <article class="relative flex flex-col justify-between p-8 rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1">
              <div class="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div>
                <div class="flex items-center justify-between mb-8">
                  <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">TRINAY AI / {{ i + 1 | number:'2.0' }}</span>
                  <div class="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <i class="pi pi-sparkles"></i>
                  </div>
                </div>

                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-blue-600 transition-colors">{{ item.title }}</h3>
                <p class="text-slate-500 font-medium leading-relaxed mb-6">{{ item.description }}</p>
              </div>

              <p-button label="Launch Workspace"
                        icon="pi pi-external-link"
                        iconPos="right"
                        (onClick)="openWorkspace(item)"
                        styleClass="w-full p-button-raised p-button-rounded py-4 font-bold uppercase tracking-widest"></p-button>
            </article>
          </ng-container>
        </div>

        @if (items.length === 0) {
          <div class="py-20 text-center">
            <p class="text-slate-400 italic font-medium">Loading AI packages...</p>
          </div>
        }
      </div>
    </div>
  `
})
export class AiMenuComponent implements OnInit {
  private contentService = inject(SiteContentService);
  private router = inject(Router);
  items: ContentItem[] = [];
  settings: SiteSettings = { brandName: '', logoUrl: '', footerText: '', menuItems: [] };

  openWorkspace(item: ContentItem): void {
    this.router.navigate(['/ai'], { queryParams: { model: item.title } });
  }

  ngOnInit(): void {
    this.contentService.getSettings().subscribe(settings => this.settings = { ...this.settings, ...settings });
    this.contentService.getAiMenuItems().subscribe((items: ContentItem[]) => {
      console.log('AI Menu Items loaded:', items.length);
      this.items = items;
    });
  }
}
