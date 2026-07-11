import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto py-16 px-4">
      <h2 class="text-4xl font-bold text-accent mb-8">About Trinay AI</h2>
      <div class="space-y-6 text-gray-300 leading-relaxed">
        <p>
          Trinay AI is a forward-thinking technology enterprise rooted in Tamil Nadu, dedicated to bridging the gap between cutting-edge AI and global needs.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div class="p-6 bg-secondary rounded-lg">
            <h3 class="text-xl font-bold text-white mb-2">Our Vision</h3>
            <p>Empowering industries with intelligent automation and localized AI solutions.</p>
          </div>
          <div class="p-6 bg-secondary rounded-lg">
            <h3 class="text-xl font-bold text-white mb-2">MSME Registered</h3>
            <p>Proudly recognized as a women-owned MSME enterprise contributing to the digital economy.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AboutComponent {}
