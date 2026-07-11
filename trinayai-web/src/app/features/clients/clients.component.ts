import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-3xl font-bold text-accent mb-12">Global Partners & Clients</h2>
      <div class="flex flex-wrap gap-8 justify-center opacity-70 grayscale hover:grayscale-0 transition-all">
        <!-- Firestore-driven logos will load here -->
        <div class="w-32 h-20 bg-gray-800 rounded flex items-center justify-center text-xs">Client Logo</div>
        <div class="w-32 h-20 bg-gray-800 rounded flex items-center justify-center text-xs">Client Logo</div>
        <div class="w-32 h-20 bg-gray-800 rounded flex items-center justify-center text-xs">Client Logo</div>
        <div class="w-32 h-20 bg-gray-800 rounded flex items-center justify-center text-xs">Client Logo</div>
      </div>
    </div>
  `
})
export class ClientsComponent {}
