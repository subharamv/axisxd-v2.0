import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RotatingTextComponent } from '../rotating-text/rotating-text';
import {
  LucideAngularModule,
  ArrowUpRight,
  Sparkles,
  Scan,
  Compass,
  Users,
  CheckCircle2,
  ChevronRight,
  Box,
  Layers,
  Sun,
  Sliders,
} from 'lucide-angular';
import { ConsultationService } from '../../core/consultation.service';
import { LiveModelsService } from '../../core/live-models.service';

gsap.registerPlugin(ScrollTrigger);

interface TelemetrySpec {
  layerName: string;
  pointsCount: string;
  tolerance: string;
  scaleAccuracy: string;
  renderingEngine: string;
  coordinateX: string;
  coordinateY: string;
  coordinateZ: string;
}

const TELEMETRY_DATA: Record<string, TelemetrySpec> = {
  ifc: {
    layerName: 'IFC SOLID PROPERTIES (BIM)',
    pointsCount: '148,293 TRIANGLES',
    tolerance: '± 2.0 mm BIM Class A',
    scaleAccuracy: '1:1 CALIBRATED',
    renderingEngine: 'WEBGL 2.0 / SHADOW',
    coordinateX: 'X: 341.298',
    coordinateY: 'Y: -112.554',
    coordinateZ: 'Z: 78.431',
  },
  dxf: {
    layerName: 'DXF / vector 2D FLOORPLAN',
    pointsCount: '12,942 POLYLINE NODES',
    tolerance: '± 0.5 mm CAD ACCURACY',
    scaleAccuracy: '1:50 LAYOUT',
    renderingEngine: '2D VECTOR ACCELERATED',
    coordinateX: 'X: 198.405',
    coordinateY: 'Y: -83.291',
    coordinateZ: 'Z: 0.000',
  },
  pointcloud: {
    layerName: 'LIDAR SPATIAL POINT CLOUD',
    pointsCount: '42,910,230 SCATTER POINTS',
    tolerance: '± 3.5 mm REAL RANGE',
    scaleAccuracy: 'TRUE SCALE CLOUD',
    renderingEngine: 'POINTSTREAM SHADER V3',
    coordinateX: 'X: 512.923',
    coordinateY: 'Y: -241.004',
    coordinateZ: 'Z: 144.302',
  },
  rol: {
    layerName: 'RIGHTS OF LIGHT SOLAR ENVELOPE',
    pointsCount: '8 SOLAR BOUNDARY RAYS',
    tolerance: '99.8% PRECISION VECTOR',
    scaleAccuracy: 'ENVIRONMENT BOUNDS',
    renderingEngine: 'RAY-TRACED OCCLUSION',
    coordinateX: 'X: 231.503',
    coordinateY: 'Y: -110.040',
    coordinateZ: 'Z: 395.120',
  },
};

interface Dot {
  cx: number;
  cy: number;
  r: number;
  opacity: number;
  color: string;
}

function buildPointCloudDots(): Dot[] {
  const dots: Dot[] = [];
  let seed = 29;
  const rng = () => {
    seed = (seed * 48271) % 2147483647;
    return seed / 2147483647;
  };
  const walls: [number, number, number, number, number, string][] = [
    [57, 57, 57, 343, 1.0, '#34d399'],
    [57, 343, 443, 343, 1.0, '#22d3ee'],
    [443, 57, 443, 343, 0.6, '#818cf8'],
    [57, 57, 443, 57, 0.6, '#a78bfa'],
    [187, 57, 187, 343, 0.8, '#60a5fa'],
    [313, 57, 313, 343, 0.8, '#f472b6'],
    [57, 183, 187, 183, 0.6, '#fb923c'],
    [57, 283, 187, 283, 0.6, '#fbbf24'],
    [307, 153, 443, 153, 0.6, '#2dd4bf'],
    [307, 283, 443, 283, 0.6, '#f87171'],
  ];
  walls.forEach(([x1, y1, x2, y2, density, color]) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const count = Math.round(len * density * 0.65);
    for (let i = 0; i < count; i++) {
      const t = rng();
      const h = rng();
      const bx = x1 + t * dx + (rng() - 0.5) * 1.8;
      const by = y1 + t * dy + (rng() - 0.5) * 1.8;
      dots.push({ cx: bx + h * 52, cy: by - h * 45, r: 0.5 + rng() * 1.0, opacity: 0.5 + density * rng() * 0.45, color });
    }
  });
  return dots;
}

const SOLAR_RAY_PATHS = [
  'M 400 80 L 280 340',
  'M 400 80 L 360 340',
  'M 400 80 L 440 340',
  'M 400 80 L 480 320',
  'M 400 80 L 200 320',
  'M 400 80 L 380 350',
];

const GOD_RAYS = [
  { d: 'M 400 80 L 280 340', w: 1.4, op: 0.55 },
  { d: 'M 400 80 L 360 340', w: 1.8, op: 0.65 },
  { d: 'M 400 80 L 440 340', w: 1.8, op: 0.65 },
  { d: 'M 400 80 L 480 320', w: 1.2, op: 0.5 },
  { d: 'M 400 80 L 200 320', w: 1.0, op: 0.45 },
  { d: 'M 400 80 L 140 240', w: 0.8, op: 0.35 },
  { d: 'M 400 80 L 480 200', w: 0.8, op: 0.35 },
  { d: 'M 400 80 L 380 350', w: 1.4, op: 0.55 },
];

const PARTNER_LOGOS = [
  { src: 'assets/images/partners/rockfield.png', alt: 'Rockfield' },
  { src: 'assets/images/partners/cintoo.png', alt: 'Cintoo' },
  { src: 'assets/images/partners/rockfield.png', alt: 'Rockfield' },
  { src: 'assets/images/partners/cintoo.png', alt: 'Cintoo' },
  { src: 'assets/images/partners/rockfield.png', alt: 'Rockfield' },
  { src: 'assets/images/partners/cintoo.png', alt: 'Cintoo' },
  { src: 'assets/images/partners/rockfield.png', alt: 'Rockfield' },
  { src: 'assets/images/partners/cintoo.png', alt: 'Cintoo' },
  { src: 'assets/images/partners/rockfield.png', alt: 'Rockfield' },
  { src: 'assets/images/partners/cintoo.png', alt: 'Cintoo' },
  { src: 'assets/images/partners/rockfield.png', alt: 'Rockfield' },
  { src: 'assets/images/partners/cintoo.png', alt: 'Cintoo' },
  { src: 'assets/images/partners/rockfield.png', alt: 'Rockfield' },
  { src: 'assets/images/partners/cintoo.png', alt: 'Cintoo' },
  { src: 'assets/images/partners/rockfield.png', alt: 'Rockfield' },
  { src: 'assets/images/partners/cintoo.png', alt: 'Cintoo' },
];

const TAG_BADGES = ['Fast', 'Accurate', 'Secure', 'Standardized'];

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RotatingTextComponent],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
})
export class HeroSectionComponent implements AfterViewInit, OnDestroy {
  readonly ArrowUpRight = ArrowUpRight;
  readonly Sparkles = Sparkles;
  readonly Scan = Scan;
  readonly Compass = Compass;
  readonly Users = Users;
  readonly CheckCircle2 = CheckCircle2;
  readonly ChevronRight = ChevronRight;
  readonly Box = Box;
  readonly Layers = Layers;
  readonly Sun = Sun;
  readonly Sliders = Sliders;

  readonly pointCloudDots = buildPointCloudDots();
  readonly solarRayPaths = SOLAR_RAY_PATHS;
  readonly godRays = GOD_RAYS;
  readonly partnerLogos = PARTNER_LOGOS;
  readonly tagBadges = TAG_BADGES;
  readonly certBadges: [string, string][] = [
    ['EN', 'hs-cert-badge--blue'],
    ['BM', 'hs-cert-badge--indigo'],
    ['LD', 'hs-cert-badge--dark'],
  ];
  readonly rotatingTexts = ['IFC Models', 'DXF/CAD Viewer', 'Point Cloud', 'Rights of light'];
  readonly portalLoginUrl = 'https://cportal.axisxd.com/login';

  /** Viewer highlight for each pill text, in order: IFC, DXF/CAD, Point Cloud, ROL (kept separate). */
  private readonly pillHighlights = ['ifc', 'dxf', 'pointcloud', 'rol'];

  activeHighlight: string | null = 'ifc';
  attentionDotIndex = 0;

  /** Highlight driven by the current rotating pill text (restored on pin mouseleave). */
  private baseHighlight: string | null = 'ifc';

  // Telemetry flicker state — retained from the source for parity; not rendered in the UI there either.
  telemetry = { renderSpeed: '0.4 ms', gpuLoad: '12%', sensorPing: '4 ms', calibStatus: 'READY' };

  @ViewChild(RotatingTextComponent) rotatingText?: RotatingTextComponent;
  @ViewChild('sectionEl') sectionEl!: ElementRef<HTMLElement>;
  @ViewChild('orb1') orb1!: ElementRef<HTMLDivElement>;
  @ViewChild('orb2') orb2!: ElementRef<HTMLDivElement>;
  @ViewChild('c1') c1!: ElementRef<HTMLDivElement>;
  @ViewChild('c2') c2!: ElementRef<HTMLDivElement>;
  @ViewChild('c3') c3!: ElementRef<HTMLDivElement>;
  @ViewChild('c4') c4!: ElementRef<HTMLDivElement>;
  @ViewChild('wallClipRect') wallClipRect!: ElementRef<SVGRectElement>;

  private ctx?: gsap.Context;
  private telemetryIntervalId: ReturnType<typeof setInterval> | null = null;
  private dotIntervalId: ReturnType<typeof setInterval> | null = null;
  private inViewObserver?: IntersectionObserver;

  constructor(
    public consultation: ConsultationService,
    public liveModels: LiveModelsService,
  ) {}

  get activeSpecs(): TelemetrySpec {
    return TELEMETRY_DATA[this.activeHighlight || 'ifc'] || TELEMETRY_DATA['ifc'];
  }

  get floorPlanClass(): string {
    if (this.activeHighlight === 'dxf' || this.activeHighlight === 'ifc') return 'hs-fp hs-fp--bright';
    if (this.activeHighlight === 'pointcloud') return 'hs-fp hs-fp--pc';
    return 'hs-fp hs-fp--dim';
  }

  ngAfterViewInit(): void {
    this.telemetryIntervalId = setInterval(() => {
      this.telemetry = {
        renderSpeed: `${(0.3 + Math.random() * 0.2).toFixed(2)} ms`,
        gpuLoad: `${Math.floor(10 + Math.random() * 6)}%`,
        sensorPing: `${Math.floor(3 + Math.random() * 3)} ms`,
        calibStatus: Math.random() > 0.15 ? 'SYS_OK' : 'CALIB_RELOAD',
      };
    }, 2500);

    this.dotIntervalId = setInterval(() => {
      this.attentionDotIndex = (this.attentionDotIndex + 1) % 4;
    }, 2500);

    this.ctx = gsap.context(() => {
      if (this.orb1) gsap.to(this.orb1.nativeElement, { y: -22, duration: 5.5, ease: 'sine.inOut', repeat: -1, yoyo: true });
      if (this.orb2) gsap.to(this.orb2.nativeElement, { y: 18, duration: 7, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1.8 });

      const counters: { el: HTMLElement; to: number; fmt: (n: number) => string }[] = [
        { el: this.c1.nativeElement, to: 5000, fmt: (n) => `${Math.round(n).toLocaleString()}+` },
        { el: this.c2.nativeElement, to: 30, fmt: (n) => `${Math.round(n)}+` },
        { el: this.c3.nativeElement, to: 230, fmt: (n) => `${Math.round(n)} Million` },
        { el: this.c4.nativeElement, to: 98, fmt: (n) => `${Math.round(n)}%` },
      ];

      counters.forEach(({ el, to, fmt }) => {
        if (!el) return;
        const obj = { val: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () => {
            gsap.to(obj, {
              val: to,
              duration: 1.8,
              ease: 'power2.out',
              onUpdate() {
                el.textContent = fmt(obj.val);
              },
            });
          },
        });
      });
    }, this.sectionEl.nativeElement);

    this.updateWallClip();

    this.inViewObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('hs-in-view');
            this.inViewObserver?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    this.sectionEl.nativeElement.querySelectorAll('.hs-fade').forEach((el) => this.inViewObserver?.observe(el));

    const ring = this.sectionEl.nativeElement.querySelector('.hs-progress-ring');
    if (ring) {
      const ringObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('hs-ring-in');
              ringObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 },
      );
      ringObserver.observe(ring);
    }
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
    if (this.telemetryIntervalId) clearInterval(this.telemetryIntervalId);
    if (this.dotIntervalId) clearInterval(this.dotIntervalId);
    this.inViewObserver?.disconnect();
  }

  /**
   * Hovering a viewer pin highlights it *and* drives the rotating pill to the
   * matching text, so the headline always names whatever the viewer is showing.
   * Rotation is held while the pointer is on a pin so the pill cannot rotate
   * away from what is being pointed at.
   */
  setHighlight(id: string | null): void {
    this.activeHighlight = id;
    this.updateWallClip();

    const index = this.pillHighlights.indexOf(id ?? '');
    if (index === -1) return;
    this.rotatingText?.pause();
    this.rotatingText?.goTo(index);
  }

  /**
   * Syncs the viewer highlight with the rotating pill text so the related
   * viewer highlights with animation as the text changes. Each pill option
   * maps to exactly one viewer (ROL stays separate from Point Cloud):
   *  - 'IFC Models'      → IFC pin + wall extrusion layer
   *  - 'DXF/CAD Viewer'  → DXF / 2D pin + floorplan
   *  - 'Point Cloud'     → Point Cloud pin + scatter layer
   *  - 'ROL'             → ROL pin + solar rays, only ROL animates
   */
  onRotatingIndexChange(index: number): void {
    const highlight = this.pillHighlights[index] ?? 'ifc';
    this.baseHighlight = highlight;
    this.activeHighlight = highlight;
    this.updateWallClip();
  }

  /**
   * Return the viewer to the highlight dictated by the current pill text and let
   * the pill resume rotating (used on pin mouseleave). The pill stays on the
   * text the hover left it at and carries on from there.
   */
  restoreHighlight(): void {
    this.activeHighlight = this.baseHighlight;
    this.updateWallClip();
    this.rotatingText?.resume();
  }

  private updateWallClip(): void {
    const rect = this.wallClipRect?.nativeElement;
    if (!rect) return;
    if (this.activeHighlight === 'ifc' || this.activeHighlight === 'rol') {
      gsap.to(rect, {
        attr: { y: 7, height: 336 },
        duration: this.activeHighlight === 'rol' ? 0.6 : 1.8,
        ease: 'power3.out',
      });
    } else {
      gsap.set(rect, { attr: { y: 343, height: 0 } });
    }
  }
}
