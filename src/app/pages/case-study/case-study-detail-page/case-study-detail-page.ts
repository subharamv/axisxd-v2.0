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
  MessageSquare,
  MapPin,
  CheckCircle,
} from 'lucide-angular';

import { SeoService } from '../../../core/seo.service';
import { CASE_STUDY_DATA, CASE_STUDY_LIST, TRENDING_CASE_STUDIES, CaseStudyEntry } from '../../../data/case-studies';
import { SOCIAL_LINKS } from '../../../data/shared-data';

@Component({
  selector: 'app-case-study-detail-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './case-study-detail-page.html',
  styleUrl: './case-study-detail-page.scss',
})
export class CaseStudyDetailPageComponent implements OnInit, OnDestroy {
  /** Optional fixed id, used by the static wrapper components under pages/case-study/details.
   * When set, bypasses the :id route param and always renders this case study. */
  @Input() fixedId?: string;

  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly ChevronLeft = ChevronLeft;
  readonly ArrowLeft = ArrowLeft;
  readonly ArrowRight = ArrowRight;
  readonly MessageSquare = MessageSquare;
  readonly MapPin = MapPin;
  readonly CheckCircle = CheckCircle;

  readonly trendingCaseStudies = TRENDING_CASE_STUDIES;
  readonly caseStudyData = CASE_STUDY_DATA;
  readonly socialLinks = SOCIAL_LINKS;

  caseStudyId = '';
  data: CaseStudyEntry | undefined;
  prevStudy: string | null = null;
  nextStudy: string | null = null;
  activeSection = '';

  private routeSub?: Subscription;
  private sectionIds: string[] = [];
  private readonly onScroll = () => this.handleScroll();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seo: SeoService,
  ) {}

  ngOnInit(): void {
    if (this.fixedId) {
      this.setCaseStudy(this.fixedId);
    } else {
      this.routeSub = this.route.paramMap.subscribe((params) => {
        const id = params.get('id') || '';
        this.setCaseStudy(id);
      });
    }
    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    window.removeEventListener('scroll', this.onScroll);
  }

  private setCaseStudy(id: string): void {
    this.caseStudyId = id;
    this.data = CASE_STUDY_DATA[id];

    const idx = CASE_STUDY_LIST.indexOf(id);
    this.prevStudy = idx > 0 ? CASE_STUDY_LIST[idx - 1] : null;
    this.nextStudy = idx >= 0 && idx < CASE_STUDY_LIST.length - 1 ? CASE_STUDY_LIST[idx + 1] : null;

    this.sectionIds = this.data ? this.data.sections.map((s) => s.id) : [];
    this.activeSection = this.sectionIds[0] || '';
    this.handleScroll();

    if (this.data) {
      this.seo.set({
        title: this.data.title,
        description: 'Explore AxisXD case studies showcasing real-world digital twin deployments.',
        canonicalPath: `/case-study/${encodeURIComponent(id)}`,
      });
    }
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

  goBack(): void {
    this.router.navigate(['/resources']);
  }

  navigateCaseStudy(id: string): void {
    this.router.navigate(['/case-study', id]);
  }

  categoryClass(color: string): string {
    if (color === 'blue') return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20';
    if (color === 'indigo') return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20';
    return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
  }

  isStringArray(p: string | string[]): p is string[] {
    return Array.isArray(p);
  }
}
