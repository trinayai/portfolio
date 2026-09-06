import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  Firestore,
  collectionData,
  docData,
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from '@angular/fire/storage';
import { AboutCard, ClientItem, ContentItem, SectionItem, SiteSettings } from '../models/site-content';

@Injectable({ providedIn: 'root' })
export class SiteContentService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);

  constructor() {}

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
    if (!this.firestore) return of({} as SiteSettings);
    return docData(doc(this.firestore, 'siteSettings', 'main'), { idField: 'id' }) as Observable<SiteSettings>;
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
    try {
      return collectionData(collection(this.firestore, collectionName), { idField: 'id' }) as Observable<T[]>;
    } catch (e) {
      console.error('Firestore access error:', e);
      return of([]);
    }
  }
}
