import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteContentService } from '../../core/services/site-content.service';
import { SectionItem, SiteSettings } from '../../core/models/site-content';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ThreeUiComponent } from '../three-ui/three-ui.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, CardModule, ThreeUiComponent],
  template: `
    <section class="relative min-h-[calc(100vh-10rem)] overflow-x-clip bg-slate-50 text-slate-900">
      <!-- Clean Static Background -->
      <div class="absolute inset-0 z-0 bg-gradient-to-b from-white via-slate-50 to-blue-50/50"></div>

      <!-- Content Overlay -->
      <div class="relative z-10">
        <!-- Hero Section -->
        <div class="mx-auto flex min-h-[calc(100vh-10rem)] max-w-7xl flex-col justify-center px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div class="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div class="space-y-8 sm:space-y-10">
              <div *ngIf="settings.showIndiaAiBadge !== false" class="inline-flex max-w-full items-center gap-3 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-bold text-blue-700 shadow-sm sm:px-6 sm:py-3 sm:text-sm">
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-[10px] text-white">
                  <i class="pi pi-sparkles"></i>
                </span>
                {{ settings.heroBadge }}
              </div>

              <h1 class="max-w-2xl text-3xl font-black leading-[2] text-slate-700 sm:text-3xl lg:text-4xl">
                {{ settings.heroDescription }}
                <span class="block bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">
                  {{ settings.brandName }}
                </span>
              </h1>

              <p class="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg font-medium">
                {{ settings.homeDescription }}
              </p>

              <div class="flex flex-wrap gap-1 pt-2 sm:gap-2">
                <p-button
                  [label]="settings.heroPrimaryCtaText"
                  [routerLink]="settings.heroPrimaryCtaRoute"
                  styleClass="p-button-outlined p-button-rounded bg-blue-600 border-none px-6 py-4 font-black uppercase tracking-widest text-white shadow-lg transition duration-300 hover:bg-blue-700 sm:px-8">
                </p-button>

                <p-button
                  [label]="settings.heroSecondaryCtaText"
                  [routerLink]="settings.heroSecondaryCtaRoute"
                  styleClass="p-button-outlined p-button-rounded border-slate-300 text-slate-700 px-6 py-4 font-black uppercase tracking-widest hover:bg-white transition duration-300 sm:px-8">
                </p-button>
              </div>
            </div>

            <div class="relative hidden h-[430px] lg:block lg:h-[500px]">
              <app-three-ui></app-three-ui>
            </div>
          </div>
        </div>

        <!-- Bento Grid Features Section -->
        <div class="relative border-y border-slate-200 py-16 sm:py-20">
          <div class="mx-auto max-w-7xl px-5 relative z-10 sm:px-8 lg:px-10">
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[260px]">

              <!-- Large Feature Card -->
              <ng-container *ngIf="homeSections[0]">
                <p-card styleClass="storybook-card h-full border border-slate-200 bg-white transition-all duration-300 hover:border-cyan-400 hover:shadow-xl group shadow-sm">
                  <div class="flex h-full flex-col justify-center">
                    <h3 class="text-2xl font-black text-slate-900 mb-3 tracking-tight group-hover:text-blue-600 transition-colors">{{ homeSections[0].title }}</h3>
                    <p class="storybook-copy text-slate-600 text-sm leading-relaxed font-medium">{{ homeSections[0].description }}</p>
                  </div>
                </p-card>
              </ng-container>

              <!-- Secondary Feature Card -->
              <ng-container *ngIf="homeSections[1]">
                <p-card styleClass="storybook-card h-full border border-slate-200 bg-white transition-all duration-300 hover:border-fuchsia-400 hover:shadow-xl group shadow-sm">
                  <div class="flex h-full flex-col justify-center">
                    <h3 class="text-2xl font-black text-slate-900 mb-3 group-hover:text-fuchsia-600 transition-colors">{{ homeSections[1].title }}</h3>
                    <p class="storybook-copy text-slate-600 text-sm leading-relaxed font-medium">{{ homeSections[1].description }}</p>
                  </div>
                </p-card>
              </ng-container>

              <!-- Tertiary Feature Card -->
              <ng-container *ngIf="homeSections[2]">
                <p-card styleClass="storybook-card h-full border border-slate-200 bg-white transition-all duration-300 hover:border-blue-400 hover:shadow-xl group shadow-sm">
                  <div class="flex h-full flex-col justify-center">
                    <h3 class="text-2xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{{ homeSections[2].title }}</h3>
                    <p class="storybook-copy text-slate-600 text-sm leading-relaxed font-medium">{{ homeSections[2].description }}</p>
                  </div>
                </p-card>
              </ng-container>

              <ng-container *ngIf="homeSections[3]">
              <p-card styleClass="storybook-card h-full border border-slate-200 bg-gradient-to-r from-white to-cyan-50 transition-all duration-300 hover:border-cyan-400 hover:shadow-xl group relative shadow-sm">
                <div class="relative z-10 flex h-full flex-col justify-center">
                  <h3 class="text-2xl font-black text-slate-900 mb-3">{{ homeSections[3].title }}</h3>
                  <p class="storybook-copy text-slate-600 text-sm font-medium max-w-md">{{ homeSections[3].description }}</p>
                  <div class="mt-4">
                    <p-button [label]="settings.homeScaleCtaText" icon="pi pi-map" styleClass="p-button-text text-cyan-600 p-0 font-bold uppercase tracking-widest hover:text-blue-700"></p-button>
                  </div>
                </div>
              </p-card>
              </ng-container>

            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #f8fafc;
    }

    ::ng-deep {
      .p-card {
        border-radius: 18px 24px 20px 26px / 22px 18px 26px 20px;
        overflow: hidden;
        .p-card-body {
          height: 100%;
          padding: 1.75rem;
        }
        .p-card-content {
          padding: 0;
        }
      }

      .storybook-card {
        position: relative;
        isolation: isolate;
        border-width: 2px;
        transform: rotate(-0.35deg);
      }

      .storybook-card:nth-child(2n) {
        transform: rotate(0.35deg);
        border-radius: 24px 18px 26px 20px / 18px 24px 20px 26px;
      }

      .storybook-card::after {
        position: absolute;
        inset: 4px;
        z-index: -1;
        border: 1px dashed rgba(37, 99, 235, 0.18);
        border-radius: inherit;
        content: '';
        pointer-events: none;
      }

      .storybook-copy {
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
      }

      @media screen and (max-width: 1023px) {
        .storybook-card,
        .storybook-card:nth-child(2n) {
          transform: none;
        }
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  private contentService = inject(SiteContentService);
  settings: SiteSettings = { brandName: '', logoUrl: '', footerText: '', menuItems: [] };
  homeSections: SectionItem[] = [];

  ngOnInit(): void {
    this.contentService.getSettings().subscribe((settings: SiteSettings) => {
      this.settings = { ...this.settings, ...settings };
    });
    this.contentService.getHomeSections().subscribe((sections: SectionItem[]) => {
      this.homeSections = sections;
    });
  }
}
