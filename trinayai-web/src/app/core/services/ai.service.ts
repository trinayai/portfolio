import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  constructor() {}

  chat(query: string, history: any[] = []): Observable<any> {
    return of({ text: '' });
  }
}
