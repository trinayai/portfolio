import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'ai-menu',
    loadComponent: () => import('./features/ai-menu/ai-menu.component').then(m => m.AiMenuComponent)
  },
  {
    path: 'ai',
    loadComponent: () => import('./features/ai-workspace/ai-workspace.component').then(m => m.AiWorkspaceComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'services',
    loadComponent: () => import('./features/services/services.component').then(m => m.ServicesComponent)
  },
  {
    path: 'clients',
    loadComponent: () => import('./features/clients/clients.component').then(m => m.ClientsComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./features/legal/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent)
  },
  {
    path: 'terms-of-service',
    loadComponent: () => import('./features/legal/terms-of-service/terms-of-service.component').then(m => m.TermsOfServiceComponent)
  },
  { path: '**', redirectTo: '' }
];
