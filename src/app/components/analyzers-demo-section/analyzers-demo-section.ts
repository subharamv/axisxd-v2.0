import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  LucideAngularModule,
  ArrowUpRight,
  CheckCircle2,
  Zap,
  TrendingUp,
  Shield,
  Clock,
} from 'lucide-angular';

gsap.registerPlugin(ScrollTrigger);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Stat {
  label: string;
  value: string;
  suffix?: string;
  icon: any;
  color: string;
}

interface Tab {
  id: string;
  label: string;
  image: string;
  href: string;
  cta: string;
  badge: string;
  description: string;
  features: string[];
  stats: Stat[];
}

const TABS: Tab[] = [
  {
    id: 'rol',
    label: 'Rights of Light',
    image: 'assets/images/analysis/rights_of_light.png',
    href: './src/rights_of_light.html',
    cta: 'Launch Rights of Light',
    badge: 'Most Popular',
    description:
      'Simulate sun paths, measure VSC and ADF, and generate BRE-compliant daylight reports so you can submit planning applications with confidence and defend against rights of light challenges.',
    features: [
      'Sun path simulation',
      'Shadow impact analysis',
      'Daylight availability assessment',
      'Solar exposure evaluation',
      'Visual impact analysis',
      'Time-based shadowing',
      'Urban context evaluation',
      'Compliance-ready outputs',
    ],
    stats: [
      { label: 'Accuracy Rate', value: '99', suffix: '%', icon: Shield, color: '#0645fb' },
      { label: 'Reports Generated', value: '12K', icon: TrendingUp, color: '#10b981' },
      { label: 'Avg. Analysis Time', value: '4', suffix: 'min', icon: Clock, color: '#f59e0b' },
      { label: 'Projects Compliant', value: '98', suffix: '%', icon: Zap, color: '#8b5cf6' },
    ],
  },
  {
    id: 'deviation',
    label: 'Deviation Analyzer',
    image: 'assets/images/analysis/deviation_analyzer.png',
    href: './src/deviation.html',
    cta: 'Open Analyzer',
    badge: 'New',
    description:
      'Compare LiDAR scans against BIM models with mm-level precision, generate color-coded deviation heatmaps, and get ISO-12053 compliant reports so you catch tolerance breaches before they become rework.',
    features: [
      'Model vs reality comparison',
      'Scan to BIM workflows',
      'Geometric deviation analysis',
      'Tolerance-based checking',
      'As-built validation',
      'Spatial accuracy assessment',
      'Change detection visualization',
      'Deviation heatmaps',
    ],
    stats: [
      { label: 'Precision', value: '±0.1', suffix: 'mm', icon: Shield, color: '#0645fb' },
      { label: 'Scans Processed', value: '8.4K', icon: TrendingUp, color: '#10b981' },
      { label: 'Error Reduction', value: '73', suffix: '%', icon: Zap, color: '#f59e0b' },
      { label: 'Time Saved', value: '60', suffix: '%', icon: Clock, color: '#8b5cf6' },
    ],
  },
  {
    id: 'clash',
    label: 'Clash Detection',
    image: 'assets/images/analysis/clash_detection.png',
    href: '#',
    cta: 'Open Clash Tool',
    badge: 'Beta',
    description:
      'Find hard and soft clashes across federated BIM models, prioritise by severity, and export BCF issues to authoring tools so teams resolve conflicts digitally before they become change orders.',
    features: [
      'Model coordination checks',
      'Spatial conflict detection',
      'Geometry interference analysis',
      'Multi-model clash review',
      'Design conflict identification',
      'Cross-discipline coordination',
      'Visual clash highlighting',
      'Issue location tagging',
    ],
    stats: [
      { label: 'Clash Detection', value: '97', suffix: '%', icon: Shield, color: '#0645fb' },
      { label: 'Issues Resolved', value: '34K', icon: TrendingUp, color: '#10b981' },
      { label: 'Rework Saved', value: '$2.1M', icon: Zap, color: '#f59e0b' },
      { label: 'Avg. Resolution', value: '2', suffix: 'hrs', icon: Clock, color: '#8b5cf6' },
    ],
  },
  {
    id: 'monitoring',
    label: 'Construction Monitoring',
    image: 'assets/images/analysis/construction_monitoring.png',
    href: '#',
    cta: 'Open Monitoring',
    badge: 'Live',
    description:
      'Track site progress with time-stamped photo comparisons, AI-powered change alerts, and automated status dashboards so stakeholders see what happened without weekly site walks.',
    features: [
      'Visual progress tracking',
      'Time-based comparison',
      'Reality capture comparison',
      'Status visualization timelines',
      'As-built progress review',
      'Periodic site comparison',
      'Remote progress assessment',
      'Historical state tracking',
    ],
    stats: [
      { label: 'Sites Monitored', value: '640', suffix: '+', icon: Shield, color: '#0645fb' },
      { label: 'Uptime', value: '99.9', suffix: '%', icon: Zap, color: '#10b981' },
      { label: 'Delay Reduction', value: '41', suffix: '%', icon: TrendingUp, color: '#f59e0b' },
      { label: 'Data Points/Day', value: '1.2M', icon: Clock, color: '#8b5cf6' },
    ],
  },
];

const BADGE_COLORS: Record<string, string> = {
  'Most Popular': 'ads-badge--popular',
  New: 'ads-badge--new',
  Beta: 'ads-badge--beta',
  Live: 'ads-badge--live',
};

@Component({
  selector: 'app-analyzers-demo-section',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './analyzers-demo-section.html',
  styleUrl: './analyzers-demo-section.scss',
})
export class AnalyzersDemoSectionComponent implements AfterViewInit, OnDestroy {
  readonly ArrowUpRight = ArrowUpRight;
  readonly CheckCircle2 = CheckCircle2;
  readonly Zap = Zap;

  readonly tabs = TABS;
  readonly kpis = [
    { v: '500+', l: 'Projects' },
    { v: '98%', l: 'Satisfaction' },
    { v: '4.9★', l: 'Rating' },
  ];

  activeTab = 'rol';
  imageLoaded = false;
  tiltX = 0;
  tiltY = 0;

  private hovering = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private ctx?: gsap.Context;
  private tl?: gsap.core.Timeline;
  private lockedHeight = 0;
  private lockedWidth = 0;
  private resizeObserver?: ResizeObserver;

  @ViewChild('sectionEl') sectionEl!: ElementRef<HTMLElement>;
  @ViewChild('tabBarEl') tabBarEl!: ElementRef<HTMLDivElement>;
  @ViewChild('stageEl') stageEl!: ElementRef<HTMLDivElement>;
  @ViewChild('contentEl') contentEl!: ElementRef<HTMLDivElement>;

  constructor(
    private router: Router,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {}

  get activeData(): Tab {
    return this.tabs.find((t) => t.id === this.activeTab) ?? this.tabs[0];
  }

  badgeClass(badge: string): string {
    return BADGE_COLORS[badge] ?? 'ads-badge--default';
  }

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {
      gsap.from('.analyzers-heading', {
        scrollTrigger: { trigger: '.analyzers-heading', start: 'top 82%', once: true },
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power4.out',
      });
      gsap.from('.analyzers-kpi-strip', {
        scrollTrigger: { trigger: '.analyzers-kpi-strip', start: 'top 88%', once: true },
        opacity: 0,
        y: 24,
        duration: 0.7,
        delay: 0.15,
        ease: 'power3.out',
      });
      gsap.from('.analyzers-tab-bar', {
        scrollTrigger: { trigger: '.analyzers-tab-bar', start: 'top 88%', once: true },
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.25,
        ease: 'power3.out',
      });
    }, this.sectionEl.nativeElement);

    this.lockHeight();
    this.zone.runOutsideAngular(() => {
      this.resizeObserver = new ResizeObserver(() => this.lockHeight());
      this.resizeObserver.observe(this.stageEl.nativeElement);
    });

    this.intervalId = setInterval(() => {
      if (this.hovering) return;
      const idx = this.tabs.findIndex((t) => t.id === this.activeTab);
      this.selectTab(this.tabs[(idx + 1) % this.tabs.length].id);
    }, 5000);
  }

  ngOnDestroy(): void {
    this.tl?.kill();
    this.resizeObserver?.disconnect();
    this.ctx?.revert();
    if (this.intervalId) clearInterval(this.intervalId);
  }

  /**
   * Slides the current panel out, swaps the data, slides the next one in from
   * the opposite edge. The content element itself is never recreated, so the
   * stage height never collapses and the page below it never shifts.
   */
  selectTab(id: string): void {
    if (id === this.activeTab) return;

    const from = this.tabs.findIndex((t) => t.id === this.activeTab);
    const to = this.tabs.findIndex((t) => t.id === id);
    const dir = to > from ? 1 : -1;
    const content = this.contentEl?.nativeElement;

    if (!content) {
      this.applyTab(id);
      return;
    }

    this.lockHeight();
    this.tl?.kill();

    // Percent-based travel keeps the slide proportional on every breakpoint.
    this.tl = gsap
      .timeline()
      .to(content, {
        xPercent: -6 * dir,
        opacity: 0,
        duration: 0.28,
        ease: 'power2.in',
      })
      .add(() => {
        this.applyTab(id);
        // Flush the new content into the DOM before the incoming tween runs.
        this.cdr.detectChanges();
      })
      .fromTo(
        content,
        { xPercent: 6 * dir, opacity: 0 },
        { xPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out', clearProps: 'opacity' },
      );
  }

  private applyTab(id: string): void {
    this.zone.run(() => {
      this.activeTab = id;
      this.imageLoaded = false;
    });
    queueMicrotask(() => this.scrollActiveTabIntoView());
  }

  /**
   * Holds the stage at the tallest panel seen at this width, so a shorter tab
   * cannot shrink the section mid-rotation. Reset whenever the width changes,
   * since the grid reflows between breakpoints.
   */
  private lockHeight(): void {
    const stage = this.stageEl?.nativeElement;
    const content = this.contentEl?.nativeElement;
    if (!stage || !content) return;

    const width = stage.offsetWidth;
    if (width !== this.lockedWidth) {
      this.lockedWidth = width;
      this.lockedHeight = 0;
    }

    const height = content.offsetHeight;
    if (height > this.lockedHeight) {
      this.lockedHeight = height;
      stage.style.minHeight = `${height}px`;
    }
  }

  private scrollActiveTabIntoView(): void {
    const container = this.tabBarEl?.nativeElement;
    if (!container) return;
    const activeBtn = container.querySelector<HTMLElement>('[data-active="true"]');
    if (!activeBtn) return;
    const scrollLeft = activeBtn.offsetLeft - (container.offsetWidth - activeBtn.offsetWidth) / 2;
    container.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
  }

  onImageLoad(): void {
    this.imageLoaded = true;
  }

  onMouseEnter(): void {
    this.hovering = true;
  }

  onMouseLeave(): void {
    this.hovering = false;
    this.tiltX = 0;
    this.tiltY = 0;
  }

  onMouseMove(event: MouseEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.tiltY = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
    this.tiltX = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
  }

  handleCta(): void {
    if (this.activeData.id === 'monitoring') {
      this.router.navigate(['/analysis/monitoring']);
    } else {
      window.open(this.activeData.href, '_blank', 'noopener,noreferrer');
    }
  }
}
