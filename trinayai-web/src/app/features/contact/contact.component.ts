import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, InputTextModule, TextareaModule, ButtonModule, CardModule],
  template: `
    <div class="min-h-screen bg-slate-950 px-6 py-32 relative overflow-hidden">
      <!-- Background Blobs -->
      <div class="absolute top-[10%] left-[-5%] h-[400px] w-[400px] bg-cyan-600/10 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-[10%] right-[-5%] h-[400px] w-[400px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse"></div>

      <div class="mx-auto max-w-6xl relative z-10">
        <div class="grid gap-20 lg:grid-cols-2 lg:items-center">
          <div>
            <span class="inline-block rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-6 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-400 ring-1 ring-cyan-500/30 mb-8 shadow-lg shadow-cyan-500/10">
              Get in Touch
            </span>
            <h2 class="text-6xl font-black tracking-tighter text-white sm:text-7xl mb-8 leading-[0.95]">
              Let's build the <span class="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent filter drop-shadow-sm">future together.</span>
            </h2>
            <p class="text-xl text-slate-400 font-medium leading-relaxed mb-12 opacity-90">
              Have questions about our AI models or compliance automation? Our team is dedicated to helping MSMEs navigate and conquer the digital landscape.
            </p>

            <div class="space-y-10">
              <div class="flex items-center gap-6 group">
                <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-cyan-400 ring-1 ring-white/10 shadow-xl group-hover:bg-cyan-500 group-hover:text-white transition-all duration-500">
                  <i class="pi pi-envelope text-2xl"></i>
                </div>
                <div>
                  <h4 class="text-white text-lg font-black tracking-tight">Email Us</h4>
                  <p class="text-slate-400 font-medium">info&#64;trinayai.com</p>
                </div>
              </div>
              <div class="flex items-center gap-6 group">
                <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-blue-400 ring-1 ring-white/10 shadow-xl group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                  <i class="pi pi-map-marker text-2xl"></i>
                </div>
                <div>
                  <h4 class="text-white text-lg font-black tracking-tight">Visit Us</h4>
                  <p class="text-slate-400 font-medium">Chennai, Tamil Nadu, India</p>
                </div>
              </div>
            </div>
          </div>

          <div class="relative group">
            <div class="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-20 blur-3xl rounded-[40px] group-hover:opacity-30 transition-opacity duration-700"></div>
            <p-card styleClass="relative border border-white/5 bg-slate-900/40 backdrop-blur-3xl shadow-3xl p-4">
              <form class="space-y-8">
                <div class="flex flex-col gap-3">
                  <label class="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Full Name</label>
                  <input type="text" pInputText placeholder="John Doe"
                         class="w-full bg-slate-950/50 border-white/10 text-white p-4 rounded-2xl focus:border-cyan-500 transition-all font-medium" />
                </div>
                <div class="flex flex-col gap-3">
                  <label class="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Email Address</label>
                  <input type="email" pInputText placeholder="john@company.com"
                         class="w-full bg-slate-950/50 border-white/10 text-white p-4 rounded-2xl focus:border-cyan-500 transition-all font-medium" />
                </div>
                <div class="flex flex-col gap-3">
                  <label class="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Your Message</label>
                  <textarea rows="5" pInputTextarea placeholder="How can we help you scale?"
                            class="w-full bg-slate-950/50 border-white/10 text-white p-4 rounded-2xl focus:border-cyan-500 transition-all font-medium"></textarea>
                </div>
                <p-button label="Send Message" icon="pi pi-send" iconPos="right"
                          styleClass="w-full p-button-raised bg-gradient-to-r from-cyan-500 to-blue-600 border-none py-5 font-black uppercase tracking-widest text-white shadow-2xl hover:scale-[1.02] transition-transform"></p-button>
              </form>
            </p-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `::ng-deep .p-inputtext, ::ng-deep .p-inputtextarea { padding: 0.75rem 1rem; border-radius: 12px; transition: all 0.3s; }`,
    `::ng-deep .p-inputtext::placeholder, ::ng-deep .p-inputtextarea::placeholder { color: #475569; }`,
    `::ng-deep .p-card { border-radius: 24px; }`,
    `::ng-deep .p-card .p-card-body { padding: 2.5rem; }`
  ]
})
export class ContactComponent {}
