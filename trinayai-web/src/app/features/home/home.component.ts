import { Component, AfterViewInit, ElementRef, ViewChild, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThreeService } from '../../core/services/three.service';
import { SiteContentService } from '../../core/services/site-content.service';
import { SectionItem, SiteSettings } from '../../core/models/site-content';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, CardModule, AnimateOnScrollModule],
  template: `
    <section class="relative min-h-screen overflow-hidden bg-[#050c1f] text-white">
      <!-- 3D Background Canvas -->
      <div #threeCanvas class="absolute inset-0 z-0"></div>

      <!-- Content Overlay -->
      <div class="relative z-10">
        <!-- Hero Section -->
        <div class="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-24 lg:px-10">
          <div class="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div class="space-y-10" pAnimateOnScroll enterClass="fadeinleft" leaveClass="fadeoutleft">
              <div class="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-cyan-300 shadow-xl shadow-cyan-500/10 backdrop-blur-xl">
                <span class="flex h-6 w-6 animate-pulse items-center justify-center rounded-full bg-cyan-500/20 text-[10px] ring-1 ring-cyan-500/50">
                  <i class="pi pi-bolt"></i>
                </span>
                {{ settings.heroBadge || 'Empowering MSMEs through IndiaAI Mission' }}
              </div>

              <h1 class="max-w-4xl text-6xl font-black leading-[1.1] tracking-tight text-white sm:text-7xl lg:text-8xl">
                {{ settings.heroDescription || 'Digital Transformation with' }}
                <span class="block bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent">
                  {{ settings.brandName || 'Trinay AI' }}
                </span>
              </h1>

              <p class="max-w-2xl text-xl leading-relaxed text-slate-400 sm:text-2xl">
                Leading the way in advanced LLMs and AI compliance automation tailored for India's growing startup ecosystem.
              </p>

              <div class="flex flex-wrap gap-6 pt-4">
                <p-button
                  [label]="settings.heroPrimaryCtaText || 'Explore AI Solutions'"
                  [routerLink]="settings.heroPrimaryCtaRoute || '/ai-menu'"
                  styleClass="p-button-raised p-button-rounded bg-gradient-to-r from-cyan-500 to-blue-600 border-none px-8 py-4 font-bold uppercase tracking-widest text-white shadow-2xl transition duration-500 hover:scale-105 hover:shadow-cyan-500/40">
                </p-button>

                <p-button
                  [label]="settings.heroSecondaryCtaText || 'Our Services'"
                  [routerLink]="settings.heroSecondaryCtaRoute || '/services'"
                  styleClass="p-button-outlined p-button-rounded border-white/20 text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-white/5 transition duration-500">
                </p-button>
              </div>
            </div>

            <div class="hidden lg:block">
              <!-- Visual element or additional 3D focus point could go here -->
              <div class="relative h-[500px] w-full rounded-[40px] border border-white/5 bg-white/5 p-1 backdrop-blur-3xl shadow-2xl">
                <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-[40px]"></div>
                <div class="h-full w-full rounded-[38px] border border-white/10 bg-[#08112a]/50 flex items-center justify-center overflow-hidden">
                   <i class="pi pi-prime text-[160px] text-cyan-500/20 animate-pulse"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats / Features Section -->
        <div class="bg-black/20 py-24 backdrop-blur-md">
          <div class="mx-auto max-w-7xl px-6">
            <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <p-card *ngFor="let item of homeSections" styleClass="h-full border border-white/10 bg-white/5 transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 hover:border-cyan-500/30">
                <ng-template pTemplate="header">
                   <div class="pt-8 px-8">
                     <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
                       <i [class]="item.icon || 'pi pi-compass'" class="text-2xl"></i>
                     </div>
                   </div>
                </ng-template>
                <h3 class="text-2xl font-bold text-white mb-3">{{ item.title }}</h3>
                <p class="text-slate-400 leading-relaxed">{{ item.description }}</p>
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

    @keyframes fadeinleft {
      0% { opacity: 0; transform: translateX(-50px); }
      100% { opacity: 1; transform: translateX(0); }
    }

    .fadeinleft {
      animation: fadeinleft 1s ease-out forwards;
    }
  `]
})
export class HomeComponent implements AfterViewInit, OnInit {
  @ViewChild('threeCanvas', { static: true }) threeCanvas!: ElementRef;
  private threeService = inject(ThreeService);
  private contentService = inject(SiteContentService);
  settings: SiteSettings = { brandName: 'TRINAY AI', logoUrl: '', footerText: '', menuItems: [], heroBadge: 'IndiaAI Mission Aligned', heroTitle: 'Innovation in AI & Software Development', heroDescription: 'Driving Digital Transformation with', heroPrimaryCtaText: 'Explore AI Solutions', heroPrimaryCtaRoute: '/ai-menu', heroSecondaryCtaText: 'See Services', heroSecondaryCtaRoute: '/services' };
  homeSections: SectionItem[] = [];

  ngOnInit(): void {
    this.contentService.getSettings().subscribe((settings) => {
      this.settings = { ...this.settings, ...settings };
    });
    this.contentService.getHomeSections().subscribe((sections) => {
      this.homeSections = sections.length ? sections : [
        { title: 'LLM Development', description: 'Custom Large Language Models tailored for MSME specific requirements and compliance.', icon: 'pi pi-share-alt' },
        { title: 'Compliance Automation', description: 'Streamlining regulatory processes with intelligent AI-driven automation systems.', icon: 'pi pi-shield' },
        { title: 'Digital Transformation', description: 'Empowering traditional businesses with cutting-edge AI and software solutions.', icon: 'pi pi-sync' }
      ];
    });
  }

  ngAfterViewInit(): void {
    this.threeService.init(this.threeCanvas.nativeElement);
  }
}
