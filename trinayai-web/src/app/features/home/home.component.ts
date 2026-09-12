import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteContentService } from '../../core/services/site-content.service';
import { SectionItem, SiteSettings } from '../../core/models/site-content';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { map } from 'rxjs/operators';
import { ThreeUiComponent } from '../three-ui/three-ui.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, CardModule, ThreeUiComponent],
  template: `
    <section class="relative min-h-screen bg-[#020617] text-white overflow-x-hidden">
      <!-- Animated Background elements -->
      <div class="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div class="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-cyan-600/10 blur-[100px] rounded-full animate-pulse" style="animation-delay: 2s"></div>
      </div>

      <!-- Content Overlay -->
      <div class="relative z-10">
        <!-- Hero Section -->
        <div class="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-24 lg:px-10">
          <div class="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div class="space-y-12">
              <div *ngIf="settings.showIndiaAiBadge" class="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-cyan-300 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10">
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-[10px] text-white">
                  <i class="pi pi-sparkles animate-spin-slow"></i>
                </span>
                {{ settings.heroBadge || 'Empowering MSMEs through IndiaAI Mission' }}
              </div>

              <h1 class="max-w-4xl text-6xl font-black leading-[0.95] tracking-tighter text-white sm:text-8xl xl:text-9xl">
                Building <span class="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent filter drop-shadow-lg">better digital</span> products with <span class="text-blue-500">TRINAYAI</span>
              </h1>

              <p class="max-w-2xl text-xl leading-relaxed text-slate-300 sm:text-2xl font-medium opacity-90">
                {{ settings.homeDescription || "We design and build practical software, AI and digital products that help ambitious teams work smarter and grow with confidence." }}
              </p>

              <div class="flex flex-wrap gap-6 pt-4">
                <p-button
                  [label]="settings.heroPrimaryCtaText || 'Explore Solutions'"
                  [routerLink]="['/ai-menu']"
                  styleClass="p-button-raised p-button-rounded bg-blue-600 border-none px-10 py-5 font-black uppercase tracking-widest text-white shadow-2xl transition duration-300 hover:bg-blue-700 hover:scale-105">
                </p-button>

                <p-button
                  [label]="settings.heroSecondaryCtaText || 'Connect'"
                  [routerLink]="['/contact']"
                  styleClass="p-button-outlined p-button-rounded border-white/20 text-white px-10 py-5 font-black uppercase tracking-widest hover:bg-white/10 transition duration-300 backdrop-blur-md">
                </p-button>
              </div>
            </div>

            <div class="relative flex items-center justify-center lg:justify-end">
              <div class="relative w-full max-w-[500px] aspect-square group">
                <div class="absolute -inset-4 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-20 blur-3xl rounded-[40px] group-hover:opacity-40 transition-opacity duration-700"></div>
                <div class="relative h-full w-full rounded-[40px] border border-white/10 bg-slate-900/40 backdrop-blur-3xl shadow-3xl overflow-hidden p-1">
                   <app-three-ui class="w-full h-full rounded-[38px]"></app-three-ui>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bento Grid Features Section -->
        <div *ngIf="homeSections.length > 0" class="relative py-32 border-t border-white/5 bg-[#01040f]">
          <div class="mx-auto max-w-7xl px-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              @for (item of homeSections; track item.id) {
                <p-card styleClass="h-full border border-white/5 bg-slate-900/20 backdrop-blur-md transition-all duration-500 hover:bg-slate-800/40 hover:border-blue-500/30 group overflow-hidden shadow-xl rounded-[32px]">
                  <ng-template pTemplate="header">
                     <div class="pt-10 px-10">
                       <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-blue-400 ring-1 ring-white/10 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-lg">
                         <i [class]="item.icon || 'pi pi-bolt'" class="text-2xl"></i>
                       </div>
                     </div>
                  </ng-template>
                  <h3 class="text-2xl font-black text-white mb-4 tracking-tight group-hover:text-blue-300 transition-colors">{{ item.title }}</h3>
                  <p class="text-slate-400 text-lg leading-relaxed font-medium group-hover:text-slate-200 transition-colors">{{ item.description }}</p>
                </p-card>
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; background-color: #020617; }
    .animate-spin-slow { animation: spin 8s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    ::ng-deep {
      .p-card .p-card-body { padding: 2.5rem; }
    }
  `]
})
export class HomeComponent implements OnInit {
  private contentService = inject(SiteContentService);
  settings: SiteSettings = { brandName: 'TRINAY AI', logoUrl: '', footerText: '', menuItems: [] };
  homeSections: SectionItem[] = [];

  ngOnInit(): void {
    this.contentService.getSettings().subscribe(settings => this.settings = { ...this.settings, ...settings });
    this.contentService.getHomeSections().pipe(
      map(sections => sections.filter(s => s.isVisible !== false))
    ).subscribe(sections => {
      this.homeSections = sections.length ? sections : [
        { title: 'AI Model Tuning', description: 'Optimizing foundational models for specialized enterprise workflows.', icon: 'pi pi-sliders-h' },
        { title: 'Secure Compliance', description: 'Automated regulatory systems built for India\'s MSME sector.', icon: 'pi pi-shield' },
        { title: 'Digital Scale', description: 'Accelerating transformation through robust software engineering.', icon: 'pi pi-chart-line' }
      ];
    });
  }
}
