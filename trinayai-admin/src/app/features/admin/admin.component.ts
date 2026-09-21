import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@angular/fire/auth';
import { AuthService } from '../../core/services/auth.service';
import { SiteContentService } from '../../core/services/site-content.service';
import { AboutCard, AboutEvent, ClientItem, ContentItem, SectionItem, SiteSettings, Director, ServicePlan } from '../../core/models/site-content';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, InputTextareaModule, CardModule, TabViewModule, FileUploadModule, ToastModule, MessageModule, InputSwitchModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private contentService = inject(SiteContentService);
  private messageService = inject(MessageService);

  authUser: User | null = null;

  settings: SiteSettings = { brandName: 'TRINAY AI', logoUrl: 'assets/logo/Trinay-AI-Logo.png', footerText: '', contactEmail: 'info@trinayai.com', showIndiaAiBadge: true, menuItems: [] };
  homeSections: SectionItem[] = [];
  aboutCards: AboutCard[] = [];
  aboutEvents: AboutEvent[] = [];
  directors: Director[] = [];
  contactInterestOptionsText = '';
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
      if (!this.settings.smtpConfig) {
        this.settings.smtpConfig = { host: '', port: 587, secure: true, user: '', pass: '' };
      }
      this.contactInterestOptionsText = settings.contactInterestOptions?.join('\n') || '';
    });
    this.contentService.getHomeSections().subscribe((sections: SectionItem[]) => this.homeSections = sections);
    this.contentService.getAboutCards().subscribe((cards: AboutCard[]) => this.aboutCards = cards);
    this.contentService.getAboutEvents().subscribe((events: AboutEvent[]) => this.aboutEvents = events);
    this.contentService.getServices().subscribe((services: ContentItem[]) => this.services = services);
    this.contentService.getAiMenuItems().subscribe((items: ContentItem[]) => this.aiMenuItems = items);
    this.contentService.getClients().subscribe((clients: ClientItem[]) => this.clients = clients);
    this.contentService.getDirectors().subscribe((directors: Director[]) => this.directors = directors);
  }

  async saveSettings() {
    try {
      await this.contentService.saveSettings(this.settings);
      this.showSuccess('Settings updated');
    } catch (error) {
      this.showError(`Failed to save settings: ${this.getErrorMessage(error)}`);
    }
  }

  async savePageCopy() {
    this.settings.contactInterestOptions = this.contactInterestOptionsText.split('\n').map(option => option.trim()).filter(Boolean);
    await this.saveSettings();
  }

  updateItemFeatures(item: ContentItem, text: string) {
    item.features = text.split('\n').map(f => f.trim()).filter(Boolean);
  }

  updatePlanFeatures(plan: ServicePlan, text: string) {
    plan.features = text.split('\n').map(f => f.trim()).filter(Boolean);
  }

  addPlanToItem(item: ContentItem) {
    if (!item.plans) item.plans = [];
    item.plans.push({
      id: 'plan_' + Date.now(),
      name: 'New Plan',
      cost: '₹0',
      billingCycle: '/ mo',
      features: [],
      isVisible: true
    });
  }

  removePlanFromItem(item: ContentItem, plan: ServicePlan) {
    item.plans = item.plans?.filter(p => p.id !== plan.id);
  }

  async addAboutEvent() {
    try {
      await this.contentService.addAboutEvent({ status: 'New milestone', date: '', description: '', icon: 'pi pi-star', isVisible: true });
      this.showSuccess('Event added');
    } catch (error) {
      this.showError(`Failed to add event: ${this.getErrorMessage(error)}`);
    }
  }

  async saveAboutEvent(event: AboutEvent) {
    if (!event.id) return;
    try {
      await this.contentService.updateAboutEvent(event.id, event);
      this.showSuccess('Event saved');
    } catch (error) {
      this.showError(`Save failed: ${this.getErrorMessage(error)}`);
    }
  }

  async deleteAboutEvent(event: AboutEvent) {
    if (!event.id) return;
    try {
      await this.contentService.deleteAboutEvent(event.id);
      this.showSuccess('Event deleted');
    } catch (error) {
      this.showError(`Delete failed: ${this.getErrorMessage(error)}`);
    }
  }

  async addDirector() {
    try {
      await this.contentService.addDirector({ name: 'New Director', role: 'Director', isVisible: true });
      this.showSuccess('Director added');
    } catch (e) {
      this.showError('Failed to add director');
    }
  }

  async saveDirector(director: Director) {
    if (director.id) {
      try {
        await this.contentService.updateDirector(director.id, director);
        this.showSuccess('Director saved');
      } catch (e) {
        this.showError('Save failed');
      }
    }
  }

  async deleteDirector(director: Director) {
    if (director.id) {
      try {
        await this.contentService.deleteDirector(director.id);
        this.showSuccess('Director deleted');
      } catch (e) {
        this.showError('Delete failed');
      }
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
      await this.contentService.addHomeSection({ title: 'New Section', description: 'Add a short description.', icon: 'pi pi-star', isVisible: true });
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
      await this.contentService.addAboutCard({ title: 'New Card', description: 'Add your content.', isVisible: true });
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
      await this.contentService.addService({ title: 'New Service', description: 'Add your service details.', icon: 'pi pi-cog', isVisible: true });
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
      await this.contentService.addAiMenuItem({ title: 'New AI Item', description: 'Add your content.', icon: 'pi pi-android', isVisible: true, plans: [] });
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
      await this.contentService.addClient({ name: 'New Client', imageUrl: '', website: '', isVisible: true });
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
