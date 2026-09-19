import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  LucideAngularModule,
  Menu,
  X,
  ChevronDown,
  ArrowUpRight,
  Box,
  Sliders,
  Camera,
  Activity,
  Sun,
  BookOpen,
  FileText,
  BookMarked,
  BarChart3,
  Layers,
  Hexagon,
  Crosshair,
  Network,
  Package,
  Send,
  Code2,
  PlayCircle,
  Users,
  HelpCircle,
  Briefcase,
} from 'lucide-angular';
import type { LucideIconData } from '../../core/lucide-icon.type';
import { AnimatedThemeTogglerComponent } from '../animated-theme-toggler/animated-theme-toggler';
import { NavStyleToggleComponent } from '../nav-style-toggle/nav-style-toggle';
import { FontSwitcherComponent } from '../font-switcher/font-switcher';
import { ConsultationService } from '../../core/consultation.service';
import gsap from 'gsap';

interface NavLink {
  label: string;
  ariaLabel: string;
  onClick: () => void;
  icon?: LucideIconData;
  desc?: string;
}

interface NavGroup {
  id: string;
  label: string;
  links: NavLink[];
}

interface ProductConfig {
  key: string;
  label: string;
  tagline: string;
  accent: string;
  accentRgb: string;
  demoUrl: string;
  icon: LucideIconData;
  previewImg: string;
  previewAlt: string;
}

const PRODUCTS: ProductConfig[] = [
  { key: 'ifc-viewer', label: 'IFC Viewer', tagline: 'BIM Model Visualization', accent: '#3B82F6', accentRgb: '59,130,246', demoUrl: 'https://realityxd.axisxd.com/', icon: Box, previewImg: 'assets/images/viewers/ifc_viewer.png', previewAlt: 'IFC Viewer' },
  { key: 'point-cloud', label: 'Point Cloud LiDAR', tagline: 'LiDAR & Reality Capture', accent: '#0645fb', accentRgb: '6,69,251', demoUrl: 'https://voxelxd.axisxd.com/', icon: Sliders, previewImg: 'assets/images/viewers/point_cloud_viewer.png', previewAlt: 'Point Cloud LiDAR' },
  { key: 'pano', label: 'Pano 360° Viewer', tagline: 'Panoramic Site Navigation', accent: '#0645fb', accentRgb: '6,69,251', demoUrl: 'https://xplorexd.axisxd.com/', icon: Camera, previewImg: 'assets/images/viewers/Pano_Viewer.png', previewAlt: 'Pano 360° Viewer' },
  { key: 'cad', label: 'CAD/DXF Viewer', tagline: 'Engineering Drawing Viewer', accent: '#0645fb', accentRgb: '6,69,251', demoUrl: '#', icon: Layers, previewImg: 'assets/images/viewers/Dxf_Viewer.png', previewAlt: 'CAD/DXF Viewer' },
  { key: 'mesh', label: '3D Mesh Viewer', tagline: 'Textured 3D Surface Rendering', accent: '#0645fb', accentRgb: '6,69,251', demoUrl: '#', icon: Hexagon, previewImg: 'assets/images/viewers/Mesh_viewer.png', previewAlt: '3D Mesh Viewer' },
];

const VIEWER_ROUTES: Record<string, string> = {
  'ifc-viewer': '/viewer/ifc',
  'point-cloud': '/viewer/point-cloud',
  pano: '/viewer/pano',
  cad: '/viewer/cad',
  mesh: '/viewer/mesh',
  'digital-twin': '/viewer/digital-twin',
  deviation: '/analysis/deviation',
  rol: '/analysis/rol',
  monitoring: '/analysis/monitoring',
  clash: '/analysis/clash',
};

@Component({
  selector: 'app-glass-navbar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, AnimatedThemeTogglerComponent, NavStyleToggleComponent, FontSwitcherComponent],
  templateUrl: './glass-navbar.html',
  styleUrl: './glass-navbar.scss',
})
export class GlassNavbarComponent implements OnInit, OnDestroy {
  @Output() switchStyle = new EventEmitter<void>();

  isDark = typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : true;
  openMenu: string | null = null;
  closingMenu: string | null = null;
  mobileOpen = false;
  mobileClosing = false;
  mobileExpanded = new Set<string>(['products', 'analysis']);
  hoveredProductKey = PRODUCTS[0].key;
  previewProductKey = PRODUCTS[0].key;
  hoveredPanel: 'none' | 'mid' | 'right' = 'none';

  readonly PRODUCTS = PRODUCTS;
  readonly COL_W = 251;
  readonly SUB_GAP_W = 20;
  readonly PREVIEW_W = 299;
  readonly CLOSED_W = 251 + 20 + 251;
  readonly OPEN_W = 251 + 20 + 251 + 299 + 1;
  readonly Menu = Menu;
  readonly X = X;
  readonly ChevronDown = ChevronDown;
  readonly ArrowUpRight = ArrowUpRight;

  private themeObserver: MutationObserver | null = null;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private router: Router,
    public consultation: ConsultationService,
    private elementRef: ElementRef,
  ) {}

  ngOnInit(): void {
    this.themeObserver = new MutationObserver(() => {
      this.isDark = document.documentElement.classList.contains('dark');
    });
    this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.mobileOpen = false;
      this.mobileClosing = false;
      this.openMenu = null;
    });
  }

  ngOnDestroy(): void {
    this.themeObserver?.disconnect();
    if (this.closeTimer) clearTimeout(this.closeTimer);
  }

  private navigateViewer(key: string): void {
    this.router.navigateByUrl(VIEWER_ROUTES[key] ?? '/');
  }

  selectProduct(key: string): void {
    this.navigateViewer(key);
    this.openMenu = null;
  }

  navigateHome(): void {
    this.router.navigateByUrl('/');
  }

  // navigateLogin(): void {
  //   window.location.href = 'https://cportal.axisxd.com/login';
  // }

    navigateLogin(): void {
  window.open('https://cportal.axisxd.com/login', '_blank', 'noopener,noreferrer');
}

  scrollToPricing(): void {
    this.router.navigateByUrl('/').then(() => {
      setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 300);
    });
  }

  private _groups: NavGroup[] | null = null;

  get groups(): NavGroup[] {
    return (this._groups ??= this.buildGroups());
  }

  private buildGroups(): NavGroup[] {
    return [
      {
        id: 'products',
        label: 'Products',
        links: PRODUCTS.map((p) => ({ label: p.label, ariaLabel: p.label, icon: p.icon, onClick: () => this.navigateViewer(p.key) })),
      },
      {
        id: 'analysis',
        label: 'Analysis',
        links: [
          { label: 'Deviation Analyzer', icon: Activity, desc: 'Scan vs BIM comparison & reporting', ariaLabel: 'Deviation Analyzer', onClick: () => this.navigateViewer('deviation') },
          { label: 'Rights of Light', icon: Sun, desc: 'Solar path and daylight assessment', ariaLabel: 'Rights of Light', onClick: () => this.navigateViewer('rol') },
          { label: 'Construction Monitoring', icon: BarChart3, desc: 'Visual progress tracking & timeline comparison', ariaLabel: 'Construction Monitoring', onClick: () => this.navigateViewer('monitoring') },
          { label: 'BIM Clash Detection', icon: Crosshair, desc: 'Automated clash & conflict detection in BIM', ariaLabel: 'BIM Clash Detection', onClick: () => this.navigateViewer('clash') },
        ],
      },
      {
        id: 'resources',
        label: 'Resources',
        links: [
          { label: 'Blogs & Articles', icon: BookOpen, desc: 'Technical articles and guides', ariaLabel: 'Blogs', onClick: () => this.router.navigateByUrl('/resources') },
          { label: 'Whitepapers', icon: FileText, desc: 'In-depth technical documents', ariaLabel: 'Whitepapers', onClick: () => this.router.navigateByUrl('/resources') },
          { label: 'Case Studies', icon: BarChart3, desc: 'Real-world client project results', ariaLabel: 'Case Studies', onClick: () => this.router.navigateByUrl('/resources') },
          { label: 'Webinars', icon: PlayCircle, desc: 'On-demand expert-led sessions', ariaLabel: 'Webinars', onClick: () => this.router.navigateByUrl('/webinars') },
          { label: 'Ebooks', icon: BookMarked, desc: 'Downloadable AEC learning guides', ariaLabel: 'Ebooks', onClick: () => this.router.navigateByUrl('/resources') },
          { label: 'Documentation', icon: Code2, desc: 'API docs, SDK guides & tutorials', ariaLabel: 'Documentation', onClick: () => this.router.navigateByUrl('/docs') },
        ],
      },
      {
        id: 'solutions',
        label: 'Solutions',
        links: [
          { label: 'Digital Twin', icon: Network, desc: 'Unified digital twin platform & viewers', ariaLabel: 'Digital Twin', onClick: () => this.navigateViewer('digital-twin') },
          { label: 'Facility Monitoring', icon: BarChart3, desc: 'Real-time facility health & sensor tracking', ariaLabel: 'Facility Monitoring', onClick: () => this.navigateViewer('monitoring') },
          { label: 'Pilot Suite Bundle', icon: Package, desc: 'All-in-one viewer access for teams', ariaLabel: 'Pilot Suite Bundle', onClick: () => this.scrollToPricing() },
          { label: 'Initiate Audit Proposal', icon: Send, desc: 'Start a site audit or consultation', ariaLabel: 'Initiate Audit Proposal', onClick: () => this.consultation.open() },
        ],
      },
      {
        id: 'connect',
        label: 'Connect',
        links: [
          { label: 'Contact Us', icon: Send, desc: 'Get in touch with our team', ariaLabel: 'Contact Us', onClick: () => this.router.navigateByUrl('/contact') },
          { label: 'Careers', icon: Briefcase, desc: "We're hiring — remote-first team", ariaLabel: 'Careers', onClick: () => this.router.navigateByUrl('/careers') },
          { label: 'Partners', icon: Users, desc: 'Explore partnership opportunities', ariaLabel: 'Partners', onClick: () => this.router.navigateByUrl('/partners') },
          { label: 'Help Center', icon: HelpCircle, desc: 'Docs, guides & support resources', ariaLabel: 'Help Center', onClick: () => this.router.navigateByUrl('/docs') },
        ],
      },
    ];
  }

  get activeProduct(): ProductConfig {
    return PRODUCTS.find((p) => p.key === this.previewProductKey) ?? PRODUCTS[0];
  }

  private qs(sel: string): HTMLElement | null {
    return this.elementRef.nativeElement.querySelector(sel);
  }

  private animatePanel(panel: 'mid' | 'right', open: boolean): void {
    const panelEl = this.qs(`.${panel}-panel`);
    const divEl = this.qs(`.${panel}-div`);
    if (!panelEl) return;
    if (open) {
      gsap.set(panelEl, { width: 0 });
      gsap.to(panelEl, { width: this.PREVIEW_W, duration: 0.42, ease: 'power3.out' });
      if (divEl) gsap.to(divEl, { opacity: 1, duration: 0.28, ease: 'power2.out' });
      if (panel === 'mid') {
        const subGap = this.qs('.sub-gap');
        if (subGap) gsap.to(subGap, { opacity: 0, duration: 0.2 });
      }
    } else {
      gsap.to(panelEl, { width: 0, duration: 0.28, ease: 'power2.in' });
      if (divEl) gsap.to(divEl, { opacity: 0, duration: 0.2 });
      if (panel === 'mid') {
        const subGap = this.qs('.sub-gap');
        if (subGap) gsap.to(subGap, { opacity: 1, duration: 0.22 });
      }
    }
  }

  private animateContainer(open: boolean): void {
    const container = this.qs('.mega-menu-container');
    if (!container) return;
    if (open) {
      gsap.set(container, { width: this.CLOSED_W });
      gsap.to(container, { width: this.OPEN_W, duration: 0.42, ease: 'power3.out' });
    } else {
      gsap.to(container, { width: this.CLOSED_W, duration: 0.28, ease: 'power2.in' });
    }
  }

  private switchPanelContent(key: string, panel: 'mid' | 'right'): void {
    const inner = this.qs(`.${panel}-panel-inner`);
    if (!inner) { this.previewProductKey = key; return; }
    gsap.to(inner, {
      opacity: 0, y: -5, duration: 0.12, ease: 'power2.in',
      onComplete: () => {
        this.previewProductKey = key;
        gsap.fromTo(inner, { opacity: 0, y: 7 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' });
      },
    });
  }

  hoverProduct(key: string): void {
    const target: 'mid' | 'right' = this.PRODUCTS.slice(0, 3).some((p) => p.key === key) ? 'mid' : 'right';
    const prev = this.hoveredPanel;
    if (prev === 'none') {
      this.hoveredProductKey = key;
      this.previewProductKey = key;
      this.hoveredPanel = target;
      this.animateContainer(true);
      this.animatePanel(target, true);
    } else if (prev === target) {
      this.hoveredProductKey = key;
      if (key !== this.previewProductKey) this.switchPanelContent(key, target);
    } else {
      this.hoveredProductKey = key;
      this.previewProductKey = key;
      this.hoveredPanel = target;
      this.animatePanel(prev, false);
      setTimeout(() => this.animatePanel(target, true), 80);
    }
  }

  menuEnter(id: string): void {
    if (this.closeTimer) clearTimeout(this.closeTimer);
    this.openMenu = id;
    this.closingMenu = null;
    if (id !== 'products') this.resetMegaMenu();
  }

  private resetMegaMenu(): void {
    if (this.hoveredPanel !== 'none') {
      this.animateContainer(false);
      this.animatePanel(this.hoveredPanel, false);
      this.hoveredPanel = 'none';
      this.hoveredProductKey = PRODUCTS[0].key;
      this.previewProductKey = PRODUCTS[0].key;
    }
  }

  menuLeave(): void {
    if (this.closeTimer) clearTimeout(this.closeTimer);
    if (!this.openMenu) return;
    this.closingMenu = this.openMenu;
    this.closeTimer = setTimeout(() => {
      this.openMenu = null;
      this.closingMenu = null;
      this.resetMegaMenu();
    }, 150);
  }

  keepOpen(): void {
    if (this.closeTimer) clearTimeout(this.closeTimer);
    this.closingMenu = null;
  }

  toggleMobileGroup(id: string): void {
    if (this.mobileExpanded.has(id)) this.mobileExpanded.delete(id);
    else this.mobileExpanded.add(id);
  }

  toggleMobile(): void {
    if (this.mobileOpen) {
      this.mobileClosing = true;
      setTimeout(() => {
        this.mobileOpen = false;
        this.mobileClosing = false;
      }, 260);
    } else {
      this.mobileOpen = true;
    }
  }

  startProject(): void {
    this.consultation.open();
    this.mobileOpen = false;
  }

  runAndClose(fn: () => void): void {
    fn();
    this.openMenu = null;
    this.resetMegaMenu();
  }

  runAndCloseMobile(fn: () => void): void {
    fn();
    this.mobileOpen = false;
  }

  readonly mobileGroupOrder = ['products', 'analysis', 'solutions', 'resources', 'connect'];

  groupById(id: string): NavGroup | undefined {
    return this.groups.find((g) => g.id === id);
  }
}
