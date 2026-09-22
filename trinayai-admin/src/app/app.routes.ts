import { Routes } from '@angular/router';
import { AdminComponent } from './features/admin/admin.component';
import { LoginComponent } from './features/admin/login.component';
import { authGuard } from './core/guards/auth.guard';
import { TrinayaiDocsComponent } from './features/documents/trinayai-docs.component';
import { DirectorsDocsComponent } from './features/documents/directors-docs.component';
import { TendersDocsComponent } from './features/documents/tenders-docs.component';
import { NonGovInvestorsComponent } from './features/investors/non-gov-investors.component';
import { GovInvestorsComponent } from './features/investors/gov-investors.component';
import { EmployeeManageComponent } from './features/manage/employee-manage.component';
import { AdminManageComponent } from './features/manage/admin-manage.component';
import { VendorsManageComponent } from './features/manage/vendors-manage.component';
import { AssetsManageComponent } from './features/manage/assets-manage.component';
import { ClientsManageComponent } from './features/manage/clients-manage.component';
import { SubscribersManageComponent } from './features/manage/subscribers-manage.component';
import { InvestmentFinanceComponent } from './features/finance/investment-finance.component';
import { FundsFinanceComponent } from './features/finance/funds-finance.component';
import { ExpensesFinanceComponent } from './features/finance/expenses-finance.component';
import { SalariesFinanceComponent } from './features/finance/salaries-finance.component';
import { ReportFinanceComponent } from './features/finance/report-finance.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] },

  // Documents
  { path: 'documents/trinayai', component: TrinayaiDocsComponent, canActivate: [authGuard] },
  { path: 'documents/directors', component: DirectorsDocsComponent, canActivate: [authGuard] },
  { path: 'documents/tenders', component: TendersDocsComponent, canActivate: [authGuard] },

  // Investors
  { path: 'investors/non-gov', component: NonGovInvestorsComponent, canActivate: [authGuard] },
  { path: 'investors/gov', component: GovInvestorsComponent, canActivate: [authGuard] },

  // Manage
  { path: 'manage/employee', component: EmployeeManageComponent, canActivate: [authGuard] },
  { path: 'manage/admin', component: AdminManageComponent, canActivate: [authGuard] },
  { path: 'manage/vendors', component: VendorsManageComponent, canActivate: [authGuard] },
  { path: 'manage/assets', component: AssetsManageComponent, canActivate: [authGuard] },
  { path: 'manage/clients', component: ClientsManageComponent, canActivate: [authGuard] },
  { path: 'manage/subscribers', component: SubscribersManageComponent, canActivate: [authGuard] },
  { path: 'manage/users', loadComponent: () => import('./features/manage/user-manage.component').then(m => m.UserManageComponent), canActivate: [authGuard] },

  // Finance
  { path: 'finance/investment', component: InvestmentFinanceComponent, canActivate: [authGuard] },
  { path: 'finance/funds', component: FundsFinanceComponent, canActivate: [authGuard] },
  { path: 'finance/expenses', component: ExpensesFinanceComponent, canActivate: [authGuard] },
  { path: 'finance/salaries', component: SalariesFinanceComponent, canActivate: [authGuard] },
  { path: 'finance/report', component: ReportFinanceComponent, canActivate: [authGuard] },

  { path: '', redirectTo: 'admin', pathMatch: 'full' },
  { path: '**', redirectTo: 'admin' }
];
