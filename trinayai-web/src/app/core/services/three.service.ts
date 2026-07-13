import { Injectable, ElementRef, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThreeService implements OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private animationId?: number;

  constructor() {}

  init(container: HTMLElement): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const gradient = document.createElement('div');
    gradient.className = 'absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_18%),radial-gradient(circle_at_80%_20%,_rgba(168,85,247,0.16),_transparent_17%),linear-gradient(135deg,#040b1a_0%,#08112a_45%,#101c39_100%)]';
    container.appendChild(gradient);

    const orb = document.createElement('div');
    orb.className = 'absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl';
    container.appendChild(orb);

    this.animate(orb);
  }

  private animate(orb: HTMLElement): void {
    this.animationId = requestAnimationFrame(() => this.animate(orb));
    const time = performance.now() * 0.0003;
    orb.style.transform = `translate(-50%, -50%) translate(${Math.sin(time) * 20}px, ${Math.cos(time) * 20}px)`;
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
