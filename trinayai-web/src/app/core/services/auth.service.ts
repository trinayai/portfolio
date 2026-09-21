import { Injectable, inject } from '@angular/core';
import { Auth, user, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, sendPasswordResetEmail } from '@angular/fire/auth';
import { from, Observable, of } from 'rxjs';
import { ProfileService } from './profile.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private profileService = inject(ProfileService);

  user$: Observable<User | null> = user(this.auth);

  async register(email: string, pass: string, profileData: any) {
    const cred = await createUserWithEmailAndPassword(this.auth, email, pass);
    if (cred.user) {
      await this.profileService.createProfile({
        uid: cred.user.uid,
        email: email,
        createdAt: new Date().toISOString(),
        subscriptions: [],
        ...profileData
      });
    }
    return cred;
  }

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout() {
    return from(signOut(this.auth));
  }

  resetPassword(email: string) {
    return from(sendPasswordResetEmail(this.auth, email));
  }
}
