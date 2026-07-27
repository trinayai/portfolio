import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteContentService } from '../../core/services/site-content.service';
import { ClientItem } from '../../core/models/site-content';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <div class="min-h-screen bg-[#050c1f] px-6 py-24">
      <div class="mx-auto max-w-7xl">
        <div class="mb-20 text-center">
          <span class="inline-block rounded-full bg-indigo-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-400 ring-1 ring-indigo-500/20 mb-6">
            Partnership
          </span>
          <h2 class="text-4xl font-black tracking-tight text-white sm:text-6xl">
            Trusted by <span class="bg-gradient-to-r from-indigo-400 to-cyan-500 bg-clip-text text-transparent">Industry Leaders</span>
          </h2>
          <p class="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Collaborating with forward-thinking organizations to drive innovation and digital excellence.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          <a *ngFor="let client of clients"
             [href]="client.website || '#'"
             target="_blank"
             class="group relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[24px] border border-white/5 bg-white/5 p-8 transition-all duration-500 hover:border-indigo-500/50 hover:bg-white/10 no-underline">

            <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <img *ngIf="client.imageUrl"
                 [src]="client.imageUrl"
                 [alt]="client.name"
                 class="max-h-full max-w-full object-contain opacity-50 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110" />

            <span *ngIf="!client.imageUrl"
                  class="text-center text-sm font-bold uppercase tracking-widest text-slate-500 transition-colors group-hover:text-white">
              {{ client.name }}
            </span>

            <!-- Decorative corner -->
            <div class="absolute -right-2 -top-2 h-8 w-8 rotate-45 bg-indigo-500/0 group-hover:bg-indigo-500/20 transition-all"></div>
          </a>
        </div>

        <div class="mt-24 rounded-[40px] border border-white/5 bg-gradient-to-r from-indigo-500/10 via-cyan-500/10 to-transparent p-12 text-center backdrop-blur-3xl">
          <h3 class="text-3xl font-bold text-white mb-4">Ready to Innovate?</h3>
          <p class="text-slate-400 mb-8 max-w-xl mx-auto text-lg">Join our network of partners and transform your business with our bespoke AI solutions.</p>
          <a routerLink="/contact" class="inline-flex rounded-full bg-white px-8 py-3 text-sm font-bold uppercase tracking-widest text-black hover:bg-slate-200 transition-colors">
            Become a Partner
          </a>
        </div>
      </div>
    </div>
  `
})
export class ClientsComponent implements OnInit {
  private contentService = inject(SiteContentService);
  clients: ClientItem[] = [];

  ngOnInit(): void {
    this.contentService.getClients().subscribe((clients) => {
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
