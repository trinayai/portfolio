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

interface Employee {
  id?: string;
  name: string;
  role: string;
  email: string;
  salary: string;
}

@Component({
  selector: 'app-employee-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, DialogModule, ToastModule],
  template: `
    <p-toast></p-toast>
    <div class="p-8 bg-white min-h-screen">
      <div class="flex justify-between items-center mb-10">
        <div>
          <span class="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block">Human Resources</span>
          <h1 class="text-3xl font-black tracking-tighter text-slate-900">Employee Registry</h1>
        </div>
        <p-button label="Add Employee" icon="pi pi-plus" (onClick)="openNew()" styleClass="p-button-success p-button-rounded"></p-button>
      </div>

      <div class="card-white p-0 overflow-hidden shadow-2xl border-slate-100">
        <p-table [value]="employees" [paginator]="true" [rows]="10">
          <ng-template pTemplate="header">
            <tr>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Employee Name</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">Email</th>
              <th class="p-6 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-emp>
            <tr class="border-t border-slate-50">
              <td class="p-6 font-bold text-slate-900">{{ emp.name }}</td>
              <td class="p-6 text-sm text-slate-600">{{ emp.role }}</td>
              <td class="p-6 text-sm text-slate-600">{{ emp.email }}</td>
              <td class="p-6 text-right">
                <p-button icon="pi pi-pencil" (onClick)="editEmployee(emp)" styleClass="p-button-text p-button-info p-button-rounded mr-2"></p-button>
                <p-button icon="pi pi-trash" (onClick)="deleteEmployee(emp)" styleClass="p-button-text p-button-danger p-button-rounded"></p-button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>

    <p-dialog [(visible)]="empDialog" [header]="employee.id ? 'Edit Employee' : 'New Employee'" [modal]="true" styleClass="p-fluid" [style]="{width: '450px'}">
      <div class="field mb-4">
        <label for="name" class="text-[10px] font-black uppercase text-slate-400 block mb-2">Full Name</label>
        <input type="text" pInputText id="name" [(ngModel)]="employee.name" required />
      </div>
      <div class="field mb-4">
        <label for="role" class="text-[10px] font-black uppercase text-slate-400 block mb-2">Role</label>
        <input type="text" pInputText id="role" [(ngModel)]="employee.role" />
      </div>
      <div class="field mb-6">
        <label for="email" class="text-[10px] font-black uppercase text-slate-400 block mb-2">Email Address</label>
        <input type="email" pInputText id="email" [(ngModel)]="employee.email" />
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancel" icon="pi pi-times" (onClick)="hideDialog()" styleClass="p-button-text"></p-button>
        <p-button label="Save" icon="pi pi-check" (onClick)="saveEmployee()"></p-button>
      </ng-template>
    </p-dialog>
  `
})
export class EmployeeManageComponent implements OnInit {
  employees: Employee[] = [];
  employee: Employee = { name: '', role: '', email: '', salary: '' };
  empDialog = false;

  private firestore = inject(Firestore);
  private messageService = inject(MessageService);

  ngOnInit() {
    collectionData(collection(this.firestore, 'employees'), { idField: 'id' }).subscribe(data => {
      this.employees = data as Employee[];
    });
  }

  openNew() {
    this.employee = { name: '', role: '', email: '', salary: '' };
    this.empDialog = true;
  }

  editEmployee(emp: Employee) {
    this.employee = { ...emp };
    this.empDialog = true;
  }

  hideDialog() {
    this.empDialog = false;
  }

  async saveEmployee() {
    if (!this.employee.name.trim()) return;

    try {
      if (this.employee.id) {
        await updateDoc(doc(this.firestore, 'employees', this.employee.id), { ...this.employee });
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Employee record saved.' });
      } else {
        await addDoc(collection(this.firestore, 'employees'), { ...this.employee });
        this.messageService.add({ severity: 'success', summary: 'Created', detail: 'New employee added.' });
      }
      this.empDialog = false;
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Operation failed.' });
    }
  }

  async deleteEmployee(emp: Employee) {
    if (!emp.id) return;
    try {
      await deleteDoc(doc(this.firestore, 'employees', emp.id));
      this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Employee record removed.' });
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Delete failed.' });
    }
  }
}
