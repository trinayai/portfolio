import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Firestore, doc, docData, setDoc, updateDoc, collection, collectionData, addDoc, getDoc } from '@angular/fire/firestore';
import { UserProfile, UserSubscription } from '../models/site-content';
import { Observable, of } from 'rxjs';
import { switchMap, startWith, catchError, shareReplay, map, tap } from 'rxjs/operators';
import { Auth, user } from '@angular/fire/auth';

function formatDisplayName(email?: string | null, name?: string | null): string {
  if (name && name.trim() && name.trim() !== 'Member') return name.trim();
  if (email && email.includes('@')) {
    const prefix = email.split('@')[0];
    return prefix.charAt(0).toUpperCase() + prefix.slice(1);
  }
  return 'Member';
}

function getInitialProfile(auth: Auth): UserProfile | null | undefined {
  if (typeof window === 'undefined') return undefined;

  // Try loading from localStorage first for instant 0ms render
  try {
    const cached = localStorage.getItem('trinay_cached_profile');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.uid) return parsed;
    }
  } catch (e) {}

  // Fallback to synchronous Auth currentUser
  const u = auth.currentUser;
  if (u) {
    return {
      uid: u.uid,
      email: u.email || '',
      displayName: formatDisplayName(u.email, u.displayName),
      createdAt: new Date().toISOString(),
      subscriptions: [],
      paymentHistory: []
    };
  }

  return undefined;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private platformId = inject(PLATFORM_ID);

  /**
   * userProfile$ states:
   * undefined: Initial state/still checking auth
   * null: Confirmed logged out
   * UserProfile: Confirmed logged in and profile loaded
   */
  userProfile$: Observable<UserProfile | null | undefined> = isPlatformBrowser(this.platformId)
    ? user(this.auth).pipe(
        tap(u => console.log(`[ProfileService] Auth change: ${u ? u.email : 'Logged Out'}`)),
        switchMap(u => {
          if (u === undefined) {
            const initial = getInitialProfile(this.auth);
            return of(initial);
          }
          if (!u) {
            try { localStorage.removeItem('trinay_cached_profile'); } catch (e) {}
            return of(null);
          }

          const userDocRef = doc(this.firestore, 'users', u.uid);
          return (docData(userDocRef, { idField: 'uid' }) as Observable<UserProfile | undefined>).pipe(
            map(profile => {
              let res: UserProfile;
              if (profile) {
                if (!profile.displayName || profile.displayName === 'Member') {
                  profile.displayName = formatDisplayName(profile.email || u.email, profile.displayName || u.displayName);
                }
                res = profile;
              } else {
                console.warn(`[ProfileService] Profile missing for ${u.email}. Initializing...`);
                const derivedName = formatDisplayName(u.email, u.displayName);
                res = {
                  uid: u.uid,
                  email: u.email || '',
                  displayName: derivedName,
                  createdAt: new Date().toISOString(),
                  subscriptions: [],
                  paymentHistory: []
                };

                setDoc(userDocRef, res, { merge: true })
                  .then(() => this.logAction(u.uid, u.email || '', 'INITIALIZE', 'System auto-initialized profile'))
                  .catch(err => console.error('[ProfileService] Auto-init failed:', err));
              }

              // Cache in localStorage for 0ms loads on next page navigation
              try { localStorage.setItem('trinay_cached_profile', JSON.stringify(res)); } catch (e) {}
              return res;
            }),
            catchError(err => {
              console.error('[ProfileService] Firestore fetch error:', err);
              const fallback: UserProfile = {
                uid: u.uid,
                email: u.email || '',
                displayName: formatDisplayName(u.email, u.displayName),
                createdAt: new Date().toISOString(),
                subscriptions: [],
                paymentHistory: []
              };
              return of(fallback);
            })
          );
        }),
        startWith(getInitialProfile(this.auth)),
        shareReplay(1)
      )
    : of(null);

  async createProfile(profile: UserProfile) {
    const userDoc = doc(this.firestore, 'users', profile.uid);
    const cleanProfile = {
      ...profile,
      displayName: formatDisplayName(profile.email, profile.displayName)
    };
    await setDoc(userDoc, cleanProfile, { merge: true });
    try { localStorage.setItem('trinay_cached_profile', JSON.stringify(cleanProfile)); } catch (e) {}
  }

  async updateProfile(uid: string, data: Partial<UserProfile>) {
    const userDoc = doc(this.firestore, 'users', uid);
    await updateDoc(userDoc, data);
    const updated = { ...getInitialProfile(this.auth), ...data };
    try { localStorage.setItem('trinay_cached_profile', JSON.stringify(updated)); } catch (e) {}
  }

  async addSubscription(uid: string, sub: UserSubscription, amount: string, serviceName: string, planName?: string) {
    const userDocRef = doc(this.firestore, 'users', uid);
    const snap = await getDoc(userDocRef);

    let currentData: UserProfile;
    if (!snap.exists()) {
      const currentUser = this.auth.currentUser;
      currentData = {
        uid,
        email: currentUser?.email || '',
        displayName: formatDisplayName(currentUser?.email, currentUser?.displayName),
        createdAt: new Date().toISOString(),
        subscriptions: [],
        paymentHistory: []
      };
      await setDoc(userDocRef, currentData, { merge: true });
    } else {
      currentData = snap.data() as UserProfile;
    }

    const subscriptions = [...(currentData.subscriptions || [])];

    // Replace if existing serviceId, otherwise add
    const existingIdx = subscriptions.findIndex(s => s.serviceId === sub.serviceId);
    if (existingIdx > -1) {
      subscriptions[existingIdx] = sub;
    } else {
      subscriptions.push(sub);
    }

    const paymentHistory = [...(currentData.paymentHistory || [])];
    paymentHistory.push({
      id: 'pay_' + Date.now(),
      amount,
      date: new Date().toISOString(),
      serviceName,
      status: 'success'
    });

    const updatedProfile = {
      ...currentData,
      subscriptions,
      paymentHistory
    };

    await updateDoc(userDocRef, {
      subscriptions,
      paymentHistory
    });

    try { localStorage.setItem('trinay_cached_profile', JSON.stringify(updatedProfile)); } catch (e) {}

    // Also sync to subscribers collection for Admin Revenue Dashboard
    const subscriberDocRef = doc(this.firestore, 'subscribers', `${uid}_${sub.serviceId}`);
    const displayPlan = planName ? `${serviceName} (${planName})` : `${serviceName} (${sub.planId})`;
    await setDoc(subscriberDocRef, {
      id: `${uid}_${sub.serviceId}`,
      userId: uid,
      email: currentData.email,
      status: 'active',
      plan: displayPlan,
      joinDate: new Date().toISOString()
    }, { merge: true });

    await this.logAction(uid, currentData.email, 'SUBSCRIPTION_ADD', `Subscribed to ${displayPlan}`);
  }

  async cancelSubscription(uid: string, serviceId: string) {
    const userDocRef = doc(this.firestore, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) return;

    const currentData = snap.data() as UserProfile;
    const subscriptions = (currentData.subscriptions || []).map(s => {
      if (s.serviceId === serviceId) {
        return { ...s, status: 'cancelled_pending' as const };
      }
      return s;
    });

    const updatedProfile = { ...currentData, subscriptions };
    await updateDoc(userDocRef, { subscriptions });
    try { localStorage.setItem('trinay_cached_profile', JSON.stringify(updatedProfile)); } catch (e) {}

    // Update subscribers collection status
    const subscriberDocRef = doc(this.firestore, 'subscribers', `${uid}_${serviceId}`);
    await setDoc(subscriberDocRef, { status: 'cancelled_pending' }, { merge: true });

    await this.logAction(uid, currentData.email, 'SUBSCRIPTION_CANCEL', `Requested cancellation for ${serviceId}`);
  }

  async logAction(userId: string, email: string, action: string, details: string) {
    try {
      const logsRef = collection(this.firestore, 'auditLogs');
      await addDoc(logsRef, {
        userId,
        email,
        action,
        details,
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      console.error('[ProfileService] Failed to log action:', e);
    }
  }

  getAllUsers(): Observable<UserProfile[]> {
    return collectionData(collection(this.firestore, 'users'), { idField: 'uid' }) as Observable<UserProfile[]>;
  }
}
