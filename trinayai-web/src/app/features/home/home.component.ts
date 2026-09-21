import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteContentService } from '../../core/services/site-content.service';
import { SectionItem, SiteSettings } from '../../core/models/site-content';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { map } from 'rxjs/operators';
import { ThreeUiComponent } from '../three-ui/three-ui.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, CardModule, ThreeUiComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private contentService = inject(SiteContentService);
  settings: SiteSettings = { brandName: 'TRINAY AI', logoUrl: '', footerText: '', menuItems: [] };
  homeSections: SectionItem[] = [];

  ngOnInit(): void {
    this.contentService.getSettings().subscribe(settings => this.settings = { ...this.settings, ...settings });
    this.contentService.getHomeSections().pipe(
      map(sections => sections.filter(s => s.isVisible !== false))
    ).subscribe(sections => {
      this.homeSections = sections.length ? sections : [
        { title: 'AI Model Tuning', description: 'Optimizing foundational models for specialized enterprise workflows.', icon: 'pi pi-sliders-h' },
        { title: 'Secure Compliance', description: 'Automated regulatory systems built for India\'s MSME sector.', icon: 'pi pi-shield' },
        { title: 'Digital Scale', description: 'Accelerating transformation through robust software engineering.', icon: 'pi pi-chart-line' }
      ];
    });
  }
}
