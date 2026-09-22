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

interface Expense {
  id?: string;
  category: string;
  amount: string;
  date: string;
  description: string;
}

@Component({
  selector: 'app-expenses-finance',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, DialogModule, ToastModule],
  template: `
    <p-toast></p-toast>
    <div class="p-8 bg-white min-h-screen">
      <div class="flex justify-between items-center mb-10">
        <div>
          <span class="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block">Accounts Payable</span>
          <h1 class="text-3xl font-black tracking-tighter text-slate-900">Expense Tracking</h1>
        </div>
        <p-button label="Log Expense" icon="pi pi-plus" (onClick)="openNew()" styleClass="p-button-success p-button-rounded"></p-button>
      </div>

      <div class="card-white p-0 overflow-hidden shadow-2xl border-slate-100">
        <p-table [value]="expenses" [paginator]="true" [rows]="10">
          <ng-template pTemplate="header">
            <tr>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Description</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Date</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-exp>
            <tr class="border-t border-slate-50">
              <td class="p-6 font-bold text-slate-900">{{ exp.category }}</td>
              <td class="p-6 text-sm text-slate-600">{{ exp.description }}</td>
              <td class="p-6 font-black text-blue-600">{{ exp.amount }}</td>
              <td class="p-6 text-sm text-slate-400 text-right">{{ exp.date | date }}</td>
              <td class="p-6 text-right">
                <p-button icon="pi pi-pencil" (onClick)="editExpense(exp)" styleClass="p-button-text p-button-info p-button-rounded mr-2"></p-button>
                <p-button icon="pi pi-trash" (onClick)="deleteExpense(exp)" styleClass="p-button-text p-button-danger p-button-rounded"></p-button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>

    <p-dialog [(visible)]="expDialog" [header]="expense.id ? 'Edit Expense' : 'New Expense'" [modal]="true" styleClass="p-fluid" [style]="{width: '450px'}">
      <div class="field mb-4">
        <label for="category" class="text-[10px] font-black uppercase text-slate-400 block mb-2">Category</label>
        <input type="text" pInputText id="category" [(ngModel)]="expense.category" required />
      </div>
      <div class="field mb-4">
        <label for="desc" class="text-[10px] font-black uppercase text-slate-400 block mb-2">Description</label>
        <input type="text" pInputText id="desc" [(ngModel)]="expense.description" />
      </div>
      <div class="field mb-6">
        <label for="amount" class="text-[10px] font-black uppercase text-slate-400 block mb-2">Amount</label>
        <input type="text" pInputText id="amount" [(ngModel)]="expense.amount" />
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancel" icon="pi pi-times" (onClick)="hideDialog()" styleClass="p-button-text"></p-button>
        <p-button label="Save" icon="pi pi-check" (onClick)="saveExpense()"></p-button>
      </ng-template>
    </p-dialog>
  `
})
export class ExpensesFinanceComponent implements OnInit {
  expenses: Expense[] = [];
  expense: Expense = { category: '', description: '', amount: '', date: new Date().toISOString() };
  expDialog = false;

  private firestore = inject(Firestore);
  private messageService = inject(MessageService);

  ngOnInit() {
    collectionData(collection(this.firestore, 'expenses'), { idField: 'id' }).subscribe(data => {
      this.expenses = data as Expense[];
    });
  }

  openNew() {
    this.expense = { category: '', description: '', amount: '', date: new Date().toISOString() };
    this.expDialog = true;
  }

  editExpense(exp: Expense) {
    this.expense = { ...exp };
    this.expDialog = true;
  }

  hideDialog() {
    this.expDialog = false;
  }

  async saveExpense() {
    if (!this.expense.category.trim()) return;
    try {
      if (this.expense.id) {
        await updateDoc(doc(this.firestore, 'expenses', this.expense.id), { ...this.expense });
        this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Expense log updated.' });
      } else {
        await addDoc(collection(this.firestore, 'expenses'), { ...this.expense });
        this.messageService.add({ severity: 'success', summary: 'Created', detail: 'New expense logged.' });
      }
      this.expDialog = false;
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Operation failed.' });
    }
  }

  async deleteExpense(exp: Expense) {
    if (!exp.id) return;
    try {
      await deleteDoc(doc(this.firestore, 'expenses', exp.id));
      this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Entry removed.' });
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Delete failed.' });
    }
  }
}
