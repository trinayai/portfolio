import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { AiMenuComponent } from './features/ai-menu/ai-menu.component';
import { AboutComponent } from './features/about/about.component';
import { ServicesComponent } from './features/services/services.component';
import { ClientsComponent } from './features/clients/clients.component';
import { ContactComponent } from './features/contact/contact.component';
import { AdminComponent } from './features/admin/admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'ai-menu', component: AiMenuComponent },
  { path: 'about', component: AboutComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'clients', component: ClientsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];
