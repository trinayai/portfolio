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
    <div class="min-h-screen bg-slate-50 px-6 py-32 relative overflow-hidden">
      <!-- Subtle Decorative Elements -->
      <div class="absolute top-0 right-0 h-96 w-96 bg-blue-100/50 blur-[100px] rounded-full"></div>
      <div class="absolute bottom-0 left-0 h-96 w-96 bg-cyan-100/50 blur-[100px] rounded-full"></div>

      <div class="mx-auto max-w-6xl relative z-10">
        <div class="text-center mb-20">
          <span class="inline-block rounded-full bg-blue-100 px-6 py-2 text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-6">
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
            <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8">
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
            <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h4 class="text-slate-900 text-lg font-bold tracking-tight mb-6">Board of Directors</h4>
              <div class="space-y-4">
                <div class="flex items-center gap-4">
                  <div class="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">MM</div>
                  <div>
                    <p class="text-slate-900 font-bold text-sm">Meenakshi M</p>
                    <p class="text-slate-500 text-xs font-medium uppercase tracking-widest">Director</p>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">SS</div>
                  <div>
                    <p class="text-slate-900 font-bold text-sm">Saravanan Subramanian</p>
                    <p class="text-slate-500 text-xs font-medium uppercase tracking-widest">Managing Director</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="lg:col-span-7">
            <p-card styleClass="border-none bg-white shadow-xl p-6 rounded-[32px]">
              <form class="grid gap-6">
                <div class="grid md:grid-cols-2 gap-6">
                  <div class="flex flex-col gap-2">
                    <label class="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                    <input type="text" pInputText placeholder="John Doe"
                           class="w-full bg-slate-50 border-slate-100 text-slate-900 p-4 rounded-2xl focus:bg-white transition-all" />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label class="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                    <input type="email" pInputText placeholder="john&#64;company.com"
                           class="w-full bg-slate-50 border-slate-100 text-slate-900 p-4 rounded-2xl focus:bg-white transition-all" />
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Your Message</label>
                  <textarea rows="5" pInputTextarea placeholder="How can we help you scale?"
                            class="w-full bg-slate-50 border-slate-100 text-slate-900 p-4 rounded-2xl focus:bg-white transition-all"></textarea>
                </div>
                <div class="pt-4">
                  <p-button label="Send Message" icon="pi pi-send" iconPos="right"
                            styleClass="w-full p-button-raised shadow-lg py-5"></p-button>
                </div>
              </form>
            </p-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `::ng-deep .p-inputtext, ::ng-deep .p-inputtextarea { padding: 1rem; border-radius: 16px; border: 1px solid #f1f5f9; background: #f8fafc; transition: all 0.3s; font-weight: 500; color: #0f172a; }`,
    `::ng-deep .p-inputtext:focus, ::ng-deep .p-inputtextarea:focus { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }`,
    `::ng-deep .p-card .p-card-body { padding: 0; }`
  ]
})
export class ContactComponent {}
