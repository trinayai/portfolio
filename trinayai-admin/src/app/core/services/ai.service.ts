import { inject, Injectable } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Observable, from, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private functions = inject(Functions);

  constructor() {}

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
