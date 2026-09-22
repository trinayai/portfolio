import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Firestore, collection, collectionData, addDoc, updateDoc, deleteDoc, doc } from '@angular/fire/firestore';

interface Payroll {
  id?: string;
  employeeName: string;
  amount: string;
  month: string;
  status: string;
}

@Component({
  selector: 'app-salaries-finance',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, DialogModule, ToastModule],
  template: `
    <p-toast></p-toast>
    <div class="p-8 bg-white min-h-screen">
      <div class="flex justify-between items-center mb-10">
        <div>
          <span class="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block">Payroll</span>
          <h1 class="text-3xl font-black tracking-tighter text-slate-900">Salary Management</h1>
        </div>
        <p-button label="Pay Salary" icon="pi pi-dollar" (onClick)="openNew()" styleClass="p-button-success p-button-rounded"></p-button>
      </div>

      <div class="card-white p-0 overflow-hidden shadow-2xl border-slate-100">
        <p-table [value]="payrolls" [paginator]="true" [rows]="10">
          <ng-template pTemplate="header">
            <tr>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Employee</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Month</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Status</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-pay>
            <tr class="border-t border-slate-50">
              <td class="p-6 font-bold text-slate-900">{{ pay.employeeName }}</td>
              <td class="p-6 text-sm text-slate-600">{{ pay.month }}</td>
              <td class="p-6 font-black text-blue-600">{{ pay.amount }}</td>
              <td class="p-6 text-right">
                <span class="text-xs font-bold uppercase tracking-widest text-green-600">{{ pay.status }}</span>
              </td>
              <td class="p-6 text-right">
                <p-button icon="pi pi-trash" (onClick)="deletePayroll(pay)" styleClass="p-button-text p-button-danger p-button-rounded"></p-button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>

    <p-dialog [(visible)]="payDialog" [header]="'Disburse Salary'" [modal]="true" styleClass="p-fluid" [style]="{width: '450px'}">
      <div class="field mb-4">
        <label for="name" class="text-[10px] font-black uppercase text-slate-400 block mb-2">Employee Name</label>
        <input type="text" pInputText id="name" [(ngModel)]="payroll.employeeName" required />
      </div>
      <div class="field mb-4">
        <label for="month" class="text-[10px] font-black uppercase text-slate-400 block mb-2">Billing Month</label>
        <input type="text" pInputText id="month" [(ngModel)]="payroll.month" placeholder="October 2026" />
      </div>
      <div class="field mb-6">
        <label for="amount" class="text-[10px] font-black uppercase text-slate-400 block mb-2">Net Salary</label>
        <input type="text" pInputText id="amount" [(ngModel)]="payroll.amount" />
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancel" icon="pi pi-times" (onClick)="hideDialog()" styleClass="p-button-text"></p-button>
        <p-button label="Disburse" icon="pi pi-check" (onClick)="savePayroll()"></p-button>
      </ng-template>
    </p-dialog>
  `
})
export class SalariesFinanceComponent implements OnInit {
  payrolls: Payroll[] = [];
  payroll: Payroll = { employeeName: '', month: '', amount: '', status: 'paid' };
  payDialog = false;

  private firestore = inject(Firestore);
  private messageService = inject(MessageService);

  ngOnInit() {
    collectionData(collection(this.firestore, 'payroll'), { idField: 'id' }).subscribe(data => {
      this.payrolls = data as Payroll[];
    });
  }

  openNew() {
    this.payroll = { employeeName: '', month: '', amount: '', status: 'paid' };
    this.payDialog = true;
  }

  hideDialog() {
    this.payDialog = false;
  }

  async savePayroll() {
    if (!this.payroll.employeeName.trim()) return;
    try {
      await addDoc(collection(this.firestore, 'payroll'), { ...this.payroll });
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Salary disbursement logged.' });
      this.payDialog = false;
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Transaction failed.' });
    }
  }

  async deletePayroll(pay: Payroll) {
    if (!pay.id) return;
    try {
      await deleteDoc(doc(this.firestore, 'payroll', pay.id));
      this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Entry removed.' });
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Operation failed.' });
    }
  }
}
