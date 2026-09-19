import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Box, Layers, Sun, Sliders } from 'lucide-angular';

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

@Component({
  selector: 'app-hero-demo-viewer',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './hero-demo-viewer.html',
  styleUrl: './hero-demo-viewer.scss',
})
export class HeroDemoViewerComponent implements AfterViewInit, OnDestroy {
  readonly Box = Box;
  readonly Layers = Layers;
  readonly Sun = Sun;
  readonly Sliders = Sliders;

  readonly pointCloudDots = buildPointCloudDots();
  readonly solarRayPaths = SOLAR_RAY_PATHS;
  readonly godRays = GOD_RAYS;

  activeHighlight: string | null = 'dxf';
  attentionDotIndex = 0;

  @ViewChild('wallClipRect') wallClipRect!: ElementRef<SVGRectElement>;

  private dotIntervalId: ReturnType<typeof setInterval> | null = null;

  get activeSpecs(): TelemetrySpec {
    return TELEMETRY_DATA[this.activeHighlight || 'ifc'] || TELEMETRY_DATA['ifc'];
  }

  get floorPlanClass(): string {
    if (this.activeHighlight === 'dxf' || this.activeHighlight === 'ifc') return 'hdv-fp hdv-fp--bright';
    if (this.activeHighlight === 'pointcloud') return 'hdv-fp hdv-fp--pc';
    return 'hdv-fp hdv-fp--dim';
  }

  ngAfterViewInit(): void {
    this.dotIntervalId = setInterval(() => {
      this.attentionDotIndex = (this.attentionDotIndex + 1) % 4;
    }, 2500);
    this.updateWallClip();
  }

  ngOnDestroy(): void {
    if (this.dotIntervalId) clearInterval(this.dotIntervalId);
  }

  setHighlight(id: string | null): void {
    this.activeHighlight = id;
    this.updateWallClip();
  }

  private updateWallClip(): void {
    const rect = this.wallClipRect?.nativeElement;
    if (!rect) return;
    if (this.activeHighlight === 'ifc' || this.activeHighlight === 'rol') {
      rect.setAttribute('y', '7');
      rect.setAttribute('height', '336');
    } else {
      rect.setAttribute('y', '343');
      rect.setAttribute('height', '0');
    }
  }
}
