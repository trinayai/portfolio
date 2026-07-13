import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="mx-auto max-w-2xl px-4 py-16">
      <h2 class="mb-8 text-3xl font-bold text-accent">Contact Us</h2>
      <a routerLink="/admin" class="mb-8 inline-flex rounded-full border border-accent/40 px-4 py-2 text-sm text-accent">Admin sign-in</a>
      <form class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-400">Name</label>
          <input type="text" class="mt-1 w-full rounded-md border border-gray-700 bg-secondary p-3 text-white focus:border-accent focus:outline-none">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-400">Email</label>
          <input type="email" class="mt-1 w-full rounded-md border border-gray-700 bg-secondary p-3 text-white focus:border-accent focus:outline-none">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-400">Message</label>
          <textarea rows="4" class="mt-1 w-full rounded-md border border-gray-700 bg-secondary p-3 text-white focus:border-accent focus:outline-none"></textarea>
        </div>
        <button type="submit" class="w-full rounded-md bg-accent py-3 font-bold text-primary transition-colors hover:bg-opacity-90">
          Send Message
        </button>
      </form>
    </div>
  `
})
export class ContactComponent {}
