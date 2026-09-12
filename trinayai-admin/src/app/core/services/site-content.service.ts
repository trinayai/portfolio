import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay, startWith } from 'rxjs/operators';
import {
  Firestore,
  collectionData,
  docData,
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from '@angular/fire/storage';
import { AboutCard, AboutEvent, ClientItem, ContentItem, SectionItem, SiteSettings } from '../models/site-content';

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
    footerText: '© 2026 Trinayai Technologies Private Limited. All rights reserved. SF No. 224/8F8, Attur main road, Kumbakottai, Namagiripettai, Rasipuram, Namakkal, Tamil Nadu – 637406.',
    contactEmail: 'info@trinayai.com',
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
    const storageRef = ref(this.storage, path);
    const result = await uploadBytes(storageRef, file);
    return getDownloadURL(result.ref);
  }

  async deleteFile(url: string): Promise<void> {
    const storageRef = ref(this.storage, url);
    return deleteObject(storageRef);
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
    const settingsDoc = doc(this.firestore, 'siteSettings', 'main');
    return setDoc(settingsDoc, { ...settings, id: 'main' }, { merge: true });
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

  getAboutEvents(): Observable<AboutEvent[]> {
    return this.listenToCollection<AboutEvent>('aboutEvents');
  }

  async addAboutEvent(payload: Omit<AboutEvent, 'id'>) {
    return addDoc(collection(this.firestore, 'aboutEvents'), payload);
  }

  async updateAboutEvent(id: string, payload: Partial<AboutEvent>) {
    return updateDoc(doc(this.firestore, 'aboutEvents', id), payload);
  }

  async deleteAboutEvent(id: string) {
    return deleteDoc(doc(this.firestore, 'aboutEvents', id));
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
    return collectionData(
      query(collection(this.firestore, collectionName)),
      { idField: 'id' }
    ).pipe(
      startWith([]),
      catchError(() => of([])),
      shareReplay({ bufferSize: 1, refCount: true })
    ) as Observable<T[]>;
  }
}
