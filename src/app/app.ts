import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { CardNavbarComponent } from './components/card-navbar/card-navbar';
import { GlassNavbarComponent } from './components/glass-navbar/glass-navbar';
import { FooterComponent } from './components/footer/footer';
import { ContactModalComponent } from './pages/contact/contact-modal/contact-modal';
import { LiveModelsModalComponent } from './components/live-models-modal/live-models-modal';
import { CookieConsentComponent } from './components/cookie-consent/cookie-consent';
import { ChatWidgetComponent } from './components/chat-widget/chat-widget';
import { ConsultationService } from './core/consultation.service';
import { SmoothScrollService } from './core/smooth-scroll.service';

type NavStyle = 'card' | 'glass';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    CardNavbarComponent,
    GlassNavbarComponent,
    FooterComponent,
    ContactModalComponent,
    LiveModelsModalComponent,
    CookieConsentComponent,
    ChatWidgetComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent implements OnInit {
  navStyle = signal<NavStyle>('glass');
  hideFooter = signal(true);
  currentUrl = signal('/');

  constructor(
    private router: Router,
    public consultation: ConsultationService,
    private smoothScroll: SmoothScrollService,
  ) {}

  ngOnInit(): void {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Wheel-damped page scrolling (no-op on touch / reduced-motion).
    this.smoothScroll.init();

    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      // Smoothly scroll to the top on every route change, matching the
      // original React app (window.scrollTo({ top: 0, behavior: 'smooth' })).
      // This makes switching between pages (e.g. IFC Viewer → Point Cloud
      // Viewer) feel smooth, and it also guarantees soft navigations start
      // from the top so ScrollTrigger entrance animations fire correctly.
      // Skip when navigating to a URL fragment (e.g. /page#section) so the
      // anchor scroll is not overridden.
      if (!this.router.url.includes('#')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      this.currentUrl.set(this.router.url);
      let route = this.router.routerState.snapshot.root;
      while (route.firstChild) route = route.firstChild;
      this.hideFooter.set(!!route.data['hideFooter']);
    });

    this.injectClarityIfConsented();
  }

  switchNavStyle(style: NavStyle): void {
    this.navStyle.set(style);
  }

  openConsultation(): void {
    this.consultation.open();
  }

  private injectClarityIfConsented(): void {
    try {
      const raw = localStorage.getItem('cookieConsent');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed.marketing) {
        const script = document.createElement('script');
        script.textContent = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","x168d9omjl");`;
        document.head.appendChild(script);
      }
    } catch {
      /* ignore */
    }
  }
}
