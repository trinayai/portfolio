import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private functions = inject(Functions);

  chat(query: string, history: any[] = []): Observable<any> {
    const chatbot = httpsCallable(this.functions, 'chatbot');
    return from(chatbot({ query, history }));
  }
}
