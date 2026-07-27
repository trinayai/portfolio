import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Observable, from, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private functions: Functions | null = null;
  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        this.functions = inject(Functions);
      } catch (e) {
        console.warn('Firebase Functions not available yet:', e);
      }
    }
  }

  chat(query: string, history: any[] = []): Observable<any> {
    if (!this.functions) return of({ text: '' });
    try {
      const chatbot = httpsCallable(this.functions, 'chatbot');
      return from(chatbot({ query, history }));
    } catch (e) {
      console.error('AI chat error:', e);
      return of({ text: '' });
    }
  }
}
