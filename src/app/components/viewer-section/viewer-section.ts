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
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LucideAngularModule, ExternalLink, ArrowUpRight, CheckCircle2, ChevronRight } from 'lucide-angular';

gsap.registerPlugin(ScrollTrigger);

interface Viewer {
  id: 'ifc' | 'pointcloud' | 'pano' | 'cad' | 'mesh';
  num: string;
  title: string;
  tag: string;
  image: string;
  demoUrl: string;
  readMoreUrl: string;
  summary: string;
  features: string[];
}

const VIEWERS: Viewer[] = [
  {
    id: 'ifc',
    num: '01',
    title: 'IFC Viewer',
    tag: 'BIM / IFC',
    image: 'assets/images/viewers/ifc_viewer.png',
    demoUrl: 'https://realityxd.axisxd.com/',
    readMoreUrl: '/viewer/ifc',
    summary:
      'The IFC Viewer in AxisXD enables seamless visualization and interaction with IFC models in a unified digital twin environment. It allows users to explore BIM data with full spatial context, review model geometry and properties, and understand complex assets clearly using industry-standard IFC formats.',
    features: [
      'Full 3D visualization & navigation',
      'Industry-standard IFC / BIM support',
      'Object-level property inspection',
      'Layer-based visibility control',
      'Measurement & inspection tools',
      'Sectioning & clipping planes',
      'Large model performance',
      'Design review & coordination',
    ],
  },
  {
    id: 'pointcloud',
    num: '02',
    title: 'Point Cloud Viewer',
    tag: 'LIDAR / SCAN',
    image: 'assets/images/viewers/point_cloud_viewer.png',
    demoUrl: 'https://voxelxd.axisxd.com/',
    readMoreUrl: '/viewer/point-cloud',
    summary:
      'The Point Cloud Viewer in AxisXD enables accurate visualization and exploration ofhigh-density point cloud data within an integrated digital twin environment. It allows users to interpretlaser scanning and LiDAR data with precise spatial context, supporting clear understanding of existingphysical conditions and captured reality.',
    features: [
      'LiDAR & laser scan support',
      'High-density dataset handling',
      'Smooth 3D spatial navigation',
      'Precise dimension measurement',
      'Sectioning & layer slicing',
      'Color & intensity rendering',
      'Spatial dataset overlay',
      'As-built condition review',
    ],
  },
  {
    id: 'pano',
    num: '03',
    title: 'Panorama Viewer',
    tag: '360° / PANO',
    image: 'assets/images/viewers/Pano_Viewer.png',
    demoUrl: 'https://xplorexd.axisxd.com/',
    readMoreUrl: '/viewer/pano',
    summary:
     'The Panorama Viewer in AxisXD enables immersive visualization of real-world environments using high-resolution panoramic imagery, with point cloud data seamlessly integrated for spatial accuracy.This combined approach allows users to visually explore sites while retaining precise geometric context fromreality capture data, delivering a reliable and intuitive digital twin viewing experience.',
    features: [
      '360° high-resolution panoramas',
      'Integrated point cloud context',
      'Seamless panorama navigation',
      'Hotspot-based site traversal',
      'Geometry-backed measurement',
      'As-built condition display',
      'Combined visual + spatial data',
      'Remote site exploration',
    ],
  },
  {
    id: 'cad',
    num: '04',
    title: 'CAD/DXF Viewer',
    tag: 'CAD / DXF',
    image: 'assets/images/viewers/Dxf_Viewer.png',
    demoUrl: '#',
    readMoreUrl: '/viewer/cad',
    summary:
      'Precision CAD and DXF drawing visualization within the digital twin environment. Review engineering drawings with full layer control, annotation tools, and spatial alignment to 3D data.',
    features: [
      'DXF / DWG file support',
      'Multi-layer visibility control',
      'Precise 2D measurement tools',
      'Annotation & markup tools',
      'Spatial alignment to 3D data',
      'High-accuracy geometry display',
      'Drawing revision comparison',
      'Engineering review workflows',
    ],
  },
  {
    id: 'mesh',
    num: '05',
    title: '3D Mesh Viewer',
    tag: '3D / MESH',
    image: 'assets/images/viewers/Mesh_viewer.png',
    demoUrl: '#',
    readMoreUrl: '/viewer/mesh',
    summary:
      'High-fidelity 3D mesh rendering for textured models, reality-captured surfaces, and complex geometry. Ideal for as-built verification, inspection, and immersive asset visualization.',
    features: [
      'OBJ / FBX / glTF support',
      'Textured surface rendering',
      'Real-time mesh inspection',
      'Surface deviation analysis',
      'Section cut & clipping tools',
      'LOD-based performance scaling',
      'Reality-captured mesh import',
      'Asset condition assessment',
    ],
  },
];

const ORDER: Viewer['id'][] = ['ifc', 'pointcloud', 'pano', 'cad', 'mesh'];

@Component({
  selector: 'app-viewer-section',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './viewer-section.html',
  styleUrl: './viewer-section.scss',
})
export class ViewerSectionComponent implements AfterViewInit, OnDestroy {
  readonly ExternalLink = ExternalLink;
  readonly ArrowUpRight = ArrowUpRight;
  readonly CheckCircle2 = CheckCircle2;
  readonly ChevronRight = ChevronRight;

  readonly viewers = VIEWERS;
  activeId: Viewer['id'] = 'ifc';

  @ViewChild('sectionEl') sectionEl!: ElementRef<HTMLElement>;
  @ViewChild('imageEl') imageEl!: ElementRef<HTMLImageElement>;
  @ViewChild('wipeEl') wipeEl!: ElementRef<HTMLDivElement>;

  /** Share of each slide's scroll slot spent wiping to the next one. */
  private static readonly WIPE_BAND = 0.6;
  /** Smoothing rate for the rendered progress, in e-folds per second. */
  private static readonly SMOOTHING = 9;

  private ctx?: gsap.Context;
  private st?: ScrollTrigger;
  private setWipe?: (value: string) => void;
  private shownIndex = 0;

  private targetProgress = 0;
  private renderedProgress = 0;
  private rafId = 0;
  private lastFrame = 0;

  get viewer(): Viewer {
    return this.viewers.find((v) => v.id === this.activeId)!;
  }

  get viewerIndex(): number {
    return this.viewers.findIndex((v) => v.id === this.activeId);
  }

  constructor(
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    const wipe = this.wipeEl.nativeElement;
    gsap.set(wipe, { backgroundColor: 'rgba(6, 69, 251, 0.35)' });
    this.setWipe = gsap.quickSetter(wipe, 'clipPath') as (value: string) => void;
    this.setWipe('inset(0 100% 0 0)');

    this.ctx = gsap.context(() => {
      this.st = ScrollTrigger.create({
        trigger: this.sectionEl.nativeElement,
        pin: true,
        pinSpacing: true,
        start: 'top top',
        end: '+=320%',
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          this.targetProgress = self.progress;
          this.startLoop();
        },
      });
    }, this.sectionEl.nativeElement);
  }

  ngOnDestroy(): void {
    this.stopLoop();
    this.ctx?.revert();
  }

  /**
   * Eases the rendered progress toward the scroll progress on its own frame
   * loop. Scroll events arrive in coarse, irregular jumps; re-easing them
   * frame by frame is what keeps the cover gliding instead of stepping.
   *
   * Runs outside Angular — this ticks on every frame of every scroll.
   */
  private startLoop(): void {
    if (this.rafId) return;
    this.lastFrame = 0;
    this.zone.runOutsideAngular(() => {
      this.rafId = requestAnimationFrame(this.tick);
    });
  }

  private stopLoop(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  private readonly tick = (now: number) => {
    // Frame-rate independent damping, so 120Hz and 60Hz displays ease alike.
    const dt = this.lastFrame ? Math.min((now - this.lastFrame) / 1000, 0.1) : 1 / 60;
    this.lastFrame = now;

    const delta = this.targetProgress - this.renderedProgress;
    const step = 1 - Math.exp(-ViewerSectionComponent.SMOOTHING * dt);
    this.renderedProgress += delta * step;

    if (Math.abs(delta) < 0.0002) {
      this.renderedProgress = this.targetProgress;
      this.render(this.renderedProgress);
      this.stopLoop();
      return;
    }

    this.render(this.renderedProgress);
    this.rafId = requestAnimationFrame(this.tick);
  };

  /** Smoothstep — takes the hard edges off each end of the sweep. */
  private ease(t: number): number {
    return t * t * (3 - 2 * t);
  }

  /**
   * Draws the wipe straight from scroll progress rather than playing a fixed
   * timeline, so the blue cover tracks the wheel one-to-one and unwinds itself
   * when you scroll back up.
   *
   * Each slide owns a 1/5 slot of the pin. The tail WIPE_BAND of a slot is the
   * transition: the first half sweeps the cover in from the left, the image and
   * copy swap at the midpoint, the second half sweeps it off to the right.
   */
  private render(progress: number): void {
    const count = this.viewers.length;
    const band = ViewerSectionComponent.WIPE_BAND;

    const u = Math.min(progress, 0.999999) * count;
    const slot = Math.floor(u);
    const frac = u - slot;

    if (frac < 1 - band || slot === count - 1) {
      this.setWipe?.('inset(0 100% 0 0)');
      this.show(slot);
      return;
    }

    const t = (frac - (1 - band)) / band; // 0 → 1 across the transition

    if (t < 0.5) {
      // Cover sweeping in from the left edge.
      const e = this.ease(t * 2);
      this.setWipe?.(`inset(0 ${(100 - e * 100).toFixed(2)}% 0 0)`);
      this.show(slot);
    } else {
      // Cover clearing off the right edge, new slide underneath.
      const e = this.ease((t - 0.5) * 2);
      this.setWipe?.(`inset(0 0% 0 ${(e * 100).toFixed(2)}%)`);
      this.show(slot + 1);
    }
  }

  private show(index: number): void {
    const clamped = Math.min(Math.max(index, 0), this.viewers.length - 1);
    if (clamped === this.shownIndex) return;

    this.shownIndex = clamped;
    // ScrollTrigger runs outside Angular, so the swap needs an explicit tick.
    this.zone.run(() => {
      this.activeId = this.viewers[clamped].id;
      this.cdr.markForCheck();
    });
  }

  /**
   * Tab / progress-bar clicks scroll to that slide's slot; the wipe then plays
   * itself out of the resulting scroll movement like any other scroll.
   */
  switchViewer(newId: Viewer['id']): void {
    const index = this.viewers.findIndex((v) => v.id === newId);
    if (index < 0 || !this.st) return;

    const count = this.viewers.length;
    // Land just past the slot's start, clear of the previous slide's wipe band.
    const progress = (index + 0.15) / count;
    const y = this.st.start + (this.st.end - this.st.start) * progress;

    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}
