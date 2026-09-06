import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-three-ui',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="three-ui-root">
      <canvas #threeCanvas class="three-canvas"></canvas>
      <div class="overlay">
        <h3 class="overlay-title">3D Prototype</h3>
        <p class="overlay-sub">Interactive Three.js canvas with HTML overlay</p>
        <button pButton type="button" label="Reset" (click)="reset()"></button>
      </div>
    </div>
  `,
  styles: [
    `:host { display: block; position: relative; height: 600px; }`,
    `.three-ui-root { position: relative; width: 100%; height: 100%; overflow: hidden; border-radius: 16px; }`,
    `.three-canvas { width: 100%; height: 100%; display: block; }`,
    `.overlay { position: absolute; left: 1rem; top: 1rem; z-index: 5; color: white; }
     .overlay-title { margin: 0 0 0.25rem 0; font-size: 1.25rem; }
     .overlay-sub { margin: 0 0 0.75rem 0; opacity: 0.85; }
    `
  ]
})
export class ThreeUiComponent implements AfterViewInit, OnDestroy {
  @ViewChild('threeCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private frameId = 0;
  private cube!: THREE.Mesh;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.resize();

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 3);

    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshStandardMaterial({ color: 0x2194ce, metalness: 0.4, roughness: 0.3 });
    this.cube = new THREE.Mesh(geo, mat);
    this.scene.add(this.cube);

    const amb = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(amb);
    const dir = new THREE.DirectionalLight(0xffffff, 1);
    dir.position.set(5, 5, 5);
    this.scene.add(dir);

    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('pointermove', this.onPointerMove);

    this.animate();
  }

  private animate = () => {
    this.frameId = requestAnimationFrame(this.animate);
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.013;
    this.renderer.render(this.scene, this.camera);
  };

  reset(): void {
    this.cube.rotation.set(0.2, 0.5, 0);
  }

  private onWindowResize = () => this.resize();

  private onPointerMove = (ev: PointerEvent) => {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = (ev.clientX - rect.left) / rect.width - 0.5;
    const y = (ev.clientY - rect.top) / rect.height - 0.5;
    this.cube.rotation.x = THREE.MathUtils.lerp(this.cube.rotation.x, y * 0.8, 0.05);
    this.cube.rotation.y = THREE.MathUtils.lerp(this.cube.rotation.y, x * 1.2, 0.05);
  };

  private resize() {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth || canvas.width || 800;
    const height = canvas.clientHeight || canvas.height || 600;
    this.renderer.setSize(width, height, false);
    if (this.camera) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frameId);
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('pointermove', this.onPointerMove);
    this.renderer.dispose();
  }
}
