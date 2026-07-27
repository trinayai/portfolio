import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { SiteContentService } from '../../core/services/site-content.service';
import { AboutCard, ClientItem, ContentItem, SectionItem, SiteSettings } from '../../core/models/site-content';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonModule, InputTextModule, InputTextareaModule, CardModule, AccordionModule, DividerModule],
  template: `
    <div class="min-h-screen bg-[#050c1f] px-6 py-24 text-white">
      <div class="mx-auto max-w-6xl">
        <div class="mb-12 flex flex-wrap items-center justify-between gap-6">
          <div>
            <span class="inline-block rounded-full bg-red-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-red-400 ring-1 ring-red-500/20 mb-4">
              Secure Access
            </span>
            <h1 class="text-4xl font-black tracking-tight text-white sm:text-5xl">Admin <span class="bg-gradient-to-r from-red-400 to-fuchsia-500 bg-clip-text text-transparent">Control Center</span></h1>
          </div>
          <p-button label="View Site" icon="pi pi-external-link" [routerLink]="['/']" styleClass="p-button-outlined border-white/10 text-white"></p-button>
        </div>

        <div *ngIf="authUser; else signInBlock" class="space-y-12">

          <!-- Site Settings -->
          <p-card styleClass="border border-white/10 bg-white/5">
            <h2 class="text-2xl font-bold mb-6 flex items-center gap-3">
               <i class="pi pi-cog text-cyan-400"></i> Global Settings
            </h2>
            <div class="grid gap-6 md:grid-cols-2">
              <div class="flex flex-col gap-2">
                <label class="text-xs font-bold uppercase tracking-widest text-slate-500">Brand Name</label>
                <input pInputText [(ngModel)]="settings.brandName" class="w-full bg-[#08112a] border-white/10 text-white" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-xs font-bold uppercase tracking-widest text-slate-500">Logo URL</label>
                <input pInputText [(ngModel)]="settings.logoUrl" class="w-full bg-[#08112a] border-white/10 text-white" />
              </div>
            </div>
            <div class="mt-6 flex flex-col gap-2">
              <label class="text-xs font-bold uppercase tracking-widest text-slate-500">Footer Text</label>
              <textarea pInputTextarea [(ngModel)]="settings.footerText" rows="3" class="w-full bg-[#08112a] border-white/10 text-white"></textarea>
            </div>
            <p-button label="Update Settings" icon="pi pi-save" (onClick)="saveSettings()" styleClass="mt-6 p-button-info"></p-button>
          </p-card>

          <p-accordion [multiple]="true" styleClass="admin-accordion">
            <!-- Home Sections -->
            <p-accordionTab>
              <ng-template pTemplate="header">
                 <span class="flex items-center gap-3"><i class="pi pi-home"></i> Home Sections</span>
              </ng-template>
              <div class="flex justify-end mb-4">
                 <p-button label="Add Section" icon="pi pi-plus" (onClick)="addHomeSection()" styleClass="p-button-sm p-button-success"></p-button>
              </div>
              <div class="space-y-4">
                <div *ngFor="let item of homeSections" class="p-6 rounded-xl border border-white/5 bg-white/5">
                  <div class="grid gap-4 md:grid-cols-2">
                    <input pInputText [(ngModel)]="item.title" placeholder="Title" class="w-full bg-black/20 border-white/10 text-white" />
                    <input pInputText [(ngModel)]="item.icon" placeholder="Icon Class (pi pi-...)" class="w-full bg-black/20 border-white/10 text-white" />
                  </div>
                  <textarea pInputTextarea [(ngModel)]="item.description" rows="2" placeholder="Description" class="mt-4 w-full bg-black/20 border-white/10 text-white"></textarea>
                  <div class="mt-4 flex gap-2">
                    <p-button label="Save" icon="pi pi-check" (onClick)="saveHomeSection(item)" styleClass="p-button-sm"></p-button>
                    <p-button label="Delete" icon="pi pi-trash" (onClick)="deleteHomeSection(item)" styleClass="p-button-sm p-button-danger p-button-outlined"></p-button>
                  </div>
                </div>
              </div>
            </p-accordionTab>

            <!-- Services -->
            <p-accordionTab>
               <ng-template pTemplate="header">
                 <span class="flex items-center gap-3"><i class="pi pi-briefcase"></i> Services</span>
              </ng-template>
              <div class="flex justify-end mb-4">
                 <p-button label="Add Service" icon="pi pi-plus" (onClick)="addService()" styleClass="p-button-sm p-button-success"></p-button>
              </div>
              <div class="space-y-4">
                <div *ngFor="let item of services" class="p-6 rounded-xl border border-white/5 bg-white/5">
                  <div class="grid gap-4 md:grid-cols-2">
                    <input pInputText [(ngModel)]="item.title" placeholder="Service Title" class="w-full bg-black/20 border-white/10 text-white" />
                    <input pInputText [(ngModel)]="item.icon" placeholder="Icon (pi pi-...)" class="w-full bg-black/20 border-white/10 text-white" />
                  </div>
                  <textarea pInputTextarea [(ngModel)]="item.description" rows="2" placeholder="Description" class="mt-4 w-full bg-black/20 border-white/10 text-white"></textarea>
                  <div class="mt-4 flex gap-2">
                    <p-button label="Save" icon="pi pi-check" (onClick)="saveService(item)" styleClass="p-button-sm"></p-button>
                    <p-button label="Delete" icon="pi pi-trash" (onClick)="deleteService(item)" styleClass="p-button-sm p-button-danger p-button-outlined"></p-button>
                  </div>
                </div>
              </div>
            </p-accordionTab>

            <!-- AI Menu Items -->
            <p-accordionTab>
               <ng-template pTemplate="header">
                 <span class="flex items-center gap-3"><i class="pi pi-android"></i> AI Menu</span>
              </ng-template>
              <div class="flex justify-end mb-4">
                 <p-button label="Add Item" icon="pi pi-plus" (onClick)="addAiMenuItem()" styleClass="p-button-sm p-button-success"></p-button>
              </div>
              <div class="space-y-4">
                <div *ngFor="let item of aiMenuItems" class="p-6 rounded-xl border border-white/5 bg-white/5">
                  <div class="grid gap-4 md:grid-cols-2">
                    <input pInputText [(ngModel)]="item.title" placeholder="Tool Title" class="w-full bg-black/20 border-white/10 text-white" />
                    <input pInputText [(ngModel)]="item.icon" placeholder="Icon (pi pi-...)" class="w-full bg-black/20 border-white/10 text-white" />
                  </div>
                  <textarea pInputTextarea [(ngModel)]="item.description" rows="2" placeholder="Description" class="mt-4 w-full bg-black/20 border-white/10 text-white"></textarea>
                  <div class="mt-4 flex gap-2">
                    <p-button label="Save" icon="pi pi-check" (onClick)="saveAiMenuItem(item)" styleClass="p-button-sm"></p-button>
                    <p-button label="Delete" icon="pi pi-trash" (onClick)="deleteAiMenuItem(item)" styleClass="p-button-sm p-button-danger p-button-outlined"></p-button>
                  </div>
                </div>
              </div>
            </p-accordionTab>

            <!-- Clients -->
            <p-accordionTab>
               <ng-template pTemplate="header">
                 <span class="flex items-center gap-3"><i class="pi pi-users"></i> Clients & Partners</span>
              </ng-template>
              <div class="flex justify-end mb-4">
                 <p-button label="Add Client" icon="pi pi-plus" (onClick)="addClient()" styleClass="p-button-sm p-button-success"></p-button>
              </div>
              <div class="space-y-4">
                <div *ngFor="let client of clients" class="p-6 rounded-xl border border-white/5 bg-white/5">
                  <div class="grid gap-4 md:grid-cols-2">
                    <input pInputText [(ngModel)]="client.name" placeholder="Client Name" class="w-full bg-black/20 border-white/10 text-white" />
                    <input pInputText [(ngModel)]="client.imageUrl" placeholder="Logo URL" class="w-full bg-black/20 border-white/10 text-white" />
                  </div>
                  <input pInputText [(ngModel)]="client.website" placeholder="Website URL" class="mt-4 w-full bg-black/20 border-white/10 text-white" />
                  <div class="mt-4 flex gap-2">
                    <p-button label="Save" icon="pi pi-check" (onClick)="saveClient(client)" styleClass="p-button-sm"></p-button>
                    <p-button label="Delete" icon="pi pi-trash" (onClick)="deleteClient(client)" styleClass="p-button-sm p-button-danger p-button-outlined"></p-button>
                  </div>
                </div>
              </div>
            </p-accordionTab>
          </p-accordion>
        </div>

        <ng-template #signInBlock>
          <p-card styleClass="border border-white/10 bg-white/5 text-center py-12">
            <h2 class="text-3xl font-bold mb-4">Authorized Access Only</h2>
            <p class="text-slate-400 mb-8 max-w-md mx-auto">Please authenticate to manage the Trinayai Technologies content ecosystem.</p>
            <p-button label="Authenticate with Firebase" icon="pi pi-lock" (onClick)="signIn()" styleClass="p-button-raised bg-gradient-to-r from-red-500 to-fuchsia-600 border-none px-8 py-3"></p-button>
          </p-card>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    ::ng-deep {
      .p-accordion {
        .p-accordion-header .p-accordion-header-link {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.05);
          color: white;
          padding: 1.5rem;
          border-radius: 16px;
          margin-bottom: 0.5rem;
          transition: all 0.3s;
          &:hover { background: rgba(255,255,255,0.1); }
        }
        .p-accordion-content {
          background: transparent;
          border: none;
          color: white;
          padding: 1.5rem 0;
        }
        .p-accordion-tab-active .p-accordion-header .p-accordion-header-link {
          border-color: rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.05);
        }
      }
      .p-inputtext, .p-inputtextarea {
        border-radius: 10px;
        padding: 0.75rem;
        &:focus { box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2); }
      }
      .p-card { border-radius: 24px; }
    }
  `]
})
export class AdminComponent implements OnInit {
  private auth = inject(Auth);
  private contentService = inject(SiteContentService);
  authUser: User | null = null;
  settings: SiteSettings = { brandName: 'TRINAY AI', logoUrl: '', footerText: '© 2026 Trinay AI. All rights reserved.', menuItems: [] };
  homeSections: SectionItem[] = [];
  aboutCards: AboutCard[] = [];
  services: ContentItem[] = [];
  aiMenuItems: ContentItem[] = [];
  clients: ClientItem[] = [];

  ngOnInit(): void {
    this.loadData();
    onAuthStateChanged(this.auth, (user: User | null) => {
      this.authUser = user;
    });
  }

  async signIn() {
    await signInAnonymously(this.auth);
  }

  private loadData() {
    this.contentService.getSettings().subscribe((settings) => {
      this.settings = { ...this.settings, ...settings };
    });
    this.contentService.getHomeSections().subscribe((sections) => this.homeSections = sections);
    this.contentService.getAboutCards().subscribe((cards) => this.aboutCards = cards);
    this.contentService.getServices().subscribe((services) => this.services = services);
    this.contentService.getAiMenuItems().subscribe((items) => this.aiMenuItems = items);
    this.contentService.getClients().subscribe((clients) => this.clients = clients);
  }

  async saveSettings() {
    await this.contentService.saveSettings(this.settings);
  }

  async addHomeSection() {
    await this.contentService.addHomeSection({ title: 'New Section', description: 'Add a short description.', icon: 'pi pi-star' });
  }

  async saveHomeSection(item: SectionItem) {
    if (item.id) {
      await this.contentService.updateHomeSection(item.id, item);
    }
  }

  async deleteHomeSection(item: SectionItem) {
    if (item.id) {
      await this.contentService.deleteHomeSection(item.id);
    }
  }

  async addAboutCard() {
    await this.contentService.addAboutCard({ title: 'New Card', description: 'Add your content.' });
  }

  async saveAboutCard(card: AboutCard) {
    if (card.id) {
      await this.contentService.updateAboutCard(card.id, card);
    }
  }

  async deleteAboutCard(card: AboutCard) {
    if (card.id) {
      await this.contentService.deleteAboutCard(card.id);
    }
  }

  async addService() {
    await this.contentService.addService({ title: 'New Service', description: 'Add your service details.', icon: 'pi pi-cog' });
  }

  async saveService(item: ContentItem) {
    if (item.id) {
      await this.contentService.updateService(item.id, item);
    }
  }

  async deleteService(item: ContentItem) {
    if (item.id) {
      await this.contentService.deleteService(item.id);
    }
  }

  async addAiMenuItem() {
    await this.contentService.addAiMenuItem({ title: 'New AI Item', description: 'Add your content.', icon: 'pi pi-android' });
  }

  async saveAiMenuItem(item: ContentItem) {
    if (item.id) {
      await this.contentService.updateAiMenuItem(item.id, item);
    }
  }

  async deleteAiMenuItem(item: ContentItem) {
    if (item.id) {
      await this.contentService.deleteAiMenuItem(item.id);
    }
  }

  async addClient() {
    await this.contentService.addClient({ name: 'New Client', imageUrl: '', website: '' });
  }

  async saveClient(client: ClientItem) {
    if (client.id) {
      await this.contentService.updateClient(client.id, client);
    }
  }

  async deleteClient(client: ClientItem) {
    if (client.id) {
      await this.contentService.deleteClient(client.id);
    }
  }
}
