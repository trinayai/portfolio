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
import { Observable } from 'rxjs';

interface Vendor {
  id?: string;
  name: string;
  contact: string;
  service: string;
  status: string;
}

@Component({
  selector: 'app-vendors-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, DialogModule, ToastModule],
  template: `
    <p-toast></p-toast>
    <div class="p-8 bg-white min-h-screen">
      <div class="flex justify-between items-center mb-10">
        <div>
          <span class="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block">Supply Chain</span>
          <h1 class="text-3xl font-black tracking-tighter text-slate-900">Vendor Directory</h1>
        </div>
        <p-button label="Add Vendor" icon="pi pi-plus" (onClick)="openNew()" styleClass="p-button-success p-button-rounded"></p-button>
      </div>

      <div class="card-white p-0 overflow-hidden shadow-2xl border-slate-100">
        <p-table [value]="vendors" [paginator]="true" [rows]="10">
          <ng-template pTemplate="header">
            <tr>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Vendor Name</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Service Area</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-vendor>
            <tr class="border-t border-slate-50">
              <td class="p-6 font-bold text-slate-900">{{ vendor.name }}</td>
              <td class="p-6 text-sm text-slate-600">{{ vendor.contact }}</td>
              <td class="p-6 text-sm text-slate-600">{{ vendor.service }}</td>
              <td class="p-6 text-right">
                <p-button icon="pi pi-pencil" (onClick)="editVendor(vendor)" styleClass="p-button-text p-button-info p-button-rounded mr-2"></p-button>
                <p-button icon="pi pi-trash" (onClick)="deleteVendor(vendor)" styleClass="p-button-text p-button-danger p-button-rounded"></p-button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>

    <p-dialog [(visible)]="vendorDialog" [header]="vendor.id ? 'Edit Vendor' : 'New Vendor'" [modal]="true" styleClass="p-fluid" [style]="{width: '450px'}">
      <div class="field mb-4">
        <label for="name" class="text-[10px] font-black uppercase text-slate-400 block mb-2">Name</label>
        <input type="text" pInputText id="name" [(ngModel)]="vendor.name" required autofocus />
      </div>
      <div class="field mb-4">
        <label for="contact" class="text-[10px] font-black uppercase text-slate-400 block mb-2">Contact Info</label>
        <input type="text" pInputText id="contact" [(ngModel)]="vendor.contact" />
      </div>
      <div class="field mb-6">
        <label for="service" class="text-[10px] font-black uppercase text-slate-400 block mb-2">Service Provided</label>
        <input type="text" pInputText id="service" [(ngModel)]="vendor.service" />
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancel" icon="pi pi-times" (onClick)="hideDialog()" styleClass="p-button-text"></p-button>
        <p-button label="Save" icon="pi pi-check" (onClick)="saveVendor()"></p-button>
      </ng-template>
    </p-dialog>
  `
})
export class VendorsManageComponent implements OnInit {
  vendors: Vendor[] = [];
  vendor: Vendor = { name: '', contact: '', service: '', status: 'active' };
  vendorDialog = false;

  private firestore = inject(Firestore);
  private messageService = inject(MessageService);

  ngOnInit() {
    collectionData(collection(this.firestore, 'vendors'), { idField: 'id' }).subscribe(data => {
      this.vendors = data as Vendor[];
    });
  }

  openNew() {
    this.vendor = { name: '', contact: '', service: '', status: 'active' };
    this.vendorDialog = true;
  }

  editVendor(vendor: Vendor) {
    this.vendor = { ...vendor };
    this.vendorDialog = true;
  }

  hideDialog() {
    this.vendorDialog = false;
  }

  async saveVendor() {
    if (!this.vendor.name.trim()) return;

    try {
      if (this.vendor.id) {
        await updateDoc(doc(this.firestore, 'vendors', this.vendor.id), { ...this.vendor });
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Vendor information saved.' });
      } else {
        await addDoc(collection(this.firestore, 'vendors'), { ...this.vendor });
        this.messageService.add({ severity: 'success', summary: 'Created', detail: 'New vendor added to system.' });
      }
      this.vendorDialog = false;
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save vendor.' });
    }
  }

  async deleteVendor(vendor: Vendor) {
    if (!vendor.id) return;
    try {
      await deleteDoc(doc(this.firestore, 'vendors', vendor.id));
      this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Vendor removed.' });
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete.' });
    }
  }
}
