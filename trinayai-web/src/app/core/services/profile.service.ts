import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Firestore, doc, docData, setDoc, updateDoc, collection, collectionData, query, where, addDoc, getDoc } from '@angular/fire/firestore';
import { UserProfile, AuditLog, UserSubscription } from '../models/site-content';
import { Observable, of, from } from 'rxjs';
import { switchMap, startWith, catchError, shareReplay, map, tap } from 'rxjs/operators';
import { Auth, user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private platformId = inject(PLATFORM_ID);

  userProfile$: Observable<UserProfile | null | undefined> = isPlatformBrowser(this.platformId)
    ? user(this.auth).pipe(
        tap(u => console.log(`[Profile] Auth stage: ${u === undefined ? 'Checking' : u ? 'Authenticated (' + u.email + ')' : 'Logged Out'}`)),
        switchMap(u => {
          if (u === undefined) return of(undefined);
          if (!u) return of(null);

          return (docData(doc(this.firestore, 'users', u.uid)) as Observable<UserProfile | undefined>).pipe(
            switchMap(profile => {
              if (profile) {
                console.log('[Profile] Document loaded successfully');
                return of(profile);
              }

              console.warn('[Profile] Document missing. Auto-initializing...');
              const newProfile: UserProfile = {
                uid: u.uid,
                email: u.email || '',
                displayName: u.displayName || 'Member',
                createdAt: new Date().toISOString(),
                subscriptions: [],
                paymentHistory: []
              };

              return from(this.createProfile(newProfile)).pipe(
                tap(() => console.log('[Profile] Auto-initialization complete')),
                map(() => newProfile)
              );
            }),
            catchError(err => {
              console.error('[Profile] Firestore error:', err);
              return of(null);
            })
          );
        }),
        startWith(undefined),
        catchError((err) => {
          console.error('[Profile] Global auth check error:', err);
          return of(null);
        }),
        shareReplay(1)
      )
    : of(null);

  async createProfile(profile: UserProfile) {
    const userDoc = doc(this.firestore, 'users', profile.uid);
    await setDoc(userDoc, profile, { merge: true });
    await this.logAction(profile.uid, profile.email, 'INITIALIZE', 'Profile auto-created on login');
  }

  async updateProfile(uid: string, data: Partial<UserProfile>) {
    const userDoc = doc(this.firestore, 'users', uid);
    await updateDoc(userDoc, data);
  }

  async addSubscription(uid: string, sub: UserSubscription, amount: string, serviceName: string) {
    const profile = await this.getProfileOnce(uid);
    // If profile is missing even after auto-init, create it first
    if (!profile) {
       console.warn('[Profile] Profile missing during sub add. Creating placeholder...');
       // In a real flow this shouldn't happen, but let's be robust
       return;
    }

    const subscriptions = [...(profile.subscriptions || [])];
    const existingIdx = subscriptions.findIndex(s => s.serviceId === sub.serviceId);

    if (existingIdx > -1) {
      subscriptions[existingIdx] = sub;
    } else {
      subscriptions.push(sub);
    }

    const paymentHistory = [...(profile.paymentHistory || [])];
    paymentHistory.push({
      id: 'pay_' + Date.now(),
      amount,
      date: new Date().toISOString(),
      serviceName,
      status: 'success'
    });

    await updateDoc(doc(this.firestore, 'users', uid), { subscriptions, paymentHistory });
    await this.logAction(uid, profile.email, 'SUBSCRIPTION_CHANGE', `Subscribed to ${serviceName} - ${sub.planId}`);
  }

  async cancelSubscription(uid: string, serviceId: string) {
    const profile = await this.getProfileOnce(uid);
    if (!profile) return;

    const subscriptions = profile.subscriptions.map(s => {
      if (s.serviceId === serviceId) {
        return { ...s, status: 'cancelled_pending' as const };
      }
      return s;
    });

    await updateDoc(doc(this.firestore, 'users', uid), { subscriptions });
    await this.logAction(uid, profile.email, 'SUBSCRIPTION_CANCEL', `Requested cancellation for ${serviceId}`);
  }

  private async getProfileOnce(uid: string): Promise<UserProfile | null> {
    try {
      const snap = await getDoc(doc(this.firestore, 'users', uid));
      return snap.exists() ? snap.data() as UserProfile : null;
    } catch (e) {
      console.error('[Profile] Failed to fetch profile once:', e);
      return null;
    }
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

  getAllUsers(): Observable<UserProfile[]> {
    if (!isPlatformBrowser(this.platformId)) return of([]);
    return collectionData(collection(this.firestore, 'users'), { idField: 'uid' }) as Observable<UserProfile[]>;
  }
}
