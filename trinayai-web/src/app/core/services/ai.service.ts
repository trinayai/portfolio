import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Observable, from, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private functions = inject(Functions);
  private platformId = inject(PLATFORM_ID);

  chat(query: string, history: any[] = []): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) return of({ text: '' });
    const chatbot = httpsCallable(this.functions, 'chatbot');
    return from(chatbot({ query, history }));
  }
}
