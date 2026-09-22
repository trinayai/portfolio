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

interface Client {
  id?: string;
  name: string;
  industry: string;
  email: string;
}

@Component({
  selector: 'app-clients-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, DialogModule, ToastModule],
  template: `
    <p-toast></p-toast>
    <div class="p-8 bg-white min-h-screen">
      <div class="flex justify-between items-center mb-10">
        <div>
          <span class="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block">Enterprise Relations</span>
          <h1 class="text-3xl font-black tracking-tighter text-slate-900">Client Directory</h1>
        </div>
        <p-button label="Add Client" icon="pi pi-plus" (onClick)="openNew()" styleClass="p-button-success p-button-rounded"></p-button>
      </div>

      <div class="card-white p-0 overflow-hidden shadow-2xl border-slate-100">
        <p-table [value]="clients" [paginator]="true" [rows]="10">
          <ng-template pTemplate="header">
            <tr>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Client Name</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Industry</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Email</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-client>
            <tr class="border-t border-slate-50">
              <td class="p-6 font-bold text-slate-900">{{ client.name }}</td>
              <td class="p-6 text-sm text-slate-600">{{ client.industry }}</td>
              <td class="p-6 text-sm text-slate-600">{{ client.email }}</td>
              <td class="p-6 text-right">
                <p-button icon="pi pi-pencil" (onClick)="editClient(client)" styleClass="p-button-text p-button-info p-button-rounded mr-2"></p-button>
                <p-button icon="pi pi-trash" (onClick)="deleteClient(client)" styleClass="p-button-text p-button-danger p-button-rounded"></p-button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>

    <p-dialog [(visible)]="clientDialog" [header]="client.id ? 'Edit Client' : 'New Client'" [modal]="true" styleClass="p-fluid" [style]="{width: '450px'}">
      <div class="field mb-4">
        <label for="name" class="text-[10px] font-black uppercase text-slate-400 block mb-2">Company Name</label>
        <input type="text" pInputText id="name" [(ngModel)]="client.name" required />
      </div>
      <div class="field mb-4">
        <label for="industry" class="text-[10px] font-black uppercase text-slate-400 block mb-2">Industry</label>
        <input type="text" pInputText id="industry" [(ngModel)]="client.industry" />
      </div>
      <div class="field mb-6">
        <label for="email" class="text-[10px] font-black uppercase text-slate-400 block mb-2">Contact Email</label>
        <input type="email" pInputText id="email" [(ngModel)]="client.email" />
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancel" icon="pi pi-times" (onClick)="hideDialog()" styleClass="p-button-text"></p-button>
        <p-button label="Save" icon="pi pi-check" (onClick)="saveClient()"></p-button>
      </ng-template>
    </p-dialog>
  `
})
export class ClientsManageComponent implements OnInit {
  clients: Client[] = [];
  client: Client = { name: '', industry: '', email: '' };
  clientDialog = false;

  private firestore = inject(Firestore);
  private messageService = inject(MessageService);

  ngOnInit() {
    collectionData(collection(this.firestore, 'clients_records'), { idField: 'id' }).subscribe(data => {
      this.clients = data as Client[];
    });
  }

  openNew() {
    this.client = { name: '', industry: '', email: '' };
    this.clientDialog = true;
  }

  editClient(client: Client) {
    this.client = { ...client };
    this.clientDialog = true;
  }

  hideDialog() {
    this.clientDialog = false;
  }

  async saveClient() {
    if (!this.client.name.trim()) return;
    try {
      if (this.client.id) {
        await updateDoc(doc(this.firestore, 'clients_records', this.client.id), { ...this.client });
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Client info saved.' });
      } else {
        await addDoc(collection(this.firestore, 'clients_records'), { ...this.client });
        this.messageService.add({ severity: 'success', summary: 'Created', detail: 'New client added.' });
      }
      this.clientDialog = false;
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Sync failed.' });
    }
  }

  async deleteClient(client: Client) {
    if (!client.id) return;
    try {
      await deleteDoc(doc(this.firestore, 'clients_records', client.id));
      this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Client removed.' });
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Delete failed.' });
    }
  }
}
