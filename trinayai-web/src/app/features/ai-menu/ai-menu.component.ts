import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteContentService } from '../../core/services/site-content.service';
import { ContentItem, SiteSettings } from '../../core/models/site-content';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-ai-menu',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="subscription-page min-h-[calc(100vh-5rem)] bg-[#020617] px-6 py-24 relative overflow-hidden text-white">
      <!-- High-tech Background -->
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      <div class="absolute top-[10%] left-[20%] h-[500px] w-[500px] bg-blue-600/10 blur-[150px] rounded-full animate-pulse"></div>
      <div class="absolute bottom-[20%] right-[10%] h-[500px] w-[500px] bg-cyan-600/10 blur-[150px] rounded-full animate-pulse" style="animation-delay: 2s"></div>

      <div class="mx-auto max-w-7xl relative z-10">
        <div class="mb-20 text-center">
          <span class="inline-block rounded-full bg-blue-500/10 px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 ring-1 ring-blue-500/30 mb-8 shadow-2xl">
            {{ settings.aiMenuEyebrow || 'Enterprise AI Access' }}
          </span>
          <h2 class="text-5xl font-black tracking-tighter text-white sm:text-7xl mb-8">
            {{ settings.aiMenuTitle || 'Choose your AI subscription.' }}
          </h2>
          <p class="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed opacity-80">
            {{ settings.aiMenuDescription || 'Power your business with specialized AI tools designed for MSMEs and global enterprise teams.' }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
          <ng-container *ngFor="let item of items; let i = index">
            <article class="relative flex flex-col p-12 rounded-[40px] border transition-all duration-700 group shadow-2xl hover:-translate-y-3"
                     [ngClass]="item.isPopular ? 'bg-gradient-to-br from-slate-900 to-blue-950 border-blue-500/30 ring-1 ring-blue-500/20' : 'bg-slate-900/40 border-white/5 backdrop-blur-3xl'">

              @if (item.isPopular) {
                <div class="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] font-black uppercase tracking-[0.25em] px-6 py-2.5 rounded-full shadow-[0_0_30px_rgba(37,99,235,0.4)]">
                  Recommended
                </div>
              }

              <div class="mb-12">
                <div class="flex items-center justify-between mb-6">
                   <h3 class="text-3xl font-black tracking-tight group-hover:text-blue-400 transition-colors">{{ item.title }}</h3>
                   <div class="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-blue-600 transition-all">
                     <i [class]="item.icon || 'pi pi-sparkles'" class="text-xl"></i>
                   </div>
                </div>
                <p class="text-slate-400 text-sm font-medium leading-relaxed min-h-[4rem]">{{ item.description }}</p>
              </div>

              <div class="mb-12">
                <div class="flex items-baseline gap-2">
                  <span class="text-6xl font-black tracking-tighter">{{ item.price || 'Custom' }}</span>
                  <span class="text-slate-500 text-lg font-bold uppercase tracking-widest">{{ item.billingCycle || '' }}</span>
                </div>
              </div>

              <div class="flex-grow space-y-5 mb-14">
                <div *ngFor="let feature of item.features" class="flex items-start gap-4">
                  <i class="pi pi-check text-blue-500 mt-1 text-sm font-bold"></i>
                  <span class="text-slate-300 text-sm font-bold tracking-tight">{{ feature }}</span>
                </div>
                @if (!item.features || item.features.length === 0) {
                   <p class="text-slate-500 italic text-xs">Full access to core modules</p>
                }
              </div>

              <p-button [label]="item.isPopular ? 'Get Started' : 'Subscribe Now'"
                        (onClick)="openWorkspace(item)"
                        [styleClass]="item.isPopular
                          ? 'w-full p-button-raised bg-blue-600 border-none py-6 font-black uppercase tracking-[0.15em] text-white shadow-xl hover:bg-blue-700 transition-all rounded-2xl'
                          : 'w-full p-button-outlined border-white/10 text-white py-6 font-black uppercase tracking-[0.15em] hover:bg-white/5 transition-all rounded-2xl'"></p-button>
            </article>
          </ng-container>
        </div>

        @if (items.length === 0) {
          <div class="py-32 text-center">
            <i class="pi pi-spin pi-spinner text-4xl text-blue-500 mb-6"></i>
            <p class="text-slate-500 font-bold uppercase tracking-widest text-sm">Syncing with secure network...</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; background-color: #020617; }
    .subscription-page {
      background-image: radial-gradient(circle at 100% 100%, rgba(37, 99, 235, 0.05) 0, transparent 50%),
                        radial-gradient(circle at 0% 0%, rgba(6, 182, 212, 0.05) 0, transparent 50%);
    }
  `]
})
export class AiMenuComponent implements OnInit {
  private contentService = inject(SiteContentService);
  private router = inject(Router);
  items: ContentItem[] = [];
  settings: SiteSettings = { brandName: '', logoUrl: '', footerText: '', menuItems: [] };

  openWorkspace(item: ContentItem): void {
    this.router.navigate(['/contact'], { queryParams: { interest: item.title } });
  }

  ngOnInit(): void {
    this.contentService.getSettings().subscribe(settings => this.settings = { ...this.settings, ...settings });
    this.contentService.getAiMenuItems().pipe(
      map(items => items.filter(i => i.isVisible !== false))
    ).subscribe(items => this.items = items);
  }
}
