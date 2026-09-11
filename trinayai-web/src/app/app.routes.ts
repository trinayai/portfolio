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
    path: 'three-ui',
    loadComponent: () => import('./features/three-ui/three-ui.component').then(m => m.ThreeUiComponent)
  },
  { path: '**', redirectTo: '' }
];
