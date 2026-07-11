import { Component, AfterViewInit, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreeService } from '../../core/services/three.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative h-screen w-full overflow-hidden bg-primary flex items-center justify-center">
      <div class="z-10 text-center">
        <h1 class="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-futuristic-blue to-futuristic-purple">
          TRINAY AI
        </h1>
        <p class="mt-4 text-xl text-gray-400">Revolutionizing AI for Global Needs</p>
        <button class="mt-8 px-8 py-3 bg-accent text-primary font-bold rounded-full hover:shadow-[0_0_30px_#00d2ff] transition-all transform hover:scale-105">
          Explore AI Menu
        </button>
      </div>
      <div #threeCanvas class="absolute inset-0 z-0"></div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('threeCanvas') threeCanvas!: ElementRef;
  private threeService = inject(ThreeService);

  ngAfterViewInit(): void {
    this.threeService.init(this.threeCanvas.nativeElement);
  }
}
