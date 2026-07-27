import { inject, Injectable, PLATFORM_ID, Optional } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, from, of } from 'rxjs';
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
  getFirestore
} from '@angular/fire/firestore';
import { AboutCard, ClientItem, ContentItem, SectionItem, SiteSettings } from '../models/site-content';

@Injectable({ providedIn: 'root' })
export class SiteContentService {
  private firestore: Firestore | null = null;
  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        this.firestore = inject(Firestore);
      } catch (e) {
        console.warn('Firestore not available yet:', e);
      }
    }
  }

  getSettings(): Observable<SiteSettings> {
    if (!this.firestore) return of({} as SiteSettings);
    return docData(doc(this.firestore, 'siteSettings', 'main'), { idField: 'id' }) as Observable<SiteSettings>;
  }

  async saveSettings(settings: SiteSettings) {
    if (!this.firestore) return;
    const settingsDoc = doc(this.firestore, 'siteSettings', 'main');
    return setDoc(settingsDoc, { ...settings, id: 'main' }, { merge: true });
  }

  getHomeSections(): Observable<SectionItem[]> {
    return this.listenToCollection('homeSections');
  }

  addHomeSection(payload: Omit<SectionItem, 'id'>) {
    if (!this.firestore) return from(Promise.resolve());
    return from(addDoc(collection(this.firestore, 'homeSections'), payload));
  }

  updateHomeSection(id: string, payload: Partial<SectionItem>) {
    if (!this.firestore) return from(Promise.resolve());
    return from(updateDoc(doc(this.firestore, 'homeSections', id), payload));
  }

  deleteHomeSection(id: string) {
    if (!this.firestore) return from(Promise.resolve());
    return from(deleteDoc(doc(this.firestore, 'homeSections', id)));
  }

  getAboutCards(): Observable<AboutCard[]> {
    return this.listenToCollection('aboutCards');
  }

  addAboutCard(payload: Omit<AboutCard, 'id'>) {
    if (!this.firestore) return from(Promise.resolve());
    return from(addDoc(collection(this.firestore, 'aboutCards'), payload));
  }

  updateAboutCard(id: string, payload: Partial<AboutCard>) {
    if (!this.firestore) return from(Promise.resolve());
    return from(updateDoc(doc(this.firestore, 'aboutCards', id), payload));
  }

  deleteAboutCard(id: string) {
    if (!this.firestore) return from(Promise.resolve());
    return from(deleteDoc(doc(this.firestore, 'aboutCards', id)));
  }

  getServices(): Observable<ContentItem[]> {
    return this.listenToCollection('services');
  }

  addService(payload: Omit<ContentItem, 'id'>) {
    if (!this.firestore) return from(Promise.resolve());
    return from(addDoc(collection(this.firestore, 'services'), payload));
  }

  updateService(id: string, payload: Partial<ContentItem>) {
    if (!this.firestore) return from(Promise.resolve());
    return from(updateDoc(doc(this.firestore, 'services', id), payload));
  }

  deleteService(id: string) {
    if (!this.firestore) return from(Promise.resolve());
    return from(deleteDoc(doc(this.firestore, 'services', id)));
  }

  getAiMenuItems(): Observable<ContentItem[]> {
    return this.listenToCollection('aiMenuItems');
  }

  addAiMenuItem(payload: Omit<ContentItem, 'id'>) {
    if (!this.firestore) return from(Promise.resolve());
    return from(addDoc(collection(this.firestore, 'aiMenuItems'), payload));
  }

  updateAiMenuItem(id: string, payload: Partial<ContentItem>) {
    if (!this.firestore) return from(Promise.resolve());
    return from(updateDoc(doc(this.firestore, 'aiMenuItems', id), payload));
  }

  deleteAiMenuItem(id: string) {
    if (!this.firestore) return from(Promise.resolve());
    return from(deleteDoc(doc(this.firestore, 'aiMenuItems', id)));
  }

  getClients(): Observable<ClientItem[]> {
    return this.listenToCollection('clients');
  }

  addClient(payload: Omit<ClientItem, 'id'>) {
    if (!this.firestore) return from(Promise.resolve());
    return from(addDoc(collection(this.firestore, 'clients'), payload));
  }

  updateClient(id: string, payload: Partial<ClientItem>) {
    if (!this.firestore) return from(Promise.resolve());
    return from(updateDoc(doc(this.firestore, 'clients', id), payload));
  }

  deleteClient(id: string) {
    if (!this.firestore) return from(Promise.resolve());
    return from(deleteDoc(doc(this.firestore, 'clients', id)));
  }

  private listenToCollection<T>(collectionName: string): Observable<T[]> {
    if (!this.firestore) return of([]);
    try {
      return collectionData(collection(this.firestore, collectionName), { idField: 'id' }) as Observable<T[]>;
    } catch (e) {
      console.error('Firestore access error:', e);
      return of([]);
    }
  }
}
