import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Firestore, doc, docData, collection, collectionData, query, addDoc } from '@angular/fire/firestore';
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

  userProfile$ = isPlatformBrowser(this.platformId)
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

  getAllUsers(): Observable<UserProfile[]> {
    if (!isPlatformBrowser(this.platformId)) return of([]);
    return collectionData(collection(this.firestore, 'users'), { idField: 'uid' }) as Observable<UserProfile[]>;
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
    if (!isPlatformBrowser(this.platformId)) return of([]);
    return collectionData(collection(this.firestore, 'auditLogs')) as Observable<AuditLog[]>;
  }
}
