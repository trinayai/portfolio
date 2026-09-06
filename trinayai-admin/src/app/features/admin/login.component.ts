import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, InputTextModule, PasswordModule, ButtonModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <div class="flex min-h-screen items-center justify-center bg-[#050c1f] px-4 py-24">
      <div class="absolute inset-0 z-0 overflow-hidden">
        <div class="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-cyan-500/10 blur-[120px]"></div>
        <div class="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-fuchsia-500/10 blur-[120px]"></div>
      </div>

      <p-card styleClass="relative z-10 w-full max-w-md border border-white/10 bg-white/5 shadow-2xl backdrop-blur-2xl">
        <div class="mb-8 text-center">
           <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
             <i class="pi pi-lock text-2xl text-white"></i>
           </div>
           <h1 class="text-3xl font-black text-white">Admin <span class="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Login</span></h1>
           <p class="mt-2 text-slate-400">Access the content management system</p>
        </div>

        <form (ngSubmit)="onLogin()" #loginForm="ngForm" class="space-y-6">
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold uppercase tracking-widest text-slate-400">Email Address</label>
            <input pInputText name="email" [(ngModel)]="email" required email placeholder="admin@trinayai.com"
                   class="w-full bg-black/20 border-white/10 text-white p-3 rounded-xl focus:border-cyan-500 transition-all" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold uppercase tracking-widest text-slate-400">Password</label>
            <p-password name="password" [(ngModel)]="password" [toggleMask]="true" [feedback]="false" styleClass="w-full"
                        inputStyleClass="w-full bg-black/20 border-white/10 text-white p-3 rounded-xl focus:border-cyan-500 transition-all"
                        placeholder="••••••••"></p-password>
          </div>

          <p-button label="Sign In" [loading]="loading" type="submit"
                    styleClass="w-full bg-gradient-to-r from-cyan-500 to-blue-600 border-none py-4 font-bold uppercase tracking-widest text-white shadow-xl hover:shadow-cyan-500/20 transition-all"></p-button>
        </form>
      </p-card>
    </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  email = '';
  password = '';
  loading = false;

  async onLogin() {
    if (!this.email || !this.password) return;

    this.loading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Welcome', detail: 'Authentication successful' });
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid credentials or access denied' });
      }
    });
  }
}
