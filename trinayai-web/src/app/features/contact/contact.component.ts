import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteContentService } from '../../core/services/site-content.service';
import { SiteSettings } from '../../core/models/site-content';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, InputTextareaModule, ButtonModule, CardModule],
  template: `
    <div class="contact-page min-h-[calc(100vh-5rem)] overflow-x-clip bg-[#fffaf2] px-4 py-8 sm:px-8 sm:py-12 lg:px-10">
      <div class="mx-auto max-w-6xl">
        <div class="contact-intro grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p class="text-xs font-black uppercase tracking-[0.2em] text-orange-600">Start a conversation</p>
            <h1 class="mt-3 text-5xl font-black leading-[0.95] tracking-[-0.06em] text-slate-950 sm:text-7xl">Bring your next big idea <span class="text-blue-600">to life.</span></h1>
          </div>
          <p class="max-w-xl text-lg leading-relaxed text-slate-600 lg:pb-2">Tell us what you are building, where it needs to go, and what success looks like. We will shape the first useful step with you.</p>
        </div>

        <div class="mt-10 grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <aside class="contact-aside rounded-[2rem] bg-blue-600 p-7 text-white shadow-xl sm:p-9">
            <p class="text-xs font-black uppercase tracking-[0.2em] text-blue-100">Trinay AI studio</p>
            <h2 class="mt-5 text-3xl font-black tracking-tight">A thoughtful reply starts here.</h2>
            <div class="mt-10 space-y-6 text-sm leading-relaxed text-blue-50">
              <p><i class="pi pi-envelope mr-3"></i>info&#64;trinayai.com</p>
              <p><i class="pi pi-map-marker mr-3"></i>Namakkal, Tamil Nadu, India</p>
              <p><i class="pi pi-clock mr-3"></i>Typically replies within one business day</p>
            </div>
            <div class="mt-12 border-t border-blue-400 pt-6 text-sm text-blue-100">For partnerships, product pilots, and AI compliance programs.</div>
          </aside>

          <section class="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-xl sm:p-9">
            <div class="mb-7 flex items-center justify-between gap-4">
              <div><p class="text-xs font-black uppercase tracking-[0.2em] text-blue-600">Project brief</p><h2 class="mt-2 text-2xl font-black text-slate-950">What can we help you make?</h2></div>
              <span class="hidden rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700 sm:inline-block">Step 1 of 1</span>
            </div>
            <form class="grid gap-5" (ngSubmit)="submit()" #contactForm="ngForm">
              <div class="grid gap-5 sm:grid-cols-2">
                <label class="field"><span>Your name</span><input name="name" required [(ngModel)]="form.name" pInputText placeholder="Aarav Sharma" /></label>
                <label class="field"><span>Work email</span><input name="email" required type="email" [(ngModel)]="form.email" pInputText placeholder="you&#64;company.com" /><small>Company email only. Personal inboxes are not accepted.</small></label>
              </div>
              <label class="field"><span>What are you exploring?</span><select name="interest" [(ngModel)]="form.interest"><option>AI product development</option><option>Compliance automation</option><option>Custom LLMs</option><option>Partnership</option></select></label>
              <label class="field"><span>Tell us a little more</span><textarea name="message" required [(ngModel)]="form.message" pInputTextarea rows="5" placeholder="Share your goal, timeline, or challenge..."></textarea></label>
              <div class="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between"><p class="text-xs leading-relaxed text-slate-500">We only use these details to respond to your enquiry.</p><p-button type="submit" [disabled]="contactForm.invalid || submitted || sending" [label]="sending ? 'Sending...' : submitted ? 'Sent' : 'Send project brief'" icon="pi pi-arrow-up-right" iconPos="right" styleClass="bg-slate-950 border-none px-6 py-3 font-bold text-white hover:bg-blue-700"></p-button></div>
              <p *ngIf="errorMessage" class="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{{ errorMessage }}</p>
              <p *ngIf="submitted" class="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">Thanks. Your brief is ready for our team to review.</p>
            </form>
          </section>
        </div>
      </div>
    </div>
  `,
  styles: [
    `::ng-deep { .field { display: grid; gap: 0.5rem; color: #475569; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; } .field small { color: #64748b; font-size: 0.68rem; font-weight: 500; letter-spacing: 0; text-transform: none; } .field input, .field textarea, .field select { width: 100%; box-sizing: border-box; border: 1px solid #e2e8f0; border-radius: 0.9rem; background: #f8fafc; color: #0f172a; padding: 0.9rem 1rem; font-size: 0.95rem; font-weight: 500; letter-spacing: 0; text-transform: none; outline: none; transition: border-color 180ms, box-shadow 180ms, background 180ms; } .field input:focus, .field textarea:focus, .field select:focus { border-color: #2563eb; background: white; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); } }`
  ]
})
export class ContactComponent implements OnInit {
  private contentService = inject(SiteContentService);
  private functions = inject(Functions);
  private recipient = 'admin@trinayai.com';
  form = { name: '', email: '', interest: 'AI product development', message: '' };
  submitted = false;
  sending = false;
  errorMessage = '';

  ngOnInit(): void {
    this.contentService.getSettings().subscribe((settings: SiteSettings) => {
      this.recipient = settings.contactEmail || this.recipient;
    });
  }

  async submit(): Promise<void> {
    const email = this.form.email.trim().toLowerCase();
    const domain = email.split('@')[1] || '';
    const freeEmailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'proton.me', 'protonmail.com', 'mail.com', 'yandex.com'];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || freeEmailDomains.includes(domain)) {
      this.errorMessage = 'Please use your company or work email address.';
      return;
    }

    this.errorMessage = '';
    this.sending = true;
    try {
      const sendProjectBrief = httpsCallable(this.functions, 'sendProjectBrief');
      await sendProjectBrief(this.form);
      this.submitted = true;
    } catch {
      this.errorMessage = 'We could not send your brief right now. Please try again shortly.';
    } finally {
      this.sending = false;
    }
  }
}
