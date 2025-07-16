import { Component, ViewChild, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { SunburstChartComponent } from './app/components/sunburst-chart/sunburst-chart.component';
import { SearchBarComponent } from './app/components/search-bar/search-bar.component';
import { ThemeToggleComponent } from './app/components/theme-toggle/theme-toggle.component';
import { TabsComponent } from './app/components/tabs/tabs.component';
import { ToolInfoDisplayComponent, ToolInfo, CategoryInfo } from './app/components/tool-info-display/tool-info-display.component';
import { ApiService, SunburstData, SearchResult } from './app/services/api.service';
import { ThemeService } from './app/services/theme.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <!-- Animated Background -->
      <div class="background-animation">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
        <div class="floating-shape shape-4"></div>
        <div class="floating-shape shape-5"></div>
      </div>
      
      <!-- Header -->
      <header class="app-header">
        <div class="header-content">
          <div class="logo-section">
            <div class="logo-icon">
              <div class="logo-inner">🤖</div>
            </div>
            <div class="logo-text">
              <h1 class="app-title">AI Tools Universe</h1>
              <p class="app-subtitle">Discover the Future of Artificial Intelligence</p>
            </div>
          </div>
          <div class="header-actions">
            <app-theme-toggle></app-theme-toggle>
          </div>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-icon">✨</span>
            <span class="badge-text">500+ AI Tools Curated</span>
          </div>
          <h1 class="hero-title">
            Explore the Complete
            <span class="gradient-text">AI Ecosystem</span>
          </h1>
          <p class="hero-description">
            Navigate through our interactive sunburst visualization to discover powerful AI tools 
            across 16+ categories. From text generation to healthcare AI, find the perfect solution for your needs.
          </p>
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">{{ totalCategories }}+</div>
              <div class="stat-label">Categories</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ totalTools }}+</div>
              <div class="stat-label">AI Tools</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">100%</div>
              <div class="stat-label">Interactive</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Search Section -->
      <section class="search-section">
        <div class="search-container">
          <h2 class="search-title">Find Your Perfect AI Tool</h2>
          <app-search-bar (searchResult)="onSearchResult($event)"></app-search-bar>
        </div>
      </section>

      <!-- Main Content -->
      <main class="app-main">
        <!-- Sunburst Visualization -->
        <section class="visualization-section">
          <div class="section-header">
            <h2 class="section-title">Interactive AI Tools Map</h2>
            <p class="section-description">
              Click on any category to zoom in and explore its tools. Hover over tools for detailed information.
            </p>
          </div>
          
          <div class="chart-container" *ngIf="sunburstData">
            <app-sunburst-chart 
              #sunburstChart
              [data]="sunburstData"
              (categorySelect)="onCategoryClick($event)"
              (toolClick)="onToolClick($event)">
            </app-sunburst-chart>
          </div>

          <div class="loading-container" *ngIf="!sunburstData">
            <div class="loading-animation">
              <div class="loading-circle"></div>
              <div class="loading-circle"></div>
              <div class="loading-circle"></div>
            </div>
            <p class="loading-text">Loading AI tools universe...</p>
          </div>
        </section>
        <!-- Tool/Category Info Display -->
        <app-tool-info-display
          [selectedTool]="selectedTool"
          [selectedCategory]="selectedCategory"
          (visitTool)="visitTool($event)"
          (shareTool)="shareTool($event)"
          (toolSelect)="onToolSelect($event)">
        </app-tool-info-display>

   <!-- Tabs Navigation -->
        <div class="tabs-wrapper">
          <app-tabs></app-tabs>
        </div>
        <!-- Features Showcase -->
        <section class="features-showcase">
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🔍</div>
              <h3>Smart Discovery</h3>
              <p>Find AI tools through intelligent search and visual exploration</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">⚡</div>
              <h3>Real-time Data</h3>
              <p>Always up-to-date information about the latest AI tools and trends</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🎯</div>
              <h3>Curated Quality</h3>
              <p>Hand-picked tools ensuring relevance and reliability</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h3>Mobile Ready</h3>
              <p>Seamless experience across all devices and screen sizes</p>
            </div>
          </div>
        </section>
      </main>

      <!-- Footer -->
      <footer class="app-footer">
        <div class="footer-content">
          <div class="footer-section">
            <div class="footer-logo">
              <div class="footer-logo-icon">🤖</div>
              <span class="footer-logo-text">AI Tools Universe</span>
            </div>
            <p class="footer-description">
              Your gateway to discovering and exploring the vast ecosystem of artificial intelligence tools.
            </p>
          </div>
          
          <div class="footer-section">
            <h4>Explore</h4>
            <ul class="footer-links">
              <li><a href="#categories">Categories</a></li>
              <li><a href="#tools">All Tools</a></li>
              <li><a href="#trending">Trending</a></li>
              <li><a href="#new">New Releases</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>Resources</h4>
            <ul class="footer-links">
              <li><a href="#api">API</a></li>
              <li><a href="#docs">Documentation</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#guides">Guides</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>Connect</h4>
            <ul class="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#twitter">Twitter</a></li>
              <li><a href="#github">GitHub</a></li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2025 AI Tools Universe. Empowering innovation through AI discovery.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: var(--app-bg);
      color: var(--app-text);
      position: relative;
      overflow-x: hidden;
    }

    /* Animated Background */
    .background-animation {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }

    .floating-shape {
      position: absolute;
      border-radius: 50%;
      background: var(--shape-gradient);
      opacity: 0.1;
      animation: float 20s infinite ease-in-out;
    }

    .shape-1 {
      width: 300px;
      height: 300px;
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 200px;
      height: 200px;
      top: 60%;
      right: 10%;
      animation-delay: 5s;
    }

    .shape-3 {
      width: 150px;
      height: 150px;
      top: 30%;
      right: 30%;
      animation-delay: 10s;
    }

    .shape-4 {
      width: 250px;
      height: 250px;
      bottom: 20%;
      left: 20%;
      animation-delay: 15s;
    }

    .shape-5 {
      width: 100px;
      height: 100px;
      top: 80%;
      left: 60%;
      animation-delay: 8s;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
      }
      33% {
        transform: translateY(-30px) rotate(120deg);
      }
      66% {
        transform: translateY(20px) rotate(240deg);
      }
    }

    /* Header */
    .app-header {
      position: relative;
      z-index: 10;
      padding: 20px 0;
      background: var(--header-bg);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--header-border);
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .logo-icon {
      width: 56px;
      height: 56px;
      background: var(--logo-bg);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      position: relative;
      overflow: hidden;
    }

    .logo-icon::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      animation: shimmer 3s infinite;
    }

    .logo-inner {
      font-size: 28px;
      z-index: 1;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .app-title {
      font-size: 24px;
      font-weight: 800;
      margin: 0;
      background: var(--title-gradient);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .app-subtitle {
      font-size: 14px;
      color: var(--subtitle-color);
      margin: 2px 0 0 0;
      font-weight: 500;
    }

    /* Hero Section */
    .hero-section {
      position: relative;
      z-index: 1;
      padding: 80px 0 60px;
      text-align: center;
    }

    .hero-content {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--badge-bg);
      color: var(--badge-text);
      padding: 8px 20px;
      border-radius: 50px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 32px;
      border: 1px solid var(--badge-border);
      backdrop-filter: blur(10px);
    }

    .badge-icon {
      font-size: 16px;
    }

    .hero-title {
      font-size: clamp(36px, 5vw, 64px);
      font-weight: 900;
      line-height: 1.1;
      margin: 0 0 24px 0;
      color: var(--hero-title);
    }

    .gradient-text {
      background: var(--gradient-text);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-description {
      font-size: 20px;
      color: var(--hero-text);
      line-height: 1.6;
      margin: 0 0 48px 0;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
    }

    .hero-stats {
      display: flex;
      justify-content: center;
      gap: 48px;
      flex-wrap: wrap;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      font-size: 36px;
      font-weight: 800;
      color: var(--stat-number);
      margin-bottom: 8px;
      display: block;
    }

    .stat-label {
      font-size: 14px;
      color: var(--stat-label);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* Search Section */
    .search-section {
      position: relative;
      z-index: 1;
      padding: 40px 0;
      background: var(--search-section-bg);
      backdrop-filter: blur(20px);
    }

    .search-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 24px;
      text-align: center;
    }

    .search-title {
      font-size: 28px;
      font-weight: 700;
      color: var(--search-title);
      margin: 0 0 24px 0;
    }

    /* Main Content */
    .app-main {
      position: relative;
      z-index: 1;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .tabs-wrapper {
      padding: 60px 0 40px;
    }

    /* Visualization Section */
    .visualization-section {
      padding: 40px 0 80px;
    }

    .section-header {
      text-align: center;
      margin-bottom: 48px;
    }

    .section-title {
      font-size: 36px;
      font-weight: 800;
      color: var(--section-title);
      margin: 0 0 16px 0;
    }

    .section-description {
      font-size: 18px;
      color: var(--section-text);
      margin: 0;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.6;
    }

    .chart-container {
      background: var(--chart-bg);
      border-radius: 24px;
      padding: 40px;
      border: 1px solid var(--chart-border);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(20px);
      min-height: 800px;
    }

    /* Loading Animation */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 100px 0;
    }

    .loading-animation {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
    }

    .loading-circle {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--loading-color);
      animation: bounce 1.4s infinite ease-in-out both;
    }

    .loading-circle:nth-child(1) { animation-delay: -0.32s; }
    .loading-circle:nth-child(2) { animation-delay: -0.16s; }

    @keyframes bounce {
      0%, 80%, 100% {
        transform: scale(0);
      }
      40% {
        transform: scale(1);
      }
    }

    .loading-text {
      color: var(--loading-text);
      font-size: 16px;
      font-weight: 500;
    }

    /* Features Showcase */
    .features-showcase {
      padding: 80px 0;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 32px;
    }

    .feature-card {
      background: var(--feature-bg);
      padding: 40px 32px;
      border-radius: 20px;
      border: 1px solid var(--feature-border);
      text-align: center;
      transition: all 0.4s ease;
      backdrop-filter: blur(20px);
    }

    .feature-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    }

    .feature-icon {
      font-size: 48px;
      margin-bottom: 24px;
      display: block;
    }

    .feature-card h3 {
      font-size: 20px;
      font-weight: 700;
      color: var(--feature-title);
      margin: 0 0 16px 0;
    }

    .feature-card p {
      color: var(--feature-text);
      line-height: 1.6;
      margin: 0;
    }

    /* Footer */
    .app-footer {
      position: relative;
      z-index: 1;
      background: var(--footer-bg);
      border-top: 1px solid var(--footer-border);
      margin-top: 80px;
    }

    .footer-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 60px 24px 40px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 40px;
    }

    .footer-section h4 {
      font-size: 16px;
      font-weight: 700;
      color: var(--footer-heading);
      margin: 0 0 20px 0;
    }

    .footer-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .footer-logo-icon {
      font-size: 24px;
    }

    .footer-logo-text {
      font-size: 18px;
      font-weight: 700;
      color: var(--footer-logo);
    }

    .footer-description {
      color: var(--footer-text);
      line-height: 1.6;
      margin: 0;
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-links li {
      margin-bottom: 12px;
    }

    .footer-links a {
      color: var(--footer-link);
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .footer-links a:hover {
      color: var(--footer-link-hover);
    }

    .footer-bottom {
      border-top: 1px solid var(--footer-border);
      padding: 24px;
      text-align: center;
    }

    .footer-bottom p {
      color: var(--footer-text);
      margin: 0;
      font-size: 14px;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 20px;
        text-align: center;
      }

      .hero-section {
        padding: 60px 0 40px;
      }

      .hero-stats {
        gap: 32px;
      }

      .chart-container {
        padding: 20px;
        min-height: 600px;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .footer-content {
        grid-template-columns: 1fr;
        text-align: center;
      }
    }

    /* Light Theme */
    :host-context([data-theme="light"]) {
      --app-bg: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      --app-text: #1e293b;
      --shape-gradient: linear-gradient(135deg, #3b82f6, #8b5cf6);
      --header-bg: rgba(255, 255, 255, 0.9);
      --header-border: rgba(226, 232, 240, 0.6);
      --logo-bg: linear-gradient(135deg, #3b82f6, #1e40af);
      --title-gradient: linear-gradient(135deg, #3b82f6, #1e40af);
      --subtitle-color: #64748b;
      --badge-bg: rgba(255, 255, 255, 0.9);
      --badge-text: #3b82f6;
      --badge-border: rgba(59, 130, 246, 0.2);
      --hero-title: #1e293b;
      --gradient-text: linear-gradient(135deg, #3b82f6, #8b5cf6);
      --hero-text: #64748b;
      --stat-number: #3b82f6;
      --stat-label: #64748b;
      --search-section-bg: rgba(255, 255, 255, 0.6);
      --search-title: #1e293b;
      --section-title: #1e293b;
      --section-text: #64748b;
      --chart-bg: rgba(255, 255, 255, 0.8);
      --chart-border: rgba(226, 232, 240, 0.6);
      --loading-color: #3b82f6;
      --loading-text: #64748b;
      --feature-bg: rgba(255, 255, 255, 0.8);
      --feature-border: rgba(226, 232, 240, 0.6);
      --feature-title: #1e293b;
      --feature-text: #64748b;
      --footer-bg: rgba(255, 255, 255, 0.9);
      --footer-border: rgba(226, 232, 240, 0.6);
      --footer-heading: #1e293b;
      --footer-logo: #1e293b;
      --footer-text: #64748b;
      --footer-link: #64748b;
      --footer-link-hover: #3b82f6;
    }

    /* Dark Theme */
    :host-context([data-theme="dark"]) {
      --app-bg: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      --app-text: #f1f5f9;
      --shape-gradient: linear-gradient(135deg, #3b82f6, #8b5cf6);
      --header-bg: rgba(15, 23, 42, 0.9);
      --header-border: rgba(51, 65, 85, 0.6);
      --logo-bg: linear-gradient(135deg, #3b82f6, #60a5fa);
      --title-gradient: linear-gradient(135deg, #60a5fa, #3b82f6);
      --subtitle-color: #94a3b8;
      --badge-bg: rgba(30, 41, 59, 0.9);
      --badge-text: #60a5fa;
      --badge-border: rgba(96, 165, 250, 0.2);
      --hero-title: #f1f5f9;
      --gradient-text: linear-gradient(135deg, #60a5fa, #a78bfa);
      --hero-text: #94a3b8;
      --stat-number: #60a5fa;
      --stat-label: #94a3b8;
      --search-section-bg: rgba(30, 41, 59, 0.6);
      --search-title: #f1f5f9;
      --section-title: #f1f5f9;
      --section-text: #94a3b8;
      --chart-bg: rgba(30, 41, 59, 0.8);
      --chart-border: rgba(51, 65, 85, 0.6);
      --loading-color: #60a5fa;
      --loading-text: #94a3b8;
      --feature-bg: rgba(30, 41, 59, 0.8);
      --feature-border: rgba(51, 65, 85, 0.6);
      --feature-title: #f1f5f9;
      --feature-text: #94a3b8;
      --footer-bg: rgba(15, 23, 42, 0.9);
      --footer-border: rgba(51, 65, 85, 0.6);
      --footer-heading: #f1f5f9;
      --footer-logo: #f1f5f9;
      --footer-text: #94a3b8;
      --footer-link: #94a3b8;
      --footer-link-hover: #60a5fa;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    SunburstChartComponent,
    SearchBarComponent,
    ThemeToggleComponent,
    TabsComponent,
    ToolInfoDisplayComponent
  ]
})
export class App implements OnInit {
  @ViewChild('sunburstChart') sunburstChart!: SunburstChartComponent;
  
  sunburstData: SunburstData | null = null;
  totalCategories = 0;
  totalTools = 0;
  selectedTool: ToolInfo | null = null;
  selectedCategory: CategoryInfo | null = null;

  constructor(
    private apiService: ApiService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.loadSunburstData();
  }

  private loadSunburstData() {
    this.apiService.getSunburstData().subscribe({
      next: (data) => {
        this.sunburstData = data;
        this.totalCategories = data.children.length;
        this.totalTools = data.children.reduce((sum, category) => sum + category.children.length, 0);
      },
      error: (error) => {
        console.error('Error loading sunburst data:', error);
        // Fallback data for development
        this.totalCategories = 16;
        this.totalTools = 500;
      }
    });
  }

  onSearchResult(result: SearchResult) {
    console.log('Search result received:', result);
    
    // Clear previous selections first
    this.selectedTool = null;
    this.selectedCategory = null;
    
    // Wait for chart to be ready
    setTimeout(() => {
      if (result.type === 'category' && result.id) {
        console.log('Highlighting category:', result.id);
        this.sunburstChart?.highlightCategory(result.id);
      } else if (result.type === 'tool' && result.name) {
        console.log('Highlighting tool:', result.name);
        this.sunburstChart?.highlightTool(result.name);
        
        // Also set the selected tool for display
        this.selectedTool = {
          name: result.name,
          description: result.description,
          url: result.url,
          category: result.category || 'Unknown',
          categoryColor: result.categoryColor || '#3b82f6',
          popularity: 85 // Default value since it's not in search results
        };
      }
    }, 100);
  }

  onCategoryClick(categoryData: CategoryInfo) {
    this.selectedCategory = categoryData;
    this.selectedTool = null;
  }

  onToolClick(toolData: any) {
    this.selectedTool = toolData;
    this.selectedCategory = null;
  }

  onToolSelect(toolData: ToolInfo) {
    this.selectedTool = toolData;
    this.selectedCategory = null;
  }

  clearSelections() {
    this.selectedTool = null;
    this.selectedCategory = null;
  }

  visitTool(url: string) {
    window.open(url, '_blank');
  }

  shareTool(toolData: ToolInfo) {
    const shareText = `Check out ${toolData.name}: ${toolData.description}`;
    const shareUrl = toolData.url || '';
    
    if (navigator.share) {
      navigator.share({
        title: toolData.name,
        text: shareText,
        url: shareUrl
      }).catch(console.error);
    } else {
      // Fallback to clipboard
      const textToShare = `${shareText}\n${shareUrl}`;
      navigator.clipboard.writeText(textToShare).then(() => {
        console.log('Tool shared to clipboard');
      }).catch(console.error);
    }
  }
}

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    ApiService,
    ThemeService
  ]
}).catch(err => console.error(err));