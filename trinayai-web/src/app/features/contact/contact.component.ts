import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SiteContentService } from '../../core/services/site-content.service';
import { SiteSettings, Director } from '../../core/models/site-content';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, InputTextareaModule, ButtonModule, CardModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  private contentService = inject(SiteContentService);

  settings$: Observable<SiteSettings> = this.contentService.getSettings();
  directors$: Observable<Director[]> = this.contentService.getDirectors().pipe(
    map(items => items.filter(d => d.isVisible !== false))
  );
}
