import { Component, AfterViewInit, ElementRef, ViewChild, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ThreeService } from '../../core/services/three.service';
import { SiteContentService } from '../../core/services/site-content.service';
import { SectionItem, SiteSettings } from '../../core/models/site-content';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule],
  template: `
    <section class="relative min-h-screen overflow-hidden bg-[#050c1f] text-white">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_18%),radial-gradient(circle_at_80%_20%,_rgba(168,85,247,0.16),_transparent_17%),linear-gradient(135deg,#040b1a_0%,#08112a_45%,#101c39_100%)] pointer-events-none"></div>
      <div class="absolute inset-0 opacity-70" aria-hidden="true">
        <div class="absolute -left-20 top-20 h-56 w-56 rounded-full bg-cyan-500/15 blur-3xl animate-blob"></div>
        <div class="absolute right-10 top-44 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-3xl animate-blob animation-delay-2000"></div>
        <div class="absolute left-1/2 bottom-8 h-52 w-52 -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div class="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-16 lg:px-10">
        <div class="grid gap-10 lg:grid-cols-[1.45fr_0.95fr] lg:items-center">
          <div class="space-y-8">
            <span class="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 shadow-lg shadow-cyan-500/10 backdrop-blur">
              <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 text-sm font-semibold text-white">{{ settings.heroBadge || 'NEW' }}</span>
              {{ settings.heroTitle || 'Modern AI website UI with motion, depth, and premium polish.' }}
            </span>

            <h1 class="max-w-4xl text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              {{ settings.heroDescription || 'Build a premium AI experience with' }}
              <span class="bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">{{ settings.brandName || 'Trinay AI' }}</span>
            </h1>

            <p class="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Deliver immersive, animated, and modern interfaces using the latest Angular, Material, Tailwind, and 3D canvas techniques.
            </p>

            <div class="flex flex-wrap gap-4">
              <a [routerLink]="settings.heroPrimaryCtaRoute || '/ai-menu'" mat-flat-button color="primary" class="rounded-full bg-gradient-to-r from-fuchsia-500 via-cyan-500 to-sky-500 px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] shadow-[0_20px_80px_-50px_rgba(139,92,246,0.7)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_25px_100px_-55px_rgba(56,189,248,0.55)]">
                {{ settings.heroPrimaryCtaText || 'Explore AI Menu' }}
              </a>
              <a [routerLink]="settings.heroSecondaryCtaRoute || '/services'" mat-stroked-button color="accent" class="rounded-full border-white/15 px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition duration-300 hover:bg-white/10">
                {{ settings.heroSecondaryCtaText || 'See Services' }}
              </a>
            </div>
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <article *ngFor="let item of homeSections" class="group overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_-50px_rgba(15,23,42,0.8)] transition duration-500 hover:-translate-y-1 hover:bg-white/10">
              <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/15">
                {{ item.icon || 'AI' }}
              </div>
              <h3 class="text-xl font-semibold text-white">{{ item.title }}</h3>
              <p class="mt-3 text-sm leading-6 text-slate-300">{{ item.description }}</p>
            </article>
          </div>
        </div>
      </div>

      <div #threeCanvas class="absolute inset-0 z-0"></div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100%;
    }

    .animate-blob {
      animation: blob 10s infinite;
    }

    .animation-delay-2000 {
      animation-delay: 2s;
    }

    .animation-delay-4000 {
      animation-delay: 4s;
    }

    @keyframes blob {
      0%, 100% {
        transform: translate(0px, 0px) scale(1);
      }
      33% {
        transform: translate(30px, -20px) scale(1.05);
      }
      66% {
        transform: translate(-20px, 20px) scale(0.95);
      }
    }

    @media (max-width: 768px) {
      section {
        padding-top: 3rem;
        padding-bottom: 3rem;
      }
    }
  `]
})
export class HomeComponent implements AfterViewInit, OnInit {
  @ViewChild('threeCanvas', { static: true }) threeCanvas!: ElementRef;
  private threeService = inject(ThreeService);
  private contentService = inject(SiteContentService);
  settings: SiteSettings = { brandName: 'TRINAY AI', logoUrl: '', footerText: '', menuItems: [], heroBadge: 'NEW', heroTitle: 'Modern AI website UI with motion, depth, and premium polish.', heroDescription: 'Build a premium AI experience with', heroPrimaryCtaText: 'Explore AI Menu', heroPrimaryCtaRoute: '/ai-menu', heroSecondaryCtaText: 'See Services', heroSecondaryCtaRoute: '/services' };
  homeSections: SectionItem[] = [];

  ngOnInit(): void {
    this.contentService.getSettings().subscribe((settings) => {
      this.settings = { ...this.settings, ...settings };
    });
    this.contentService.getHomeSections().subscribe((sections) => this.homeSections = sections);
  }

  ngAfterViewInit(): void {
    this.threeService.init(this.threeCanvas.nativeElement);
  }
}
