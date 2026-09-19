import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Settings, X } from 'lucide-angular';
import gsap from 'gsap';

const STORAGE_KEY = 'cookieConsent';

interface Prefs {
  necessary: boolean;
  marketing: boolean;
}

function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        return { necessary: !!parsed.necessary, marketing: !!parsed.marketing };
      }
    }
  } catch {
    /* ignore */
  }
  return { necessary: true, marketing: false };
}

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './cookie-consent.html',
  styleUrl: './cookie-consent.scss',
})
export class CookieConsentComponent implements OnInit {
  @ViewChild('wrapper') wrapperRef!: ElementRef<HTMLDivElement>;
  @ViewChild('customizePanel') customizePanelRef!: ElementRef<HTMLDivElement>;

  showCustomize = false;
  prefs: Prefs = loadPrefs();
  dismissed = false;

  readonly Settings = Settings;
  readonly X = X;

  ngOnInit(): void {
    this.dismissed = localStorage.getItem(STORAGE_KEY) !== null;
    if (this.dismissed) return;

    setTimeout(() => {
      if (!this.wrapperRef?.nativeElement) return;
      gsap.fromTo(
        this.wrapperRef.nativeElement,
        { x: 80, opacity: 0, scale: 0.95 },
        { x: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', delay: 0.8 },
      );
    });
  }

  openCustomize(): void {
    this.showCustomize = true;
    setTimeout(() => {
      if (!this.customizePanelRef?.nativeElement) return;
      gsap.fromTo(
        this.customizePanelRef.nativeElement,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.35, ease: 'power2.out' },
      );
    });
  }

  toggleMarketing(): void {
    this.prefs = { ...this.prefs, marketing: !this.prefs.marketing };
  }

  close(accepted: boolean): void {
    const p: Prefs = accepted
      ? { necessary: true, marketing: this.showCustomize ? this.prefs.marketing : true }
      : { necessary: true, marketing: false };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    this.prefs = p;

    const el = this.wrapperRef?.nativeElement;
    if (!el) {
      this.dismissed = true;
      return;
    }
    gsap.to(el, {
      x: 80,
      opacity: 0,
      scale: 0.95,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        this.dismissed = true;
      },
    });
  }
}
