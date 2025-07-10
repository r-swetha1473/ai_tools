import { Component, ElementRef, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { SunburstData } from '../../services/api.service';
import { ThemeService } from '../../services/theme.service';
import { Subject, takeUntil } from 'rxjs';
import { SearchResult } from '../../services/api.service';


@Component({
  selector: 'app-sunburst-chart',
  template: `
    <div class="sunburst-container">
         <div class="controls">
    <!-- <button class="btn btn-secondary" (click)="expandAll()">Expand All</button>
    <button class="btn btn-secondary" (click)="collapseAll()">Collapse All</button> -->
    <button class="btn btn-secondary" (click)="resetZoom()">Reset View</button>
  </div>
      <div class="chart-wrapper">
           
        <svg #svgElement class="sunburst-svg"></svg>
        
        <!-- Center Navigation -->
        <div class="center-navigation" *ngIf="centerInfo">
          <div class="center-content">
            <div class="breadcrumb" *ngIf="currentFocus && currentFocus !== root">
              <button class="breadcrumb-item root" (click)="resetZoom()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
                AI Tools
              </button>
              <span class="breadcrumb-separator">›</span>
              <span class="breadcrumb-current">{{ currentFocus.data.name }}</span>
            </div>
            
            <div class="center-info" *ngIf="!currentFocus || currentFocus === root">
              <h3 class="center-title">AI Tools Universe</h3>
              <p class="center-description">Click any category to explore</p>
              <div class="center-stats">
                <div class="stat">
                  <span class="stat-number">{{ totalCategories }}</span>
                  <span class="stat-label">Categories</span>
                </div>
                <div class="stat">
                  <span class="stat-number">{{ totalTools }}</span>
                  <span class="stat-label">Tools</span>
                </div>
              </div>
            </div>
            
            <div class="category-info" *ngIf="currentFocus && currentFocus !== root">
              <div class="category-header">
                <div class="category-icon" [style.background]="currentFocus.data.color">
                  {{ getCategoryIcon(currentFocus.data.id) }}
                </div>
                <div class="category-details">
                  <h3 class="category-name">{{ currentFocus.data.name }}</h3>
                  <p class="category-description">{{ currentFocus.data.description }}</p>
                </div>
              </div>
              <div class="category-stats">
                <div class="stat">
                  <span class="stat-number">{{ currentFocus.children?.length || 0 }}</span>
                  <span class="stat-label">Tools</span>
                </div>
                <div class="stat">
                  <span class="stat-number">{{ getAveragePopularity(currentFocus) }}%</span>
                  <span class="stat-label">Avg Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Enhanced Tooltip -->
      <div class="tooltip" 
           [class.visible]="tooltipVisible" 
           [style.left.px]="tooltipX" 
           [style.top.px]="tooltipY">
        <div class="tooltip-header">
          <div class="tooltip-icon" [style.background]="tooltipData.color">
            {{ tooltipData.icon }}
          </div>
          <div class="tooltip-info">
            <h4 class="tooltip-title">{{ tooltipData.title }}</h4>
            <span class="tooltip-type">{{ tooltipData.type }}</span>
          </div>
          <div class="tooltip-rating" *ngIf="tooltipData.rating">
            <div class="rating-value">{{ tooltipData.rating }}/5</div>
            <div class="rating-stars">
              <span *ngFor="let star of getStars(tooltipData.rating)" 
                    class="star" 
                    [class.filled]="star">★</span>
            </div>
          </div>
        </div>
        
        <div class="tooltip-body">
          <p class="tooltip-description">{{ tooltipData.description }}</p>
          
          <div class="tooltip-stats" *ngIf="tooltipData.stats">
            <div class="stat-row">
              <span class="stat-label">Popularity</span>
              <div class="popularity-bar">
                <div class="popularity-fill" [style.width.%]="tooltipData.stats.popularity"></div>
              </div>
              <span class="stat-value">{{ tooltipData.stats.popularity }}%</span>
            </div>
          </div>
          
          <div class="tooltip-actions" *ngIf="tooltipData.url">
            <button class="action-btn primary" (click)="openTool(tooltipData.url)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15,3 21,3 21,9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              Visit Tool
            </button>
            <button class="action-btn secondary" (click)="shareTool(tooltipData)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
 .sunburst-container {
  position: relative; /* Needed for absolute children */
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 700px;
  background: var(--chart-bg);
  border-radius: 20px;
  overflow: hidden;
}.btn-primary {
    background-color: var(--primary-600);
    color: #fff
}
.btn {
    display: inline-flex
;
    align-items: center;
    justify-content: center;
    padding: .75rem
 1.5rem;
    border: none;
    border-radius: .5rem;
    font-size: .875rem;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: all .2s ease;
    white-space: nowrap;
}
.btn-primary:hover {
    background-color: var(--primary-700);
    transform: translateY(-1px);
    box-shadow: var(--shadow-lg)
}

.btn-secondary {
    background-color: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border)
}

.btn-secondary:hover {
    background-color: var(--bg-tertiary);
    transform: translateY(-1px)
}

.controls {
  position: absolute;
  top: 1rem;
  
  right: 1rem;
  z-index: 100;
  display: flex;
  gap: 0.5rem;
  background-color: var(--bg-primary);
  padding: 0.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}


    .chart-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sunburst-svg {
      width: 100%;
      height: 100%;
      max-width: 700px;
      max-height: 700px;
      cursor: pointer;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 10px;
    }

    /* Highlighted elements */
    .sunburst-svg .highlighted {
      filter: drop-shadow(0 0 8px #f59e0b) brightness(1.2);
      stroke: #f59e0b !important;
      stroke-width: 3px !important;
    }.sunburst-container {
      background: linear-gradient(135deg, #fdfbfb, #ebedee);
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
    }

    :host-context([data-theme="dark"]) .sunburst-container {
      background: linear-gradient(135deg, #1e293b, #0f172a);
    }
    text {
      pointer-events: none;
      fill: #1e293b;
      font-size: 12px;
      font-weight: bold;
      text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6);
    }

    :host-context([data-theme="dark"]) text {
      fill: #f1f5f9;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
    }
    .sunburst-svg .highlighted {
      stroke: url(#glow-gradient);
      stroke-width: 4px !important;
      filter: drop-shadow(0 0 10px #f59e0b);
    }
    .tooltip {
      transition: opacity 0.3s ease, transform 0.3s ease;
    }


    .sunburst-svg .parent-highlighted {
      filter: drop-shadow(0 0 6px #3b82f6) brightness(1.1);
      stroke: #3b82f6 !important;
      stroke-width: 2px !important;
    }

    /* Center Navigation */
    .center-navigation {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 10;
      max-width: 300px;
      text-align: center;
    }

    .center-content {
      background: var(--center-bg);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      padding: 24px;
      border: 1px solid var(--center-border);
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      font-size: 14px;
    }

    .breadcrumb-item {
      background: none;
      border: none;
      color: var(--breadcrumb-color);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 8px;
      transition: all 0.2s ease;
      pointer-events: auto;
      font-size: 14px;
      font-weight: 500;
    }

    .breadcrumb-item:hover {
      background: var(--breadcrumb-hover);
      color: var(--breadcrumb-hover-color);
    }

    .breadcrumb-item svg {
      width: 14px;
      height: 14px;
    }

    .breadcrumb-separator {
      margin: 0 8px;
      color: var(--breadcrumb-separator);
      font-weight: 300;
    }

    .breadcrumb-current {
      color: var(--breadcrumb-current);
      font-weight: 600;
    }

    .center-info {
      text-align: center;
    }

    .center-title {
      font-size: 24px;
      font-weight: 700;
      color: var(--center-title);
      margin: 0 0 8px 0;
    }

    .center-description {
      font-size: 14px;
      color: var(--center-description);
      margin: 0 0 20px 0;
    }

    .center-stats {
      display: flex;
      justify-content: center;
      gap: 24px;
    }

    .stat {
      text-align: center;
    }

    .stat-number {
      display: block;
      font-size: 20px;
      font-weight: 700;
      color: var(--stat-number);
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 12px;
      color: var(--stat-label);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 500;
    }

    .category-info {
      text-align: center;
    }

    .category-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
      text-align: left;
    }

    .category-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: white;
      flex-shrink: 0;
    }

    .category-details {
      flex: 1;
      min-width: 0;
    }

    .category-name {
      font-size: 18px;
      font-weight: 700;
      color: var(--category-name);
      margin: 0 0 4px 0;
    }

    .category-description {
      font-size: 13px;
      color: var(--category-description);
      margin: 0;
      line-height: 1.4;
    }

    .category-stats {
      display: flex;
      justify-content: center;
      gap: 24px;
    }

    /* Tooltip */
    .tooltip {
      position: absolute;
      background: var(--tooltip-bg);
      border: 1px solid var(--tooltip-border);
      border-radius: 12px;
      padding: 0;
      pointer-events: none;
      z-index: 1000;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      max-width: 300px;
      min-width: 250px;
      opacity: 0;
      transform: translateY(10px) scale(0.95);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(20px);
    }

    .tooltip.visible {
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    .tooltip-header {
      padding: 16px;
      border-bottom: 1px solid var(--tooltip-divider);
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .tooltip-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: white;
      flex-shrink: 0;
    }

    .tooltip-info {
      flex: 1;
      min-width: 0;
    }

    .tooltip-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--tooltip-title);
      margin: 0 0 4px 0;
    }

    .tooltip-type {
      font-size: 12px;
      color: var(--tooltip-type);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .tooltip-rating {
      text-align: right;
    }

    .rating-value {
      font-size: 14px;
      font-weight: 600;
      color: var(--rating-value);
      margin-bottom: 4px;
    }

    .rating-stars {
      display: flex;
      gap: 2px;
      justify-content: flex-end;
    }

    .star {
      color: var(--star-empty);
      font-size: 12px;
    }

    .star.filled {
      color: var(--star-filled);
    }

    .tooltip-body {
      padding: 16px;
    }

    .tooltip-description {
      color: var(--tooltip-description);
      margin: 0 0 16px 0;
      line-height: 1.4;
      font-size: 14px;
    }

    .tooltip-stats {
      margin-bottom: 16px;
    }

    .stat-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .stat-label {
      font-size: 12px;
      color: var(--stat-label);
      font-weight: 500;
      min-width: 60px;
    }

    .popularity-bar {
      flex: 1;
      height: 4px;
      background: var(--popularity-bg);
      border-radius: 2px;
      overflow: hidden;
    }

    .popularity-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #3b82f6);
      border-radius: 2px;
      transition: width 0.3s ease;
    }

    .stat-value {
      font-size: 12px;
      color: var(--stat-value);
      font-weight: 600;
      min-width: 35px;
      text-align: right;
    }

    .tooltip-actions {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      flex: 1;
      padding: 8px 12px;
      border: none;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.2s ease;
      pointer-events: auto;
    }

    .action-btn svg {
      width: 12px;
      height: 12px;
    }

    .action-btn.primary {
      background: var(--btn-primary-bg);
      color: var(--btn-primary-text);
    }

    .action-btn.primary:hover {
      background: var(--btn-primary-hover);
      transform: translateY(-1px);
    }

    .action-btn.secondary {
      background: var(--btn-secondary-bg);
      color: var(--btn-secondary-text);
      border: 1px solid var(--btn-secondary-border);
    }

    .action-btn.secondary:hover {
      background: var(--btn-secondary-hover);
    }

    /* Light theme */
    :host-context([data-theme="light"]) {
      --border: #e2e8f0;
      --chart-bg: rgba(255, 255, 255, 0.95);
      --center-bg: rgba(255, 255, 255, 0.95);
      --center-border: rgba(226, 232, 240, 0.8);
      --center-title: #1e293b;
      --center-description: #64748b;
      --stat-number: #3b82f6;
      --stat-label: #64748b;
      --breadcrumb-color: #64748b;
      --breadcrumb-hover: rgba(59, 130, 246, 0.1);
      --breadcrumb-hover-color: #3b82f6;
      --breadcrumb-separator: #cbd5e1;
      --breadcrumb-current: #1e293b;
      --category-name: #1e293b;
      --category-description: #64748b;
      --tooltip-bg: rgba(255, 255, 255, 0.98);
      --tooltip-border: rgba(226, 232, 240, 0.8);
      --tooltip-divider: rgba(226, 232, 240, 0.6);
      --tooltip-title: #1e293b;
      --tooltip-type: #64748b;
      --tooltip-description: #475569;
      --rating-value: #1e293b;
      --star-empty: #e2e8f0;
      --star-filled: #fbbf24;
      --stat-label: #64748b;
      --stat-value: #1e293b;
      --popularity-bg: #e2e8f0;
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
      --chart-bg: rgba(15, 23, 42, 0.95);
      --center-bg: rgba(30, 41, 59, 0.95);
      --center-border: rgba(51, 65, 85, 0.8);
      --center-title: #f1f5f9;
      --center-description: #94a3b8;
      --stat-number: #60a5fa;
      --stat-label: #94a3b8;
      --breadcrumb-color: #94a3b8;
      --breadcrumb-hover: rgba(96, 165, 250, 0.15);
      --breadcrumb-hover-color: #60a5fa;
      --breadcrumb-separator: #64748b;
      --breadcrumb-current: #f1f5f9;
      --category-name: #f1f5f9;
      --category-description: #94a3b8;
      --tooltip-bg: rgba(30, 41, 59, 0.98);
      --tooltip-border: rgba(51, 65, 85, 0.8);
      --tooltip-divider: rgba(51, 65, 85, 0.6);
      --tooltip-title: #f1f5f9;
      --tooltip-type: #94a3b8;
      --tooltip-description: #cbd5e1;
      --rating-value: #f1f5f9;
      --border: #e2e8f0;
      --star-empty: #475569;
      --star-filled: #fbbf24;
      --stat-label: #94a3b8;
      --stat-value: #f1f5f9;
      --popularity-bg: #334155;
      --btn-primary-bg: #3b82f6;
      --btn-primary-text: white;
      --btn-primary-hover: #60a5fa;
      --btn-secondary-bg: #475569;
      --btn-secondary-text: #cbd5e1;
      --btn-secondary-border: #64748b;
      --btn-secondary-hover: #64748b;
    }

    @media (max-width: 768px) {
      .center-navigation {
        max-width: 250px;
      }

      .center-content {
        padding: 20px;
      }

      .category-header {
        flex-direction: column;
        text-align: center;
        gap: 12px;
      }

      .tooltip {
        max-width: 280px;
        min-width: 220px;
      }
      text {
  pointer-events: none;
  text-shadow: 0 0 2px white;
  font-weight: bold;
}text {
  font-size: 10px;
  fill: #333;
  background: white;
  border-radius: 9999px;
  padding: 2px 6px;
}


    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class SunburstChartComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() data!: SunburstData;
  @Output() categorySelect = new EventEmitter<string>();
  @ViewChild('svgElement', { static: true }) svgElement!: ElementRef<SVGSVGElement>;

  private destroy$ = new Subject<void>();
  private radius = 0;
  private arc: any;
  private path: any;
  private g: any;
  private labels: any;

  public root: any;
  public currentFocus: any = null;
  public centerInfo: any = null;
  public totalCategories = 0;
  public totalTools = 0;

  public tooltipVisible = false;
  public tooltipX = 0;
  public tooltipY = 0;
  public tooltipData: any = {};

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.isDarkMode().pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngAfterViewInit() {
    if (this.data) this.createChart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public handleSearchResult(result: SearchResult) {
    if (result.type === 'category') {
      this.highlightCategory(result.id);
    } else if (result.type === 'tool') {
      this.highlightTool(result.name);
    }
  }

  private createChart() {
    const element = this.svgElement.nativeElement;
    const width = element.clientWidth;
    this.radius = width / 2;

    const svg = d3.select(element)
      .attr('width', width)
      .attr('height', width)
      .append('g')
      .attr('transform', `translate(${this.radius},${this.radius})`);

    this.g = svg;

    const baseColors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#9D4EDD', '#F72585', '#00F5D4', '#F15BB5', '#F4A261', '#8338EC'];
    const categoryColors = new Map<string, string>();
    this.data.children.forEach((cat, i) => {
      categoryColors.set(cat.name, baseColors[i % baseColors.length]);
    });

    const color = (d: any) => {
      const parentName = d.depth === 1 ? d.data.name : d.parent?.data?.name;
      const baseColor = categoryColors.get(parentName) || '#999';
      const base = d3.color(baseColor);
      if (!base) return '#ccc';
      if (d.depth === 1) return base.darker(0.8).formatHex();
      if (d.depth === 2) return base.brighter(1.2).formatHex();
      return '#eee';
    };

    svg.append('defs').append('linearGradient')
      .attr('id', 'glow-gradient')
      .attr('x1', '0%').attr('x2', '100%')
      .attr('y1', '0%').attr('y2', '100%')
      .selectAll('stop')
      .data([
        { offset: '0%', color: '#fbbf24' },
        { offset: '100%', color: '#f59e0b' }
      ])
      .enter()
      .append('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color);

    this.root = d3.hierarchy(this.data)
      .sum((d: any) => d.value || 1)
      .sort((a, b) => (b.value || 0) - (a.value || 0));
    d3.partition().size([2 * Math.PI, this.radius])(this.root);
    this.root.each((d: any) => (d.current = d));

    this.totalCategories = this.data.children.length;
    this.totalTools = this.data.children.reduce((total, cat) => total + cat.children.length, 0);

    this.arc = d3.arc()
      .startAngle((d: any) => d.x0)
      .endAngle((d: any) => d.x1)
      .innerRadius((d: any) => d.y0)
      .outerRadius((d: any) => d.y1);

    this.path = svg.append('g')
      .selectAll('path')
      .data(this.root.descendants().slice(1))
      .join('path')
      .attr('fill', (d: any) => color(d))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .attr('d', (d: any) => this.arc(d.current))
      .on('click', (event, d) => this.clicked(event, d))
      .on('mouseover', (event, d) => this.showTooltip(event, d))
      .on('mousemove', (event) => this.updateTooltip(event))
      .on('mouseout', () => this.hideTooltip());

    this.labels = svg.append('g').attr('pointer-events', 'none').attr('class', 'labels');
    this.updateLabels();
    this.setCenterInfo();
  }

  private clicked(event: any, p: any) {
    if (p.depth === 2 && p.data.url) {
      window.open(p.data.url, '_blank');
      return;
    }

    this.currentFocus = p.depth ? p : null;
    this.setCenterInfo();

    this.root.each((d: any) => {
      d.target = {
        x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        y0: Math.max(0, d.y0 - p.depth),
        y1: Math.max(0, d.y1 - p.depth)
      };
    });

    const transition = this.g.transition().duration(750);

    this.path.transition(transition)
      .tween('data', (d: any) => {
        const i = d3.interpolate(d.current, d.target);
        return (t: number) => (d.current = i(t));
      })
      .attrTween('d', (d: any) => () => this.arc(d.current))
      .end()
      .then(() => this.updateLabels())
      .catch(() => {});
  }

  private updateLabels() {
    if (!this.labels || !this.arc) return;

    const visibleNodes = this.root.descendants().slice(1).filter((d: any) => {
      const angle = d.current.x1 - d.current.x0;
      const radius = d.current.y1 - d.current.y0;
      return angle > 0.15 && radius > 10;
    });

    const text = this.labels.selectAll('text')
      .data(visibleNodes, (d: any) => d.data.name);

   text.join(
  (enter: any) => enter.append('text')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .style('font-size', '10px')
    .style('fill', '#333')
    .style('pointer-events', 'none')
    .text((d: any) => d.data.name)
    .attr('transform', (d: any) => {
      const [x, y] = this.arc.centroid(d.current);
      return `translate(${x}, ${y})`;
    }),

  (update: any) => update
    .text((d: any) => d.data.name)
    .transition()
    .duration(750)
    .attr('transform', (d: any) => {
      const [x, y] = this.arc.centroid(d.current);
      return `translate(${x}, ${y})`;
    }),

  (exit: any) => exit.remove()
);

  }

  public resetZoom() {
    this.clicked(null, this.root);
  }

  public getCategoryIcon(id: string): string {
    const icons: Record<string, string> = {
      'text-generation': '✍️',
      'image-generation': '🎨',
      'code-generation': '💻'
    };
    return icons[id] || '🔧';
  }

  private showTooltip(event: MouseEvent, d: any) {
    if (!d || d.depth === 0) return;
    this.tooltipData = {
      title: d.data.name,
      description: d.data.description || '',
      type: d.data.type || '',
      icon: '🔧',
      color: '#000',
      rating: d.data.rating || 0,
      stats: d.data.stats || {},
      url: d.data.url || ''
    };
    this.tooltipX = event.offsetX;
    this.tooltipY = event.offsetY;
    this.tooltipVisible = true;
  }

  private updateTooltip(event: MouseEvent) {
    this.tooltipX = event.offsetX;
    this.tooltipY = event.offsetY;
  }

  private hideTooltip() {
    this.tooltipVisible = false;
  }

  private setCenterInfo() {
    this.centerInfo = {
      current: this.currentFocus,
      totalCategories: this.totalCategories,
      totalTools: this.totalTools
    };
  }

  public highlightCategory(categoryId: string) {
    const category = this.root.descendants().find((d: any) => d.depth === 1 && d.data.id === categoryId);
    if (category) this.clicked(null, category);
  }

  public highlightTool(toolName: string) {
    const tool = this.root.descendants().find((d: any) => d.depth === 2 && d.data.name.toLowerCase() === toolName.toLowerCase());
    if (tool) this.clicked(null, tool.parent);
  }

  public getAveragePopularity(node: any): number {
    if (!node.children) return 0;
    const total = node.children.reduce((sum: number, child: any) => sum + (child.data.value || 0), 0);
    return Math.round(total / node.children.length);
  }

  public getStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }

  public openTool(url: string) {
    if (url) window.open(url, '_blank');
  }

  public shareTool(toolData: any) {
    const shareText = `${toolData.title}: ${toolData.url}`;
    if (navigator.share) {
      navigator.share({ title: toolData.title, text: toolData.description, url: toolData.url });
    } else {
      navigator.clipboard.writeText(shareText);
    }
  }
}

