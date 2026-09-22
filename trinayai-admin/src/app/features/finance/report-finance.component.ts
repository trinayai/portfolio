import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

@Component({
  selector: 'app-report-finance',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule],
  template: `
    <div class="p-8 bg-white min-h-screen">
      <div class="mb-10">
        <span class="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block">Executive Insights</span>
        <h1 class="text-3xl font-black tracking-tighter text-slate-900">Financial Reports</h1>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
         <div class="lg:col-span-2 card-white p-8">
            <h4 class="text-xs font-black uppercase text-slate-400 mb-6">Revenue Growth</h4>
            <p-chart type="line" [data]="chartData" [options]="chartOptions"></p-chart>
         </div>
         <div class="space-y-8">
            <div class="card-white p-8 bg-blue-600 text-white border-none shadow-2xl">
               <h4 class="text-[9px] font-black uppercase tracking-widest opacity-80 mb-4">Current ARR</h4>
               <p class="text-3xl font-black mb-1">₹4.2M</p>
               <p class="text-[10px] font-bold text-blue-200">+12.4% from last quarter</p>
            </div>
            <div class="card-white p-8 bg-slate-900 text-white border-none shadow-2xl">
               <h4 class="text-[9px] font-black uppercase tracking-widest opacity-80 mb-4">Total Assets</h4>
               <p class="text-3xl font-black mb-1">₹28.5M</p>
               <p class="text-[10px] font-bold text-slate-400">Verified inventory & property</p>
            </div>
         </div>
      </div>
    </div>
  `
})
export class ReportFinanceComponent implements OnInit {
  chartData: any;
  chartOptions: any;

  ngOnInit() {
    this.chartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Revenue (INR)',
          data: [650000, 590000, 800000, 810000, 560000, 950000],
          fill: true,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          tension: 0.4
        }
      ]
    };

    this.chartOptions = {
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
        x: { grid: { display: false } }
      }
    };
  }
}
