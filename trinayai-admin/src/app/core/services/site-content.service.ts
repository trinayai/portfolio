import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, setDoc, docData, query } from '@angular/fire/firestore';
import { Storage, deleteObject, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { AboutCard, AboutEvent, ClientItem, ContentItem, SectionItem, SiteSettings, Director } from '../models/site-content';

@Injectable({ providedIn: 'root' })
export class SiteContentService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private platformId = inject(PLATFORM_ID);

  private settings$?: Observable<SiteSettings>;
  private streams = new Map<string, Observable<any[]>>();

  private readonly defaultSettings: SiteSettings = {
    brandName: 'TRINAY AI',
    logoUrl: 'assets/logo/Trinay-AI-Logo.png',
    footerText: '© 2026 Trinayai Technologies Private Limited. All rights reserved. SF No. 224/8F8, Attur main road, Kumbakottai, Namagiripettai, Rasipuram, Namakkal, Tamil Nadu – 637406.',
    contactEmail: 'info@trinayai.com',
    contactAddress: 'SF No. 224/8F8, Attur main road, Kumbakottai,\nNamagiripettai, Rasipuram, Namakkal,\nTamil Nadu – 637406',
    contactTitle: 'Get in touch with us.',
    contactDescription: 'Our team is dedicated to helping MSMEs navigate and conquer the digital landscape.',
    menuItems: [
      { label: 'Home', route: '/', order: 0, isVisible: true },
      { label: 'Subscription', route: '/ai-menu', order: 1, isVisible: true },
      { label: 'About', route: '/about', order: 2, isVisible: true },
      { label: 'Services', route: '/services', order: 3, isVisible: true },
      { label: 'Clients', route: '/clients', order: 4, isVisible: true },
      { label: 'Contact', route: '/contact', order: 5, isVisible: true }
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

    if (!isPlatformBrowser(this.platformId)) {
      return of(this.defaultSettings);
    }

    const docRef = doc(this.firestore, 'siteSettings', 'main');
    this.settings$ = (docData(docRef, { idField: 'id' }) as Observable<Partial<SiteSettings> | undefined>).pipe(
      map(settings => {
        if (!settings || !Object.keys(settings).length) {
          setDoc(docRef, { ...this.defaultSettings, id: 'main' }, { merge: true }).catch(() => {});
          return this.defaultSettings;
        }
        return {
          ...this.defaultSettings,
          ...settings,
          menuItems: settings?.menuItems?.length ? settings.menuItems : this.defaultSettings.menuItems
        } as SiteSettings;
      }),
      catchError(err => {
        console.error('[SiteContent] Error fetching siteSettings:', err);
        return of(this.defaultSettings);
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    return this.settings$;
  }

  refreshSettings() {
    this.settings$ = undefined;
  }

  async saveSettings(settings: SiteSettings) {
    const res = await setDoc(doc(this.firestore, 'siteSettings', 'main'), { ...settings, id: 'main' }, { merge: true });
    this.refreshSettings();
    return res;
  }

  getHomeSections(): Observable<SectionItem[]> { return this.getCachedCollection<SectionItem>('homeSections'); }
  getAboutCards(): Observable<AboutCard[]> { return this.getCachedCollection<AboutCard>('aboutCards'); }
  getAboutEvents(): Observable<AboutEvent[]> { return this.getCachedCollection<AboutEvent>('aboutEvents'); }
  getServices(): Observable<ContentItem[]> { return this.getCachedCollection<ContentItem>('services'); }
  getAiMenuItems(): Observable<ContentItem[]> { return this.getCachedCollection<ContentItem>('aiMenuItems'); }
  getDirectors(): Observable<Director[]> { return this.getCachedCollection<Director>('directors'); }
  getClients(): Observable<ClientItem[]> { return this.getCachedCollection<ClientItem>('clients'); }

  private getCachedCollection<T>(collectionName: string): Observable<T[]> {
    if (!isPlatformBrowser(this.platformId)) {
      return of([]);
    }

    if (this.streams.has(collectionName)) {
      return this.streams.get(collectionName)!;
    }

    const stream = collectionData(
      query(collection(this.firestore, collectionName)),
      { idField: 'id' }
    ).pipe(
      tap(data => console.log(`[SiteContent] Fetched ${data.length} items from ${collectionName}`)),
      catchError(err => {
        console.error(`Error loading ${collectionName}:`, err);
        return of([]);
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    ) as Observable<T[]>;

    this.streams.set(collectionName, stream);
    return stream;
  }

  refreshCollection(name: string) {
    this.streams.delete(name);
  }

  async addHomeSection(payload: Omit<SectionItem, 'id'>) { return addDoc(collection(this.firestore, 'homeSections'), payload); }
  async updateHomeSection(id: string, payload: Partial<SectionItem>) { return setDoc(doc(this.firestore, 'homeSections', id), payload, { merge: true }); }
  async deleteHomeSection(id: string) { return deleteDoc(doc(this.firestore, 'homeSections', id)); }
  async addAboutCard(payload: Omit<AboutCard, 'id'>) { return addDoc(collection(this.firestore, 'aboutCards'), payload); }
  async updateAboutCard(id: string, payload: Partial<AboutCard>) { return setDoc(doc(this.firestore, 'aboutCards', id), payload, { merge: true }); }
  async deleteAboutCard(id: string) { return deleteDoc(doc(this.firestore, 'aboutCards', id)); }
  async addAboutEvent(payload: Omit<AboutEvent, 'id'>) { return addDoc(collection(this.firestore, 'aboutEvents'), payload); }
  async updateAboutEvent(id: string, payload: Partial<AboutEvent>) { return setDoc(doc(this.firestore, 'aboutEvents', id), payload, { merge: true }); }
  async deleteAboutEvent(id: string) { return deleteDoc(doc(this.firestore, 'aboutEvents', id)); }
  async addService(payload: Omit<ContentItem, 'id'>) { return addDoc(collection(this.firestore, 'services'), payload); }
  async updateService(id: string, payload: Partial<ContentItem>) { return setDoc(doc(this.firestore, 'services', id), payload, { merge: true }); }
  async deleteService(id: string) { return deleteDoc(doc(this.firestore, 'services', id)); }
  async addAiMenuItem(payload: Omit<ContentItem, 'id'>) { return addDoc(collection(this.firestore, 'aiMenuItems'), payload); }
  async updateAiMenuItem(id: string, payload: Partial<ContentItem>) { return setDoc(doc(this.firestore, 'aiMenuItems', id), payload, { merge: true }); }
  async deleteAiMenuItem(id: string) { return deleteDoc(doc(this.firestore, 'aiMenuItems', id)); }
  async addDirector(payload: Omit<Director, 'id'>) { return addDoc(collection(this.firestore, 'directors'), payload); }
  async updateDirector(id: string, payload: Partial<Director>) { return setDoc(doc(this.firestore, 'directors', id), payload, { merge: true }); }
  async deleteDirector(id: string) { return deleteDoc(doc(this.firestore, 'directors', id)); }
  async addClient(payload: Omit<ClientItem, 'id'>) { return addDoc(collection(this.firestore, 'clients'), payload); }
  async updateClient(id: string, payload: Partial<ClientItem>) { return setDoc(doc(this.firestore, 'clients', id), payload, { merge: true }); }
  async deleteClient(id: string) { return deleteDoc(doc(this.firestore, 'clients', id)); }
}
