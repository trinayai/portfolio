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
    `.three-ui-root { position: relative; width: 100%; height: 100%; min-height: inherit; overflow: hidden; border-radius: 40px; background: transparent; }`,
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
  private points!: THREE.Points;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const canvas = this.canvasRef.nativeElement;

    // Setup Scene
    this.scene = new THREE.Scene();

    // Setup Camera
    this.camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    this.camera.position.z = 5;

    // Setup Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.resize();

    // Create Particles (Neural Network / AI vibe)
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colorArray = [];
    const colors = [new THREE.Color(0x2563eb), new THREE.Color(0x06b6d4), new THREE.Color(0x7c3aed)];

    for (let i = 0; i < 6000; i++) {
      vertices.push(
        THREE.MathUtils.randFloatSpread(10),
        THREE.MathUtils.randFloatSpread(10),
        THREE.MathUtils.randFloatSpread(10)
      );
      const color = colors[Math.floor(Math.random() * colors.length)];
      colorArray.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colorArray, 3));

    const material = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    this.points = new THREE.Points(geometry, material);
    this.scene.add(this.points);

    // Subtle Ambient Light
    const amb = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(amb);

    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('pointermove', this.onPointerMove);

    this.animate();
  }

  private animate = () => {
    this.frameId = requestAnimationFrame(this.animate);

    this.points.rotation.y += 0.0015;
    this.points.rotation.x += 0.0008;

    // Pulse effect
    const time = Date.now() * 0.001;
    this.points.position.y = Math.sin(time * 0.4) * 0.15;

    this.renderer.render(this.scene, this.camera);
  };

  private onWindowResize = () => this.resize();

  private onPointerMove = (ev: PointerEvent) => {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = (ev.clientX - rect.left) / rect.width - 0.5;
    const y = (ev.clientY - rect.top) / rect.height - 0.5;

    this.points.rotation.x = THREE.MathUtils.lerp(this.points.rotation.x, y * 0.5, 0.03);
    this.points.rotation.y = THREE.MathUtils.lerp(this.points.rotation.y, x * 0.5, 0.03);
  };

  private resize() {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth || 800;
    const height = canvas.clientHeight || 600;
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
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.points) {
      this.points.geometry.dispose();
      (this.points.material as THREE.Material).dispose();
    }
  }
}
