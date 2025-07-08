import { Component, OnInit, OnDestroy, Output, EventEmitter,HostListener  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, SearchResult } from '../../services/api.service';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  template: `
    <div class="search-container">
  <div class="search-input-wrapper">
    <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>
    <input
      type="text"
      class="search-input"
      placeholder="Search AI tools and categories..."
      [(ngModel)]="searchQuery"
      (input)="onSearchInput($event)"
      (focus)="showResults = true"
      (blur)="onBlur()"
    />
    <button *ngIf="searchQuery" class="clear-button" (click)="clearSearch()" type="button">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>

  <div class="search-results" *ngIf="showResults && searchResults.length > 0">
    <div *ngFor="let result of searchResults; let i = index">
      <div *ngIf="isFirstOfType(i, result.type)" class="results-header">
        {{ result.type === 'category' ? 'Categories' : 'Tools' }}
      </div>
      <div
        class="search-result-item"
        [class.selected]="i === selectedIndex"
        (click)="selectResult(result)"
      >
        <div class="result-icon" [style.background-color]="getResultColor(result)">
          <span class="result-emoji">{{ getResultIcon(result) }}</span>
        </div>
        <div class="result-content">
          <div class="result-name" [innerHTML]="highlight(result.name)"></div>
          <div class="result-description" [innerHTML]="highlight(result.description)"></div>
          <div class="result-type">{{ result.type === 'category' ? 'Category' : 'Tool' }}</div>
        </div>
      </div>
    </div>
  </div>
</div>

  `,
  styles: [`
    .search-container {
      position: relative;
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
    }
.search-result-item.selected {
  background-color: var(--search-border-focus);
  color: white;
  transform: translateX(4px);
}
.results-header {
  padding: 6px 20px;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  color: var(--results-category);
  background-color: var(--results-bg);
}

    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-input {
      width: 100%;
      padding: 16px 20px 16px 56px;
      border: 2px solid var(--search-border);
      border-radius: 16px;
      font-size: 16px;
      background: var(--search-bg);
      color: var(--search-text);
      transition: all 0.3s ease;
      outline: none;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .search-input:focus {
      border-color: var(--search-border-focus);
      box-shadow: 0 0 0 4px var(--search-shadow), 0 8px 32px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
    }

    .search-icon {
      position: absolute;
      left: 20px;
      width: 20px;
      height: 20px;
      color: var(--search-icon);
      pointer-events: none;
      z-index: 1;
    }

    .clear-button {
      position: absolute;
      right: 16px;
      width: 28px;
      height: 28px;
      border: none;
      background: var(--clear-bg);
      color: var(--search-icon);
      cursor: pointer;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .clear-button:hover {
      background: var(--clear-hover);
      transform: scale(1.1);
    }

    .clear-button svg {
      width: 14px;
      height: 14px;
    }

    .search-results {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      right: 0;
      background: var(--results-bg);
      border: 1px solid var(--results-border);
      border-radius: 16px;
      max-height: 400px;
      overflow-y: auto;
      z-index: 1000;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      backdrop-filter: blur(20px);
    }

    .search-result-item {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid var(--results-divider);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .search-result-item:hover {
      background: var(--results-hover);
      transform: translateX(4px);
    }

    .search-result-item:last-child {
      border-bottom: none;
    }

    .result-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .result-emoji {
      font-size: 20px;
    }

    .result-content {
      flex: 1;
      min-width: 0;
    }

    .result-name {
      font-weight: 600;
      color: var(--results-title);
      margin-bottom: 4px;
      font-size: 16px;
    }

    .result-description {
      font-size: 14px;
      color: var(--results-text);
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .result-type {
      font-size: 12px;
      color: var(--results-category);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Light theme */
    :host-context([data-theme="light"]) {
      --search-bg: rgba(255, 255, 255, 0.95);
      --search-border: #e2e8f0;
      --search-border-focus: #3b82f6;
      --search-text: #1e293b;
      --search-icon: #64748b;
      --search-shadow: rgba(59, 130, 246, 0.15);
      --clear-bg: #f1f5f9;
      --clear-hover: #e2e8f0;
      --results-bg: rgba(255, 255, 255, 0.98);
      --results-border: #e2e8f0;
      --results-divider: #f1f5f9;
      --results-hover: #f8fafc;
      --results-title: #1e293b;
      --results-text: #475569;
      --results-category: #64748b;
    }

    /* Dark theme */
    :host-context([data-theme="dark"]) {
      --search-bg: rgba(30, 41, 59, 0.95);
      --search-border: #334155;
      --search-border-focus: #3b82f6;
      --search-text: #f1f5f9;
      --search-icon: #94a3b8;
      --search-shadow: rgba(59, 130, 246, 0.25);
      --clear-bg: #475569;
      --clear-hover: #64748b;
      --results-bg: rgba(30, 41, 59, 0.98);
      --results-border: #334155;
      --results-divider: #475569;
      --results-hover: #475569;
      --results-title: #f1f5f9;
      --results-text: #cbd5e1;
      --results-category: #94a3b8;
    }
  `],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @Output() searchResult = new EventEmitter<SearchResult>();

  searchQuery = '';
  searchResults: SearchResult[] = [];
  showResults = false;
  selectedIndex = -1;

  private destroy$ = new Subject<void>();
  private searchInput$ = new Subject<string>();

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.searchInput$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query.trim()) {
          return of([]);
        }
        return this.apiService.search(query);
      }),
      takeUntil(this.destroy$)
    ).subscribe(results => {
      this.searchResults = results;
      this.showResults = results.length > 0;
      this.selectedIndex = -1;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput(event: any) {
    const query = event.target.value;
    this.searchQuery = query;
    this.searchInput$.next(query);
  }

  onBlur() {
    setTimeout(() => {
      this.showResults = false;
    }, 150);
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];
    this.showResults = false;
    this.selectedIndex = -1;
  }

  selectResult(result: SearchResult) {
    this.searchQuery = result.name;
    this.showResults = false;
    this.searchResult.emit(result);
  }

  highlight(text: string): string {
    if (!this.searchQuery) return text;
    const regex = new RegExp(`(${this.searchQuery})`, 'gi');
    return text.replace(regex, `<mark>$1</mark>`);
  }

  getResultColor(result: SearchResult): string {
    return result.color || result.categoryColor || '#3b82f6';
  }

  getResultIcon(result: SearchResult): string {
    if (result.type === 'category') {
      const iconMap: { [key: string]: string } = {
        'text-generation': '✍️',
        'image-generation': '🎨',
        'code-generation': '💻',
        'audio-processing': '🎵',
        'video-generation': '🎬',
        'data-analysis': '📊',
        'design-tools': '🎯',
        'productivity': '⚡'
      };
      return iconMap[result.id] || '🔧';
    }
    return '🛠️';
  }

  isFirstOfType(index: number, type: string): boolean {
    return index === this.searchResults.findIndex(r => r.type === type);
  }

  // Keyboard navigation
  @HostListener('document:keydown.arrowDown', ['$event'])
  handleArrowDown(event: KeyboardEvent) {
    if (!this.showResults || this.searchResults.length === 0) return;
    event.preventDefault();
    this.selectedIndex = (this.selectedIndex + 1) % this.searchResults.length;
  }

  @HostListener('document:keydown.arrowUp', ['$event'])
  handleArrowUp(event: KeyboardEvent) {
    if (!this.showResults || this.searchResults.length === 0) return;
    event.preventDefault();
    this.selectedIndex = (this.selectedIndex - 1 + this.searchResults.length) % this.searchResults.length;
  }

  @HostListener('document:keydown.enter', ['$event'])
  handleEnter(event: KeyboardEvent) {
    if (this.selectedIndex >= 0 && this.showResults) {
      event.preventDefault();
      this.selectResult(this.searchResults[this.selectedIndex]);
    }
  }
}