import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { ThreeService } from '../../core/services/three.service';

@Component({
  selector: 'app-three-ui',
  standalone: true,
  template: `<div #container class="three-container"></div>`,
  styles: [`
    .three-container { width: 100%; height: 100%; overflow: hidden; }
    :host { display: block; width: 100%; height: 100%; }
  `]
})
export class ThreeUiComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', { static: true }) containerRef!: ElementRef;
  private threeService = inject(ThreeService);

  ngAfterViewInit(): void {
    this.threeService.init(this.containerRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.threeService.ngOnDestroy();
  }
}
