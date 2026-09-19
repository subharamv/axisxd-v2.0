import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  LucideAngularModule,
  Calendar,
  Clock,
  ChevronLeft,
  ArrowLeft,
  ArrowRight,
  Download,
  FileText,
} from 'lucide-angular';

import { WHITEPAPER_DATA, WP_LIST, RELATED_WHITEPAPERS, WhitepaperEntry } from '../../../data/whitepapers';
import { SOCIAL_LINKS } from '../../../data/shared-data';
import { SeoService } from '../../../core/seo.service';
import { DownloadPopupComponent } from '../download-popup/download-popup';

@Component({
  selector: 'app-whitepaper-detail-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, DownloadPopupComponent],
  templateUrl: './whitepaper-detail-page.html',
  styleUrl: './whitepaper-detail-page.scss',
})
export class WhitepaperDetailPageComponent implements OnInit, OnDestroy {
  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly ChevronLeft = ChevronLeft;
  readonly ArrowLeft = ArrowLeft;
  readonly ArrowRight = ArrowRight;
  readonly Download = Download;
  readonly FileText = FileText;

  readonly WHITEPAPER_DATA = WHITEPAPER_DATA;
  readonly RELATED_WHITEPAPERS = RELATED_WHITEPAPERS;
  readonly SOCIAL_LINKS = SOCIAL_LINKS;

  /** Optional fixed id, used by the static per-slug wrapper pages instead of the route param. */
  @Input() fixedId: string | null = null;

  whitepaperId = '';
  data: WhitepaperEntry | undefined;
  prevWp: string | null = null;
  nextWp: string | null = null;
  sectionIds: string[] = [];
  activeSection = '';
  showPopup = false;

  private paramSub: Subscription | null = null;
  private readonly onScroll = () => this.handleScroll();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly seo: SeoService,
  ) {}

  ngOnInit(): void {
    if (this.fixedId) {
      this.whitepaperId = this.fixedId;
      this.loadWhitepaper();
    } else {
      this.paramSub = this.route.paramMap.subscribe((params) => {
        this.whitepaperId = params.get('id') || '';
        this.loadWhitepaper();
      });
    }
    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  ngOnDestroy(): void {
    this.paramSub?.unsubscribe();
    window.removeEventListener('scroll', this.onScroll);
  }

  private loadWhitepaper(): void {
    this.data = WHITEPAPER_DATA[this.whitepaperId];

    const idx = WP_LIST.indexOf(this.whitepaperId);
    this.prevWp = idx > 0 ? WP_LIST[idx - 1] : null;
    this.nextWp = idx >= 0 && idx < WP_LIST.length - 1 ? WP_LIST[idx + 1] : null;

    this.sectionIds = this.data ? this.data.sections.map((s) => s.id) : [];
    this.activeSection = this.sectionIds[0] || '';
    this.showPopup = false;
    this.handleScroll();

    this.seo.set({
      title: this.whitepaperId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      description: 'Download AxisXD whitepapers on digital twin technology.',
      canonicalPath: `/whitepaper/${encodeURIComponent(this.whitepaperId)}`,
    });
  }

  private handleScroll(): void {
    if (!this.sectionIds.length) return;
    const scrollY = window.scrollY + 130;
    let current = this.sectionIds[0];
    for (const id of this.sectionIds) {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) {
        current = id;
      }
    }
    this.activeSection = current;
  }

  scrollToSection(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  isArray(value: unknown): value is string[] {
    return Array.isArray(value);
  }

  relatedList(): typeof RELATED_WHITEPAPERS {
    return RELATED_WHITEPAPERS.filter((t) => t.id !== this.whitepaperId).slice(0, 3);
  }

  back(): void {
    this.router.navigate(['/resources']);
  }

  navigateWhitepaper(id: string): void {
    this.router.navigate(['/whitepaper', id]);
  }

  openPopup(): void {
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
  }
}
