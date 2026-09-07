import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteContentService } from '../../core/services/site-content.service';
import { SectionItem, SiteSettings } from '../../core/models/site-content';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, CardModule],
  template: `
    <section class="relative min-h-screen bg-[#050c1f] text-white">
      <!-- Clean Static Background -->
      <div class="absolute inset-0 z-0 bg-gradient-to-b from-[#0a1128] to-[#050c1f]"></div>

      <!-- Content Overlay -->
      <div class="relative z-10">
        <!-- Hero Section -->
        <div class="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-24 lg:px-10">
          <div class="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div class="space-y-12">
              <div class="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-cyan-300 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10">
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-[10px] text-white">
                  <i class="pi pi-sparkles"></i>
                </span>
                {{ settings.heroBadge || 'Empowering MSMEs through IndiaAI Mission' }}
              </div>

              <h1 class="max-w-4xl text-7xl font-black leading-[0.95] tracking-tighter text-white sm:text-8xl lg:text-9xl">
                {{ settings.heroDescription || 'Digital AI' }}
                <span class="block bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent">
                  {{ settings.brandName || 'Trinay AI' }}
                </span>
              </h1>

              <p class="max-w-2xl text-xl leading-relaxed text-slate-300 sm:text-2xl font-medium opacity-90">
                Leading the way in advanced LLMs and AI compliance automation tailored for India's growing startup ecosystem.
              </p>

              <div class="flex flex-wrap gap-6 pt-4">
                <p-button
                  [label]="settings.heroPrimaryCtaText || 'Explore Solutions'"
                  [routerLink]="settings.heroPrimaryCtaRoute || '/ai-menu'"
                  styleClass="p-button-raised p-button-rounded bg-gradient-to-r from-cyan-500 via-blue-600 to-fuchsia-600 border-none px-10 py-5 font-black uppercase tracking-widest text-white shadow-lg transition duration-300 hover:scale-105">
                </p-button>

                <p-button
                  [label]="settings.heroSecondaryCtaText || 'View Services'"
                  [routerLink]="settings.heroSecondaryCtaRoute || '/services'"
                  styleClass="p-button-outlined p-button-rounded border-white/20 text-white px-10 py-5 font-black uppercase tracking-widest hover:bg-white/10 transition duration-300 backdrop-blur-md">
                </p-button>
              </div>
            </div>

            <div class="hidden lg:block relative">
              <div class="relative h-[550px] w-full rounded-[40px] border border-white/10 bg-slate-900/40 p-1 backdrop-blur-3xl shadow-3xl overflow-hidden">
                <div class="h-full w-full rounded-[38px] border border-white/5 bg-[#020617]/40 flex items-center justify-center">
                   <i class="pi pi-prime text-[200px] bg-gradient-to-br from-cyan-400 to-blue-600 bg-clip-text text-transparent opacity-20"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bento Grid Features Section -->
        <div class="relative py-32 overflow-hidden border-y border-white/5">
          <div class="mx-auto max-w-7xl px-6 relative z-10">
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[300px]">

              <!-- Large Feature Card -->
              <ng-container *ngIf="homeSections[0]">
                <p-card styleClass="md:col-span-2 md:row-span-2 h-full border border-white/10 bg-slate-900/40 transition-all duration-300 hover:bg-slate-800/60 hover:border-cyan-500/50 group overflow-hidden shadow-2xl">
                  <ng-template pTemplate="header">
                     <div class="pt-10 px-10">
                       <div class="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white ring-1 ring-white/10 shadow-2xl transition-all duration-300">
                         <i [class]="homeSections[0].icon || 'pi pi-compass'" class="text-3xl"></i>
                       </div>
                     </div>
                  </ng-template>
                  <div class="h-full flex flex-col justify-end pb-8 px-2">
                    <h3 class="text-4xl font-black text-white mb-4 tracking-tight group-hover:text-cyan-300 transition-colors">{{ homeSections[0].title }}</h3>
                    <p class="text-slate-400 text-xl leading-relaxed font-medium group-hover:text-slate-200 transition-colors">{{ homeSections[0].description }}</p>
                  </div>
                </p-card>
              </ng-container>

              <!-- Secondary Feature Card -->
              <ng-container *ngIf="homeSections[1]">
                <p-card styleClass="md:col-span-1 md:row-span-1 h-full border border-white/10 bg-slate-900/40 transition-all duration-300 hover:bg-slate-800/60 hover:border-fuchsia-500/50 group overflow-hidden">
                  <ng-template pTemplate="header">
                     <div class="pt-8 px-8">
                       <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-fuchsia-400 ring-1 ring-white/10 group-hover:bg-fuchsia-500 group-hover:text-white transition-all duration-300">
                         <i [class]="homeSections[1].icon || 'pi pi-bolt'" class="text-2xl"></i>
                       </div>
                     </div>
                  </ng-template>
                  <h3 class="text-2xl font-black text-white mb-2 group-hover:text-fuchsia-300 transition-colors">{{ homeSections[1].title }}</h3>
                  <p class="text-slate-400 text-sm leading-relaxed font-medium group-hover:text-slate-200 transition-colors">{{ homeSections[1].description }}</p>
                </p-card>
              </ng-container>

              <!-- Tertiary Feature Card -->
              <ng-container *ngIf="homeSections[2]">
                <p-card styleClass="md:col-span-1 md:row-span-1 h-full border border-white/10 bg-slate-900/40 transition-all duration-300 hover:bg-slate-800/60 hover:border-blue-500/50 group overflow-hidden">
                  <ng-template pTemplate="header">
                     <div class="pt-8 px-8">
                       <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-blue-400 ring-1 ring-white/10 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                         <i [class]="homeSections[2].icon || 'pi pi-sync'" class="text-2xl"></i>
                       </div>
                     </div>
                  </ng-template>
                  <h3 class="text-2xl font-black text-white mb-2 group-hover:text-blue-300 transition-colors">{{ homeSections[2].title }}</h3>
                  <p class="text-slate-400 text-sm leading-relaxed font-medium group-hover:text-slate-200 transition-colors">{{ homeSections[2].description }}</p>
                </p-card>
              </ng-container>

              <!-- Extra Wide Interactive Card -->
              <p-card styleClass="md:col-span-2 md:row-span-1 h-full border border-white/10 bg-gradient-to-r from-slate-900/40 to-cyan-950/20 backdrop-blur-xl transition-all duration-300 hover:bg-slate-800/60 hover:border-cyan-500/40 group relative overflow-hidden">
                <div class="relative z-10 flex h-full flex-col justify-center">
                  <h3 class="text-3xl font-black text-white mb-4 tracking-tighter">Scale with Certainty</h3>
                  <p class="text-slate-400 text-lg font-medium max-w-md">Our specialized MSME compliance engine ensures your AI journey is secure and locally compliant from day one.</p>
                  <div class="mt-6">
                    <p-button label="View Roadmap" icon="pi pi-map" styleClass="p-button-text text-cyan-400 p-0 font-bold uppercase tracking-widest hover:text-white"></p-button>
                  </div>
                </div>
              </p-card>

            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #050c1f;
    }

    ::ng-deep {
      .p-card {
        border-radius: 24px;
        .p-card-body {
          padding: 2rem;
        }
        .p-card-content {
          padding: 0;
        }
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  private contentService = inject(SiteContentService);
  settings: SiteSettings = { brandName: 'TRINAY AI', logoUrl: '', footerText: '', menuItems: [], heroBadge: 'IndiaAI Mission Aligned', heroTitle: 'Innovation in AI & Software Development', heroDescription: 'Driving Digital Transformation with', heroPrimaryCtaText: 'Explore AI Solutions', heroPrimaryCtaRoute: '/ai-menu', heroSecondaryCtaText: 'See Services', heroSecondaryCtaRoute: '/services' };
  homeSections: SectionItem[] = [];

  ngOnInit(): void {
    this.contentService.getSettings().subscribe((settings: SiteSettings) => {
      this.settings = { ...this.settings, ...settings };
    });
    this.contentService.getHomeSections().subscribe((sections: SectionItem[]) => {
      this.homeSections = sections.length ? sections : [
        { title: 'LLM Development', description: 'Custom Large Language Models tailored for MSME specific requirements and compliance.', icon: 'pi pi-share-alt' },
        { title: 'Compliance Automation', description: 'Streamlining regulatory processes with intelligent AI-driven automation systems.', icon: 'pi pi-shield' },
        { title: 'Digital Transformation', description: 'Empowering traditional businesses with cutting-edge AI and software solutions.', icon: 'pi pi-sync' }
      ];
    });
  }
}
