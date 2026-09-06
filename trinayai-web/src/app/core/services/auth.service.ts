import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any | null> = of(null);

  login(email: string, password: string) {
    return of(null);
  }

  logout() {
    return of(null);
  }
}
