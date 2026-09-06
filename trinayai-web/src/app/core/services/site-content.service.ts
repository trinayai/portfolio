import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AboutCard, ClientItem, ContentItem, SectionItem, SiteSettings } from '../models/site-content';

@Injectable({ providedIn: 'root' })
export class SiteContentService {
  constructor() {}

  async uploadFile(file: File, path: string): Promise<string> {
    return '';
  }

  async deleteFile(url: string): Promise<void> {
    return;
  }

  getSettings(): Observable<SiteSettings> {
    return of({} as SiteSettings);
  }

  async saveSettings(settings: SiteSettings) {
    return Promise.resolve();
  }

  getHomeSections(): Observable<SectionItem[]> {
    return this.listenToCollection<SectionItem>('homeSections');
  }

  async addHomeSection(payload: Omit<SectionItem, 'id'>) {
    return Promise.resolve();
  }

  async updateHomeSection(id: string, payload: Partial<SectionItem>) {
    return Promise.resolve();
  }

  async deleteHomeSection(id: string) {
    return Promise.resolve();
  }

  getAboutCards(): Observable<AboutCard[]> {
    return this.listenToCollection<AboutCard>('aboutCards');
  }

  async addAboutCard(payload: Omit<AboutCard, 'id'>) {
    return Promise.resolve();
  }

  async updateAboutCard(id: string, payload: Partial<AboutCard>) {
    return Promise.resolve();
  }

  async deleteAboutCard(id: string) {
    return Promise.resolve();
  }

  getServices(): Observable<ContentItem[]> {
    return this.listenToCollection<ContentItem>('services');
  }

  async addService(payload: Omit<ContentItem, 'id'>) {
    return Promise.resolve();
  }

  async updateService(id: string, payload: Partial<ContentItem>) {
    return Promise.resolve();
  }

  async deleteService(id: string) {
    return Promise.resolve();
  }

  getAiMenuItems(): Observable<ContentItem[]> {
    return this.listenToCollection<ContentItem>('aiMenuItems');
  }

  async addAiMenuItem(payload: Omit<ContentItem, 'id'>) {
    return Promise.resolve();
  }

  async updateAiMenuItem(id: string, payload: Partial<ContentItem>) {
    return Promise.resolve();
  }

  async deleteAiMenuItem(id: string) {
    return Promise.resolve();
  }

  getClients(): Observable<ClientItem[]> {
    return this.listenToCollection<ClientItem>('clients');
  }

  async addClient(payload: Omit<ClientItem, 'id'>) {
    return Promise.resolve();
  }

  async updateClient(id: string, payload: Partial<ClientItem>) {
    return Promise.resolve();
  }

  async deleteClient(id: string) {
    return Promise.resolve();
  }

  private listenToCollection<T>(collectionName: string): Observable<T[]> {
    return of([]);
  }
}
