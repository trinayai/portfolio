import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay, startWith } from 'rxjs/operators';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, setDoc, updateDoc, docData } from '@angular/fire/firestore';
import { Storage, deleteObject, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { AboutCard, ClientItem, ContentItem, SectionItem, SiteSettings } from '../models/site-content';

@Injectable({ providedIn: 'root' })
export class SiteContentService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private platformId = inject(PLATFORM_ID);
  private settings$!: Observable<SiteSettings>;
  private collectionStreams = new Map<string, Observable<unknown[]>>();

  private readonly defaultSettings: SiteSettings = {
    brandName: 'TRINAY AI',
    logoUrl: 'assets/logo/Trinay-AI-Logo.png',
    footerText: '© 2026 Trinayai Technologies Private Limited. All rights reserved. Tamil Nadu, India.',
    contactEmail: 'admin@trinayai.com',
    menuItems: [
      { label: 'Home', route: '/', order: 0 },
      { label: 'AI Menu', route: '/ai-menu', order: 1 },
      { label: 'About', route: '/about', order: 2 },
      { label: 'Services', route: '/services', order: 3 },
      { label: 'Clients', route: '/clients', order: 4 },
      { label: 'Contact', route: '/contact', order: 5 }
    ]
  };

  async uploadFile(file: File, path: string): Promise<string> {
    const result = await uploadBytes(ref(this.storage, path), file);
    return getDownloadURL(result.ref);
  }

  async deleteFile(url: string): Promise<void> {
    return deleteObject(ref(this.storage, url));
  }

  getSettings(): Observable<SiteSettings> {
    if (this.settings$) return this.settings$;

    const settingsDocument$: Observable<Partial<SiteSettings> | null | undefined> = isPlatformBrowser(this.platformId)
      ? docData(doc(this.firestore, 'siteSettings', 'main'), { idField: 'id' }) as Observable<Partial<SiteSettings> | undefined>
      : of(null);

    this.settings$ = settingsDocument$.pipe(
      map(settings => ({
        ...this.defaultSettings,
        ...(settings || {}),
        menuItems: settings?.menuItems?.length ? settings.menuItems : this.defaultSettings.menuItems
      }) as SiteSettings),
      startWith(this.defaultSettings),
      catchError(() => of(this.defaultSettings)),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    return this.settings$;
  }

  async saveSettings(settings: SiteSettings) {
    return setDoc(doc(this.firestore, 'siteSettings', 'main'), { ...settings, id: 'main' }, { merge: true });
  }

  getHomeSections(): Observable<SectionItem[]> {
    return this.listenToCollection<SectionItem>('homeSections');
  }

  async addHomeSection(payload: Omit<SectionItem, 'id'>) {
    return addDoc(collection(this.firestore, 'homeSections'), payload);
  }

  async updateHomeSection(id: string, payload: Partial<SectionItem>) {
    return updateDoc(doc(this.firestore, 'homeSections', id), payload);
  }

  async deleteHomeSection(id: string) {
    return deleteDoc(doc(this.firestore, 'homeSections', id));
  }

  getAboutCards(): Observable<AboutCard[]> {
    return this.listenToCollection<AboutCard>('aboutCards');
  }

  async addAboutCard(payload: Omit<AboutCard, 'id'>) {
    return addDoc(collection(this.firestore, 'aboutCards'), payload);
  }

  async updateAboutCard(id: string, payload: Partial<AboutCard>) {
    return updateDoc(doc(this.firestore, 'aboutCards', id), payload);
  }

  async deleteAboutCard(id: string) {
    return deleteDoc(doc(this.firestore, 'aboutCards', id));
  }

  getServices(): Observable<ContentItem[]> {
    return this.listenToCollection<ContentItem>('services');
  }

  async addService(payload: Omit<ContentItem, 'id'>) {
    return addDoc(collection(this.firestore, 'services'), payload);
  }

  async updateService(id: string, payload: Partial<ContentItem>) {
    return updateDoc(doc(this.firestore, 'services', id), payload);
  }

  async deleteService(id: string) {
    return deleteDoc(doc(this.firestore, 'services', id));
  }

  getAiMenuItems(): Observable<ContentItem[]> {
    return this.listenToCollection<ContentItem>('aiMenuItems');
  }

  async addAiMenuItem(payload: Omit<ContentItem, 'id'>) {
    return addDoc(collection(this.firestore, 'aiMenuItems'), payload);
  }

  async updateAiMenuItem(id: string, payload: Partial<ContentItem>) {
    return updateDoc(doc(this.firestore, 'aiMenuItems', id), payload);
  }

  async deleteAiMenuItem(id: string) {
    return deleteDoc(doc(this.firestore, 'aiMenuItems', id));
  }

  getClients(): Observable<ClientItem[]> {
    return this.listenToCollection<ClientItem>('clients');
  }

  async addClient(payload: Omit<ClientItem, 'id'>) {
    return addDoc(collection(this.firestore, 'clients'), payload);
  }

  async updateClient(id: string, payload: Partial<ClientItem>) {
    return updateDoc(doc(this.firestore, 'clients', id), payload);
  }

  async deleteClient(id: string) {
    return deleteDoc(doc(this.firestore, 'clients', id));
  }

  private listenToCollection<T>(collectionName: string): Observable<T[]> {
    const cachedStream = this.collectionStreams.get(collectionName);
    if (cachedStream) return cachedStream as Observable<T[]>;

    const collectionStream = isPlatformBrowser(this.platformId)
      ? collectionData(collection(this.firestore, collectionName), { idField: 'id' }).pipe(
        startWith([]),
        catchError(() => of([]))
      )
      : of([]);
    const sharedStream = collectionStream.pipe(shareReplay({ bufferSize: 1, refCount: true })) as Observable<T[]>;
    this.collectionStreams.set(collectionName, sharedStream as Observable<unknown[]>);
    return sharedStream;
  }
}
