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

interface Asset {
  id?: string;
  name: string;
  category: string;
  value: string;
  purchaseDate: string;
}

@Component({
  selector: 'app-assets-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, DialogModule, ToastModule],
  template: `
    <p-toast></p-toast>
    <div class="p-8 bg-white min-h-screen">
      <div class="flex justify-between items-center mb-10">
        <div>
          <span class="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block">Fixed Assets</span>
          <h1 class="text-3xl font-black tracking-tighter text-slate-900">Asset Inventory</h1>
        </div>
        <p-button label="Register Asset" icon="pi pi-plus" (onClick)="openNew()" styleClass="p-button-success p-button-rounded"></p-button>
      </div>

      <div class="card-white p-0 overflow-hidden shadow-2xl border-slate-100">
        <p-table [value]="assets" [paginator]="true" [rows]="10">
          <ng-template pTemplate="header">
            <tr>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Name</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Value</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-asset>
            <tr class="border-t border-slate-50">
              <td class="p-6 font-bold text-slate-900">{{ asset.name }}</td>
              <td class="p-6 text-sm text-slate-600">{{ asset.category }}</td>
              <td class="p-6 text-sm text-slate-600">{{ asset.value }}</td>
              <td class="p-6 text-right">
                <p-button icon="pi pi-pencil" (onClick)="editAsset(asset)" styleClass="p-button-text p-button-info p-button-rounded mr-2"></p-button>
                <p-button icon="pi pi-trash" (onClick)="deleteAsset(asset)" styleClass="p-button-text p-button-danger p-button-rounded"></p-button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>

    <p-dialog [(visible)]="assetDialog" [header]="asset.id ? 'Edit Asset' : 'New Asset'" [modal]="true" styleClass="p-fluid" [style]="{width: '450px'}">
      <div class="field mb-4">
        <label for="name" class="text-[10px] font-black uppercase text-slate-400 block mb-2">Asset Name</label>
        <input type="text" pInputText id="name" [(ngModel)]="asset.name" required />
      </div>
      <div class="field mb-4">
        <label for="category" class="text-[10px] font-black uppercase text-slate-400 block mb-2">Category</label>
        <input type="text" pInputText id="category" [(ngModel)]="asset.category" />
      </div>
      <div class="field mb-6">
        <label for="value" class="text-[10px] font-black uppercase text-slate-400 block mb-2">Est. Value</label>
        <input type="text" pInputText id="value" [(ngModel)]="asset.value" />
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancel" icon="pi pi-times" (onClick)="hideDialog()" styleClass="p-button-text"></p-button>
        <p-button label="Save" icon="pi pi-check" (onClick)="saveAsset()"></p-button>
      </ng-template>
    </p-dialog>
  `
})
export class AssetsManageComponent implements OnInit {
  assets: Asset[] = [];
  asset: Asset = { name: '', category: '', value: '', purchaseDate: '' };
  assetDialog = false;

  private firestore = inject(Firestore);
  private messageService = inject(MessageService);

  ngOnInit() {
    collectionData(collection(this.firestore, 'assets'), { idField: 'id' }).subscribe(data => {
      this.assets = data as Asset[];
    });
  }

  openNew() {
    this.asset = { name: '', category: '', value: '', purchaseDate: '' };
    this.assetDialog = true;
  }

  editAsset(asset: Asset) {
    this.asset = { ...asset };
    this.assetDialog = true;
  }

  hideDialog() {
    this.assetDialog = false;
  }

  async saveAsset() {
    if (!this.asset.name.trim()) return;
    try {
      if (this.asset.id) {
        await updateDoc(doc(this.firestore, 'assets', this.asset.id), { ...this.asset });
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Asset saved.' });
      } else {
        await addDoc(collection(this.firestore, 'assets'), { ...this.asset });
        this.messageService.add({ severity: 'success', summary: 'Created', detail: 'New asset registered.' });
      }
      this.assetDialog = false;
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Sync failed.' });
    }
  }

  async deleteAsset(asset: Asset) {
    if (!asset.id) return;
    try {
      await deleteDoc(doc(this.firestore, 'assets', asset.id));
      this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Asset removed.' });
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Delete failed.' });
    }
  }
}
