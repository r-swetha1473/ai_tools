import { Component, ElementRef, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { SunburstData } from '../../services/api.service';
import { ThemeService } from '../../services/theme.service';
import { Subject, takeUntil } from 'rxjs';
import { SearchResult } from '../../services/api.service';

export interface ToolClickData {
  name: string;
  description: string;
  url?: string;
  category: string;
  categoryColor: string;
  popularity: number;
}

@Component({
  selector: 'app-sunburst-chart',
  template: `
    <div class="sunburst-container">
      <div class="controls">
        <button class="btn btn-secondary" (click)="resetZoom()">Reset View</button>
      </div>
      
      <div class="chart-wrapper">
        <svg #svgElement class="sunburst-svg"></svg>
        
        <!-- Enhanced Center Circle -->
        <div class="center-circle" *ngIf="centerInfo">
          <div class="center-content">
            <!-- Breadcrumb Navigation -->
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
            
            <!-- Root View -->
            <div class="center-info" *ngIf="!currentFocus || currentFocus === root">
              <div class="center-logo">
                <div class="logo-ring">
                  <div class="logo-inner">🤖</div>
                </div>
              </div>
              <h3 class="center-title">AI Universe</h3>
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
            
            <!-- Category View -->
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
    </div>
  `,
  styles: [`
    .sunburst-container {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 700px;
      background: var(--chart-bg);
      border-radius: 20px;
      overflow: hidden;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: .75rem 1.5rem;
      border: none;
      border-radius: .5rem;
      font-size: .875rem;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      transition: all .2s ease;
      white-space: nowrap;
    }

    .btn-secondary {
      background-color: var(--bg-secondary);
      color: var(--text-primary);
      border: 1px solid var(--border);
    }

    .btn-secondary:hover {
      background-color: var(--bg-tertiary);
      transform: translateY(-1px);
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

    .sunburst-svg .highlighted {
      stroke: url(#glow-gradient);
      stroke-width: 4px !important;
      filter: drop-shadow(0 0 10px #f59e0b);
    }

    .sunburst-svg .parent-highlighted {
      filter: drop-shadow(0 0 6px #3b82f6) brightness(1.1);
      stroke: #3b82f6 !important;
      stroke-width: 2px !important;
    }

    /* Enhanced Center Circle */
    .center-circle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 10;
      width: 280px;
      height: 280px;
      border-radius: 50%;
      background: var(--center-bg);
      backdrop-filter: blur(20px);
      border: 2px solid var(--center-border);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .center-content {
      text-align: center;
      padding: 20px;
      width: 100%;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      font-size: 12px;
    }

    .breadcrumb-item {
      background: none;
      border: none;
      color: var(--breadcrumb-color);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 6px;
      transition: all 0.2s ease;
      pointer-events: auto;
      font-size: 12px;
      font-weight: 500;
    }

    .breadcrumb-item:hover {
      background: var(--breadcrumb-hover);
      color: var(--breadcrumb-hover-color);
    }

    .breadcrumb-item svg {
      width: 12px;
      height: 12px;
    }

    .breadcrumb-separator {
      margin: 0 6px;
      color: var(--breadcrumb-separator);
      font-weight: 300;
    }

    .breadcrumb-current {
      color: var(--breadcrumb-current);
      font-weight: 600;
    }

    /* Root View Styles */
    .center-info {
      text-align: center;
    }

    .center-logo {
      margin-bottom: 16px;
    }

    .logo-ring {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: var(--logo-ring-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      position: relative;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .logo-ring::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      border-radius: 50%;
      background: var(--logo-ring-border);
      z-index: -1;
      animation: rotate 20s linear infinite;
    }

    .logo-inner {
      font-size: 32px;
      z-index: 1;
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .center-title {
      font-size: 20px;
      font-weight: 700;
      color: var(--center-title);
      margin: 0 0 6px 0;
    }

    .center-description {
      font-size: 12px;
      color: var(--center-description);
      margin: 0 0 16px 0;
    }

    .center-stats {
      display: flex;
      justify-content: center;
      gap: 20px;
    }

    .stat {
      text-align: center;
    }

    .stat-number {
      display: block;
      font-size: 18px;
      font-weight: 700;
      color: var(--stat-number);
      margin-bottom: 2px;
    }

    .stat-label {
      font-size: 10px;
      color: var(--stat-label);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 500;
    }

    /* Category View Styles */
    .category-info {
      text-align: center;
    }

    .category-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      text-align: left;
    }

    .category-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: white;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .category-details {
      flex: 1;
      min-width: 0;
    }

    .category-name {
      font-size: 16px;
      font-weight: 700;
      color: var(--category-name);
      margin: 0 0 2px 0;
    }

    .category-description {
      font-size: 11px;
      color: var(--category-description);
      margin: 0;
      line-height: 1.3;
    }

    .category-stats {
      display: flex;
      justify-content: center;
      gap: 20px;
    }

    /* SVG Text Styles */
    text {
      pointer-events: none;
      fill: var(--text-color);
      font-size: 10px;
      font-weight: bold;
      text-shadow: 0 1px 2px var(--text-shadow);
    }

    @media (max-width: 768px) {
      .center-circle {
        width: 240px;
        height: 240px;
      }

      .center-content {
        padding: 16px;
      }

      .logo-ring {
        width: 60px;
        height: 60px;
      }

      .logo-inner {
        font-size: 24px;
      }

      .center-title {
        font-size: 16px;
      }

      .category-header {
        flex-direction: column;
        text-align: center;
        gap: 8px;
      }

      .category-stats {
        gap: 16px;
      }
    }

    /* Light theme */
    :host-context([data-theme="light"]) {
      --chart-bg: linear-gradient(135deg, #fdfbfb, #ebedee);
      --bg-primary: rgba(255, 255, 255, 0.9);
      --bg-secondary: rgba(248, 250, 252, 0.9);
      --bg-tertiary: #f1f5f9;
      --text-primary: #1e293b;
      --border: #e2e8f0;
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
      --logo-ring-bg: linear-gradient(135deg, #3b82f6, #1e40af);
      --logo-ring-border: linear-gradient(135deg, #60a5fa, #3b82f6);
      --text-color: #1e293b;
      --text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6);
    }

    /* Dark theme */
    :host-context([data-theme="dark"]) {
      --chart-bg: linear-gradient(135deg, #1e293b, #0f172a);
      --bg-primary: rgba(30, 41, 59, 0.9);
      --bg-secondary: rgba(51, 65, 85, 0.9);
      --bg-tertiary: #64748b;
      --text-primary: #f1f5f9;
      --border: #334155;
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
      --logo-ring-bg: linear-gradient(135deg, #3b82f6, #60a5fa);
      --logo-ring-border: linear-gradient(135deg, #60a5fa, #a78bfa);
      --text-color: #f1f5f9;
      --text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class SunburstChartComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() data!: SunburstData;
  @Output() categorySelect = new EventEmitter<string>();
  @Output() toolClick = new EventEmitter<ToolClickData>();
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
      .style('cursor', 'pointer')
      .on('click', (event, d) => this.clicked(event, d));

    this.labels = svg.append('g').attr('pointer-events', 'none').attr('class', 'labels');
    this.updateLabels();
    this.setCenterInfo();
  }

  private clicked(event: any, p: any) {
    // Handle tool (leaf node) clicks
    if (p.depth === 2 && p.data.url) {
      const toolData: ToolClickData = {
        name: p.data.name,
        description: p.data.description,
        url: p.data.url,
        category: p.parent.data.name,
        categoryColor: p.data.color,
        popularity: p.data.value || 0
      };
      this.toolClick.emit(toolData);
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
        .style('fill', 'var(--text-color)')
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
      'code-generation': '💻',
      'audio-processing': '🎵',
      'video-generation': '🎬',
      'data-analysis': '📊',
      'design-tools': '🎯',
      'productivity': '⚡'
    };
    return icons[id] || '🔧';
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
}