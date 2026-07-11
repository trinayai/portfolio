import { Injectable, ElementRef, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class ThreeService implements OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private animationId?: number;
  private particles?: THREE.Points;

  constructor() {}

  init(container: HTMLElement): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);

    // Create particles
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 5000; i++) {
      vertices.push(
        THREE.MathUtils.randFloatSpread(20),
        THREE.MathUtils.randFloatSpread(20),
        THREE.MathUtils.randFloatSpread(20)
      );
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ color: 0x00d2ff, size: 0.05 });
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);

    this.animate();

    window.addEventListener('resize', this.onResize.bind(this));
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(this.animate.bind(this));

    if (this.particles) {
      this.particles.rotation.y += 0.001;
      this.particles.rotation.x += 0.0005;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  private onResize(): void {
    if (this.camera && this.renderer) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.onResize.bind(this));
    }
  }
}
