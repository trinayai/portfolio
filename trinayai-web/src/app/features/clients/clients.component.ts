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
    <div class="min-h-[calc(100vh-5rem)] bg-slate-50 px-5 py-14 relative overflow-x-clip sm:px-8 sm:py-16 lg:px-10">
      <!-- Background Accents -->
      <div class="absolute top-[15%] right-[10%] h-[360px] w-[360px] bg-blue-100/70 blur-[120px] rounded-full"></div>

      <div class="mx-auto max-w-7xl relative z-10">
        <div class="mb-12 text-center">
          <span class="inline-block rounded-full bg-blue-50 px-5 py-2 text-xs font-black uppercase tracking-[0.2em] text-blue-600 ring-1 ring-blue-100 mb-5">
            Strategic Partnerships
          </span>
          <h2 class="text-4xl font-black tracking-tighter text-slate-900 sm:text-6xl">
            Trusted by <span class="text-blue-600">Industry Leaders</span>
          </h2>
          <p class="mx-auto mt-5 max-w-3xl text-base text-slate-600 font-medium leading-relaxed sm:text-xl">
            Collaborating with forward-thinking organizations to drive innovation and digital excellence across the startup ecosystem.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          <ng-container *ngFor="let client of clients">
            <a [href]="client.website || '#'"
               target="_blank"
               class="group relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:border-blue-300 hover:shadow-lg no-underline shadow-sm sm:p-8">

              <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <img *ngIf="client.imageUrl" [src]="client.imageUrl" [alt]="client.name"
                   class="max-h-full max-w-full object-contain opacity-40 grayscale transition-all duration-700 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110" />

              <span *ngIf="!client.imageUrl" class="text-center text-sm font-black uppercase tracking-wider text-slate-500 transition-all duration-300 group-hover:text-blue-700 group-hover:scale-105 sm:text-base">
                {{ client.name }}
              </span>

              <!-- Decorative Glow -->
              <div class="absolute -right-4 -top-4 h-12 w-12 rounded-full bg-indigo-500/0 blur-xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
            </a>
          </ng-container>
        </div>

        <div class="mt-14 rounded-3xl border border-slate-200 bg-white p-7 text-center relative overflow-hidden group shadow-sm sm:mt-16 sm:p-12">
          <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-cyan-500/10 to-transparent opacity-50"></div>
          <div class="relative z-10">
            <h3 class="text-3xl font-black text-slate-900 mb-5 tracking-tighter sm:text-4xl">Ready to Scale Your Innovation?</h3>
            <p class="text-slate-600 mb-7 max-w-2xl mx-auto text-base font-medium leading-relaxed sm:text-xl">Join our network of elite partners and transform your business operations with our bespoke, state-of-the-art AI solutions.</p>
            <p-button label="Become a Partner" icon="pi pi-user-plus" [routerLink]="['/contact']"
                      styleClass="p-button-raised p-button-rounded bg-blue-600 border-none px-8 py-4 font-black uppercase tracking-widest text-white shadow-lg hover:bg-blue-700 transition-colors"></p-button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ClientsComponent implements OnInit {
  private contentService = inject(SiteContentService);
  clients: ClientItem[] = [];

  ngOnInit(): void {
    this.contentService.getClients().subscribe((clients: ClientItem[]) => {
      this.clients = clients.length ? clients : [
        { name: 'TechScale India', website: 'https://techscale.in', imageUrl: '' },
        { name: 'MSME Global', website: 'https://msmeglobal.org', imageUrl: '' },
        { name: 'FutureSoft', website: 'https://futuresoft.com', imageUrl: '' },
        { name: 'IndiaAI Mission', website: 'https://indiaai.gov.in', imageUrl: '' },
        { name: 'Startup Tamil Nadu', website: 'https://startuptn.in', imageUrl: '' }
      ];
    });
  }
}
