import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabs',
  template: `
    <div class="tabs-container">
      <div class="tabs-header">
        <button 
          *ngFor="let tab of tabs" 
          class="tab-button"
          [class.active]="activeTab === tab.id"
          (click)="setActiveTab(tab.id)"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
        </button>
      </div>
      
      <div class="tabs-content">
        <!-- Overview Tab -->
        <div class="tab-panel" [class.active]="activeTab === 'overview'">
          <div class="overview-grid">
            <div class="overview-card">
              <div class="card-icon">🤖</div>
              <h3>AI Revolution</h3>
              <p>Discover cutting-edge artificial intelligence tools that are transforming industries and empowering creators worldwide.</p>
            </div>
            <div class="overview-card">
              <div class="card-icon">🎯</div>
              <h3>Curated Selection</h3>
              <p>Hand-picked tools across 16+ categories, from text generation to healthcare AI, ensuring quality and relevance.</p>
            </div>
            <div class="overview-card">
              <div class="card-icon">📊</div>
              <h3>Interactive Exploration</h3>
              <p>Navigate through our zoomable sunburst visualization to explore tools by category and discover new possibilities.</p>
            </div>
            <div class="overview-card">
              <div class="card-icon">⚡</div>
              <h3>Real-time Updates</h3>
              <p>Stay current with the latest AI tools and trends through our continuously updated database.</p>
            </div>
          </div>
        </div>

        <!-- Categories Tab -->
        <div class="tab-panel" [class.active]="activeTab === 'categories'">
          <div class="categories-grid">
            <div class="category-card" *ngFor="let category of categories">
              <div class="category-header">
                <div class="category-icon" [style.background]="category.color">
                  {{ category.icon }}
                </div>
                <div class="category-info">
                  <h4>{{ category.name }}</h4>
                  <span class="tool-count">{{ category.toolCount }} tools</span>
                </div>
              </div>
              <p class="category-description">{{ category.description }}</p>
              <div class="category-tools">
                <span class="tool-tag" *ngFor="let tool of category.popularTools">
                  {{ tool }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Features Tab -->
        <div class="tab-panel" [class.active]="activeTab === 'features'">
          <div class="features-list">
            <div class="feature-item">
              <div class="feature-icon">🔍</div>
              <div class="feature-content">
                <h4>Smart Search</h4>
                <p>Instantly find AI tools with our intelligent search that understands context and suggests relevant alternatives.</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🎨</div>
              <div class="feature-content">
                <h4>Visual Discovery</h4>
                <p>Explore tools through our interactive sunburst chart that makes discovering new AI solutions intuitive and engaging.</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">📱</div>
              <div class="feature-content">
                <h4>Responsive Design</h4>
                <p>Access our platform seamlessly across all devices with a mobile-first design that adapts to your screen.</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🌙</div>
              <div class="feature-content">
                <h4>Dark Mode</h4>
                <p>Switch between light and dark themes for comfortable viewing in any environment or time of day.</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">⚡</div>
              <div class="feature-content">
                <h4>Fast Performance</h4>
                <p>Built with modern web technologies for lightning-fast loading and smooth interactions.</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🔗</div>
              <div class="feature-content">
                <h4>Direct Access</h4>
                <p>Click any tool to visit its official website directly, making it easy to start using AI tools immediately.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- About Tab -->
        <div class="tab-panel" [class.active]="activeTab === 'about'">
          <div class="about-content">
            <div class="about-hero">
              <h2>About AI Tools Explorer</h2>
              <p class="about-subtitle">Democratizing access to artificial intelligence through intuitive discovery</p>
            </div>
            
            <div class="about-sections">
              <div class="about-section">
                <h3>Our Mission</h3>
                <p>We believe that artificial intelligence should be accessible to everyone. Our mission is to create the most comprehensive and user-friendly directory of AI tools, helping individuals and businesses discover the perfect solutions for their needs.</p>
              </div>
              
              <div class="about-section">
                <h3>Why We Built This</h3>
                <p>The AI landscape is evolving rapidly, with new tools launching daily. We created this platform to cut through the noise and provide a curated, organized view of the most valuable AI tools across all industries and use cases.</p>
              </div>
              
              <div class="about-section">
                <h3>Our Approach</h3>
                <p>We combine data-driven insights with human curation to ensure our directory remains accurate, relevant, and valuable. Each tool is evaluated based on functionality, user experience, and real-world impact.</p>
              </div>
              
              <div class="about-section">
                <h3>Looking Forward</h3>
                <p>As AI continues to transform how we work and create, we're committed to evolving our platform to meet the changing needs of our community. Join us in exploring the future of artificial intelligence.</p>
              </div>
            </div>
            
            <div class="about-stats">
              <div class="stat-item">
                <div class="stat-number">500+</div>
                <div class="stat-label">AI Tools</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">16</div>
                <div class="stat-label">Categories</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">10K+</div>
                <div class="stat-label">Monthly Users</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">24/7</div>
                <div class="stat-label">Updates</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tabs-container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
    }

    .tabs-header {
      display: flex;
      border-bottom: 2px solid var(--tabs-border);
      margin-bottom: 32px;
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .tabs-header::-webkit-scrollbar {
      display: none;
    }

    .tab-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px 24px;
      border: none;
      background: transparent;
      color: var(--tab-inactive);
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      border-bottom: 3px solid transparent;
      white-space: nowrap;
      min-width: fit-content;
    }

    .tab-button:hover {
      color: var(--tab-hover);
      background: var(--tab-hover-bg);
    }

    .tab-button.active {
      color: var(--tab-active);
      border-bottom-color: var(--tab-active-border);
      background: var(--tab-active-bg);
    }

    .tab-icon {
      font-size: 18px;
    }

    .tab-label {
      font-weight: 600;
    }

    .tabs-content {
      position: relative;
      min-height: 400px;
    }

    .tab-panel {
      display: none;
      animation: fadeIn 0.3s ease-in-out;
    }

    .tab-panel.active {
      display: block;
    }

    /* Overview Tab Styles */
    .overview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }

    .overview-card {
      background: var(--card-bg);
      padding: 32px 24px;
      border-radius: 16px;
      border: 1px solid var(--card-border);
      text-align: center;
      transition: all 0.3s ease;
    }

    .overview-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
    }

    .card-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .overview-card h3 {
      font-size: 20px;
      font-weight: 700;
      color: var(--card-title);
      margin: 0 0 12px 0;
    }

    .overview-card p {
      color: var(--card-text);
      line-height: 1.6;
      margin: 0;
    }

    /* Categories Tab Styles */
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 20px;
    }

    .category-card {
      background: var(--card-bg);
      padding: 24px;
      border-radius: 16px;
      border: 1px solid var(--card-border);
      transition: all 0.3s ease;
    }

    .category-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }

    .category-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
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
    }

    .category-info h4 {
      font-size: 18px;
      font-weight: 700;
      color: var(--card-title);
      margin: 0 0 4px 0;
    }

    .tool-count {
      font-size: 14px;
      color: var(--card-subtitle);
      font-weight: 500;
    }

    .category-description {
      color: var(--card-text);
      line-height: 1.5;
      margin: 0 0 16px 0;
    }

    .category-tools {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .tool-tag {
      background: var(--tag-bg);
      color: var(--tag-text);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    /* Features Tab Styles */
    .features-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 20px;
      padding: 24px;
      background: var(--card-bg);
      border-radius: 16px;
      border: 1px solid var(--card-border);
      transition: all 0.3s ease;
    }

    .feature-item:hover {
      transform: translateX(4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }

    .feature-icon {
      font-size: 32px;
      flex-shrink: 0;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--feature-icon-bg);
      border-radius: 12px;
    }

    .feature-content h4 {
      font-size: 18px;
      font-weight: 700;
      color: var(--card-title);
      margin: 0 0 8px 0;
    }

    .feature-content p {
      color: var(--card-text);
      line-height: 1.6;
      margin: 0;
    }

    /* About Tab Styles */
    .about-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .about-hero {
      text-align: center;
      margin-bottom: 48px;
    }

    .about-hero h2 {
      font-size: 36px;
      font-weight: 800;
      color: var(--about-title);
      margin: 0 0 16px 0;
    }

    .about-subtitle {
      font-size: 20px;
      color: var(--about-subtitle);
      margin: 0;
      line-height: 1.5;
    }

    .about-sections {
      display: flex;
      flex-direction: column;
      gap: 32px;
      margin-bottom: 48px;
    }

    .about-section h3 {
      font-size: 24px;
      font-weight: 700;
      color: var(--about-heading);
      margin: 0 0 16px 0;
    }

    .about-section p {
      color: var(--about-text);
      line-height: 1.7;
      font-size: 16px;
      margin: 0;
    }

    .about-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 24px;
      padding: 32px;
      background: var(--stats-bg);
      border-radius: 16px;
      border: 1px solid var(--stats-border);
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      font-size: 32px;
      font-weight: 800;
      color: var(--stat-number);
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 14px;
      color: var(--stat-label);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .tabs-header {
        padding: 0 16px;
      }

      .tab-button {
        padding: 12px 16px;
        font-size: 14px;
      }

      .overview-grid,
      .categories-grid {
        grid-template-columns: 1fr;
      }

      .feature-item {
        flex-direction: column;
        text-align: center;
      }

      .about-hero h2 {
        font-size: 28px;
      }

      .about-subtitle {
        font-size: 16px;
      }
    }

    /* Light Theme */
    :host-context([data-theme="light"]) {
      --tabs-border: #e2e8f0;
      --tab-inactive: #64748b;
      --tab-hover: #3b82f6;
      --tab-hover-bg: rgba(59, 130, 246, 0.05);
      --tab-active: #3b82f6;
      --tab-active-border: #3b82f6;
      --tab-active-bg: rgba(59, 130, 246, 0.1);
      --card-bg: rgba(255, 255, 255, 0.8);
      --card-border: rgba(226, 232, 240, 0.6);
      --card-title: #1e293b;
      --card-text: #475569;
      --card-subtitle: #64748b;
      --tag-bg: #f1f5f9;
      --tag-text: #475569;
      --feature-icon-bg: rgba(59, 130, 246, 0.1);
      --about-title: #1e293b;
      --about-subtitle: #64748b;
      --about-heading: #1e293b;
      --about-text: #475569;
      --stats-bg: rgba(255, 255, 255, 0.8);
      --stats-border: rgba(226, 232, 240, 0.6);
      --stat-number: #3b82f6;
      --stat-label: #64748b;
    }

    /* Dark Theme */
    :host-context([data-theme="dark"]) {
      --tabs-border: #334155;
      --tab-inactive: #94a3b8;
      --tab-hover: #60a5fa;
      --tab-hover-bg: rgba(96, 165, 250, 0.1);
      --tab-active: #60a5fa;
      --tab-active-border: #60a5fa;
      --tab-active-bg: rgba(96, 165, 250, 0.15);
      --card-bg: rgba(30, 41, 59, 0.8);
      --card-border: rgba(51, 65, 85, 0.6);
      --card-title: #f1f5f9;
      --card-text: #cbd5e1;
      --card-subtitle: #94a3b8;
      --tag-bg: #475569;
      --tag-text: #cbd5e1;
      --feature-icon-bg: rgba(96, 165, 250, 0.15);
      --about-title: #f1f5f9;
      --about-subtitle: #94a3b8;
      --about-heading: #f1f5f9;
      --about-text: #cbd5e1;
      --stats-bg: rgba(30, 41, 59, 0.8);
      --stats-border: rgba(51, 65, 85, 0.6);
      --stat-number: #60a5fa;
      --stat-label: #94a3b8;
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class TabsComponent implements OnInit {
  activeTab = 'overview';

  tabs = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'categories', label: 'Categories', icon: '📂' },
    { id: 'features', label: 'Features', icon: '⚡' },
    { id: 'about', label: 'About', icon: 'ℹ️' }
  ];

  categories = [
    {
      name: 'Text Generation',
      description: 'AI tools for generating and editing text content',
      color: '#3B82F6',
      icon: '✍️',
      toolCount: 4,
      popularTools: ['ChatGPT', 'Claude', 'Gemini']
    },
    {
      name: 'Image Generation',
      description: 'AI tools for creating and editing images',
      color: '#EC4899',
      icon: '🎨',
      toolCount: 4,
      popularTools: ['DALL·E', 'Midjourney', 'Stable Diffusion']
    },
    {
      name: 'Code Generation',
      description: 'AI tools for programming and code assistance',
      color: '#10B981',
      icon: '💻',
      toolCount: 4,
      popularTools: ['GitHub Copilot', 'Cursor', 'Tabnine']
    },
    {
      name: 'Audio Processing',
      description: 'AI tools for audio and music generation',
      color: '#F59E0B',
      icon: '🎵',
      toolCount: 4,
      popularTools: ['ElevenLabs', 'Mubert', 'Speechify']
    },
    {
      name: 'Video Generation',
      description: 'AI tools for video creation and editing',
      color: '#8B5CF6',
      icon: '🎬',
      toolCount: 4,
      popularTools: ['Runway ML', 'Synthesia', 'Luma AI']
    },
    {
      name: 'Data Analysis',
      description: 'AI tools for data processing and analysis',
      color: '#06B6D4',
      icon: '📊',
      toolCount: 4,
      popularTools: ['Tableau GPT', 'Julius AI', 'DataRobot']
    }
  ];

  constructor() {}

  ngOnInit() {}

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }
}