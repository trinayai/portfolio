import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@angular/fire/auth';
import { AuthService } from '../../core/services/auth.service';
import { SiteContentService } from '../../core/services/site-content.service';
import { AboutCard, ClientItem, ContentItem, SectionItem, SiteSettings } from '../../core/models/site-content';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, ButtonModule, InputTextModule, InputTextareaModule, CardModule, TabViewModule, FileUploadModule, ToastModule, MessageModule],
  template: `
    <p-toast></p-toast>
    <div class="min-h-screen bg-[#050c1f] px-4 py-16 text-white md:px-8 lg:px-12">
      <div class="mx-auto max-w-7xl">
        <div class="mb-12 flex flex-wrap items-center justify-between gap-6">
          <div>
            <span class="inline-block rounded-full bg-red-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-red-400 ring-1 ring-red-500/20 mb-4">
              Authorized Personnel Only
            </span>
            <h1 class="text-4xl font-black tracking-tight text-white sm:text-5xl">Content <span class="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Management</span></h1>
          </div>
          <div class="flex gap-4">
            <p-button label="Logout" icon="pi pi-power-off" (onClick)="logout()" styleClass="p-button-danger p-button-outlined border-white/10 text-white hover:bg-red-500/10"></p-button>
          </div>
        </div>

        <p-message></p-message>

        @if (authUser) {
          <p-card class="border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl admin-main-card">
            <p-tabView class="custom-tabview">

              <p-tabPanel header="Branding">
                <div class="grid gap-8 lg:grid-cols-2">
                   <div class="space-y-6">
                      <div class="flex flex-col gap-2">
                        <label class="text-xs font-bold uppercase tracking-widest text-slate-500">Brand Name</label>
                        <input pInputText [(ngModel)]="settings.brandName" class="w-full bg-black/20 border-white/10 text-white" />
                      </div>
                      <div class="flex flex-col gap-2">
                        <label class="text-xs font-bold uppercase tracking-widest text-slate-500">Footer Text</label>
                        <textarea pInputTextarea [(ngModel)]="settings.footerText" rows="4" class="w-full bg-black/20 border-white/10 text-white"></textarea>
                      </div>
                      <div class="flex flex-col gap-2">
                        <label class="text-xs font-bold uppercase tracking-widest text-slate-500">Contact Recipient Email</label>
                        <input pInputText type="email" [(ngModel)]="settings.contactEmail" placeholder="admin&#64;trinayai.com" class="w-full bg-black/20 border-white/10 text-white" />
                        <small class="text-slate-500">Project brief emails open addressed to this inbox.</small>
                      </div>
                      <label class="flex items-center gap-3 text-sm font-semibold text-slate-300">
                        <input type="checkbox" [(ngModel)]="settings.showIndiaAiBadge" />
                        Show IndiaAI Mission badge on the home hero
                      </label>
                      <p-button label="Save Branding" icon="pi pi-save" (onClick)="saveSettings()" styleClass="p-button-info w-full md:w-auto"></p-button>
                   </div>
                   <div class="space-y-4">
                      <label class="text-xs font-bold uppercase tracking-widest text-slate-500">Site Logo</label>
                      <div class="p-6 rounded-xl border border-dashed border-white/20 bg-white/5 flex flex-col items-center">
                         @if (settings.logoUrl) {
                           <img [src]="settings.logoUrl" alt="logo" class="h-24 w-24 rounded-full object-cover mb-4 shadow-lg shadow-cyan-500/20" />
                         }
                        <p-fileUpload mode="basic" name="logo" accept="image/*" [auto]="true" (onSelect)="onLogoUpload($event)"
                                        chooseLabel="Upload New Logo" styleClass="p-button-outlined p-button-sm"></p-fileUpload>
                      </div>
                   </div>
                </div>
              </p-tabPanel>

              <p-tabPanel header="Home Page">
                <div class="space-y-10">
                   <div>
                     <h3 class="text-xl font-bold text-white mb-6 border-b border-white/5 pb-2">Hero Section</h3>
                     <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div class="flex flex-col gap-2">
                          <label class="text-xs font-bold uppercase tracking-widest text-slate-500">Badge Text</label>
                          <input pInputText [(ngModel)]="settings.heroBadge" class="bg-black/20 border-white/10 text-white" />
                        </div>
                        <div class="flex flex-col gap-2">
                          <label class="text-xs font-bold uppercase tracking-widest text-slate-500">Title</label>
                          <input pInputText [(ngModel)]="settings.heroTitle" class="bg-black/20 border-white/10 text-white" />
                        </div>
                        <div class="flex flex-col gap-2">
                          <label class="text-xs font-bold uppercase tracking-widest text-slate-500">CTA Text</label>
                          <input pInputText [(ngModel)]="settings.heroPrimaryCtaText" class="bg-black/20 border-white/10 text-white" />
                        </div>
                     </div>
                     <p-button label="Save Hero Settings" icon="pi pi-save" (onClick)="saveSettings()" styleClass="mt-4 p-button-info p-button-sm"></p-button>
                   </div>

                   <div>
                     <div class="flex items-center justify-between mb-6 border-b border-white/5 pb-2">
                       <h3 class="text-xl font-bold text-white">Features / Stats</h3>
                       <p-button label="Add Section" icon="pi pi-plus" (onClick)="addHomeSection()" styleClass="p-button-sm p-button-success"></p-button>
                     </div>
                     <div class="grid gap-6 md:grid-cols-2">
                        @for (item of homeSections; track item) {
                          <div class="p-6 rounded-xl border border-white/5 bg-white/5">
                            <div class="grid gap-4 mb-4">
                              <input pInputText [(ngModel)]="item.title" placeholder="Title" class="w-full bg-black/20 border-white/10 text-white" />
                              <input pInputText [(ngModel)]="item.icon" placeholder="Icon (pi pi-...)" class="w-full bg-black/20 border-white/10 text-white" />
                              <textarea pInputTextarea [(ngModel)]="item.description" rows="2" placeholder="Description" class="w-full bg-black/20 border-white/10 text-white"></textarea>
                            </div>
                            <div class="flex gap-2">
                              <p-button icon="pi pi-save" (onClick)="saveHomeSection(item)" styleClass="p-button-sm"></p-button>
                              <p-button icon="pi pi-trash" (onClick)="deleteHomeSection(item)" styleClass="p-button-sm p-button-danger p-button-outlined"></p-button>
                            </div>
                          </div>
                        }
                     </div>
                   </div>
                </div>
              </p-tabPanel>

              <p-tabPanel header="Tools & Services">
                 <div class="grid gap-12 lg:grid-cols-2">
                    <div>
                      <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-bold text-white">AI Tools</h3>
                        <p-button label="New Tool" icon="pi pi-plus" (onClick)="addAiMenuItem()" styleClass="p-button-sm p-button-success"></p-button>
                      </div>
                      <div class="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scroll">
                        @for (item of aiMenuItems; track item) {
                          <div class="p-5 rounded-xl border border-white/5 bg-white/5">
                            <input pInputText [(ngModel)]="item.title" class="w-full bg-black/20 border-white/10 text-white mb-2" />
                            <textarea pInputTextarea [(ngModel)]="item.description" rows="2" class="w-full bg-black/20 border-white/10 text-white mb-3"></textarea>
                            <div class="flex gap-2">
                              <p-button icon="pi pi-save" (onClick)="saveAiMenuItem(item)" styleClass="p-button-sm p-button-info p-button-outlined"></p-button>
                              <p-button icon="pi pi-trash" (onClick)="deleteAiMenuItem(item)" styleClass="p-button-sm p-button-danger p-button-outlined"></p-button>
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                    <div>
                      <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-bold text-white">Services</h3>
                        <p-button label="New Service" icon="pi pi-plus" (onClick)="addService()" styleClass="p-button-sm p-button-success"></p-button>
                      </div>
                      <div class="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scroll">
                        @for (item of services; track item) {
                          <div class="p-5 rounded-xl border border-white/5 bg-white/5">
                            <input pInputText [(ngModel)]="item.title" class="w-full bg-black/20 border-white/10 text-white mb-2" />
                            <textarea pInputTextarea [(ngModel)]="item.description" rows="2" class="w-full bg-black/20 border-white/10 text-white mb-3"></textarea>
                            <div class="flex gap-2">
                              <p-button icon="pi pi-save" (onClick)="saveService(item)" styleClass="p-button-sm p-button-info p-button-outlined"></p-button>
                              <p-button icon="pi pi-trash" (onClick)="deleteService(item)" styleClass="p-button-sm p-button-danger p-button-outlined"></p-button>
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </p-tabPanel>

              <p-tabPanel header="Clients">
                <div class="flex justify-end mb-6">
                   <p-button label="Register New Client" icon="pi pi-plus" (onClick)="addClient()" styleClass="p-button-success"></p-button>
                </div>
                <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                   @for (client of clients; track client) {
                     <div class="p-6 rounded-2xl border border-white/5 bg-white/5 flex flex-col">
                        <div class="h-32 w-full rounded-xl border border-white/5 bg-black/20 mb-4 flex items-center justify-center overflow-hidden p-4 relative group">
                          @if (client.imageUrl) {
                            <img [src]="client.imageUrl" class="max-h-full max-w-full object-contain" />
                          }
                          <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <p-fileUpload mode="basic" accept="image/*" [auto]="true" (onSelect)="onClientLogoUpload($event, client)"
                                           chooseLabel="Change" styleClass="p-button-sm p-button-rounded"></p-fileUpload>
                          </div>
                        </div>
                        <input pInputText [(ngModel)]="client.name" placeholder="Client Name" class="w-full bg-black/10 border-white/5 text-white mb-2" />
                        <input pInputText [(ngModel)]="client.website" placeholder="Website" class="w-full bg-black/10 border-white/5 text-white mb-4" />
                        <div class="mt-auto flex gap-2">
                          <p-button label="Update" icon="pi pi-check" (onClick)="saveClient(client)" styleClass="p-button-sm w-full"></p-button>
                          <p-button icon="pi pi-trash" (onClick)="deleteClient(client)" styleClass="p-button-sm p-button-danger p-button-outlined"></p-button>
                        </div>
                     </div>
                   }
                </div>
              </p-tabPanel>

              <p-tabPanel header="About Info">
                <div class="flex items-center justify-between mb-6">
                   <h3 class="text-xl font-bold text-white">About Page Cards</h3>
                   <p-button label="Add Card" icon="pi pi-plus" (onClick)="addAboutCard()" styleClass="p-button-sm p-button-success"></p-button>
                </div>
                <div class="grid gap-6 md:grid-cols-2">
                   @for (card of aboutCards; track card) {
                     <div class="p-6 rounded-xl border border-white/5 bg-white/5">
                        <input pInputText [(ngModel)]="card.title" class="w-full bg-black/20 border-white/10 text-white mb-4" />
                        <textarea pInputTextarea [(ngModel)]="card.description" rows="3" class="w-full bg-black/20 border-white/10 text-white mb-4"></textarea>
                        <div class="flex gap-2">
                          <p-button label="Save" icon="pi pi-check" (onClick)="saveAboutCard(card)" styleClass="p-button-sm"></p-button>
                          <p-button icon="pi pi-trash" (onClick)="deleteAboutCard(card)" styleClass="p-button-sm p-button-danger p-button-outlined"></p-button>
                        </div>
                     </div>
                   }
                </div>
              </p-tabPanel>

            </p-tabView>
          </p-card>
        }
      </div>
    </div>
  `,
  styles: [`
    ::ng-deep {
      .admin-main-card .p-card-body { padding: 0; }

      .custom-tabview {
        .p-tabview-nav {
          background: rgba(255,255,255,0.02) !important;
          border: none;
          padding: 1rem 1rem 0 1rem;
          li .p-tabview-nav-link {
            background: transparent !important;
            border: none !important;
            color: #64748b !important;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-size: 0.75rem;
            padding: 1rem 1.5rem;
            transition: all 0.3s;
            &:not(.p-disabled):focus { box-shadow: none; }
          }
          li.p-highlight .p-tabview-nav-link {
            color: #22d3ee !important;
            border-bottom: 2px solid #22d3ee !important;
          }
        }
        .p-tabview-panels {
          background: transparent !important;
          padding: 2.5rem;
          color: white;
        }
      }

      .p-inputtext, .p-inputtextarea {
        border-radius: 12px;
        padding: 0.75rem 1rem;
        transition: all 0.3s;
        &::placeholder { color: #475569; }
        &:focus {
          background: rgba(0,0,0,0.4);
          box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2);
          border-color: #0891b2;
        }
      }

      .custom-scroll {
        &::-webkit-scrollbar { width: 4px; }
        &::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private contentService = inject(SiteContentService);
  private messageService = inject(MessageService);

  authUser: User | null = null;

  settings: SiteSettings = { brandName: 'TRINAY AI', logoUrl: '', footerText: '© 2026 Trinay AI. All rights reserved.', contactEmail: 'admin@trinayai.com', showIndiaAiBadge: true, menuItems: [] };
  homeSections: SectionItem[] = [];
  aboutCards: AboutCard[] = [];
  services: ContentItem[] = [];
  aiMenuItems: ContentItem[] = [];
  clients: ClientItem[] = [];

  ngOnInit(): void {
    this.loadData();
    this.authService.user$.subscribe((user: User | null) => {
      this.authUser = user;
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  async logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.authUser = null;
        this.showSuccess('Logged out safely');
        this.router.navigate(['/login']);
      },
      error: () => this.showError('Logout failed')
    });
  }

  private loadData() {
    this.contentService.getSettings().subscribe((settings: SiteSettings) => {
      this.settings = { ...this.settings, ...settings };
    });
    this.contentService.getHomeSections().subscribe((sections: SectionItem[]) => this.homeSections = sections);
    this.contentService.getAboutCards().subscribe((cards: AboutCard[]) => this.aboutCards = cards);
    this.contentService.getServices().subscribe((services: ContentItem[]) => this.services = services);
    this.contentService.getAiMenuItems().subscribe((items: ContentItem[]) => this.aiMenuItems = items);
    this.contentService.getClients().subscribe((clients: ClientItem[]) => this.clients = clients);
  }

  async saveSettings() {
    try {
      await this.contentService.saveSettings(this.settings);
      this.showSuccess('Settings updated');
    } catch (error) {
      this.showError(`Failed to save settings: ${this.getErrorMessage(error)}`);
    }
  }

  async onLogoUpload(event: any) {
    const file = event.files[0];
    if (file) {
      try {
        const url = await this.contentService.uploadFile(file, `logos/site-logo-${Date.now()}`);
        this.settings.logoUrl = url;
        await this.saveSettings();
      } catch (e) {
        this.showError('Upload failed');
      }
    }
  }

  async onClientLogoUpload(event: any, client: ClientItem) {
    const file = event.files[0];
    if (file && client.id) {
      try {
        const url = await this.contentService.uploadFile(file, `clients/${client.id}-${Date.now()}`);
        client.imageUrl = url;
        await this.saveClient(client);
      } catch (e) {
        this.showError('Upload failed');
      }
    }
  }

  async addHomeSection() {
    try {
      await this.contentService.addHomeSection({ title: 'New Section', description: 'Add a short description.', icon: 'pi pi-star' });
      this.showSuccess('Section added');
    } catch (e) {
      this.showError('Failed to add section');
    }
  }

  async saveHomeSection(item: SectionItem) {
    if (item.id) {
      try {
        await this.contentService.updateHomeSection(item.id, item);
        this.showSuccess('Section saved');
      } catch (error) {
        this.showError(`Save failed: ${this.getErrorMessage(error)}`);
      }
    }
  }

  async deleteHomeSection(item: SectionItem) {
    if (item.id) {
      try {
        await this.contentService.deleteHomeSection(item.id);
        this.showSuccess('Section deleted');
      } catch (e) {
        this.showError('Delete failed');
      }
    }
  }

  async addAboutCard() {
    try {
      await this.contentService.addAboutCard({ title: 'New Card', description: 'Add your content.' });
      this.showSuccess('Card added');
    } catch (e) {
      this.showError('Failed to add card');
    }
  }

  async saveAboutCard(card: AboutCard) {
    if (card.id) {
      try {
        await this.contentService.updateAboutCard(card.id, card);
        this.showSuccess('Card saved');
      } catch (error) {
        this.showError(`Save failed: ${this.getErrorMessage(error)}`);
      }
    }
  }

  async deleteAboutCard(card: AboutCard) {
    if (card.id) {
      try {
        await this.contentService.deleteAboutCard(card.id);
        this.showSuccess('Card deleted');
      } catch (e) {
        this.showError('Delete failed');
      }
    }
  }

  async addService() {
    try {
      await this.contentService.addService({ title: 'New Service', description: 'Add your service details.', icon: 'pi pi-cog' });
      this.showSuccess('Service added');
    } catch (e) {
      this.showError('Failed to add service');
    }
  }

  async saveService(item: ContentItem) {
    if (item.id) {
      try {
        await this.contentService.updateService(item.id, item);
        this.showSuccess('Service saved');
      } catch (error) {
        this.showError(`Save failed: ${this.getErrorMessage(error)}`);
      }
    }
  }

  async deleteService(item: ContentItem) {
    if (item.id) {
      try {
        await this.contentService.deleteService(item.id);
        this.showSuccess('Service deleted');
      } catch (e) {
        this.showError('Delete failed');
      }
    }
  }

  async addAiMenuItem() {
    try {
      await this.contentService.addAiMenuItem({ title: 'New AI Item', description: 'Add your content.', icon: 'pi pi-android' });
      this.showSuccess('AI item added');
    } catch (e) {
      this.showError('Failed to add AI item');
    }
  }

  async saveAiMenuItem(item: ContentItem) {
    if (item.id) {
      try {
        await this.contentService.updateAiMenuItem(item.id, item);
        this.showSuccess('AI Item saved');
      } catch (error) {
        this.showError(`Save failed: ${this.getErrorMessage(error)}`);
      }
    }
  }

  async deleteAiMenuItem(item: ContentItem) {
    if (item.id) {
      try {
        await this.contentService.deleteAiMenuItem(item.id);
        this.showSuccess('AI item deleted');
      } catch (e) {
        this.showError('Delete failed');
      }
    }
  }

  async addClient() {
    try {
      await this.contentService.addClient({ name: 'New Client', imageUrl: '', website: '' });
      this.showSuccess('Client added');
    } catch (e) {
      this.showError('Failed to add client');
    }
  }

  async saveClient(client: ClientItem) {
    if (client.id) {
      try {
        await this.contentService.updateClient(client.id, client);
        this.showSuccess('Client updated');
      } catch (error) {
        this.showError(`Update failed: ${this.getErrorMessage(error)}`);
      }
    }
  }

  async deleteClient(client: ClientItem) {
    if (client.id) {
      try {
        await this.contentService.deleteClient(client.id);
        this.showSuccess('Client deleted');
      } catch (e) {
        this.showError('Delete failed');
      }
    }
  }

  private showSuccess(msg: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
  }

  private showError(msg: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }

  private getErrorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'message' in error) {
      return String(error.message);
    }
    return 'Check your Firebase connection and permissions';
  }
}
