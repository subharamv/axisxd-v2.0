import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  LucideAngularModule,
  Activity,
  BarChart3,
  Box,
  Camera,
  Crosshair,
  Hexagon,
  Layers,
  Network,
  Sliders,
  Sun,
  type LucideIconData,
} from 'lucide-angular';

interface DockItem {
  label: string;
  group: 'Viewer' | 'Analysis';
  icon: LucideIconData;
  route: string;
  color: string;
}

/** Viewers and analyzers, in the same order the header menus list them. */
const ITEMS: DockItem[] = [
  { label: 'IFC Viewer', group: 'Viewer', icon: Box, route: '/viewer/ifc', color: '#3b82f6' },
  { label: 'Point Cloud', group: 'Viewer', icon: Sliders, route: '/viewer/point-cloud', color: '#0645fb' },
  { label: 'Pano 360°', group: 'Viewer', icon: Camera, route: '/viewer/pano', color: '#6366f1' },
  { label: 'CAD / DXF', group: 'Viewer', icon: Layers, route: '/viewer/cad', color: '#0ea5e9' },
  { label: '3D Mesh', group: 'Viewer', icon: Hexagon, route: '/viewer/mesh', color: '#8b5cf6' },
  { label: 'Digital Twin', group: 'Viewer', icon: Network, route: '/viewer/digital-twin', color: '#2563eb' },
  { label: 'Deviation Analyzer', group: 'Analysis', icon: Activity, route: '/analysis/deviation', color: '#10b981' },
  { label: 'Rights of Light', group: 'Analysis', icon: Sun, route: '/analysis/rol', color: '#f59e0b' },
  { label: 'Construction Monitoring', group: 'Analysis', icon: BarChart3, route: '/analysis/monitoring', color: '#06b6d4' },
  { label: 'Clash Detection', group: 'Analysis', icon: Crosshair, route: '/analysis/clash', color: '#f43f5e' },
];

/** How far the magnification reaches, and how much it lifts, in px. */
const REACH = 46;
const AMP = 0.85;
const LIFT = 26;

@Component({
  selector: 'app-tools-dock',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './tools-dock.html',
  styleUrl: './tools-dock.scss',
})
export class ToolsDockComponent implements AfterViewInit, OnDestroy {
  readonly items = ITEMS;

  @ViewChild('dockEl') dockEl!: ElementRef<HTMLElement>;
  @ViewChildren('itemEl') itemEls!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('hintEl') hintEl!: ElementRef<HTMLElement>;

  /** The prompt has done its job once the dock has been hovered. */
  private hintShown = true;

  constructor(
    private zone: NgZone,
    private router: Router,
  ) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      const dock = this.dockEl.nativeElement;
      dock.addEventListener('mousemove', this.onMove);
      dock.addEventListener('mouseleave', this.onLeave);
    });
  }

  ngOnDestroy(): void {
    const dock = this.dockEl?.nativeElement;
    dock?.removeEventListener('mousemove', this.onMove);
    dock?.removeEventListener('mouseleave', this.onLeave);
  }

  open(item: DockItem): void {
    this.router.navigateByUrl(item.route);
  }

  /** Each tile grows with a gaussian falloff from the cursor, the way the macOS dock does. */
  private onMove = (event: MouseEvent): void => {
    if (this.hintShown) {
      this.hintShown = false;
      this.hintEl?.nativeElement.classList.add('dock-hint--gone');
    }

    for (const ref of this.itemEls) {
      const el = ref.nativeElement;
      const rect = el.getBoundingClientRect();
      const dist = Math.abs(event.clientX - (rect.left + rect.width / 2));
      const scale = 1 + AMP * Math.exp(-((dist / REACH) ** 2));
      const grow = scale - 1;
      el.style.transform = `translateY(${-grow * LIFT}px) scale(${scale})`;
      el.style.zIndex = String(10 + Math.round(grow * 10));
      el.style.setProperty('--dock-label', grow > AMP * 0.72 ? '1' : '0');
    }
  };

  private onLeave = (): void => {
    for (const ref of this.itemEls) {
      const el = ref.nativeElement;
      el.style.transform = '';
      el.style.zIndex = '';
      el.style.setProperty('--dock-label', '0');
    }
  };
}
