import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ArrowUpRight } from 'lucide-angular';
import gsap from 'gsap';
import { AnimatedThemeTogglerComponent } from '../animated-theme-toggler/animated-theme-toggler';

export type CardNavLink = {
  label: string;
  description?: string;
  image?: string;
  ctaLabel?: string;
  href: string;
  ariaLabel: string;
  onClick?: () => void;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
  megaMenu?: boolean;
  /** 'connect' renders the Book a Demo + Contact Sales footer; 'follow-us' renders the social/webinars strip. */
  footerKind?: 'connect' | 'follow-us';
  footerStrip?: boolean;
  cardClassName?: string;
};

@Component({
  selector: 'app-card-nav',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, AnimatedThemeTogglerComponent],
  templateUrl: './card-nav.html',
  styleUrl: './card-nav.scss',
})
export class CardNavComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() logoAlt = 'Logo';
  @Input() items: CardNavItem[] = [];
  @Input() ease = 'power3.out';
  @Input() ctaText = 'Get Started';

  @Input() logoSrcDark = 'assets/images/logos/xd_white_logo.png';
  @Input() logoSrcLight = 'assets/images/logos/xd_blue_logo.png';

  @Output() ctaClick = new EventEmitter<void>();
  @Output() logoClick = new EventEmitter<void>();
  @Output() openConsultation = new EventEmitter<void>();
  @Output() navigateContact = new EventEmitter<void>();
  @Output() navigateWebinars = new EventEmitter<void>();
  @Output() navigateFaq = new EventEmitter<void>();

  @ViewChild('navEl') navElRef!: ElementRef<HTMLElement>;
  @ViewChildren('cardEl') cardEls!: QueryList<ElementRef<HTMLElement>>;

  isHamburgerOpen = false;
  isExpanded = false;
  isDark = typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : true;
  hoveredMegaIdx = 0;
  hoveredBentoLink: { link: CardNavLink; visualIdx: number } | null = null;

  readonly MEGA_VISUAL_KEYS = ['ifc', 'point-cloud', 'pano', 'cad', 'mesh'] as const;
  readonly ANALYSIS_VISUAL_KEYS = ['deviation', 'rol', 'monitoring', 'clash'] as const;

  private tl: gsap.core.Timeline | null = null;
  private themeObserver: MutationObserver | null = null;
  private resizeHandler = () => this.handleResize();

  get megaItem(): CardNavItem | undefined {
    return this.items.find((i) => i.megaMenu);
  }

  get footerStripItem(): CardNavItem | undefined {
    return this.items.find((i) => i.footerStrip);
  }

  get regularItems(): CardNavItem[] {
    return this.items.filter((i) => !i.megaMenu);
  }

  get featuredLink(): CardNavLink | undefined {
    if (this.hoveredBentoLink) return this.hoveredBentoLink.link;
    const mega = this.megaItem;
    return mega?.links?.[this.hoveredMegaIdx] ?? mega?.links?.[0];
  }

  get featuredVisualKey(): string {
    if (this.hoveredBentoLink) return this.ANALYSIS_VISUAL_KEYS[this.hoveredBentoLink.visualIdx] ?? this.ANALYSIS_VISUAL_KEYS[0];
    return this.MEGA_VISUAL_KEYS[this.hoveredMegaIdx] ?? this.MEGA_VISUAL_KEYS[0];
  }

  onAnalysisLinkHover(link: CardNavLink, idx: number): void {
    this.hoveredBentoLink = { link, visualIdx: idx };
  }

  onAnalysisLinkLeave(): void {
    this.hoveredBentoLink = null;
  }

  get currentBaseColor(): string {
    return this.isDark ? 'rgba(20, 20, 25, 0.85)' : 'rgba(255, 255, 255, 0.85)';
  }
  get currentMenuColor(): string {
    return this.isDark ? '#ffffff' : '#09090b';
  }
  get currentButtonBgColor(): string {
    return this.isDark ? '#ffffff' : '#0645fb';
  }
  get currentButtonTextColor(): string {
    return this.isDark ? '#000000' : '#ffffff';
  }

  ngAfterViewInit(): void {
    this.checkTheme();
    this.themeObserver = new MutationObserver(() => this.checkTheme());
    this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    this.rebuildTimeline();
    window.addEventListener('resize', this.resizeHandler);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && !changes['items'].firstChange) {
      this.isExpanded = false;
      this.isHamburgerOpen = false;
      this.rebuildTimeline();
    }
  }

  ngOnDestroy(): void {
    this.tl?.kill();
    this.themeObserver?.disconnect();
    window.removeEventListener('resize', this.resizeHandler);
  }

  private checkTheme(): void {
    this.isDark = document.documentElement.classList.contains('dark');
  }

  private calculateHeight(): number {
    const navEl = this.navElRef?.nativeElement;
    if (!navEl) return 420;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const contentEl = navEl.querySelector('.card-nav-content') as HTMLElement | null;
      if (contentEl) {
        const wasVisibility = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = 'visible';
        contentEl.style.pointerEvents = 'auto';
        contentEl.style.position = 'static';
        contentEl.style.height = 'auto';

        // force reflow
        void contentEl.offsetHeight;

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisibility;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        const natural = topBar + contentHeight + padding;
        const maxH = window.innerHeight - 15;
        return Math.min(natural, maxH);
      }
    }
    return this.items.some((i) => i.megaMenu) ? 430 : 150;
  }

  private rebuildTimeline(): void {
    this.tl?.kill();
    const navEl = this.navElRef?.nativeElement;
    if (!navEl) return;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    const cards = this.cardEls?.map((c) => c.nativeElement) ?? [];
    gsap.set(cards, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });
    tl.to(navEl, { height: () => this.calculateHeight(), duration: 0.4, ease: this.ease });
    tl.to(cards, { y: 0, opacity: 1, duration: 0.4, ease: this.ease, stagger: 0.08 }, '-=0.1');
    this.tl = tl;
  }

  private handleResize(): void {
    if (!this.tl) return;
    if (this.isExpanded) {
      const newHeight = this.calculateHeight();
      gsap.set(this.navElRef.nativeElement, { height: newHeight });
      this.rebuildTimeline();
      this.tl?.progress(1);
    } else {
      this.rebuildTimeline();
    }
  }

  toggleMenu(): void {
    if (!this.tl) return;
    if (!this.isExpanded) {
      this.isHamburgerOpen = true;
      this.isExpanded = true;
      this.tl.play(0);
    } else {
      this.isHamburgerOpen = false;
      this.isExpanded = false;
      this.tl.reverse();
    }
  }

  closeMenu(): void {
    if (!this.isExpanded) return;
    this.isHamburgerOpen = false;
    this.isExpanded = false;
    this.tl?.reverse();
  }

  onMegaLinkHover(idx: number): void {
    this.hoveredMegaIdx = idx;
  }

  onMegaLinkClick(event: Event, link: CardNavLink): void {
    if (link.onClick) {
      event.preventDefault();
      link.onClick();
    } else if (link.href.startsWith('#')) {
      event.preventDefault();
      document.getElementById(link.href.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this.closeMenu();
  }

  onCardLinkClick(event: Event, link: CardNavLink): void {
    if (link.onClick) {
      event.preventDefault();
      link.onClick();
    } else if (link.href.startsWith('#')) {
      event.preventDefault();
      document.getElementById(link.href.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this.closeMenu();
  }

  onFeaturedCtaClick(): void {
    this.featuredLink?.onClick?.();
    this.closeMenu();
  }

  onFaqClick(event: Event): void {
    event.preventDefault();
    this.closeMenu();
    this.navigateFaq.emit();
  }

  cardClassFor(item: CardNavItem): string {
    const slug = item.label.toLowerCase().replace(/\s+/g, '-');
    return `nav-card ${item.cardClassName || ''} nav-card--${slug}`;
  }

  readonly ArrowUpRight = ArrowUpRight;
}
