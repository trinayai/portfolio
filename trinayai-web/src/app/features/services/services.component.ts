import { Component, OnInit, inject } from '@angular/core';
import { SiteContentService } from '../../core/services/site-content.service';
import { ContentItem } from '../../core/models/site-content';
import { SiteSettings } from '../../core/models/site-content';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <div class="min-h-[calc(100vh-5rem)] bg-white px-5 py-14 relative overflow-x-clip sm:px-8 sm:py-16 lg:px-10">
      <!-- Background Accents -->
      <div class="absolute top-0 right-0 h-96 w-96 bg-blue-50 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-0 left-0 h-96 w-96 bg-cyan-50 blur-[120px] rounded-full"></div>

      <div class="mx-auto max-w-7xl relative z-10">
        <div class="mb-12 text-center">
          <span class="inline-block rounded-full bg-blue-100 px-6 py-2 text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-8">
            {{ settings.servicesEyebrow }}
          </span>
          <h2 class="text-4xl font-black tracking-tighter text-slate-900 sm:text-6xl">
            {{ settings.servicesTitle }}
          </h2>
          <p class="mx-auto mt-5 max-w-3xl text-base text-slate-500 font-medium leading-relaxed sm:text-xl">
            {{ settings.servicesDescription }}
          </p>
        </div>

        <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <ng-container *ngFor="let item of services; let i = index">
            <p-card styleClass="h-full border border-slate-100 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden group shadow-sm">
              <ng-template pTemplate="header">
                 <div class="h-1.5 w-full bg-blue-600 opacity-80"></div>
                 <div class="pt-10 px-10">
                   <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                     <i [class]="item.icon || 'pi pi-cog'" class="text-2xl"></i>
                   </div>
                 </div>
              </ng-template>
              <h3 class="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">{{ item.title }}</h3>
              <p class="text-slate-500 text-lg leading-relaxed font-medium transition-colors">{{ item.description }}</p>
              <ng-template pTemplate="footer">
                <button class="mt-4 text-sm font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-all flex items-center gap-3 group/btn">
                  <span>Discover More</span>
                  <i class="pi pi-arrow-right text-xs transition-transform group-hover/btn:translate-x-2"></i>
                </button>
              </ng-template>
            </p-card>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: [`
    ::ng-deep {
      .p-card {
        border-radius: 32px;
        .p-card-body {
          padding: 2.5rem;
        }
        .p-card-content {
          padding: 0;
        }
      }
    }
  `]
})
export class ServicesComponent implements OnInit {
  private contentService = inject(SiteContentService);
  services: ContentItem[] = [];
  settings: SiteSettings = { brandName: '', logoUrl: '', footerText: '', menuItems: [] };

  ngOnInit(): void {
    this.contentService.getSettings().subscribe(settings => this.settings = { ...this.settings, ...settings });
    this.contentService.getServices().subscribe((services: ContentItem[]) => {
      this.services = services;
    });
  }
}
