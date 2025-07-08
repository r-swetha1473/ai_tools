import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button 
      class="theme-toggle"
      (click)="toggleTheme()"
      [attr.aria-label]="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
      title="{{ isDarkMode ? 'Switch to light mode' : 'Switch to dark mode' }}"
    >
      <svg 
        *ngIf="!isDarkMode" 
        class="theme-icon" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
      <svg 
        *ngIf="isDarkMode" 
        class="theme-icon" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    </button>
  `,
  styles: [`
    .theme-toggle {
      width: 44px;
      height: 44px;
      border: none;
      border-radius: 12px;
      background: var(--toggle-bg);
      color: var(--toggle-color);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .theme-toggle:hover {
      background: var(--toggle-hover);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .theme-toggle:active {
      transform: translateY(0);
    }

    .theme-icon {
      width: 20px;
      height: 20px;
      transition: transform 0.3s ease;
    }

    .theme-toggle:hover .theme-icon {
      transform: scale(1.1);
    }

    /* Light theme */
    :host-context([data-theme="light"]) {
      --toggle-bg: rgba(255, 255, 255, 0.9);
      --toggle-color: #475569;
      --toggle-hover: #f8fafc;
    }

    /* Dark theme */
    :host-context([data-theme="dark"]) {
      --toggle-bg: rgba(51, 65, 85, 0.9);
      --toggle-color: #f1f5f9;
      --toggle-hover: #64748b;
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class ThemeToggleComponent implements OnInit {
  isDarkMode = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.isDarkMode().subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}