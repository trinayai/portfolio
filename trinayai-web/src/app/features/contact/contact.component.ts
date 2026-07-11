import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto py-16 px-4">
      <h2 class="text-3xl font-bold text-accent mb-8">Contact Us</h2>
      <form class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-400">Name</label>
          <input type="text" class="w-full mt-1 bg-secondary border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:border-accent">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-400">Email</label>
          <input type="email" class="w-full mt-1 bg-secondary border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:border-accent">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-400">Message</label>
          <textarea rows="4" class="w-full mt-1 bg-secondary border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:border-accent"></textarea>
        </div>
        <button type="submit" class="w-full bg-accent text-primary font-bold py-3 rounded-md hover:bg-opacity-90 transition-colors">
          Send Message
        </button>
      </form>
    </div>
  `
})
export class ContactComponent {}
