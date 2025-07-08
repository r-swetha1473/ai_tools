import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode$ = new BehaviorSubject<boolean>(false);

  constructor() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    this.isDarkMode$.next(savedTheme === 'dark' || (!savedTheme && prefersDark));
    this.applyTheme();
  }

  isDarkMode() {
    return this.isDarkMode$.asObservable();
  }

  toggleTheme() {
    const newTheme = !this.isDarkMode$.value;
    this.isDarkMode$.next(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme() {
    const isDark = this.isDarkMode$.value;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }
}