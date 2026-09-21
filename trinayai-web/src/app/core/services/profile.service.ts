import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Firestore, doc, docData, setDoc, updateDoc, collection, collectionData, query, where, addDoc } from '@angular/fire/firestore';
import { UserProfile, AuditLog } from '../models/site-content';
import { Observable, of } from 'rxjs';
import { switchMap, startWith, catchError, shareReplay } from 'rxjs/operators';
import { Auth, user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private platformId = inject(PLATFORM_ID);

  userProfile$: Observable<UserProfile | null> = isPlatformBrowser(this.platformId)
    ? user(this.auth).pipe(
        switchMap(u => {
          if (!u) return of(null);
          return docData(doc(this.firestore, 'users', u.uid)) as Observable<UserProfile>;
        }),
        startWith(null),
        catchError(() => of(null)),
        shareReplay(1)
      )
    : of(null);

  async createProfile(profile: UserProfile) {
    const userDoc = doc(this.firestore, 'users', profile.uid);
    await setDoc(userDoc, profile);
    await this.logAction(profile.uid, profile.email, 'SIGNUP', 'User registered and profile created');
  }

  async updateProfile(uid: string, data: Partial<UserProfile>) {
    const userDoc = doc(this.firestore, 'users', uid);
    await updateDoc(userDoc, data);
  }

  async logAction(userId: string, email: string, action: string, details: string) {
    const logsRef = collection(this.firestore, 'auditLogs');
    const log: AuditLog = {
      userId,
      email,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    await addDoc(logsRef, log);
  }

  getAuditLogs(): Observable<AuditLog[]> {
    return collectionData(collection(this.firestore, 'auditLogs')) as Observable<AuditLog[]>;
  }

  getAllUsers(): Observable<UserProfile[]> {
    return collectionData(collection(this.firestore, 'users')) as Observable<UserProfile[]>;
  }
}
