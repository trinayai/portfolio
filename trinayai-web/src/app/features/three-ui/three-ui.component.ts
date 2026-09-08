import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-three-ui',
  standalone: true,
  imports: [],
  template: `
    <div class="three-ui-root">
      <canvas #threeCanvas class="three-canvas"></canvas>
    </div>
  `,
  styles: [
    `:host { display: block; position: relative; height: 100%; min-height: 360px; }`,
    `.three-ui-root { position: relative; width: 100%; height: 100%; min-height: inherit; overflow: hidden; border: 1px solid rgba(148, 163, 184, 0.28); border-radius: 28px; background: radial-gradient(circle at 68% 36%, rgba(125, 211, 252, 0.34), transparent 31%), linear-gradient(145deg, #f8fbff, #eaf2ff); box-shadow: 0 24px 70px rgba(37, 99, 235, 0.14); }`,
    `.three-canvas { width: 100%; height: 100%; display: block; }`
  ]
})
export class ThreeUiComponent implements AfterViewInit, OnDestroy {
  @ViewChild('threeCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private platformId = inject(PLATFORM_ID);

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private frameId = 0;
  private cube!: THREE.Mesh;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const canvas = this.canvasRef.nativeElement;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.resize();

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 3);

    const geo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const materials = [
      this.createWallArtMaterial(0x2563eb, 0),
      this.createWallArtMaterial(0x06b6d4, 1),
      this.createWallArtMaterial(0x7c3aed, 2),
      this.createWallArtMaterial(0xdb2777, 3),
      this.createWallArtMaterial(0x0f766e, 4),
      this.createWallArtMaterial(0xf59e0b, 5)
    ];
    this.cube = new THREE.Mesh(geo, materials);
    this.cube.rotation.set(-0.3, 0.45, 0.15);
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

  private createWallArtMaterial(color: number, variant: number): THREE.MeshStandardMaterial {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    if (!context) return new THREE.MeshStandardMaterial({ color, metalness: 0.55, roughness: 0.22 });
    context.fillStyle = '#' + color.toString(16).padStart(6, '0');
    context.fillRect(0, 0, 256, 256);
    context.strokeStyle = 'rgba(255, 255, 255, 0.82)';
    context.fillStyle = 'rgba(255, 255, 255, 0.9)';
    context.lineWidth = 5;
    for (let i = 0; i < 5; i++) {
      const offset = 24 + i * 42;
      context.beginPath();
      context.moveTo(22, offset);
      context.lineTo(82 + variant * 8, offset);
      context.lineTo(128, 128);
      context.lineTo(224, 256 - offset);
      context.stroke();
    }
    for (let i = 0; i < 7; i++) {
      const x = 24 + ((i * 37 + variant * 19) % 208);
      const y = 28 + ((i * 53 + variant * 13) % 200);
      context.beginPath();
      context.arc(x, y, 7 + (i % 2) * 3, 0, Math.PI * 2);
      context.fill();
    }
    context.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    context.lineWidth = 2;
    context.strokeRect(18, 18, 220, 220);
    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.MeshStandardMaterial({ map: texture, metalness: 0.45, roughness: 0.24 });
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
    if (!isPlatformBrowser(this.platformId)) return;
    cancelAnimationFrame(this.frameId);
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('pointermove', this.onPointerMove);
    if (this.renderer) this.renderer.dispose();
  }
}
