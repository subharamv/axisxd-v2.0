import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { LucideAngularModule, ArrowLeft, ExternalLink } from 'lucide-angular';
import { SeoService } from '../../../core/seo.service';

interface SitemapEntry {
  label: string;
  path: string;
}

interface SitemapCategory {
  title: string;
  description: string;
  items: SitemapEntry[];
}

const SITEMAP_CATEGORIES: SitemapCategory[] = [
  {
    title: 'Home',
    description: 'Main landing page and platform overview',
    items: [{ label: 'Home', path: '/' }],
  },
  {
    title: 'Viewers',
    description: 'Browser-based 3D viewers for AEC data',
    items: [
      { label: 'IFC / BIM Viewer (RealityXD)', path: '/viewer/ifc' },
      { label: 'Point Cloud LiDAR Viewer (VoxelXD)', path: '/viewer/point-cloud' },
      { label: 'Pano 360° Viewer (XploreXD)', path: '/viewer/pano' },
      { label: 'CAD / DXF Viewer', path: '/viewer/cad' },
      { label: '3D Mesh Viewer', path: '/viewer/mesh' },
      { label: 'Digital Twin Platform', path: '/viewer/digital-twin' },
    ],
  },
  {
    title: 'Analysis Tools',
    description: 'AI-powered analysis and compliance tools',
    items: [
      { label: 'Deviation Analyzer', path: '/analysis/deviation' },
      { label: 'Rights of Light Analysis', path: '/analysis/rol' },
      { label: 'Construction Monitoring', path: '/analysis/monitoring' },
      { label: 'BIM Clash Detection', path: '/analysis/clash' },
    ],
  },
  {
    title: 'Resources',
    description: 'Educational content and research',
    items: [
      { label: 'Resources Hub', path: '/resources' },
      { label: 'Webinars', path: '/webinars' },
      { label: 'Documentation', path: '/docs' },
      { label: 'FAQ', path: '/faq' },
      { label: 'Glossary', path: '/glossary' },
    ],
  },
  {
    title: 'Company',
    description: 'About AxisXD and contact information',
    items: [
      { label: 'Contact Us', path: '/contact' },
      { label: 'Careers', path: '/careers' },
      { label: 'Integrations & Partners', path: '/partners' },
    ],
  },
  {
    title: 'Account',
    description: 'Authentication and account management',
    items: [
      { label: 'Login', path: '/login' },
      { label: 'Sign Up', path: '/signup' },
    ],
  },
];

@Component({
  selector: 'app-sitemap-page',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './sitemap-page.html',
  styleUrl: './sitemap-page.scss',
})
export class SitemapPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heading') headingRef?: ElementRef<HTMLDivElement>;
  @ViewChild('categoryGrid') categoryGridRef?: ElementRef<HTMLDivElement>;
  @ViewChild('allUrls') allUrlsRef?: ElementRef<HTMLDivElement>;

  readonly ArrowLeft = ArrowLeft;
  readonly ExternalLink = ExternalLink;
  readonly categories = SITEMAP_CATEGORIES;

  isDark = true;

  private themeObserver: MutationObserver | null = null;
  private gsapCtx: gsap.Context | null = null;

  constructor(private seo: SeoService) {
    this.seo.set({
      title: 'Sitemap',
      description: 'Complete sitemap for AxisXD: browse all pages, viewers, analysis tools, and resources.',
      canonicalPath: '/sitemap',
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
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out' },
        );
      }
      if (this.categoryGridRef) {
        gsap.fromTo(
          this.categoryGridRef.nativeElement.children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, delay: 0.4, ease: 'power2.out' },
        );
      }
      if (this.allUrlsRef) {
        gsap.fromTo(
          this.allUrlsRef.nativeElement,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, delay: 0.7, ease: 'power2.out' },
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.themeObserver?.disconnect();
    this.gsapCtx?.revert();
  }

  get flatEntries(): { item: SitemapEntry; categoryTitle: string }[] {
    return this.categories.flatMap((cat) => cat.items.map((item) => ({ item, categoryTitle: cat.title })));
  }
}
