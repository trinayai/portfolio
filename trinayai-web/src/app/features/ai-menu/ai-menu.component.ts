import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 bg-secondary min-h-screen">
      <h2 class="text-3xl font-bold text-accent mb-6">AI Menu & Analytics</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="p-6 bg-primary border border-gray-800 rounded-xl hover:border-accent transition-colors">
          <h3 class="text-xl font-semibold mb-2">Tamil + English Chatbot</h3>
          <p class="text-gray-400">Multilingual AI support for localized interactions.</p>
        </div>
        <div class="p-6 bg-primary border border-gray-800 rounded-xl hover:border-accent transition-colors">
          <h3 class="text-xl font-semibold mb-2">AI Model Showcase</h3>
          <p class="text-gray-400">Explore our latest generative and analytical models.</p>
        </div>
        <div class="p-6 bg-primary border border-gray-800 rounded-xl hover:border-accent transition-colors">
          <h3 class="text-xl font-semibold mb-2">Real-time Analytics</h3>
          <p class="text-gray-400">Monitor AI logs and performance metrics.</p>
        </div>
      </div>
    </div>
  `
})
export class AiMenuComponent {}
