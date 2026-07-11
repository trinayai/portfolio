import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 bg-primary min-h-screen">
      <h2 class="text-3xl font-bold text-accent mb-12 text-center">Our Services</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="service-card">
          <h3 class="text-xl font-bold mb-4">AI Solutions</h3>
          <p class="text-gray-400">Custom AI models for government and enterprise sectors.</p>
        </div>
        <div class="service-card">
          <h3 class="text-xl font-bold mb-4">Software Dev</h3>
          <p class="text-gray-400">Scalable web and mobile applications using modern stacks.</p>
        </div>
        <div class="service-card">
          <h3 class="text-xl font-bold mb-4">Consulting</h3>
          <p class="text-gray-400">Strategic guidance on AI integration and digital transformation.</p>
        </div>
        <div class="service-card">
          <h3 class="text-xl font-bold mb-4">Global Needs</h3>
          <p class="text-gray-400">International project management and multilingual support.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .service-card {
      @apply p-6 bg-secondary border-b-4 border-accent rounded-t-lg hover:-translate-y-2 transition-transform;
    }
  `]
})
export class ServicesComponent {}
