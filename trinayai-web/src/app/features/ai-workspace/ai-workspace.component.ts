import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

interface UsageConfig {
  label: string;
  description: string;
  placeholder: string;
  controls: string[];
  accent: string;
}

@Component({
  selector: 'app-ai-workspace',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonModule],
  template: `
    <main class="workspace-shell">
      <div class="workspace-glow workspace-glow-one"></div>
      <div class="workspace-glow workspace-glow-two"></div>

      <div class="workspace-content">
        <header class="workspace-header">
          <a routerLink="/ai-menu" class="back-link"><i class="pi pi-arrow-left"></i> AI models</a>
          <span class="status-pill"><span class="status-dot"></span> Workspace ready</span>
        </header>

        <section class="workspace-hero">
          <div>
            <p class="eyebrow">TRINAY AI / PRIVATE WORKSPACE</p>
            <h1>{{ selectedModel }}</h1>
            <p class="hero-copy">{{ activeConfig.description }}</p>
          </div>
          <div class="model-mark" [style.background]="activeConfig.accent">
            <i class="pi pi-sparkles"></i>
          </div>
        </section>

        <section class="workspace-grid">
          <aside class="configuration-panel">
            <div class="panel-heading">
              <div>
                <p class="panel-label">01 / Configure</p>
                <h2>Shape the run</h2>
              </div>
              <i class="pi pi-sliders-h"></i>
            </div>

            <label class="field-label" for="usage">Primary usage</label>
            <select id="usage" [(ngModel)]="selectedUsage" (ngModelChange)="updateConfiguration()">
              <option *ngFor="let usage of usageOptions" [value]="usage">{{ usage }}</option>
            </select>

            <div class="control-list">
              <div class="control-row" *ngFor="let control of activeConfig.controls; let i = index">
                <div>
                  <span class="control-name">{{ control }}</span>
                  <span class="control-value">{{ controlValues[i] }}</span>
                </div>
                <input type="range" min="0" max="100" [(ngModel)]="controlValues[i]" [attr.aria-label]="control" />
              </div>
            </div>

            <div class="plan-note">
              <i class="pi pi-check-circle"></i>
              <span><strong>Subscriber access</strong> includes saved prompts, usage analytics, and priority inference.</span>
            </div>
          </aside>

          <section class="prompt-panel">
            <div class="panel-heading">
              <div>
                <p class="panel-label">02 / Prompt</p>
                <h2>Give it direction</h2>
              </div>
              <span class="prompt-count">{{ prompt.length }} / 4,000</span>
            </div>

            <textarea [(ngModel)]="prompt" maxlength="4000" [placeholder]="activeConfig.placeholder"></textarea>
            <div class="prompt-footer">
              <span><i class="pi pi-lock"></i> Your workspace is private</span>
              <p-button label="Run model" icon="pi pi-arrow-up-right" iconPos="right" (onClick)="runModel()" styleClass="run-button"></p-button>
            </div>

            <div class="response-preview" [class.response-ready]="hasRun">
              <div class="response-icon"><i class="pi" [ngClass]="hasRun ? 'pi-check' : 'pi-bolt'"></i></div>
              <div>
                <p class="panel-label">{{ hasRun ? 'Run complete' : 'Ready when you are' }}</p>
                <p>{{ hasRun ? 'Your configured ' + selectedModel + ' response will appear here.' : 'Your response preview will appear here after the first run.' }}</p>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  `,
  styles: [`
    :host { display: block; }
    .workspace-shell { min-height: calc(100vh - 12rem); position: relative; overflow: hidden; background: #f4f7f8; color: #102a2d; padding: 1rem; }
    .workspace-content { position: relative; z-index: 1; max-width: 1180px; margin: auto; }
    .workspace-glow { position: absolute; width: 25rem; height: 25rem; border-radius: 50%; filter: blur(90px); opacity: .55; }
    .workspace-glow-one { top: -9rem; right: 8%; background: #b8eadb; }
    .workspace-glow-two { bottom: -12rem; left: 6%; background: #f4d49b; }
    .workspace-header { display: flex; align-items: center; justify-content: space-between; padding: .75rem 0 4rem; }
    .back-link { color: #31575a; font-size: .8rem; font-weight: 800; text-decoration: none; text-transform: uppercase; letter-spacing: .12em; }
    .back-link i { margin-right: .5rem; }
    .status-pill { display: inline-flex; align-items: center; gap: .5rem; border: 1px solid #c8dcda; border-radius: 999px; background: rgba(255,255,255,.7); color: #46706d; font-size: .72rem; font-weight: 800; padding: .55rem .8rem; text-transform: uppercase; letter-spacing: .08em; }
    .status-dot { width: .45rem; height: .45rem; border-radius: 50%; background: #18a87e; box-shadow: 0 0 0 .2rem #bcebdc; }
    .workspace-hero { display: flex; align-items: end; justify-content: space-between; gap: 2rem; margin-bottom: 2.5rem; }
    .eyebrow, .panel-label { margin: 0 0 .75rem; color: #d3673e; font-size: .68rem; font-weight: 900; letter-spacing: .17em; text-transform: uppercase; }
    h1 { max-width: 760px; margin: 0; color: #102a2d; font-size: clamp(2.6rem, 6vw, 5.5rem); line-height: .92; letter-spacing: -.04em; }
    .hero-copy { max-width: 620px; margin: 1.25rem 0 0; color: #557174; font-size: 1.05rem; line-height: 1.65; }
    .model-mark { display: grid; flex: 0 0 5rem; height: 5rem; place-items: center; border: 2px solid rgba(16,42,45,.15); border-radius: 1.25rem; color: #102a2d; font-size: 1.5rem; transform: rotate(4deg); }
    .workspace-grid { display: grid; grid-template-columns: minmax(260px, .72fr) minmax(0, 1.28fr); gap: 1rem; }
    .configuration-panel, .prompt-panel { border: 1px solid #d6e1df; background: rgba(255,255,255,.82); box-shadow: 0 18px 50px rgba(16,42,45,.08); }
    .configuration-panel { padding: 1.5rem; }
    .prompt-panel { min-height: 480px; display: flex; flex-direction: column; padding: 1.5rem; }
    .panel-heading { display: flex; align-items: start; justify-content: space-between; gap: 1rem; margin-bottom: 2rem; }
    h2 { margin: 0; color: #102a2d; font-size: 1.45rem; letter-spacing: -.02em; }
    .field-label, .control-name { color: #31575a; font-size: .75rem; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
    select { width: 100%; margin: .6rem 0 1.75rem; border: 1px solid #bdcfcc; border-radius: .35rem; background: #f8fbfa; color: #102a2d; padding: .8rem; font: inherit; }
    .control-list { display: grid; gap: 1.25rem; }
    .control-row > div { display: flex; justify-content: space-between; margin-bottom: .55rem; }
    .control-value { color: #d3673e; font-size: .75rem; font-weight: 800; }
    input[type=range] { width: 100%; accent-color: #d3673e; }
    .plan-note { display: flex; gap: .7rem; margin-top: 2rem; border-top: 1px solid #e0e9e7; padding-top: 1.2rem; color: #638083; font-size: .78rem; line-height: 1.5; }
    .plan-note i { color: #18a87e; margin-top: .15rem; }
    textarea { flex: 1; min-height: 245px; resize: vertical; border: 1px solid #bdcfcc; border-radius: .35rem; background: #f8fbfa; color: #102a2d; font: inherit; line-height: 1.6; padding: 1rem; outline-color: #d3673e; }
    textarea::placeholder { color: #8aa09e; }
    .prompt-footer { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem 0 1.5rem; color: #708785; font-size: .75rem; }
    .prompt-footer i { margin-right: .35rem; }
    .run-button { border: 0; background: #102a2d; padding: .75rem 1.1rem; font-weight: 800; }
    .run-button:hover { background: #d3673e; }
    .response-preview { display: flex; align-items: center; gap: .85rem; border-top: 1px solid #e0e9e7; padding-top: 1rem; color: #77908d; font-size: .82rem; }
    .response-preview p { margin: 0; line-height: 1.45; }
    .response-icon { display: grid; flex: 0 0 2.25rem; height: 2.25rem; place-items: center; border-radius: .5rem; background: #e6efed; color: #6d8b88; }
    .response-ready .response-icon { background: #d7f3e8; color: #15956f; }
    @media (max-width: 720px) { .workspace-shell { padding: .75rem; } .workspace-header { padding-bottom: 2.5rem; } .workspace-hero { align-items: start; } .model-mark { flex-basis: 3.5rem; height: 3.5rem; } .workspace-grid { grid-template-columns: 1fr; } .prompt-panel { min-height: 430px; } .prompt-footer { align-items: stretch; flex-direction: column; } }
  `]
})
export class AiWorkspaceComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  selectedModel = 'Trinay Intelligence';
  selectedUsage = 'General reasoning';
  prompt = '';
  hasRun = false;
  controlValues = [72, 58, 64];
  usageOptions = ['General reasoning', 'Content and communication', 'Document analysis', 'Customer support', 'Risk and compliance'];
  activeConfig: UsageConfig = this.getConfiguration(this.selectedUsage);

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.selectedModel = params.get('model') || 'Trinay Intelligence';
      const requestedUsage = params.get('usage');
      if (requestedUsage && this.usageOptions.includes(requestedUsage)) {
        this.selectedUsage = requestedUsage;
      } else {
        this.selectedUsage = this.inferUsage(this.selectedModel);
      }
      this.activeConfig = this.getConfiguration(this.selectedUsage);
      this.syncRouteState();
    });
  }

  updateConfiguration(): void {
    this.activeConfig = this.getConfiguration(this.selectedUsage);
    this.controlValues = [72, 58, 64];
    this.syncRouteState();
  }

  private syncRouteState(): void {
    const currentModel = this.route.snapshot.queryParamMap.get('model');
    const currentUsage = this.route.snapshot.queryParamMap.get('usage');
    if (currentModel === this.selectedModel && currentUsage === this.selectedUsage) return;
    this.router.navigate([], {
      queryParams: { model: this.selectedModel, usage: this.selectedUsage },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  runModel(): void {
    this.hasRun = true;
  }

  private inferUsage(model: string): string {
    const normalized = model.toLowerCase();
    if (normalized.includes('sentiment') || normalized.includes('customer')) return 'Customer support';
    if (normalized.includes('document') || normalized.includes('summar')) return 'Document analysis';
    if (normalized.includes('risk') || normalized.includes('compliance')) return 'Risk and compliance';
    if (normalized.includes('translation') || normalized.includes('content')) return 'Content and communication';
    return 'General reasoning';
  }

  private getConfiguration(usage: string): UsageConfig {
    const configurations: Record<string, UsageConfig> = {
      'General reasoning': { label: 'General reasoning', description: 'A flexible reasoning surface for strategy, research, planning, and complex business questions.', placeholder: 'Ask Trinay Intelligence to reason through a business challenge, compare options, or create a clear action plan...', controls: ['Reasoning depth', 'Creativity', 'Context retention'], accent: '#b8eadb' },
      'Content and communication': { label: 'Content and communication', description: 'Turn a brief into clear, on-brand communication with the right balance of originality and precision.', placeholder: 'Describe the audience, message, tone, and outcome you want to create...', controls: ['Brand voice', 'Originality', 'Output length'], accent: '#f4d49b' },
      'Document analysis': { label: 'Document analysis', description: 'Extract meaning from dense documents, surface decisions, and turn evidence into a usable brief.', placeholder: 'Paste a document excerpt or describe the clauses, facts, and decisions you need reviewed...', controls: ['Evidence focus', 'Summary detail', 'Citation strictness'], accent: '#c8d8f3' },
      'Customer support': { label: 'Customer support', description: 'Build helpful, consistent responses that understand customer intent and move conversations forward.', placeholder: 'Describe the customer message, product context, and the resolution you want to reach...', controls: ['Empathy', 'Resolution focus', 'Response brevity'], accent: '#f3c6cb' },
      'Risk and compliance': { label: 'Risk and compliance', description: 'Identify exposure early and communicate practical next steps for compliant operations.', placeholder: 'Describe the process, policy, or scenario you want assessed for risk and compliance gaps...', controls: ['Risk sensitivity', 'Regulatory focus', 'Recommendation detail'], accent: '#d7c8ee' }
    };
    return configurations[usage] || configurations['General reasoning'];
  }
}
