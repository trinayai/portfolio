import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, InputTextModule, InputTextareaModule, ButtonModule, CardModule],
  template: `
    <div class="min-h-screen bg-[#050c1f] px-6 py-24">
      <div class="mx-auto max-w-4xl">
        <div class="grid gap-12 lg:grid-cols-2">
          <div>
            <span class="inline-block rounded-full bg-cyan-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-400 ring-1 ring-cyan-500/20 mb-6">
              Get in Touch
            </span>
            <h2 class="text-4xl font-black tracking-tight text-white sm:text-5xl mb-6">
              Let's build the <span class="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">future together.</span>
            </h2>
            <p class="text-lg text-slate-400 leading-relaxed mb-10">
              Have questions about our AI models or compliance automation? Our team is here to help MSMEs navigate the digital landscape.
            </p>

            <div class="space-y-8">
              <div class="flex items-center gap-4">
                <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
                  <i class="pi pi-envelope text-xl"></i>
                </div>
                <div>
                  <h4 class="text-white font-bold">Email Us</h4>
                  <p class="text-slate-400">info&#64;trinayai.com</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                  <i class="pi pi-map-marker text-xl"></i>
                </div>
                <div>
                  <h4 class="text-white font-bold">Visit Us</h4>
                  <p class="text-slate-400">Chennai, Tamil Nadu, India</p>
                </div>
              </div>
            </div>

            <div class="mt-12">
               <a routerLink="/admin" class="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                 <i class="pi pi-lock text-[10px]"></i> Admin Portal
               </a>
            </div>
          </div>

          <div>
            <p-card styleClass="border border-white/10 bg-white/5 backdrop-blur-xl">
              <form class="space-y-6">
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-bold uppercase tracking-widest text-slate-500">Name</label>
                  <input type="text" pInputText placeholder="Your Name" class="w-full bg-[#08112a] border-white/10 text-white focus:border-cyan-500" />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-bold uppercase tracking-widest text-slate-500">Email</label>
                  <input type="email" pInputText placeholder="email@example.com" class="w-full bg-[#08112a] border-white/10 text-white focus:border-cyan-500" />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-bold uppercase tracking-widest text-slate-500">Message</label>
                  <textarea rows="5" pInputTextarea [autoResize]="true" placeholder="How can we help you?" class="w-full bg-[#08112a] border-white/10 text-white focus:border-cyan-500"></textarea>
                </div>
                <p-button label="Send Message" icon="pi pi-send" iconPos="right" styleClass="w-full p-button-raised bg-gradient-to-r from-cyan-500 to-blue-600 border-none py-4 font-bold uppercase tracking-widest"></p-button>
              </form>
            </p-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    ::ng-deep {
      .p-inputtext, .p-inputtextarea {
        padding: 0.75rem 1rem;
        border-radius: 12px;
        transition: all 0.3s;
        &::placeholder { color: #475569; }
      }
      .p-card {
        border-radius: 24px;
        .p-card-body { padding: 2.5rem; }
      }
    }
  `]
})
export class ContactComponent {}
