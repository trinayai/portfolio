import { Component, OnInit, inject } from '@angular/core';
import { SiteContentService } from '../../core/services/site-content.service';
import { ContentItem, SiteSettings } from '../../core/models/site-content';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  private contentService = inject(SiteContentService);
  services: ContentItem[] = [];
  settings: SiteSettings = { brandName: '', logoUrl: '', footerText: '', menuItems: [] };

  ngOnInit(): void {
    this.contentService.getSettings().subscribe(settings => this.settings = { ...this.settings, ...settings });
    this.contentService.getServices().pipe(
      map(items => items.filter(i => i.isVisible !== false))
    ).subscribe((services: ContentItem[]) => {
      this.services = services.length ? services : [
        { title: 'AI Model Tuning', description: 'Fine-tuning foundational models for domain-specific accuracy and efficiency.', icon: 'pi pi-sliders-h' },
        { title: 'NLP Solutions', description: 'Advanced natural language processing for sentiment analysis, translation, and more.', icon: 'pi pi-comment' },
        { title: 'Data Analytics', description: 'Transforming raw data into actionable insights using predictive AI modeling.', icon: 'pi pi-chart-bar' },
        { title: 'Cloud Infrastructure', description: 'Scalable cloud architectures optimized for heavy AI workloads and fast inference.', icon: 'pi pi-cloud' }
      ];
    });
  }
}
