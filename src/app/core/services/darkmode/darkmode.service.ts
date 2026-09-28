import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DarkmodeService {
  private dark = signal<boolean>(false);
  isDark = this.dark.asReadonly();
  constructor() {
    const saved = localStorage.getItem('dark-mode') === 'true';
    this.dark.set(saved);
    this.applyTheme(saved);
  }
  toggleTheme() {
    const newVal = !this.dark();
    this.dark.set(newVal);
    localStorage.setItem('dark-mode', String(newVal));
    this.applyTheme(newVal);
  }
  private applyTheme(dark: boolean) {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}
