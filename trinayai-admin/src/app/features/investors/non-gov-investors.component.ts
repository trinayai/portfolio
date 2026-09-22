import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc } from '@angular/fire/firestore';

@Component({
  selector: 'app-non-gov-investors',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, DialogModule, ToastModule],
  template: `
    <p-toast></p-toast>
    <div class="p-8 bg-white min-h-screen">
      <div class="flex justify-between items-center mb-10">
        <div>
          <span class="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block">Private Capital</span>
          <h1 class="text-3xl font-black tracking-tighter text-slate-900">Private Investors</h1>
        </div>
        <p-button label="Register Investor" icon="pi pi-user-plus" (onClick)="openNew()" styleClass="p-button-success p-button-rounded"></p-button>
      </div>

      <div class="card-white p-0 overflow-hidden shadow-2xl border-slate-100">
        <p-table [value]="investors" [paginator]="true" [rows]="10">
          <ng-template pTemplate="header">
            <tr>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Investor Name</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Commitment</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-inv>
            <tr class="border-t border-slate-50">
              <td class="p-6 font-bold text-slate-900">{{ inv.name }}</td>
              <td class="p-6 font-black text-blue-600">{{ inv.amount }}</td>
              <td class="p-6 text-right">
                <p-button icon="pi pi-trash" (onClick)="deleteInv(inv)" styleClass="p-button-text p-button-danger p-button-rounded"></p-button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>

    <p-dialog [(visible)]="invDialog" header="Register Private Investor" [modal]="true" styleClass="p-fluid" [style]="{width: '450px'}">
      <div class="field mb-4">
        <label class="text-[10px] font-black uppercase text-slate-400 block mb-2">Individual/Firm Name</label>
        <input type="text" pInputText [(ngModel)]="investor.name" required />
      </div>
      <div class="field mb-6">
        <label class="text-[10px] font-black uppercase text-slate-400 block mb-2">Commitment Amount</label>
        <input type="text" pInputText [(ngModel)]="investor.amount" />
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancel" icon="pi pi-times" (onClick)="invDialog = false" styleClass="p-button-text"></p-button>
        <p-button label="Register" icon="pi pi-check" (onClick)="saveInv()"></p-button>
      </ng-template>
    </p-dialog>
  `
})
export class NonGovInvestorsComponent implements OnInit {
  investors: any[] = [];
  investor = { name: '', amount: '' };
  invDialog = false;
  private firestore = inject(Firestore);
  private messageService = inject(MessageService);

  ngOnInit() {
    collectionData(collection(this.firestore, 'private_investors'), { idField: 'id' }).subscribe(d => this.investors = d);
  }

  openNew() {
    this.investor = { name: '', amount: '' };
    this.invDialog = true;
  }

  async saveInv() {
    if (!this.investor.name.trim()) return;
    try {
      await addDoc(collection(this.firestore, 'private_investors'), { ...this.investor });
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Investor registered.' });
      this.invDialog = false;
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Sync failed.' });
    }
  }

  async deleteInv(inv: any) {
    if (!inv.id) return;
    try {
      await deleteDoc(doc(this.firestore, 'private_investors', inv.id));
      this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Record removed.' });
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Operation failed.' });
    }
  }
}
