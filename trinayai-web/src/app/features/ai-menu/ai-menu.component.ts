import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteContentService } from '../../core/services/site-content.service';
import { ContentItem } from '../../core/models/site-content';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ai-menu',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="ai-page min-h-[calc(100vh-20rem)] bg-slate-50 px-1 py-1 relative overflow-x-clip sm:px-2 sm:py-2 lg:px-2">
      <!-- Background Accents -->
      <div class="absolute top-[10%] left-[20%] h-[300px] w-[300px] bg-blue-100/70 blur-[100px] rounded-full"></div>
      <div class="absolute bottom-[20%] right-[10%] h-[300px] w-[300px] bg-cyan-100/70 blur-[100px] rounded-full"></div>

      <div class="mx-auto max-w-7xl relative z-10">
        <div class="mb-3">
          <div>
            <p class="text-xs font-black uppercase tracking-[0.2em] text-orange-600">AI / global tools</p>
            <h2 class="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Specialist AI, ready to deploy.</h2>
          </div>
        </div>

        <div class="street-scene">
          <div class="street-sky"></div>
          <div class="street-building street-building-left"></div>
          <div class="street-building street-building-right"></div>
          <div class="street-road">
            <span class="road-line road-line-one"></span>
            <span class="road-line road-line-two"></span>
          </div>
          <div class="street-banners">
          <ng-container *ngFor="let item of items; let i = index">
              <article class="street-banner group" [ngClass]="'street-banner-' + (i % 5)">
                <span class="banner-rope"></span>
                <div class="banner-topline">
                  <span>{{ i === 0 ? 'FLAGSHIP' : 'READY TO DEPLOY' }}</span>
                </div>

                <div class="relative flex h-full flex-col justify-between p-5 sm:p-6">
                <div>
                  <p class="banner-kicker">TRINAY AI / {{ i + 1 | number:'2.0' }}</p>
                  <h3 [class]="i === 0 ? 'text-3xl font-black' : 'text-xl font-bold'" class="text-slate-950 mb-3 tracking-tight">{{ item.title }}</h3>
                  <p class="ai-card-copy text-slate-600 font-medium">{{ item.description }}</p>
                  <p class="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-700/70">Enterprise-ready workflow</p>
                </div>

                <ng-container *ngIf="i !== 0">
                  <p-button label="Subscribe & launch"
                            (onClick)="openWorkspace(item)"
                            styleClass="mt-6 w-full p-button-sm bg-white/70 border border-current text-slate-800 hover:bg-slate-950 hover:border-slate-950 hover:text-white transition-all font-bold uppercase tracking-widest"></p-button>
                </ng-container>

                <ng-container *ngIf="i === 0">
                  <div class="mt-8">
                     <p-button label="Subscribe & launch"
                               (onClick)="openWorkspace(item)"
                               styleClass="bg-slate-950 border-none px-8 py-4 font-black uppercase tracking-widest text-white shadow-lg hover:bg-slate-800 transition-colors"></p-button>
                  </div>
                </ng-container>
                </div>
                <span class="banner-tail"></span>
              </article>
          </ng-container>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      ::ng-deep {
        .street-scene {
          position: relative;
          min-height: 540px;
          overflow: hidden;
          border: 1px solid #f1c27d;
          border-radius: 28px;
          background: #f7d9aa;
          perspective: 1200px;
          box-shadow: 0 24px 60px rgba(120, 53, 15, 0.14);
        }

        .street-sky {
          position: absolute;
          inset: 0 0 40% 0;
          background: linear-gradient(135deg, #ffedd5 0%, #fef3c7 48%, #bae6fd 100%);
        }

        .street-sky::after {
          position: absolute;
          top: 22%;
          right: 14%;
          width: 7rem;
          height: 7rem;
          border-radius: 50%;
          background: #f59e0b;
          box-shadow: 0 0 0 1.2rem rgba(245, 158, 11, 0.1), 0 0 4rem rgba(245, 158, 11, 0.3);
          content: '';
        }

        .street-building {
          position: absolute;
          bottom: 28%;
          width: 26%;
          height: 33%;
          border: 4px solid rgba(124, 45, 18, 0.14);
          background: repeating-linear-gradient(90deg, rgba(255,255,255,0.22) 0 1.5rem, transparent 1.5rem 3rem), #fb923c;
        }

        .street-building-left {
          left: -5%;
          transform: skewY(5deg);
          background-color: #f97316;
        }

        .street-building-right {
          right: -5%;
          transform: skewY(-5deg);
          background-color: #ec4899;
        }

        .street-road {
          position: absolute;
          right: -15%;
          bottom: -30%;
          left: -15%;
          height: 64%;
          transform: perspective(800px) rotateX(58deg);
          transform-origin: center top;
          background: repeating-linear-gradient(90deg, #64748b 0 4rem, #475569 4rem 8rem);
          box-shadow: inset 0 1rem 0 rgba(255,255,255,0.25);
        }

        .road-line {
          position: absolute;
          top: 12%;
          width: 5rem;
          height: 0.45rem;
          border-radius: 999px;
          background: #fef3c7;
        }

        .road-line-one { left: 43%; }
        .road-line-two { top: 46%; left: 43%; width: 7rem; }

        .street-banners {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1.25rem;
          align-items: end;
          min-height: 540px;
          padding: 2.25rem 2.25rem 4.5rem;
          transform-style: preserve-3d;
        }

        .street-banner {
          position: relative;
          display: flex;
          min-height: 280px;
          flex-direction: column;
          border: 3px solid rgba(120, 53, 15, 0.25);
          border-radius: 8px 8px 18px 18px;
          box-shadow: 0 1rem 1.5rem rgba(67, 20, 7, 0.2), 0.5rem 0.5rem 0 rgba(255,255,255,0.28) inset;
          transform: rotateY(-8deg) rotateZ(-1deg) translateZ(20px);
          transition: transform 300ms ease, box-shadow 300ms ease;
        }

        .street-banner:nth-child(even) {
          transform: rotateY(8deg) rotateZ(1deg) translateZ(36px);
        }

        .street-banner:hover {
          z-index: 4;
          box-shadow: 0 1.5rem 2.5rem rgba(67, 20, 7, 0.3), 0.5rem 0.5rem 0 rgba(255,255,255,0.28) inset;
          transform: rotateY(-2deg) rotateZ(0) translateY(-0.75rem) translateZ(70px);
        }

        .street-banner:nth-child(even):hover {
          transform: rotateY(2deg) rotateZ(0) translateY(-0.75rem) translateZ(70px);
        }

        .street-banner-0 { background: #facc15; }
        .street-banner-1 { background: #fb7185; }
        .street-banner-2 { background: #2dd4bf; }
        .street-banner-3 { background: #a78bfa; }
        .street-banner-4 { background: #fb923c; }

        .banner-rope {
          position: absolute;
          top: -3rem;
          left: 50%;
          width: 2px;
          height: 3rem;
          background: #78350f;
          content: '';
        }

        .banner-topline {
          padding: 0.7rem 1rem;
          border-bottom: 2px solid rgba(120, 53, 15, 0.2);
          color: rgba(67, 20, 7, 0.75);
          font-size: 0.62rem;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-align: right;
        }

        .banner-kicker {
          margin-bottom: 0.8rem;
          color: rgba(67, 20, 7, 0.62);
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 0.15em;
        }

        .banner-tail {
          position: absolute;
          bottom: -1.2rem;
          left: 50%;
          width: 0;
          height: 0;
          border-right: 0.8rem solid transparent;
          border-left: 0.8rem solid transparent;
          border-top: 1.2rem solid currentColor;
          color: inherit;
          filter: brightness(0.88);
        }

        .ai-card-copy {
          display: -webkit-box;
          overflow: hidden;
          font-size: 0.95rem;
          line-height: 1.55;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 4;
        }

        @media screen and (max-width: 767px) {
          .street-scene {
            min-height: 0;
          }

          .street-building,
          .street-road,
          .street-sky::after {
            display: none;
          }

          .street-banners {
            grid-template-columns: 1fr;
            min-height: 0;
            padding: 2rem 0.75rem 1.5rem;
          }

          .street-banner,
          .street-banner:nth-child(even),
          .street-banner:hover,
          .street-banner:nth-child(even):hover {
            min-height: 210px;
            transform: none;
          }
        }
      }
    `
  ]
})
export class AiMenuComponent implements OnInit {
  private contentService = inject(SiteContentService);
  private router = inject(Router);
  private readonly defaultItems: ContentItem[] = [
    { title: 'Sentiment Analysis', description: 'Analyze customer feedback and social sentiment with reliable, actionable insights.' },
    { title: 'Document Summarizer', description: 'Turn long legal and financial documents into concise, useful summaries.' },
    { title: 'Chat Intelligence', description: 'Support customers and generate leads with focused conversational AI.' },
    { title: 'Translation Engine', description: 'Translate technical content across more than 100 languages with clarity.' },
    { title: 'Risk Assessment', description: 'Identify compliance risks early with predictive business analysis.' }
  ];
  items: ContentItem[] = this.defaultItems;

  openWorkspace(item: ContentItem): void {
    this.router.navigate(['/ai'], { queryParams: { model: item.title } });
  }

  ngOnInit(): void {
    this.contentService.getAiMenuItems().subscribe((items: ContentItem[]) => {
      if (items.length) this.items = items;
    });
  }

}
