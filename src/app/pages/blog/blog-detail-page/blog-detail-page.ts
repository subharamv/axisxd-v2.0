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
} from 'lucide-angular';

import { BLOG_DATA, BLOG_LIST, TRENDING, BlogEntry } from '../../../data/blog-posts';
import { SOCIAL_LINKS } from '../../../data/shared-data';
import { SeoService } from '../../../core/seo.service';

@Component({
  selector: 'app-blog-detail-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './blog-detail-page.html',
  styleUrl: './blog-detail-page.scss',
})
export class BlogDetailPageComponent implements OnInit, OnDestroy {
  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly ChevronLeft = ChevronLeft;
  readonly ArrowLeft = ArrowLeft;
  readonly ArrowRight = ArrowRight;

  readonly BLOG_DATA = BLOG_DATA;
  readonly TRENDING = TRENDING;
  readonly SOCIAL_LINKS = SOCIAL_LINKS;

  /**
   * Optional fixed blog id, set by the standalone detail-page wrapper
   * components (see pages/blog/details/*) that mirror the React app's
   * thin wrapper pages, each of which pins a single blogId. When set,
   * the route param is ignored.
   */
  @Input() fixedId?: string;

  blogId = '';
  data: BlogEntry | undefined;
  prevBlog: string | null = null;
  nextBlog: string | null = null;
  sectionIds: string[] = [];
  activeSection = '';

  private paramSub: Subscription | null = null;
  private readonly onScroll = () => this.handleScroll();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly seo: SeoService,
  ) {}

  ngOnInit(): void {
    if (this.fixedId) {
      this.blogId = this.fixedId;
      this.loadBlog();
    } else {
      this.paramSub = this.route.paramMap.subscribe((params) => {
        this.blogId = params.get('id') || '';
        this.loadBlog();
      });
    }
    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  ngOnDestroy(): void {
    this.paramSub?.unsubscribe();
    window.removeEventListener('scroll', this.onScroll);
  }

  private loadBlog(): void {
    this.data = BLOG_DATA[this.blogId];

    const idx = BLOG_LIST.indexOf(this.blogId);
    this.prevBlog = idx > 0 ? BLOG_LIST[idx - 1] : null;
    this.nextBlog = idx >= 0 && idx < BLOG_LIST.length - 1 ? BLOG_LIST[idx + 1] : null;

    this.sectionIds = this.data ? this.data.sections.map((s) => s.id) : [];
    this.activeSection = this.sectionIds[0] || '';
    this.handleScroll();

    this.seo.set({
      title: this.blogId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      description: 'Read the latest from the AxisXD blog.',
      canonicalPath: `/blog/${encodeURIComponent(this.blogId)}`,
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

  asStringArray(value: string | string[]): string[] {
    return value as string[];
  }

  back(): void {
    this.router.navigate(['/resources']);
  }

  navigateBlog(id: string): void {
    this.router.navigate(['/blog', id]);
  }
}
