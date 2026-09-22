import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Firestore, collection, collectionData, addDoc, doc, deleteDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-funds-finance',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, DialogModule, ToastModule],
  template: `
    <p-toast></p-toast>
    <div class="p-8 bg-white min-h-screen">
      <div class="flex justify-between items-center mb-10">
        <div>
          <span class="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block">Capital Management</span>
          <h1 class="text-3xl font-black tracking-tighter text-slate-900">Funds & Liquidity</h1>
        </div>
        <p-button label="Add Entry" icon="pi pi-plus" (onClick)="openNew()" styleClass="p-button-success p-button-rounded"></p-button>
      </div>

      <div class="card-white p-0 overflow-hidden shadow-2xl border-slate-100">
        <p-table [value]="funds" [paginator]="true" [rows]="10">
          <ng-template pTemplate="header">
            <tr>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Source</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Total Capital</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-fund>
            <tr class="border-t border-slate-50">
              <td class="p-6 font-bold text-slate-900">{{ fund.source }}</td>
              <td class="p-6 font-black text-blue-600">{{ fund.amount }}</td>
              <td class="p-6 text-sm text-slate-500 uppercase tracking-widest font-bold">{{ fund.status }}</td>
              <td class="p-6 text-right">
                <p-button icon="pi pi-trash" (onClick)="deleteFund(fund)" styleClass="p-button-text p-button-danger p-button-rounded"></p-button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>

    <p-dialog [(visible)]="fundDialog" header="Log Capital Entry" [modal]="true" styleClass="p-fluid" [style]="{width: '450px'}">
      <div class="field mb-4">
        <label class="text-[10px] font-black uppercase text-slate-400 block mb-2">Funding Source</label>
        <input type="text" pInputText [(ngModel)]="fund.source" required />
      </div>
      <div class="field mb-6">
        <label class="text-[10px] font-black uppercase text-slate-400 block mb-2">Amount</label>
        <input type="text" pInputText [(ngModel)]="fund.amount" />
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancel" icon="pi pi-times" (onClick)="fundDialog = false" styleClass="p-button-text"></p-button>
        <p-button label="Confirm" icon="pi pi-check" (onClick)="saveFund()"></p-button>
      </ng-template>
    </p-dialog>
  `
})
export class FundsFinanceComponent implements OnInit {
  funds: any[] = [];
  fund = { source: '', amount: '', status: 'available' };
  fundDialog = false;
  private firestore = inject(Firestore);
  private messageService = inject(MessageService);

  ngOnInit() {
    collectionData(collection(this.firestore, 'funds_ledger'), { idField: 'id' }).subscribe(d => this.funds = d);
  }

  openNew() {
    this.fund = { source: '', amount: '', status: 'available' };
    this.fundDialog = true;
  }

  async saveFund() {
    if (!this.fund.source.trim()) return;
    try {
      await addDoc(collection(this.firestore, 'funds_ledger'), { ...this.fund });
      this.messageService.add({ severity: 'success', summary: 'Logged', detail: 'Capital entry verified.' });
      this.fundDialog = false;
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Operation failed.' });
    }
  }

  async deleteFund(fund: any) {
    if (!fund.id) return;
    try {
      await deleteDoc(doc(this.firestore, 'funds_ledger', fund.id));
      this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Entry removed.' });
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Delete failed.' });
    }
  }
}
