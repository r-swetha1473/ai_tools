import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ToolCardData {
  name: string;
  description: string;
  url?: string;
  category: string;
  categoryColor: string;
  popularity: number;
}

@Component({
  selector: 'app-tool-card',
  template: `
    <div class="tool-card-overlay" *ngIf="isVisible" (click)="onOverlayClick($event)">
      <div class="tool-card" (click)="$event.stopPropagation()">
        <button class="close-button" (click)="onClose()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div class="tool-header">
          <div class="tool-icon" [style.background]="toolData?.categoryColor">
            🛠️
          </div>
          <div class="tool-info">
            <h3 class="tool-name">{{ toolData?.name }}</h3>
            <p class="tool-category">{{ toolData?.category }}</p>
          </div>
          <div class="popularity-badge">
            <span class="popularity-value">{{ toolData?.popularity }}%</span>
            <span class="popularity-label">Popular</span>
          </div>
        </div>
        
        <div class="tool-body">
          <p class="tool-description">{{ toolData?.description }}</p>
          
          <div class="tool-stats">
            <div class="stat-item">
              <div class="stat-icon">⭐</div>
              <div class="stat-content">
                <span class="stat-value">{{ getStarRating() }}/5</span>
                <span class="stat-label">Rating</span>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">📈</div>
              <div class="stat-content">
                <span class="stat-value">{{ toolData?.popularity }}%</span>
                <span class="stat-label">Popularity</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="tool-actions">
          <button class="action-btn primary" (click)="onVisitTool()" *ngIf="toolData?.url">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15,3 21,3 21,9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            Visit {{ getDomain() }}
          </button>
          
          <button class="action-btn secondary" (click)="onShare()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            Share Tool
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tool-card-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(8px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: fadeIn 0.3s ease-out;
    }

    .tool-card {
      background: var(--card-bg);
      border-radius: 24px;
      padding: 32px;
      max-width: 500px;
      width: 100%;
      border: 1px solid var(--card-border);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
      position: relative;
      animation: slideUp 0.3s ease-out;
    }

    .close-button {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 32px;
      height: 32px;
      border: none;
      background: var(--close-bg);
      color: var(--close-color);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .close-button:hover {
      background: var(--close-hover);
      transform: scale(1.1);
    }

    .close-button svg {
      width: 16px;
      height: 16px;
    }

    .tool-header {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 24px;
    }

    .tool-icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: white;
      flex-shrink: 0;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .tool-info {
      flex: 1;
      min-width: 0;
    }

    .tool-name {
      font-size: 24px;
      font-weight: 700;
      color: var(--tool-name);
      margin: 0 0 4px 0;
    }

    .tool-category {
      font-size: 14px;
      color: var(--tool-category);
      margin: 0;
      font-weight: 500;
    }

    .popularity-badge {
      background: var(--badge-bg);
      padding: 8px 12px;
      border-radius: 12px;
      text-align: center;
      border: 1px solid var(--badge-border);
    }

    .popularity-value {
      display: block;
      font-size: 16px;
      font-weight: 700;
      color: var(--badge-value);
      margin-bottom: 2px;
    }

    .popularity-label {
      font-size: 10px;
      color: var(--badge-label);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }

    .tool-body {
      margin-bottom: 32px;
    }

    .tool-description {
      color: var(--tool-description);
      line-height: 1.6;
      margin: 0 0 24px 0;
      font-size: 16px;
    }

    .tool-stats {
      display: flex;
      gap: 24px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }

    .stat-icon {
      font-size: 20px;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 16px;
      font-weight: 700;
      color: var(--stat-value);
      margin-bottom: 2px;
    }

    .stat-label {
      font-size: 12px;
      color: var(--stat-label);
      font-weight: 500;
    }

    .tool-actions {
      display: flex;
      gap: 12px;
    }

    .action-btn {
      flex: 1;
      padding: 14px 20px;
      border: none;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s ease;
      text-decoration: none;
    }

    .action-btn svg {
      width: 16px;
      height: 16px;
    }

    .action-btn.primary {
      background: var(--btn-primary-bg);
      color: var(--btn-primary-text);
    }

    .action-btn.primary:hover {
      background: var(--btn-primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
    }

    .action-btn.secondary {
      background: var(--btn-secondary-bg);
      color: var(--btn-secondary-text);
      border: 1px solid var(--btn-secondary-border);
    }

    .action-btn.secondary:hover {
      background: var(--btn-secondary-hover);
      transform: translateY(-2px);
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @media (max-width: 768px) {
      .tool-card {
        padding: 24px;
        margin: 20px;
      }

      .tool-header {
        flex-direction: column;
        text-align: center;
        gap: 12px;
      }

      .tool-stats {
        flex-direction: column;
        gap: 16px;
      }

      .tool-actions {
        flex-direction: column;
      }
    }

    /* Light theme */
    :host-context([data-theme="light"]) {
      --card-bg: rgba(255, 255, 255, 0.98);
      --card-border: rgba(226, 232, 240, 0.8);
      --close-bg: #f1f5f9;
      --close-color: #64748b;
      --close-hover: #e2e8f0;
      --tool-name: #1e293b;
      --tool-category: #64748b;
      --tool-description: #475569;
      --badge-bg: rgba(59, 130, 246, 0.1);
      --badge-border: rgba(59, 130, 246, 0.2);
      --badge-value: #3b82f6;
      --badge-label: #64748b;
      --stat-value: #1e293b;
      --stat-label: #64748b;
      --btn-primary-bg: #3b82f6;
      --btn-primary-text: white;
      --btn-primary-hover: #2563eb;
      --btn-secondary-bg: #f8fafc;
      --btn-secondary-text: #475569;
      --btn-secondary-border: #e2e8f0;
      --btn-secondary-hover: #f1f5f9;
    }

    /* Dark theme */
    :host-context([data-theme="dark"]) {
      --card-bg: rgba(30, 41, 59, 0.98);
      --card-border: rgba(51, 65, 85, 0.8);
      --close-bg: #475569;
      --close-color: #cbd5e1;
      --close-hover: #64748b;
      --tool-name: #f1f5f9;
      --tool-category: #94a3b8;
      --tool-description: #cbd5e1;
      --badge-bg: rgba(96, 165, 250, 0.15);
      --badge-border: rgba(96, 165, 250, 0.3);
      --badge-value: #60a5fa;
      --badge-label: #94a3b8;
      --stat-value: #f1f5f9;
      --stat-label: #94a3b8;
      --btn-primary-bg: #3b82f6;
      --btn-primary-text: white;
      --btn-primary-hover: #60a5fa;
      --btn-secondary-bg: #475569;
      --btn-secondary-text: #cbd5e1;
      --btn-secondary-border: #64748b;
      --btn-secondary-hover: #64748b;
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class ToolCardComponent implements OnInit {
  @Input() toolData: ToolCardData | null = null;
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();
  @Output() visitTool = new EventEmitter<string>();
  @Output() shareTool = new EventEmitter<ToolCardData>();

  ngOnInit() {}

  onClose() {
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onVisitTool() {
    if (this.toolData?.url) {
      this.visitTool.emit(this.toolData.url);
    }
  }

  onShare() {
    if (this.toolData) {
      this.shareTool.emit(this.toolData);
    }
  }

  getDomain(): string {
    if (!this.toolData?.url) return '';
    try {
      const url = new URL(this.toolData.url);
      return url.hostname.replace('www.', '');
    } catch {
      return 'Website';
    }
  }

  getStarRating(): number {
    if (!this.toolData?.popularity) return 0;
    return Math.round((this.toolData.popularity / 100) * 5);
  }
}