import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  LucideAngularModule,
  BookOpen,
  FileText,
  Mail,
  BookMarked,
  Sparkles,
  Search,
  ArrowUpRight,
  Filter,
  Award,
} from 'lucide-angular';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { SeoService } from '../../../core/seo.service';
import type { Tab, Resource } from '../../../data/resources';
import { RESOURCES, TABS, ALL_CATEGORIES } from '../../../data/resources';
import { ResourceCardComponent } from '../resource-card/resource-card';
import { CarouselSectionComponent } from '../carousel-section/carousel-section';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-resources-section',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ResourceCardComponent, CarouselSectionComponent],
  templateUrl: './resources-section.html',
  styleUrl: './resources-section.scss',
})
export class ResourcesSectionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('resourcesSectionEl') resourcesSectionElRef!: ElementRef<HTMLDivElement>;
  @ViewChild('blogsEl') blogsElRef?: ElementRef<HTMLDivElement>;
  @ViewChild('caseStudiesEl') caseStudiesElRef?: ElementRef<HTMLDivElement>;
  @ViewChild('whitepapersEl') whitepapersElRef?: ElementRef<HTMLDivElement>;
  @ViewChild('newsletterEl') newsletterElRef?: ElementRef<HTMLDivElement>;
  @ViewChild('ebooksEl') ebooksElRef?: ElementRef<HTMLDivElement>;

  readonly BookOpen = BookOpen;
  readonly FileText = FileText;
  readonly Mail = Mail;
  readonly BookMarked = BookMarked;
  readonly Sparkles = Sparkles;
  readonly Search = Search;
  readonly ArrowUpRight = ArrowUpRight;
  readonly Filter = Filter;
  readonly Award = Award;

  readonly TABS = TABS;
  readonly ALL_CATEGORIES = ALL_CATEGORIES;
  readonly RESOURCES = RESOURCES;

  activeTab: Tab = 'all';
  visualTabId: Tab = 'all';
  searchQuery = '';
  filterOpen = false;
  activeCategories: string[] = [];

  /** Bumped on every tab change so the carousel wrappers replay their entrance animation. */
  animKey = 0;
  animKeyArr: number[] = [0];

  private animInterval?: ReturnType<typeof setInterval>;
  private gsapCtx?: gsap.Context;

  constructor(
    private router: Router,
    private seo: SeoService,
  ) {}

  ngOnInit(): void {
    this.seo.set({
      title: 'Resources',
      description: 'Explore AxisXD resources: blog posts, whitepapers, case studies, and webinars on digital twin technology.',
      canonicalPath: '/resources',
    });
  }

  ngAfterViewInit(): void {
    this.gsapCtx = gsap.context(() => {
      gsap.from('.resources-filter-bar', {
        scrollTrigger: { trigger: '.resources-filter-bar', start: 'top 92%', once: true },
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: 'power3.out',
      });
    }, this.resourcesSectionElRef.nativeElement);

    ScrollTrigger.refresh();
  }

  ngOnDestroy(): void {
    this.gsapCtx?.revert();
    ScrollTrigger.getAll().forEach((t) => t.kill());
    if (this.animInterval) clearInterval(this.animInterval);
  }

  /* ── Data derived from the full resource list (not filtered) ── */
  get blogs(): Resource[] {
    return this.RESOURCES.filter((r) => r.type === 'blogs');
  }
  get caseStudies(): Resource[] {
    return this.RESOURCES.filter((r) => r.type === 'case-studies');
  }
  get whitepapers(): Resource[] {
    return this.RESOURCES.filter((r) => r.type === 'whitepapers');
  }
  get newsletters(): Resource[] {
    return this.RESOURCES.filter((r) => r.type === 'newsletter');
  }
  get ebooks(): Resource[] {
    return this.RESOURCES.filter((r) => r.type === 'ebooks');
  }

  /* ── Filtering ── */
  get filtered(): Resource[] {
    const q = this.searchQuery.toLowerCase();
    return this.RESOURCES.filter((r) => {
      const matchesTab = this.activeTab === 'all' || r.type === this.activeTab;
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.excerpt.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q);
      const matchesCategory = this.activeCategories.length === 0 || this.activeCategories.includes(r.category);
      return matchesTab && matchesSearch && matchesCategory;
    });
  }

  get featured(): Resource | undefined {
    const filtered = this.filtered;
    return filtered.find((r) => r.featured) || filtered[0];
  }

  get recent(): Resource[] {
    return this.filtered.slice(0, 6);
  }

  get recentExclFeatured(): Resource[] {
    const featuredId = this.featured?.id;
    return this.recent.filter((r) => r.id !== featuredId);
  }

  filteredByType(type: Exclude<Tab, 'all'>): Resource[] {
    return this.filtered.filter((r) => r.type === type);
  }

  sectionResources(type: Exclude<Tab, 'all'>, all: Resource[]): Resource[] {
    return this.activeTab === 'all' ? all : this.filteredByType(type);
  }

  showSection(type: Exclude<Tab, 'all'>): boolean {
    return this.activeTab === 'all' || this.activeTab === type;
  }

  /* ── Navigation (routes) ── */
  goToBlog(id: string): void {
    this.router.navigate(['/blog', id]);
  }
  goToWhitepaper(id: string): void {
    this.router.navigate(['/whitepaper', id]);
  }
  goToCaseStudy(id: string): void {
    this.router.navigate(['/case-study', id]);
  }

  /* ── Tabs / scroll / search / filters ── */
  private sectionScroll(tab: Tab): void {
    const map: Record<Tab, HTMLElement | null> = {
      all: null,
      blogs: this.blogsElRef?.nativeElement ?? null,
      'case-studies': this.caseStudiesElRef?.nativeElement ?? null,
      whitepapers: this.whitepapersElRef?.nativeElement ?? null,
      newsletter: this.newsletterElRef?.nativeElement ?? null,
      ebooks: this.ebooksElRef?.nativeElement ?? null,
    };

    if (tab === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const el = map[tab];
    if (!el) return;

    const y = window.scrollY + el.getBoundingClientRect().top - 120;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  handleTabChange(tab: Tab): void {
    const currentIdx = this.TABS.findIndex((t) => t.id === this.visualTabId);
    const targetIdx = this.TABS.findIndex((t) => t.id === tab);
    this.activeTab = tab;
    this.animKey++;
    this.animKeyArr = [this.animKey];
    if (currentIdx === targetIdx) return;

    if (this.animInterval) clearInterval(this.animInterval);

    const step = currentIdx < targetIdx ? 1 : -1;
    let i = currentIdx + step;
    this.animInterval = setInterval(() => {
      this.visualTabId = this.TABS[i].id;
      i += step;
      if (Math.abs(i - (targetIdx + step)) < 0.01) {
        clearInterval(this.animInterval);
        this.animInterval = undefined;
      }
    }, 90);

    setTimeout(() => this.sectionScroll(tab), 200 + Math.abs(targetIdx - currentIdx) * 90);
  }

  toggleCategory(cat: string): void {
    this.activeCategories = this.activeCategories.includes(cat)
      ? this.activeCategories.filter((c) => c !== cat)
      : [...this.activeCategories, cat];
  }

  clearCategories(): void {
    this.activeCategories = [];
  }

  toggleFilterOpen(): void {
    this.filterOpen = !this.filterOpen;
  }

  clearSearch(): void {
    this.searchQuery = '';
  }

  setActiveTabAll(): void {
    this.activeTab = 'all';
  }

  filterByCategoryQuickLink(cat: string): void {
    this.activeCategories = [cat];
    this.activeTab = 'all';
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
