import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-tenders-docs',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, FileUploadModule, ToastModule],
  template: `
    <p-toast></p-toast>
    <div class="p-8 bg-white min-h-screen">
      <div class="flex justify-between items-center mb-10">
        <div>
          <span class="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block">Tender Management</span>
          <h1 class="text-3xl font-black tracking-tighter text-slate-900">Project Tenders</h1>
        </div>
        <p-fileUpload mode="basic" [auto]="true" (onSelect)="onUpload($event)"
                      chooseLabel="New Tender" styleClass="p-button-success p-button-rounded"></p-fileUpload>
      </div>

      <div class="card-white p-0 overflow-hidden shadow-2xl border-slate-100">
        <p-table [value]="docs" [paginator]="true" [rows]="10">
          <ng-template pTemplate="header">
            <tr>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Tender Name</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-doc>
            <tr class="border-t border-slate-50">
              <td class="p-6 font-bold text-slate-900">{{ doc.name }}</td>
              <td class="p-6 text-sm text-slate-400">{{ doc.uploadDate | date }}</td>
              <td class="p-6 text-right">
                <a [href]="doc.url" target="_blank" class="p-button p-button-text p-button-info p-button-rounded mr-2"><i class="pi pi-file-pdf"></i></a>
                <p-button icon="pi pi-trash" (onClick)="deleteDoc(doc)" styleClass="p-button-text p-button-danger p-button-rounded"></p-button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `
})
export class TendersDocsComponent implements OnInit {
  docs: any[] = [];
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private messageService = inject(MessageService);

  ngOnInit() {
    collectionData(collection(this.firestore, 'tenders_docs'), { idField: 'id' }).subscribe(data => this.docs = data);
  }

  async onUpload(event: any) {
    const file = event.files[0];
    if (!file) return;
    try {
      const path = `documents/tenders/${Date.now()}_${file.name}`;
      const url = await getDownloadURL((await uploadBytes(ref(this.storage, path), file)).ref);
      await addDoc(collection(this.firestore, 'tenders_docs'), { name: file.name, url, uploadDate: new Date().toISOString() });
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Tender file published.' });
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Operation failed.' });
    }
  }

  async deleteDoc(docFile: any) {
    if (!docFile.id) return;
    try {
      await deleteDoc(doc(this.firestore, 'tenders_docs', docFile.id));
      this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Tender removed.' });
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Delete failed.' });
    }
  }
}
