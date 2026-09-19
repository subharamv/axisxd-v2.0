import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideRouter,
  withInMemoryScrolling,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      // Prefetch every lazy route (viewer/analysis pages, etc.) in the
      // background after the initial load, so switching between products in
      // the navbar (e.g. IFC Viewer → Point Cloud Viewer) is instant instead
      // of waiting on a network fetch for each chunk.
      withPreloading(PreloadAllModules),
      // Keep anchor (fragment) scrolling. Scroll-to-top on navigation is done
      // smoothly on NavigationEnd in app.ts (matching the original React app),
      // so the instant scrollPositionRestoration is not needed and would
      // otherwise cause an abrupt jump when switching pages.
     withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
    ),
    provideAnimations(),
  ],
};




