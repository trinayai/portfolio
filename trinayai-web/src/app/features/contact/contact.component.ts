import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, InputTextModule, InputTextareaModule, ButtonModule, CardModule],
  template: `
    <div class="min-h-screen bg-white px-6 py-32 relative overflow-hidden">
      <!-- Background Accents -->
      <div class="absolute top-0 right-0 h-96 w-96 bg-blue-50 blur-[100px] rounded-full"></div>
      <div class="absolute bottom-0 left-0 h-96 w-96 bg-cyan-50 blur-[100px] rounded-full"></div>

      <div class="mx-auto max-w-6xl relative z-10">
        <div class="text-center mb-20">
          <span class="inline-block rounded-full bg-blue-50 px-6 py-2 text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-6">
            Get in Touch
          </span>
          <h2 class="text-5xl font-black tracking-tighter text-slate-900 sm:text-6xl mb-6">
            Let's build the <span class="text-blue-600">future together.</span>
          </h2>
          <p class="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Have questions about our AI models or compliance automation? Our team is dedicated to helping MSMEs navigate and conquer the digital landscape.
          </p>
        </div>

        <div class="grid gap-12 lg:grid-cols-12 lg:items-start">
          <!-- Contact Information -->
          <div class="lg:col-span-5 space-y-10">
            <div class="bg-white p-10 rounded-[32px] shadow-sm border border-slate-100 space-y-10">
              <div class="flex items-start gap-6 group">
                <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <i class="pi pi-envelope text-xl"></i>
                </div>
                <div>
                  <h4 class="text-slate-900 text-lg font-bold tracking-tight mb-1">Email Us</h4>
                  <p class="text-slate-600 font-medium">info&#64;trinayai.com</p>
                </div>
              </div>

              <div class="flex items-start gap-6 group">
                <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <i class="pi pi-map-marker text-xl"></i>
                </div>
                <div>
                  <h4 class="text-slate-900 text-lg font-bold tracking-tight mb-1">Registered Office</h4>
                  <p class="text-slate-600 font-medium leading-relaxed">
                    SF No. 224/8F8, Attur main road, Kumbakottai,<br>
                    Namagiripettai, Rasipuram, Namakkal,<br>
                    Tamil Nadu – 637406
                  </p>
                </div>
              </div>
            </div>

            <!-- Board of Directors -->
            <div class="bg-slate-950 p-10 rounded-[32px] shadow-2xl text-white">
              <h4 class="text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-8">Board of Directors</h4>
              <div class="space-y-8">
                <div class="flex items-center gap-5 group">
                  <div class="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-blue-400 font-black border border-white/10 group-hover:bg-blue-600 group-hover:text-white transition-all">MM</div>
                  <div>
                    <p class="text-white font-black text-lg tracking-tight">Meenakshi M</p>
                    <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Director</p>
                  </div>
                </div>
                <div class="flex items-center gap-5 group">
                  <div class="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-cyan-400 font-black border border-white/10 group-hover:bg-cyan-500 group-hover:text-white transition-all">SS</div>
                  <div>
                    <p class="text-white font-black text-lg tracking-tight">Saravanan Subramanian</p>
                    <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Managing Director</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="lg:col-span-7">
            <p-card styleClass="border-none bg-white shadow-2xl p-4 rounded-[40px]">
              <form class="p-4 sm:p-8 space-y-8">
                <div class="grid md:grid-cols-2 gap-8">
                  <div class="flex flex-col gap-3">
                    <label class="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                    <input type="text" pInputText placeholder="John Doe"
                           class="w-full bg-slate-50 border-slate-100 text-slate-900 p-5 rounded-2xl focus:bg-white transition-all font-semibold" />
                  </div>
                  <div class="flex flex-col gap-3">
                    <label class="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                    <input type="email" pInputText placeholder="john&#64;company.com"
                           class="w-full bg-slate-50 border-slate-100 text-slate-900 p-5 rounded-2xl focus:bg-white transition-all font-semibold" />
                  </div>
                </div>
                <div class="flex flex-col gap-3">
                  <label class="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Your Message</label>
                  <textarea rows="6" pInputTextarea placeholder="How can we help you scale?"
                            class="w-full bg-slate-50 border-slate-100 text-slate-900 p-5 rounded-2xl focus:bg-white transition-all font-semibold"></textarea>
                </div>
                <div class="pt-6">
                  <p-button label="Send Message" icon="pi pi-send" iconPos="right"
                            styleClass="w-full p-button-raised bg-blue-600 border-none py-6 font-black uppercase tracking-widest text-white shadow-xl hover:bg-blue-700 hover:scale-[1.01] transition-all"></p-button>
                </div>
              </form>
            </p-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `::ng-deep .p-inputtext, ::ng-deep .p-inputtextarea { padding: 1.25rem; border-radius: 18px; border: 1px solid #f1f5f9; background: #f8fafc; transition: all 0.3s; color: #0f172a; }`,
    `::ng-deep .p-inputtext:focus, ::ng-deep .p-inputtextarea:focus { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }`,
    `::ng-deep .p-card .p-card-body { padding: 0; }`
  ]
})
export class ContactComponent {}
