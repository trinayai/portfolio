import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SiteContentService } from '../../core/services/site-content.service';
import { SiteSettings, Director } from '../../core/models/site-content';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, InputTextareaModule, ButtonModule, CardModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  private contentService = inject(SiteContentService);
  settings: SiteSettings = { brandName: '', logoUrl: '', footerText: '', menuItems: [] };
  directors: Director[] = [];

  ngOnInit(): void {
    this.contentService.getSettings().subscribe(settings => this.settings = { ...this.settings, ...settings });
    this.contentService.getDirectors().pipe(
      map(items => items.filter(d => d.isVisible !== false))
    ).subscribe(directors => this.directors = directors);
  }
}
