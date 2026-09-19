import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

// Synchronously initialize the correct theme class on the root html node before rendering
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  document.documentElement.classList.remove('dark');
} else {
  document.documentElement.classList.add('dark');
  localStorage.setItem('theme', 'dark');
}

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
