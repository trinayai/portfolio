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
    <div class="min-h-screen bg-slate-950 px-6 py-32 relative overflow-hidden">
      <!-- Background Accents -->
      <div class="absolute top-[15%] right-[10%] h-[500px] w-[500px] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse"></div>

      <div class="mx-auto max-w-7xl relative z-10">
        <div class="mb-24 text-center">
          <span class="inline-block rounded-full bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 px-6 py-2 text-xs font-black uppercase tracking-[0.2em] text-indigo-400 ring-1 ring-indigo-500/30 mb-8 shadow-lg shadow-indigo-500/10">
            Strategic Partnerships
          </span>
          <h2 class="text-6xl font-black tracking-tighter text-white sm:text-7xl">
            Trusted by <span class="bg-gradient-to-r from-indigo-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">Industry Leaders</span>
          </h2>
          <p class="mx-auto mt-8 max-w-3xl text-xl text-slate-400 font-medium leading-relaxed opacity-90">
            Collaborating with forward-thinking organizations to drive innovation and digital excellence across the startup ecosystem.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          <ng-container *ngFor="let client of clients">
            <a [href]="client.website || '#'"
               target="_blank"
               class="group relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[32px] border border-white/5 bg-slate-900/40 p-8 transition-all duration-700 hover:border-indigo-500/40 hover:bg-slate-800/60 no-underline shadow-xl">

              <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <img *ngIf="client.imageUrl" [src]="client.imageUrl" [alt]="client.name"
                   class="max-h-full max-w-full object-contain opacity-40 grayscale transition-all duration-700 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110" />

              <span *ngIf="!client.imageUrl" class="text-center text-base font-black uppercase tracking-wider text-slate-500 transition-all duration-500 group-hover:text-white group-hover:scale-105">
                {{ client.name }}
              </span>

              <!-- Decorative Glow -->
              <div class="absolute -right-4 -top-4 h-12 w-12 rounded-full bg-indigo-500/0 blur-xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
            </a>
          </ng-container>
        </div>

        <div class="mt-32 rounded-[50px] border border-white/5 bg-slate-900/40 p-16 text-center backdrop-blur-3xl relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-cyan-500/10 to-transparent opacity-50"></div>
          <div class="relative z-10">
            <h3 class="text-4xl font-black text-white mb-6 tracking-tighter">Ready to Scale Your Innovation?</h3>
            <p class="text-slate-300 mb-10 max-w-2xl mx-auto text-xl font-medium leading-relaxed opacity-90">Join our network of elite partners and transform your business operations with our bespoke, state-of-the-art AI solutions.</p>
            <p-button label="Become a Partner" icon="pi pi-user-plus" [routerLink]="['/contact']"
                      styleClass="p-button-raised p-button-rounded bg-gradient-to-r from-indigo-500 to-cyan-600 border-none px-10 py-5 font-black uppercase tracking-widest text-white shadow-2xl hover:scale-105 transition-transform"></p-button>
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
