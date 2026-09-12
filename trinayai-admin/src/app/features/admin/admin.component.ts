import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@angular/fire/auth';
import { AuthService } from '../../core/services/auth.service';
import { SiteContentService } from '../../core/services/site-content.service';
import { AboutCard, AboutEvent, ClientItem, ContentItem, SectionItem, SiteSettings } from '../../core/models/site-content';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, InputTextareaModule, CardModule, TabViewModule, FileUploadModule, ToastModule, MessageModule, InputSwitchModule],
  template: `
    <p-toast></p-toast>
    <div class="min-h-screen bg-[#050c1f] px-4 py-16 text-white md:px-8 lg:px-12">
      <div class="mx-auto max-w-7xl">
        <div class="mb-12 flex flex-wrap items-center justify-between gap-6">
          <div>
            <span class="inline-block rounded-full bg-red-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-red-400 ring-1 ring-red-500/20 mb-4">
              Authorized Personnel Only
            </span>
            <h1 class="text-4xl font-black tracking-tight text-white sm:text-5xl">Content <span class="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Management</span></h1>
          </div>
          <div class="flex gap-4">
            <p-button label="Logout" icon="pi pi-power-off" (onClick)="logout()" styleClass="p-button-danger p-button-outlined border-white/10 text-white hover:bg-red-500/10"></p-button>
          </div>
        </div>

        <p-message></p-message>

        @if (authUser) {
          <p-card class="border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl admin-main-card">
            <p-tabView class="custom-tabview">

              <p-tabPanel header="Branding">
                <div class="grid gap-8 lg:grid-cols-2">
                   <div class="space-y-6">
                      <div class="flex flex-col gap-2">
                        <label class="text-xs font-bold uppercase tracking-widest text-slate-500">Brand Name</label>
                        <input pInputText [(ngModel)]="settings.brandName" class="w-full bg-black/20 border-white/10 text-white" />
                      </div>
                      <div class="flex flex-col gap-2">
                        <label class="text-xs font-bold uppercase tracking-widest text-slate-500">Footer Text</label>
                        <textarea pInputTextarea [(ngModel)]="settings.footerText" rows="4" class="w-full bg-black/20 border-white/10 text-white"></textarea>
                      </div>
                      <div class="flex flex-col gap-2">
                        <label class="text-xs font-bold uppercase tracking-widest text-slate-500">Contact Recipient Email</label>
                        <input pInputText type="email" [(ngModel)]="settings.contactEmail" placeholder="admin&#64;trinayai.com" class="w-full bg-black/20 border-white/10 text-white" />
                        <small class="text-slate-500">Project brief emails open addressed to this inbox.</small>
                      </div>
                      <label class="flex items-center gap-3 text-sm font-semibold text-slate-300">
                        <input type="checkbox" [(ngModel)]="settings.showIndiaAiBadge" />
                        Show IndiaAI Mission badge on the home hero
                      </label>
                      <div class="grid gap-4 md:grid-cols-2">
                        <input pInputText [(ngModel)]="settings.homeDescription" placeholder="Home supporting description" class="bg-black/20 border-white/10 text-white" />
                        <input pInputText [(ngModel)]="settings.homeScaleCtaText" placeholder="Home scale CTA" class="bg-black/20 border-white/10 text-white" />
                      </div>
                      <p-button label="Save Branding" icon="pi pi-save" (onClick)="saveSettings()" styleClass="p-button-info w-full md:w-auto"></p-button>
                   </div>
                   <div class="space-y-4">
                      <label class="text-xs font-bold uppercase tracking-widest text-slate-500">Site Logo</label>
                      <div class="p-6 rounded-xl border border-dashed border-white/20 bg-white/5 flex flex-col items-center">
                         @if (settings.logoUrl) {
                           <img [src]="settings.logoUrl" alt="logo" class="h-24 w-24 rounded-full object-cover mb-4 shadow-lg shadow-cyan-500/20" />
                         }
                        <p-fileUpload mode="basic" name="logo" accept="image/*" [auto]="true" (onSelect)="onLogoUpload($event)"
                                        chooseLabel="Upload New Logo" styleClass="p-button-outlined p-button-sm"></p-fileUpload>
                      </div>
                   </div>
                </div>
              </p-tabPanel>

              <p-tabPanel header="Home Page">
                <div class="space-y-10">
                   <div>
                     <h3 class="text-xl font-bold text-white mb-6 border-b border-white/5 pb-2">Hero Section</h3>
                     <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div class="flex flex-col gap-2">
                          <label class="text-xs font-bold uppercase tracking-widest text-slate-500">Badge Text</label>
                          <input pInputText [(ngModel)]="settings.heroBadge" class="bg-black/20 border-white/10 text-white" />
                        </div>
                        <div class="flex flex-col gap-2">
                          <label class="text-xs font-bold uppercase tracking-widest text-slate-500">Title</label>
                          <input pInputText [(ngModel)]="settings.heroTitle" class="bg-black/20 border-white/10 text-white" />
                        </div>
                        <div class="flex flex-col gap-2">
                          <label class="text-xs font-bold uppercase tracking-widest text-slate-500">CTA Text</label>
                          <input pInputText [(ngModel)]="settings.heroPrimaryCtaText" class="bg-black/20 border-white/10 text-white" />
                        </div>
                        <div class="flex flex-col gap-2 md:col-span-2">
                          <label class="text-xs font-bold uppercase tracking-widest text-slate-500">Scale Card Description</label>
                          <textarea pInputTextarea [(ngModel)]="settings.homeScaleDescription" rows="2" class="bg-black/20 border-white/10 text-white"></textarea>
                        </div>
                     </div>
                     <p-button label="Save Hero Settings" icon="pi pi-save" (onClick)="saveSettings()" styleClass="mt-4 p-button-info p-button-sm"></p-button>
                   </div>

                   <div>
                     <div class="flex items-center justify-between mb-6 border-b border-white/5 pb-2">
                       <h3 class="text-xl font-bold text-white">Features / Stats</h3>
                       <p-button label="Add Section" icon="pi pi-plus" (onClick)="addHomeSection()" styleClass="p-button-sm p-button-success"></p-button>
                     </div>
                     <div class="grid gap-6 md:grid-cols-2">
                        @for (item of homeSections; track item.id) {
                          <div class="p-6 rounded-xl border border-white/5 bg-white/5 space-y-4">
                            <div class="flex items-center justify-between">
                              <span class="text-xs font-bold uppercase tracking-widest text-slate-500">Visible</span>
                              <p-inputSwitch [(ngModel)]="item.isVisible"></p-inputSwitch>
                            </div>
                            <div class="grid gap-4">
                              <input pInputText [(ngModel)]="item.title" placeholder="Title" class="w-full bg-black/20 border-white/10 text-white" />
                              <input pInputText [(ngModel)]="item.icon" placeholder="Icon (pi pi-...)" class="w-full bg-black/20 border-white/10 text-white" />
                              <textarea pInputTextarea [(ngModel)]="item.description" rows="2" placeholder="Description" class="w-full bg-black/20 border-white/10 text-white"></textarea>
                            </div>
                            <div class="flex gap-2">
                              <p-button icon="pi pi-save" (onClick)="saveHomeSection(item)" styleClass="p-button-sm p-button-info"></p-button>
                              <p-button icon="pi pi-trash" (onClick)="deleteHomeSection(item)" styleClass="p-button-sm p-button-danger p-button-outlined"></p-button>
                            </div>
                          </div>
                        }
                     </div>
                   </div>
                </div>
              </p-tabPanel>

              <p-tabPanel header="Subscriptions">
                 <div class="mb-10 flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <h3 class="text-xl font-bold text-white">Subscription Plans</h3>
                      <p class="text-slate-400 text-sm">Manage the AI packages shown on the public subscription page.</p>
                    </div>
                    <p-button label="Create Plan" icon="pi pi-plus" (onClick)="addAiMenuItem()" styleClass="p-button-success"></p-button>
                 </div>

                 <div class="grid gap-8 lg:grid-cols-2">
                    @for (item of aiMenuItems; track item.id) {
                      <div class="p-8 rounded-3xl border border-white/10 bg-white/5 space-y-6">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-6">
                            <div class="flex items-center gap-2">
                              <span class="text-[10px] font-black uppercase tracking-widest text-slate-500">Visible</span>
                              <p-inputSwitch [(ngModel)]="item.isVisible"></p-inputSwitch>
                            </div>
                            <div class="flex items-center gap-2">
                              <span class="text-[10px] font-black uppercase tracking-widest text-slate-500">Popular</span>
                              <p-inputSwitch [(ngModel)]="item.isPopular"></p-inputSwitch>
                            </div>
                          </div>
                          <h4 class="text-lg font-bold text-blue-400">Plan #{{ aiMenuItems.indexOf(item) + 1 }}</h4>
                        </div>

                        <div class="grid gap-4 md:grid-cols-2">
                          <div class="flex flex-col gap-2">
                            <label class="text-[10px] font-black uppercase tracking-widest text-slate-500">Title</label>
                            <input pInputText [(ngModel)]="item.title" class="w-full bg-black/20 border-white/10 text-white" />
                          </div>
                          <div class="flex flex-col gap-2">
                            <label class="text-[10px] font-black uppercase tracking-widest text-slate-500">Price (e.g. ₹9,999)</label>
                            <input pInputText [(ngModel)]="item.price" class="w-full bg-black/20 border-white/10 text-white" />
                          </div>
                          <div class="flex flex-col gap-2">
                            <label class="text-[10px] font-black uppercase tracking-widest text-slate-500">Billing Cycle (e.g. / mo)</label>
                            <input pInputText [(ngModel)]="item.billingCycle" class="w-full bg-black/20 border-white/10 text-white" />
                          </div>
                          <div class="flex flex-col gap-2">
                            <label class="text-[10px] font-black uppercase tracking-widest text-slate-500">Icon Class</label>
                            <input pInputText [(ngModel)]="item.icon" class="w-full bg-black/20 border-white/10 text-white" />
                          </div>
                        </div>

                        <div class="flex flex-col gap-2">
                          <label class="text-[10px] font-black uppercase tracking-widest text-slate-500">Short Description</label>
                          <textarea pInputTextarea [(ngModel)]="item.description" rows="2" class="w-full bg-black/20 border-white/10 text-white"></textarea>
                        </div>

                        <div class="flex flex-col gap-2">
                          <label class="text-[10px] font-black uppercase tracking-widest text-slate-500">Features (one per line)</label>
                          <textarea pInputTextarea
                                   [ngModel]="item.features?.join('\n')"
                                   (ngModelChange)="updateItemFeatures(item, $event)"
                                   rows="5" class="w-full bg-black/20 border-white/10 text-white" placeholder="Feature 1\nFeature 2..."></textarea>
                        </div>

                        <div class="flex gap-3 pt-4 border-t border-white/5">
                          <p-button label="Save Plan" icon="pi pi-check" (onClick)="saveAiMenuItem(item)" styleClass="p-button-info flex-grow"></p-button>
                          <p-button icon="pi pi-trash" (onClick)="deleteAiMenuItem(item)" styleClass="p-button-danger p-button-outlined"></p-button>
                        </div>
                      </div>
                    }
                 </div>
              </p-tabPanel>

              <p-tabPanel header="Services">
                  <div class="mb-10 flex items-center justify-between border-b border-white/5 pb-4">
                    <h3 class="text-xl font-bold text-white">General Services</h3>
                    <p-button label="New Service" icon="pi pi-plus" (onClick)="addService()" styleClass="p-button-success p-button-sm"></p-button>
                  </div>
                  <div class="grid gap-6 md:grid-cols-2">
                    @for (item of services; track item.id) {
                      <div class="p-6 rounded-xl border border-white/10 bg-white/5 space-y-4">
                        <div class="flex items-center justify-between">
                          <span class="text-xs font-bold uppercase tracking-widest text-slate-500">Visible</span>
                          <p-inputSwitch [(ngModel)]="item.isVisible"></p-inputSwitch>
                        </div>
                        <div class="grid gap-4">
                          <input pInputText [(ngModel)]="item.title" placeholder="Service Title" class="w-full bg-black/20 border-white/10 text-white" />
                          <input pInputText [(ngModel)]="item.icon" placeholder="Icon" class="w-full bg-black/20 border-white/10 text-white" />
                          <textarea pInputTextarea [(ngModel)]="item.description" rows="3" placeholder="Description" class="w-full bg-black/20 border-white/10 text-white"></textarea>
                        </div>
                        <div class="flex gap-2">
                          <p-button label="Save" icon="pi pi-save" (onClick)="saveService(item)" styleClass="p-button-sm p-button-info"></p-button>
                          <p-button icon="pi pi-trash" (onClick)="deleteService(item)" styleClass="p-button-sm p-button-danger p-button-outlined"></p-button>
                        </div>
                      </div>
                    }
                  </div>
              </p-tabPanel>

              <p-tabPanel header="Clients">
                <div class="flex justify-end mb-6">
                   <p-button label="Register New Client" icon="pi pi-plus" (onClick)="addClient()" styleClass="p-button-success"></p-button>
                </div>
                <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                   @for (client of clients; track client.id) {
                     <div class="p-6 rounded-2xl border border-white/5 bg-white/5 flex flex-col space-y-4">
                        <div class="flex items-center justify-between">
                          <span class="text-[10px] font-black uppercase tracking-widest text-slate-500">Visible</span>
                          <p-inputSwitch [(ngModel)]="client.isVisible"></p-inputSwitch>
                        </div>
                        <div class="h-32 w-full rounded-xl border border-white/5 bg-black/20 flex items-center justify-center overflow-hidden p-4 relative group">
                          @if (client.imageUrl) {
                            <img [src]="client.imageUrl" class="max-h-full max-w-full object-contain" />
                          }
                          <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <p-fileUpload mode="basic" accept="image/*" [auto]="true" (onSelect)="onClientLogoUpload($event, client)"
                                           chooseLabel="Change" styleClass="p-button-sm p-button-rounded"></p-fileUpload>
                          </div>
                        </div>
                        <input pInputText [(ngModel)]="client.name" placeholder="Client Name" class="w-full bg-black/10 border-white/5 text-white mb-2" />
                        <input pInputText [(ngModel)]="client.website" placeholder="Website" class="w-full bg-black/10 border-white/5 text-white mb-4" />
                        <div class="mt-auto flex gap-2">
                          <p-button label="Update" icon="pi pi-check" (onClick)="saveClient(client)" styleClass="p-button-sm w-full p-button-info"></p-button>
                          <p-button icon="pi pi-trash" (onClick)="deleteClient(client)" styleClass="p-button-sm p-button-danger p-button-outlined"></p-button>
                        </div>
                     </div>
                   }
                </div>
              </p-tabPanel>

              <p-tabPanel header="About Info">
                <div class="grid gap-4 mb-8 md:grid-cols-2">
                  <input pInputText [(ngModel)]="settings.aboutEyebrow" placeholder="About eyebrow" class="bg-black/20 border-white/10 text-white" />
                  <input pInputText [(ngModel)]="settings.aboutTitle" placeholder="About title" class="bg-black/20 border-white/10 text-white" />
                  <textarea pInputTextarea [(ngModel)]="settings.aboutIntro" rows="3" placeholder="About introduction" class="bg-black/20 border-white/10 text-white"></textarea>
                  <textarea pInputTextarea [(ngModel)]="settings.aboutBody" rows="3" placeholder="About second paragraph" class="bg-black/20 border-white/10 text-white"></textarea>
                  <input pInputText [(ngModel)]="settings.aboutTimelineTitle" placeholder="Timeline title" class="bg-black/20 border-white/10 text-white" />
                  <p-button label="Save About Copy" icon="pi pi-save" (onClick)="saveSettings()" styleClass="p-button-info"></p-button>
                </div>
                <div class="flex items-center justify-between mb-6">
                   <h3 class="text-xl font-bold text-white">About Page Cards</h3>
                   <p-button label="Add Card" icon="pi pi-plus" (onClick)="addAboutCard()" styleClass="p-button-sm p-button-success"></p-button>
                </div>
                <div class="grid gap-6 md:grid-cols-2">
                   @for (card of aboutCards; track card.id) {
                     <div class="p-6 rounded-xl border border-white/5 bg-white/5 space-y-4">
                        <div class="flex items-center justify-between">
                          <span class="text-xs font-bold uppercase tracking-widest text-slate-500">Visible</span>
                          <p-inputSwitch [(ngModel)]="card.isVisible"></p-inputSwitch>
                        </div>
                        <input pInputText [(ngModel)]="card.title" class="w-full bg-black/20 border-white/10 text-white" />
                        <textarea pInputTextarea [(ngModel)]="card.description" rows="3" class="w-full bg-black/20 border-white/10 text-white"></textarea>
                        <div class="flex gap-2">
                          <p-button label="Save" icon="pi pi-check" (onClick)="saveAboutCard(card)" styleClass="p-button-sm p-button-info"></p-button>
                          <p-button icon="pi pi-trash" (onClick)="deleteAboutCard(card)" styleClass="p-button-sm p-button-danger p-button-outlined"></p-button>
                        </div>
                     </div>
                   }
                </div>
                <div class="mt-10 flex items-center justify-between mb-6">
                  <h3 class="text-xl font-bold text-white">Timeline Events</h3>
                  <p-button label="Add Event" icon="pi pi-plus" (onClick)="addAboutEvent()" styleClass="p-button-sm p-button-success"></p-button>
                </div>
                <div class="grid gap-6 md:grid-cols-2">
                  @for (event of aboutEvents; track event.id) {
                    <div class="p-6 rounded-xl border border-white/5 bg-white/5 space-y-4">
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-bold uppercase tracking-widest text-slate-500">Visible</span>
                        <p-inputSwitch [(ngModel)]="event.isVisible"></p-inputSwitch>
                      </div>
                      <div class="grid gap-4 mb-4 md:grid-cols-2">
                        <input pInputText [(ngModel)]="event.status" placeholder="Status" class="bg-black/20 border-white/10 text-white" />
                        <input pInputText [(ngModel)]="event.date" placeholder="Date" class="bg-black/20 border-white/10 text-white" />
                        <input pInputText [(ngModel)]="event.icon" placeholder="Icon" class="bg-black/20 border-white/10 text-white md:col-span-2" />
                        <textarea pInputTextarea [(ngModel)]="event.description" rows="2" placeholder="Description" class="bg-black/20 border-white/10 text-white md:col-span-2"></textarea>
                      </div>
                      <div class="flex gap-2">
                        <p-button label="Save" icon="pi pi-check" (onClick)="saveAboutEvent(event)" styleClass="p-button-sm p-button-info"></p-button>
                        <p-button icon="pi pi-trash" (onClick)="(deleteAboutEvent(event))" styleClass="p-button-sm p-button-danger p-button-outlined"></p-button>
                      </div>
                    </div>
                  }
                </div>
              </p-tabPanel>

              <p-tabPanel header="Page Copy">
                <div class="grid gap-6 md:grid-cols-2">
                  <input pInputText [(ngModel)]="settings.clientsEyebrow" placeholder="Clients eyebrow" class="bg-black/20 border-white/10 text-white" />
                  <input pInputText [(ngModel)]="settings.clientsTitle" placeholder="Clients title" class="bg-black/20 border-white/10 text-white" />
                  <textarea pInputTextarea [(ngModel)]="settings.clientsDescription" rows="3" placeholder="Clients description" class="bg-black/20 border-white/10 text-white md:col-span-2"></textarea>
                  <input pInputText [(ngModel)]="settings.clientsCtaTitle" placeholder="Clients CTA title" class="bg-black/20 border-white/10 text-white" />
                  <input pInputText [(ngModel)]="settings.clientsCtaText" placeholder="Clients CTA button" class="bg-black/20 border-white/10 text-white" />
                  <textarea pInputTextarea [(ngModel)]="settings.clientsCtaDescription" rows="2" placeholder="Clients CTA description" class="bg-black/20 border-white/10 text-white md:col-span-2"></textarea>
                  <input pInputText [(ngModel)]="settings.contactEyebrow" placeholder="Contact eyebrow" class="bg-black/20 border-white/10 text-white" />
                  <input pInputText [(ngModel)]="settings.contactTitle" placeholder="Contact title" class="bg-black/20 border-white/10 text-white" />
                  <textarea pInputTextarea [(ngModel)]="settings.contactDescription" rows="2" placeholder="Contact description" class="bg-black/20 border-white/10 text-white md:col-span-2"></textarea>
                  <input pInputText [(ngModel)]="settings.contactStudioLabel" placeholder="Contact studio label" class="bg-black/20 border-white/10 text-white" />
                  <input pInputText [(ngModel)]="settings.contactHeading" placeholder="Contact heading" class="bg-black/20 border-white/10 text-white" />
                  <input pInputText [(ngModel)]="settings.contactAddress" placeholder="Contact address" class="bg-black/20 border-white/10 text-white" />
                  <input pInputText [(ngModel)]="settings.contactHours" placeholder="Contact response time" class="bg-black/20 border-white/10 text-white" />
                  <textarea pInputTextarea [(ngModel)]="settings.contactFooter" rows="2" placeholder="Contact footer" class="bg-black/20 border-white/10 text-white md:col-span-2"></textarea>
                  <textarea pInputTextarea [(ngModel)]="contactInterestOptionsText" rows="3" placeholder="One contact interest per line" class="bg-black/20 border-white/10 text-white md:col-span-2"></textarea>
                  <input pInputText [(ngModel)]="settings.aiMenuEyebrow" placeholder="AI menu eyebrow" class="bg-black/20 border-white/10 text-white" />
                  <input pInputText [(ngModel)]="settings.aiMenuTitle" placeholder="AI menu title" class="bg-black/20 border-white/10 text-white" />
                  <textarea pInputTextarea [(ngModel)]="settings.aiMenuDescription" rows="2" placeholder="AI menu description" class="bg-black/20 border-white/10 text-white md:col-span-2"></textarea>
                  <input pInputText [(ngModel)]="settings.aiMenuBannerLabel" placeholder="AI menu banner label" class="bg-black/20 border-white/10 text-white" />
                  <input pInputText [(ngModel)]="settings.servicesEyebrow" placeholder="Services eyebrow" class="bg-black/20 border-white/10 text-white" />
                  <input pInputText [(ngModel)]="settings.servicesTitle" placeholder="Services title" class="bg-black/20 border-white/10 text-white" />
                  <textarea pInputTextarea [(ngModel)]="settings.servicesDescription" rows="2" placeholder="Services description" class="bg-black/20 border-white/10 text-white md:col-span-2"></textarea>
                  <p-button label="Save Page Copy" icon="pi pi-save" (onClick)="savePageCopy()" styleClass="p-button-info"></p-button>
                </div>
              </p-tabPanel>

            </p-tabView>
          </p-card>
        }
      </div>
    </div>
  `,
  styles: [`
    ::ng-deep {
      .admin-main-card .p-card-body { padding: 0; }

      .custom-tabview {
        .p-tabview-nav {
          background: rgba(255,255,255,0.02) !important;
          border: none;
          padding: 1rem 1rem 0 1rem;
          li .p-tabview-nav-link {
            background: transparent !important;
            border: none !important;
            color: #64748b !important;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-size: 0.75rem;
            padding: 1rem 1.5rem;
            transition: all 0.3s;
            &:not(.p-disabled):focus { box-shadow: none; }
          }
          li.p-highlight .p-tabview-nav-link {
            color: #22d3ee !important;
            border-bottom: 2px solid #22d3ee !important;
          }
        }
        .p-tabview-panels {
          background: transparent !important;
          padding: 2.5rem;
          color: white;
        }
      }

      .p-inputtext, .p-inputtextarea {
        border-radius: 12px;
        padding: 0.75rem 1rem;
        transition: all 0.3s;
        &::placeholder { color: #475569; }
        &:focus {
          background: rgba(0,0,0,0.4);
          box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2);
          border-color: #0891b2;
        }
      }

      .custom-scroll {
        &::-webkit-scrollbar { width: 4px; }
        &::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private contentService = inject(SiteContentService);
  private messageService = inject(MessageService);

  authUser: User | null = null;

  settings: SiteSettings = { brandName: 'TRINAY AI', logoUrl: 'assets/logo/Trinay-AI-Logo.png', footerText: '© 2026 Trinayai Technologies Private Limited. All rights reserved. SF No. 224/8F8, Attur main road, Kumbakottai, Namagiripettai, Rasipuram, Namakkal, Tamil Nadu – 637406.', contactEmail: 'info@trinayai.com', showIndiaAiBadge: true, menuItems: [] };
  homeSections: SectionItem[] = [];
  aboutCards: AboutCard[] = [];
  aboutEvents: AboutEvent[] = [];
  contactInterestOptionsText = '';
  services: ContentItem[] = [];
  aiMenuItems: ContentItem[] = [];
  clients: ClientItem[] = [];

  ngOnInit(): void {
    this.loadData();
    this.authService.user$.subscribe((user: User | null) => {
      this.authUser = user;
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  async logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.authUser = null;
        this.showSuccess('Logged out safely');
        this.router.navigate(['/login']);
      },
      error: () => this.showError('Logout failed')
    });
  }

  private loadData() {
    this.contentService.getSettings().subscribe((settings: SiteSettings) => {
      this.settings = { ...this.settings, ...settings };
      this.contactInterestOptionsText = settings.contactInterestOptions?.join('\n') || '';
    });
    this.contentService.getHomeSections().subscribe((sections: SectionItem[]) => this.homeSections = sections);
    this.contentService.getAboutCards().subscribe((cards: AboutCard[]) => this.aboutCards = cards);
    this.contentService.getAboutEvents().subscribe((events: AboutEvent[]) => this.aboutEvents = events);
    this.contentService.getServices().subscribe((services: ContentItem[]) => this.services = services);
    this.contentService.getAiMenuItems().subscribe((items: ContentItem[]) => this.aiMenuItems = items);
    this.contentService.getClients().subscribe((clients: ClientItem[]) => this.clients = clients);
  }

  async saveSettings() {
    try {
      await this.contentService.saveSettings(this.settings);
      this.showSuccess('Settings updated');
    } catch (error) {
      this.showError(`Failed to save settings: ${this.getErrorMessage(error)}`);
    }
  }

  async savePageCopy() {
    this.settings.contactInterestOptions = this.contactInterestOptionsText.split('\n').map(option => option.trim()).filter(Boolean);
    await this.saveSettings();
  }

  updateItemFeatures(item: ContentItem, text: string) {
    item.features = text.split('\n').map(f => f.trim()).filter(Boolean);
  }

  async addAboutEvent() {
    try {
      await this.contentService.addAboutEvent({ status: 'New milestone', date: '', description: '', icon: 'pi pi-star', isVisible: true });
      this.showSuccess('Event added');
    } catch (error) {
      this.showError(`Failed to add event: ${this.getErrorMessage(error)}`);
    }
  }

  async saveAboutEvent(event: AboutEvent) {
    if (!event.id) return;
    try {
      await this.contentService.updateAboutEvent(event.id, event);
      this.showSuccess('Event saved');
    } catch (error) {
      this.showError(`Save failed: ${this.getErrorMessage(error)}`);
    }
  }

  async deleteAboutEvent(event: AboutEvent) {
    if (!event.id) return;
    try {
      await this.contentService.deleteAboutEvent(event.id);
      this.showSuccess('Event deleted');
    } catch (error) {
      this.showError(`Delete failed: ${this.getErrorMessage(error)}`);
    }
  }

  async onLogoUpload(event: any) {
    const file = event.files[0];
    if (file) {
      try {
        const url = await this.contentService.uploadFile(file, `logos/site-logo-${Date.now()}`);
        this.settings.logoUrl = url;
        await this.saveSettings();
      } catch (e) {
        this.showError('Upload failed');
      }
    }
  }

  async onClientLogoUpload(event: any, client: ClientItem) {
    const file = event.files[0];
    if (file && client.id) {
      try {
        const url = await this.contentService.uploadFile(file, `clients/${client.id}-${Date.now()}`);
        client.imageUrl = url;
        await this.saveClient(client);
      } catch (e) {
        this.showError('Upload failed');
      }
    }
  }

  async addHomeSection() {
    try {
      await this.contentService.addHomeSection({ title: 'New Section', description: 'Add a short description.', icon: 'pi pi-star', isVisible: true });
      this.showSuccess('Section added');
    } catch (e) {
      this.showError('Failed to add section');
    }
  }

  async saveHomeSection(item: SectionItem) {
    if (item.id) {
      try {
        await this.contentService.updateHomeSection(item.id, item);
        this.showSuccess('Section saved');
      } catch (error) {
        this.showError(`Save failed: ${this.getErrorMessage(error)}`);
      }
    }
  }

  async deleteHomeSection(item: SectionItem) {
    if (item.id) {
      try {
        await this.contentService.deleteHomeSection(item.id);
        this.showSuccess('Section deleted');
      } catch (e) {
        this.showError('Delete failed');
      }
    }
  }

  async addAboutCard() {
    try {
      await this.contentService.addAboutCard({ title: 'New Card', description: 'Add your content.', isVisible: true });
      this.showSuccess('Card added');
    } catch (e) {
      this.showError('Failed to add card');
    }
  }

  async saveAboutCard(card: AboutCard) {
    if (card.id) {
      try {
        await this.contentService.updateAboutCard(card.id, card);
        this.showSuccess('Card saved');
      } catch (error) {
        this.showError(`Save failed: ${this.getErrorMessage(error)}`);
      }
    }
  }

  async deleteAboutCard(card: AboutCard) {
    if (card.id) {
      try {
        await this.contentService.deleteAboutCard(card.id);
        this.showSuccess('Card deleted');
      } catch (e) {
        this.showError('Delete failed');
      }
    }
  }

  async addService() {
    try {
      await this.contentService.addService({ title: 'New Service', description: 'Add your service details.', icon: 'pi pi-cog', isVisible: true });
      this.showSuccess('Service added');
    } catch (e) {
      this.showError('Failed to add service');
    }
  }

  async saveService(item: ContentItem) {
    if (item.id) {
      try {
        await this.contentService.updateService(item.id, item);
        this.showSuccess('Service saved');
      } catch (error) {
        this.showError(`Save failed: ${this.getErrorMessage(error)}`);
      }
    }
  }

  async deleteService(item: ContentItem) {
    if (item.id) {
      try {
        await this.contentService.deleteService(item.id);
        this.showSuccess('Service deleted');
      } catch (e) {
        this.showError('Delete failed');
      }
    }
  }

  async addAiMenuItem() {
    try {
      await this.contentService.addAiMenuItem({ title: 'New AI Item', description: 'Add your content.', icon: 'pi pi-android', isVisible: true });
      this.showSuccess('AI item added');
    } catch (e) {
      this.showError('Failed to add AI item');
    }
  }

  async saveAiMenuItem(item: ContentItem) {
    if (item.id) {
      try {
        await this.contentService.updateAiMenuItem(item.id, item);
        this.showSuccess('AI Item saved');
      } catch (error) {
        this.showError(`Save failed: ${this.getErrorMessage(error)}`);
      }
    }
  }

  async deleteAiMenuItem(item: ContentItem) {
    if (item.id) {
      try {
        await this.contentService.deleteAiMenuItem(item.id);
        this.showSuccess('AI item deleted');
      } catch (e) {
        this.showError('Delete failed');
      }
    }
  }

  async addClient() {
    try {
      await this.contentService.addClient({ name: 'New Client', imageUrl: '', website: '', isVisible: true });
      this.showSuccess('Client added');
    } catch (e) {
      this.showError('Failed to add client');
    }
  }

  async saveClient(client: ClientItem) {
    if (client.id) {
      try {
        await this.contentService.updateClient(client.id, client);
        this.showSuccess('Client updated');
      } catch (error) {
        this.showError(`Update failed: ${this.getErrorMessage(error)}`);
      }
    }
  }

  async deleteClient(client: ClientItem) {
    if (client.id) {
      try {
        await this.contentService.deleteClient(client.id);
        this.showSuccess('Client deleted');
      } catch (e) {
        this.showError('Delete failed');
      }
    }
  }

  private showSuccess(msg: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
  }

  private showError(msg: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }

  private getErrorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'message' in error) {
      return String(error.message);
    }
    return 'Check your Firebase connection and permissions';
  }
}
