import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  LucideAngularModule,
  ChevronDown,
  Search,
  X,
  ArrowLeft,
  BookOpen,
  CreditCard,
  Shield,
  Settings,
  Puzzle,
  FileText,
} from 'lucide-angular';
import { SeoService } from '../../../core/seo.service';

gsap.registerPlugin(ScrollTrigger);

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  id: string;
  icon: any;
  title: string;
  items: FAQItem[];
}

const CATEGORIES: FAQCategory[] = [
  {
    id: 'getting-started',
    icon: BookOpen,
    title: 'Getting Started',
    items: [
      {
        q: 'What is AxisXD?',
        a: 'AxisXD is a browser-based digital twin platform for the AEC industry. It provides a suite of 3D viewers including IFC/BIM, point cloud LiDAR, 360° panoramic, CAD/DXF, and 3D mesh viewers, along with analysis tools for deviation checking, clash detection, construction monitoring, and rights-of-light assessment.',
      },
      {
        q: 'Do I need to install anything?',
        a: 'No. All AxisXD viewers run directly in the browser via WebGL and WebAssembly. There is no software to download or plugins to install. A modern browser (Chrome, Firefox, Edge, Safari) is all you need.',
      },
      {
        q: 'How do I get started?',
        a: 'Sign up for a free Pilot Sandbox account at axisxd.com. You will receive an API key immediately, and you can start uploading models and embedding viewers within minutes. Our Quick Start guide walks you through the entire process.',
      },
      {
        q: 'What file formats does AxisXD support?',
        a: 'AxisXD supports IFC (2×3, 4, 4×3), LAS/LAZ, E57, PLY, PCD, RCP/RCS, DXF, and common 3D mesh formats. Each viewer accepts its native formats; see the <a href="/docs" class="text-[#60a5fa] dark:text-[#0645fb] hover:underline">documentation</a> for detailed compatibility lists.',
      },
    ],
  },
  {
    id: 'pricing-plans',
    icon: CreditCard,
    title: 'Pricing & Plans',
    items: [
      {
        q: 'Is there a free tier?',
        a: 'Yes. The Pilot Sandbox plan is free and includes full access to all viewers and analysis tools with reasonable usage limits. It is ideal for evaluation, small projects, and development.',
      },
      {
        q: 'What is included in the Enterprise Precision plan?',
        a: 'Enterprise Precision includes everything in Pilot Sandbox plus higher rate limits, priority processing, dedicated support, custom branding, SSO/SAML, and volume pricing. It starts at $249/month for teams and $549/month for organizations.',
      },
      {
        q: 'Can I upgrade or downgrade my plan?',
        a: 'Yes. You can change your plan at any time from the dashboard. Upgrades take effect immediately; downgrades apply at the start of the next billing cycle.',
      },
      {
        q: 'Is there a free trial for Enterprise features?',
        a: 'Contact our sales team for a 14-day Enterprise trial. We will set up a dedicated environment with full access to all Enterprise features so you can evaluate before committing.',
      },
    ],
  },
  {
    id: 'security',
    icon: Shield,
    title: 'Security & Compliance',
    items: [
      {
        q: 'How is my data protected?',
        a: 'All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We maintain SOC 2 compliance and undergo regular third-party penetration testing. Models and scans are stored in isolated, per-tenant storage buckets.',
      },
      {
        q: 'Where is my data stored?',
        a: 'Data is stored in US-based data centers with automatic replication across availability zones. EU data residency is available for Enterprise plans. Contact support to enable data residency in specific regions.',
      },
      {
        q: 'Do you offer SSO / SAML?',
        a: 'Yes. Enterprise Precision plans include SSO/SAML integration with major identity providers including Okta, Azure AD, Google Workspace, and OneLogin. Self-service setup is available from the dashboard.',
      },
      {
        q: 'What happens if I delete my account?',
        a: 'All your data including uploaded models, scans, and analysis reports is permanently deleted within 30 days of account deletion. You can request expedited deletion by contacting support.',
      },
    ],
  },
  {
    id: 'integration',
    icon: Puzzle,
    title: 'Integration & Embedding',
    items: [
      {
        q: 'Can I embed AxisXD viewers in my own application?',
        a: 'Absolutely. All viewers can be embedded via iframe or the JavaScript SDK. The SDK gives you full control over viewer state, event handling, and programmatic interactions. See our <a href="/docs" class="text-[#60a5fa] dark:text-[#0645fb] hover:underline">documentation</a> for code examples.',
      },
      {
        q: 'Does AxisXD work with Autodesk, Revit, or BIM 360?',
        a: 'We offer a Revit add-in for direct publishing of models to AxisXD, and a BIM 360 integration that syncs models automatically. These are available on all paid plans.',
      },
      {
        q: 'Is there a REST API?',
        a: 'Yes. The AxisXD REST API (api.axisxd.com/v1) provides programmatic access to model management, scan uploads, analysis job execution, and viewer configuration. API keys are available from the dashboard.',
      },
    ],
  },
  {
    id: 'usage',
    icon: Settings,
    title: 'Usage & Limits',
    items: [
      {
        q: 'Is there a file size limit?',
        a: 'Pilot Sandbox supports models up to 500 MB per file. Enterprise Precision supports models up to 2 GB. Larger models can be split into zones or tiles for efficient streaming.',
      },
      {
        q: 'How many team members can I invite?',
        a: 'Pilot Sandbox supports up to 3 team members. Enterprise Precision (Team) supports 10, and Enterprise Precision (Organization) supports unlimited team members with role-based access control.',
      },
      {
        q: 'What are the API rate limits?',
        a: 'Pilot Sandbox: 60 requests/minute. Enterprise Precision (Team): 300 requests/minute. Enterprise Precision (Organization): 1,200 requests/minute. Rate limits apply per API key.',
      },
    ],
  },
  {
    id: 'support',
    icon: FileText,
    title: 'Support & Troubleshooting',
    items: [
      {
        q: 'How can I get help?',
        a: 'Email support@axisxd.com for technical questions. Enterprise customers have access to a dedicated Slack channel and priority support with a 2-hour SLA during business hours.',
      },
      {
        q: 'My model is not loading. What should I check?',
        a: 'First, verify the file format is supported and the file is not corrupted. Check the browser console for errors. Ensure your API key has the correct permissions. If the problem persists, contact support with the model ID and any error messages.',
      },
      {
        q: 'Can I export analysis reports?',
        a: 'Yes. Analysis results including deviation maps, clash reports, and rights-of-light assessments can be exported as PDF, CSV, or JSON. Reports include visual snapshots and measurement data.',
      },
    ],
  },
];

@Component({
  selector: 'app-faq-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './faq-page.html',
  styleUrl: './faq-page.scss',
})
export class FaqPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heading') headingRef?: ElementRef<HTMLDivElement>;
  @ViewChild('searchBar') searchRef?: ElementRef<HTMLDivElement>;
  @ViewChild('categoryGrid') categoryGridRef?: ElementRef<HTMLDivElement>;
  @ViewChild('cta') ctaRef?: ElementRef<HTMLDivElement>;

  readonly ChevronDown = ChevronDown;
  readonly Search = Search;
  readonly X = X;
  readonly ArrowLeft = ArrowLeft;

  readonly categories = CATEGORIES;

  isDark = true;
  searchQuery = '';
  activeCategory: string | null = null;
  openItems: Record<string, boolean> = {};

  readonly footerLinks = [{ label: 'Blog & Articles' }, { label: 'Whitepapers' }, { label: 'Webinars' }];

  private themeObserver: MutationObserver | null = null;
  private gsapCtx: gsap.Context | null = null;

  constructor(private seo: SeoService) {
    this.seo.set({
      title: 'FAQ',
      description: 'Frequently asked questions about AxisXD digital twin platform, viewers, analysis tools, and pricing.',
      canonicalPath: '/faq',
    });
  }

  ngOnInit(): void {
    this.isDark = document.documentElement.classList.contains('dark');
    this.themeObserver = new MutationObserver(() => {
      this.isDark = document.documentElement.classList.contains('dark');
    });
    this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }

  ngAfterViewInit(): void {
    this.gsapCtx = gsap.context(() => {
      if (this.headingRef) {
        gsap.fromTo(
          this.headingRef.nativeElement.children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power2.out' },
        );
      }

      if (this.searchRef) {
        gsap.fromTo(
          this.searchRef.nativeElement,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, delay: 0.3, ease: 'power2.out' },
        );
      }

      if (this.categoryGridRef) {
        gsap.fromTo(
          this.categoryGridRef.nativeElement.children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, delay: 0.5, ease: 'power2.out' },
        );
      }

      if (this.ctaRef) {
        ScrollTrigger.create({
          trigger: this.ctaRef.nativeElement,
          start: 'top 85%',
          onEnter: () => {
            gsap.fromTo(
              this.ctaRef!.nativeElement.children,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
            );
          },
        });
      }
    });

    ScrollTrigger.refresh();
  }

  ngOnDestroy(): void {
    this.themeObserver?.disconnect();
    this.gsapCtx?.revert();
    ScrollTrigger.getAll().forEach((t) => t.kill());
  }

  get filtered(): FAQCategory[] {
    const q = this.searchQuery.toLowerCase();
    return this.categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q),
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }

  get totalResults(): number {
    return this.filtered.reduce((sum, cat) => sum + cat.items.length, 0);
  }

  get visibleCategories(): FAQCategory[] {
    return this.searchQuery || this.activeCategory ? this.filtered : this.categories;
  }

  isCategoryVisible(cat: FAQCategory): boolean {
    if (this.searchQuery) return true;
    if (this.activeCategory) return this.activeCategory === cat.id;
    return true;
  }

  clearSearch(): void {
    this.searchQuery = '';
  }

  selectCategory(id: string): void {
    this.activeCategory = id;
  }

  showAllCategories(): void {
    this.activeCategory = null;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.activeCategory = null;
  }

  isOpen(catId: string, idx: number): boolean {
    return !!this.openItems[`${catId}-${idx}`];
  }

  toggleItem(catId: string, idx: number, contentEl: HTMLElement, answerEl: HTMLElement): void {
    const key = `${catId}-${idx}`;
    const nowOpen = !this.openItems[key];
    this.openItems[key] = nowOpen;
    if (nowOpen) {
      gsap.to(contentEl, { height: answerEl.scrollHeight, opacity: 1, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
    } else {
      gsap.to(contentEl, { height: 0, opacity: 0, duration: 0.25, ease: 'power2.in', overwrite: 'auto' });
    }
  }
}
