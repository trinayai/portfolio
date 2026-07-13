import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { SiteContentService } from '../../core/services/site-content.service';
import { AboutCard, ClientItem, ContentItem, SectionItem, SiteSettings } from '../../core/models/site-content';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-primary px-6 py-16 text-white">
      <div class="mx-auto max-w-6xl">
        <div class="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 class="text-4xl font-bold text-accent">Admin Dashboard</h1>
            <p class="mt-2 text-gray-400">Manage site content, client logos, and page sections from one place.</p>
          </div>
          <a routerLink="/contact" class="rounded-full border border-accent/40 px-4 py-2 text-sm text-accent">Back to contact</a>
        </div>

        <div *ngIf="authUser; else signInBlock" class="space-y-8">
          <div class="rounded-2xl border border-gray-800 bg-secondary/80 p-6">
            <h2 class="text-2xl font-semibold">Site Settings</h2>
            <div class="mt-4 grid gap-4 md:grid-cols-2">
              <label class="text-sm text-gray-300">
                Brand name
                <input [(ngModel)]="settings.brandName" class="mt-1 w-full rounded border border-gray-700 bg-primary px-3 py-2" />
              </label>
              <label class="text-sm text-gray-300">
                Logo URL
                <input [(ngModel)]="settings.logoUrl" class="mt-1 w-full rounded border border-gray-700 bg-primary px-3 py-2" />
              </label>
            </div>
            <label class="mt-4 block text-sm text-gray-300">
              Footer text
              <textarea [(ngModel)]="settings.footerText" rows="3" class="mt-1 w-full rounded border border-gray-700 bg-primary px-3 py-2"></textarea>
            </label>
            <button (click)="saveSettings()" class="mt-4 rounded bg-accent px-4 py-2 font-semibold text-primary">Save Settings</button>
          </div>

          <div class="rounded-2xl border border-gray-800 bg-secondary/80 p-6">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-semibold">Home Sections</h2>
              <button (click)="addHomeSection()" class="rounded bg-accent px-3 py-2 text-sm font-semibold text-primary">Add section</button>
            </div>
            <div class="mt-4 space-y-3">
              <div *ngFor="let item of homeSections" class="rounded border border-gray-700 bg-primary p-4">
                <div class="grid gap-4 md:grid-cols-2">
                  <label class="text-sm text-gray-300">
                    Title
                    <input [(ngModel)]="item.title" class="mt-1 w-full rounded border border-gray-700 bg-secondary px-3 py-2" />
                  </label>
                  <label class="text-sm text-gray-300">
                    Icon
                    <input [(ngModel)]="item.icon" class="mt-1 w-full rounded border border-gray-700 bg-secondary px-3 py-2" />
                  </label>
                </div>
                <label class="mt-3 block text-sm text-gray-300">
                  Description
                  <textarea [(ngModel)]="item.description" rows="3" class="mt-1 w-full rounded border border-gray-700 bg-secondary px-3 py-2"></textarea>
                </label>
                <div class="mt-3 flex gap-2">
                  <button (click)="saveHomeSection(item)" class="rounded bg-accent px-3 py-2 text-sm font-semibold text-primary">Save</button>
                  <button (click)="deleteHomeSection(item)" class="rounded border border-red-500 px-3 py-2 text-sm text-red-400">Delete</button>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-800 bg-secondary/80 p-6">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-semibold">About Cards</h2>
              <button (click)="addAboutCard()" class="rounded bg-accent px-3 py-2 text-sm font-semibold text-primary">Add card</button>
            </div>
            <div class="mt-4 space-y-3">
              <div *ngFor="let card of aboutCards" class="rounded border border-gray-700 bg-primary p-4">
                <label class="block text-sm text-gray-300">
                  Title
                  <input [(ngModel)]="card.title" class="mt-1 w-full rounded border border-gray-700 bg-secondary px-3 py-2" />
                </label>
                <label class="mt-3 block text-sm text-gray-300">
                  Description
                  <textarea [(ngModel)]="card.description" rows="3" class="mt-1 w-full rounded border border-gray-700 bg-secondary px-3 py-2"></textarea>
                </label>
                <div class="mt-3 flex gap-2">
                  <button (click)="saveAboutCard(card)" class="rounded bg-accent px-3 py-2 text-sm font-semibold text-primary">Save</button>
                  <button (click)="deleteAboutCard(card)" class="rounded border border-red-500 px-3 py-2 text-sm text-red-400">Delete</button>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-800 bg-secondary/80 p-6">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-semibold">Services</h2>
              <button (click)="addService()" class="rounded bg-accent px-3 py-2 text-sm font-semibold text-primary">Add service</button>
            </div>
            <div class="mt-4 space-y-3">
              <div *ngFor="let item of services" class="rounded border border-gray-700 bg-primary p-4">
                <div class="grid gap-4 md:grid-cols-2">
                  <label class="text-sm text-gray-300">
                    Title
                    <input [(ngModel)]="item.title" class="mt-1 w-full rounded border border-gray-700 bg-secondary px-3 py-2" />
                  </label>
                  <label class="text-sm text-gray-300">
                    Icon
                    <input [(ngModel)]="item.icon" class="mt-1 w-full rounded border border-gray-700 bg-secondary px-3 py-2" />
                  </label>
                </div>
                <label class="mt-3 block text-sm text-gray-300">
                  Description
                  <textarea [(ngModel)]="item.description" rows="3" class="mt-1 w-full rounded border border-gray-700 bg-secondary px-3 py-2"></textarea>
                </label>
                <div class="mt-3 flex gap-2">
                  <button (click)="saveService(item)" class="rounded bg-accent px-3 py-2 text-sm font-semibold text-primary">Save</button>
                  <button (click)="deleteService(item)" class="rounded border border-red-500 px-3 py-2 text-sm text-red-400">Delete</button>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-800 bg-secondary/80 p-6">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-semibold">AI Menu Items</h2>
              <button (click)="addAiMenuItem()" class="rounded bg-accent px-3 py-2 text-sm font-semibold text-primary">Add item</button>
            </div>
            <div class="mt-4 space-y-3">
              <div *ngFor="let item of aiMenuItems" class="rounded border border-gray-700 bg-primary p-4">
                <div class="grid gap-4 md:grid-cols-2">
                  <label class="text-sm text-gray-300">
                    Title
                    <input [(ngModel)]="item.title" class="mt-1 w-full rounded border border-gray-700 bg-secondary px-3 py-2" />
                  </label>
                  <label class="text-sm text-gray-300">
                    Icon
                    <input [(ngModel)]="item.icon" class="mt-1 w-full rounded border border-gray-700 bg-secondary px-3 py-2" />
                  </label>
                </div>
                <label class="mt-3 block text-sm text-gray-300">
                  Description
                  <textarea [(ngModel)]="item.description" rows="3" class="mt-1 w-full rounded border border-gray-700 bg-secondary px-3 py-2"></textarea>
                </label>
                <div class="mt-3 flex gap-2">
                  <button (click)="saveAiMenuItem(item)" class="rounded bg-accent px-3 py-2 text-sm font-semibold text-primary">Save</button>
                  <button (click)="deleteAiMenuItem(item)" class="rounded border border-red-500 px-3 py-2 text-sm text-red-400">Delete</button>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-800 bg-secondary/80 p-6">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-semibold">Clients</h2>
              <button (click)="addClient()" class="rounded bg-accent px-3 py-2 text-sm font-semibold text-primary">Add client</button>
            </div>
            <div class="mt-4 space-y-3">
              <div *ngFor="let client of clients" class="rounded border border-gray-700 bg-primary p-4">
                <div class="grid gap-4 md:grid-cols-2">
                  <label class="text-sm text-gray-300">
                    Name
                    <input [(ngModel)]="client.name" class="mt-1 w-full rounded border border-gray-700 bg-secondary px-3 py-2" />
                  </label>
                  <label class="text-sm text-gray-300">
                    Image URL
                    <input [(ngModel)]="client.imageUrl" class="mt-1 w-full rounded border border-gray-700 bg-secondary px-3 py-2" />
                  </label>
                </div>
                <label class="mt-3 block text-sm text-gray-300">
                  Website
                  <input [(ngModel)]="client.website" class="mt-1 w-full rounded border border-gray-700 bg-secondary px-3 py-2" />
                </label>
                <div class="mt-3 flex gap-2">
                  <button (click)="saveClient(client)" class="rounded bg-accent px-3 py-2 text-sm font-semibold text-primary">Save</button>
                  <button (click)="deleteClient(client)" class="rounded border border-red-500 px-3 py-2 text-sm text-red-400">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ng-template #signInBlock>
          <div class="rounded-2xl border border-gray-800 bg-secondary/80 p-8 text-center">
            <h2 class="text-2xl font-semibold">Sign in to continue</h2>
            <p class="mt-3 text-gray-400">The admin view uses a Firebase anonymous sign-in for quick access.</p>
            <button (click)="signIn()" class="mt-6 rounded bg-accent px-4 py-2 font-semibold text-primary">Enter admin view</button>
          </div>
        </ng-template>
      </div>
    </div>
  `
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
    await this.contentService.addHomeSection({ title: 'New Section', description: 'Add a short description.', icon: '✨' });
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
    await this.contentService.addService({ title: 'New Service', description: 'Add your service details.', icon: '⚙️' });
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
    await this.contentService.addAiMenuItem({ title: 'New AI Item', description: 'Add your content.', icon: '🤖' });
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
