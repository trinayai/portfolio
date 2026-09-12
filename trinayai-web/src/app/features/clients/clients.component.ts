import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SiteContentService } from '../../core/services/site-content.service';
import { ClientItem } from '../../core/models/site-content';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, RouterLink],
  template: `
    <div class="min-h-[calc(100vh-5rem)] bg-white px-5 py-14 relative overflow-x-clip sm:px-8 sm:py-16 lg:px-10">
      <!-- Background Accents -->
      <div class="absolute top-[15%] right-[10%] h-[360px] w-[360px] bg-blue-50 blur-[120px] rounded-full"></div>

      <div class="mx-auto max-w-7xl relative z-10">
        <div class="mb-12 text-center">
          <span class="inline-block rounded-full bg-blue-50 px-5 py-2 text-xs font-black uppercase tracking-[0.2em] text-blue-600 ring-1 ring-blue-100 mb-5">
            {{ settings.clientsEyebrow || 'Trusted by' }}
          </span>
          <h2 class="text-4xl font-black tracking-tighter text-slate-900 sm:text-6xl">
            {{ settings.clientsTitle || 'Built alongside ambitious teams.' }}
          </h2>
          <p class="mx-auto mt-5 max-w-3xl text-base text-slate-500 font-medium leading-relaxed sm:text-xl">
            {{ settings.clientsDescription || 'From first prototype to dependable platform, we work closely with teams who want technology to create measurable progress.' }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          <ng-container *ngFor="let client of clients">
            <a [href]="client.website || '#'"
               target="_blank"
               class="group relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-slate-100 bg-white p-2 transition-all duration-500 hover:border-blue-200 hover:shadow-2xl no-underline shadow-sm">

              <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <img *ngIf="client.imageUrl" [src]="client.imageUrl" [alt]="client.name"
                   class="h-[98%] w-[98%] object-contain transition-all duration-500 group-hover:scale-105" />

              <span *ngIf="!client.imageUrl" class="text-center text-sm font-black uppercase tracking-wider text-slate-400 transition-all duration-300 group-hover:text-blue-600 group-hover:scale-105 sm:text-base">
                {{ client.name }}
              </span>
            </a>
          </ng-container>
        </div>

        <div class="mt-20 rounded-[40px] border border-slate-100 bg-slate-50 p-8 text-center relative overflow-hidden group shadow-sm sm:p-16">
          <div class="relative z-10">
            <h3 class="text-3xl font-black text-slate-900 mb-5 tracking-tighter sm:text-5xl">{{ settings.clientsCtaTitle || 'Have a challenge worth solving?' }}</h3>
            <p class="text-slate-500 mb-10 max-w-2xl mx-auto text-lg font-medium leading-relaxed sm:text-xl">{{ settings.clientsCtaDescription || 'Tell us what you are building and we will help shape the next practical step.' }}</p>
            <p-button [label]="settings.clientsCtaText || 'Get in touch'" icon="pi pi-arrow-right" iconPos="right" [routerLink]="['/contact']"
                      styleClass="p-button-raised p-button-rounded bg-blue-600 border-none px-10 py-5 font-black uppercase tracking-widest text-white shadow-xl hover:bg-blue-700 transition-all"></p-button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ClientsComponent implements OnInit {
  private contentService = inject(SiteContentService);
  settings: import('../../core/models/site-content').SiteSettings = { brandName: '', logoUrl: '', footerText: '', menuItems: [] };
  clients: ClientItem[] = [];

  ngOnInit(): void {
    this.contentService.getSettings().subscribe(settings => this.settings = { ...this.settings, ...settings });
    this.contentService.getClients().subscribe((clients: ClientItem[]) => this.clients = clients);
  }
}
