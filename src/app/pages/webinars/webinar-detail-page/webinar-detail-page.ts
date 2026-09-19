import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  LucideAngularModule,
  Calendar,
  Clock,
  ChevronLeft,
  Linkedin,
  Twitter,
  Facebook,
  Share2,
  ArrowLeft,
  ArrowRight,
  Users,
  Play,
  X,
  CheckCircle,
} from 'lucide-angular';

import {
  WEBINAR_DATA,
  WB_LIST,
  RELATED_WEBINARS,
  CATEGORY_STYLES,
  STATUS_STYLES,
  WebinarEntry,
} from '../../../data/webinars';
import { SeoService } from '../../../core/seo.service';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
}

const SOCIAL_LINKS = [
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Share2, href: '#', label: 'Copy Link' },
];

@Component({
  selector: 'app-webinar-detail-page',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './webinar-detail-page.html',
  styleUrl: './webinar-detail-page.scss',
})
export class WebinarDetailPageComponent implements OnInit, OnDestroy {
  /** When set (e.g. by a fixed-slug wrapper page), overrides the id read from the route. */
  @Input() fixedId?: string;

  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly ChevronLeft = ChevronLeft;
  readonly Users = Users;
  readonly Play = Play;
  readonly X = X;
  readonly CheckCircle = CheckCircle;
  readonly ArrowLeft = ArrowLeft;
  readonly ArrowRight = ArrowRight;

  readonly WEBINAR_DATA = WEBINAR_DATA;
  readonly RELATED_WEBINARS = RELATED_WEBINARS;
  readonly CATEGORY_STYLES = CATEGORY_STYLES;
  readonly STATUS_STYLES = STATUS_STYLES;
  readonly SOCIAL_LINKS = SOCIAL_LINKS;

  webinarId = '';
  data: WebinarEntry | undefined;
  prevWb: string | null = null;
  nextWb: string | null = null;
  sectionIds: string[] = [];
  activeSection = '';

  showPopup = false;
  registerSuccess = false;
  formData: RegisterFormData = { firstName: '', lastName: '', email: '', company: '' };
  formErrors: Record<string, string> = {};

  private paramSub: Subscription | null = null;
  private successTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly onScroll = () => this.handleScroll();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly seo: SeoService,
  ) {}

  ngOnInit(): void {
    if (this.fixedId) {
      this.webinarId = this.fixedId;
      this.loadWebinar();
    } else {
      this.paramSub = this.route.paramMap.subscribe((params) => {
        this.webinarId = params.get('id') || '';
        this.loadWebinar();
      });
    }
    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  ngOnDestroy(): void {
    this.paramSub?.unsubscribe();
    window.removeEventListener('scroll', this.onScroll);
    if (this.successTimeout) clearTimeout(this.successTimeout);
  }

  private loadWebinar(): void {
    this.data = WEBINAR_DATA[this.webinarId];

    const idx = WB_LIST.indexOf(this.webinarId);
    this.prevWb = idx > 0 ? WB_LIST[idx - 1] : null;
    this.nextWb = idx >= 0 && idx < WB_LIST.length - 1 ? WB_LIST[idx + 1] : null;

    this.sectionIds = this.data ? this.data.sections.map((s) => s.id) : [];
    this.activeSection = this.sectionIds[0] || '';
    this.handleScroll();

    this.seo.set({
      title: this.webinarId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      description: 'Watch this AxisXD webinar on-demand.',
      canonicalPath: `/webinar/${encodeURIComponent(this.webinarId)}`,
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

  get isOnDemand(): boolean {
    return this.data?.status === 'on-demand';
  }

  get isUpcoming(): boolean {
    return this.data?.status === 'upcoming';
  }

  openPopup(): void {
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
    this.registerSuccess = false;
  }

  validateForm(): boolean {
    const errors: Record<string, string> = {};
    if (!this.formData.firstName.trim()) errors['firstName'] = 'First name is required';
    if (!this.formData.email.trim()) {
      errors['email'] = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email)) {
      errors['email'] = 'Please enter a valid email';
    }
    if (!this.formData.company.trim()) errors['company'] = 'Company is required';
    this.formErrors = errors;
    return Object.keys(errors).length === 0;
  }

  handleFormSubmit(e: Event): void {
    e.preventDefault();
    if (!this.validateForm()) return;
    this.registerSuccess = true;
    this.successTimeout = setTimeout(() => {
      this.showPopup = false;
      this.registerSuccess = false;
      this.formData = { firstName: '', lastName: '', email: '', company: '' };
    }, 3000);
  }

  updateField(field: keyof RegisterFormData, value: string): void {
    this.formData = { ...this.formData, [field]: value };
    if (this.formErrors[field]) {
      this.formErrors = { ...this.formErrors, [field]: '' };
    }
  }

  back(): void {
    this.router.navigate(['/webinars']);
  }

  navigateWebinar(id: string): void {
    this.router.navigate(['/webinar', id]);
  }

  relatedWebinars() {
    return this.RELATED_WEBINARS.filter((t) => t.id !== this.webinarId).slice(0, 3);
  }
}
