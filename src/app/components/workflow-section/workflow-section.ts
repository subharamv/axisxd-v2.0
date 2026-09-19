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
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type GraphicKind = 'building' | 'iot' | 'analyze' | 'predict' | 'network';

interface WorkflowStep {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  kind: GraphicKind;
  nodeCount: number;
  connectDist: number;
}

interface V3 {
  x: number;
  y: number;
  z: number;
}

/** A structural line of the building. `tier` drives the bottom-up assembly reveal. */
interface Edge {
  a: V3;
  b: V3;
  tier: number;
  w: number;
  alpha: number;
  /** Furniture and stairs render in the solid brand blue rather than the themed tint. */
  accent?: boolean;
}

interface Face {
  pts: V3[];
  tier: number;
  alpha: number;
  accent?: boolean;
}

interface Marker {
  p: V3;
  tier: number;
}

interface Building {
  edges: Edge[];
  faces: Face[];
  markers: Marker[];
  tiers: number;
}

/** Synthetic scan point; dev is 0..1 deviation on the deviating wall, -1 elsewhere. */
interface CloudPt {
  p: V3;
  dev: number;
}

interface Brain {
  pts: { x: number; y: number }[];
  edges: [number, number][];
  folds: { x: number; y: number }[][];
  paths: number[][];
}

interface GraphNode {
  bx: number;
  by: number;
  phase: number;
  speed: number;
  r: number;
}

interface Graph {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  wrap: HTMLElement;
  step: WorkflowStep;
  nodes: GraphNode[];
  building?: Building;
  zones?: { temp: number }[];
  cloud?: CloudPt[];
  brain?: Brain;
  sc: number;
  oy: number;
  ox: number;
  width: number;
  height: number;
  progress: number;
  revealed: boolean;
  visible: boolean;
  spin: number;
  yaw: number;
  pitch: number;
  lastT: number;
  /** Hover zoom toward the clash: 0 wide, 1 close in. */
  focus: number;
  zoomK: number;
  fx: number;
  fy: number;
  mouse: { x: number; y: number; active: boolean };
}

const STEPS: WorkflowStep[] = [
  {
    id: 'visualize',
    title: 'Visualize',
    tagline: 'Build a complete digital view of reality',
    description:
      'Bring IFC/BIM models, point clouds, CAD drawings, 360° imagery, and 3D meshes into one georeferenced environment. Explore what exists, what was designed, and what is being built.',
    tags: ['BIM', 'LiDAR', 'CAD', '360°', '3D Mesh'],
    kind: 'building',
    nodeCount: 0,
    connectDist: 0,
  },
  {
    id: 'connect',
    title: 'Connect',
    tagline: 'Bring the live world into the model',
    description:
      'Connect your digital environment with IoT sensors, SCADA, operational systems, project data, and other information sources to create a connected representation of the physical asset.',
    tags: ['IoT', 'SCADA', 'Operations', 'Project Data', 'Live Data'],
    kind: 'iot',
    nodeCount: 14,
    connectDist: 0.24,
  },
  {
    id: 'analyze',
    title: 'Analyze',
    tagline: 'Turn spatial data into actionable insight',
    description:
      'Compare design with reality, detect deviations and clashes, monitor construction progress, assess conditions, and understand relationships between assets, locations, and data.',
    tags: ['Deviation', 'Clash Detection', 'Progress', 'Inspection', 'Asset Analysis'],
    kind: 'analyze',
    nodeCount: 16,
    connectDist: 0.3,
  },
  {
    id: 'predict',
    title: 'Predict',
    tagline: 'Turn intelligence into foresight',
    description:
      'Combine historical and live data with analytics to identify patterns, detect changing conditions, and support earlier, more informed decisions across the asset lifecycle.',
    tags: ['Trends', 'Anomalies', 'Risk', 'Forecasting', 'Decision Intelligence'],
    kind: 'predict',
    nodeCount: 0,
    connectDist: 0.36,
  },
];

/* Building envelope, in model units. Y grows upward, the model is centred on the origin. */
const HW = 1.0; // half width  (x)
const HD = 0.6; // half depth  (z)
const Y0 = -0.46; // ground slab
const Y1 = 0; // first floor slab
const Y2 = 0.46; // roof slab
const TIERS = 5;

const v3 = (x: number, y: number, z: number): V3 => ({ x, y, z });

@Component({
  selector: 'app-workflow-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workflow-section.html',
  styleUrl: './workflow-section.scss',
})
export class WorkflowSectionComponent implements AfterViewInit, OnDestroy {
  readonly steps = STEPS;

  @ViewChild('sectionEl') sectionEl!: ElementRef<HTMLElement>;
  @ViewChildren('graphWrap') graphWraps!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('graphCanvas') graphCanvases!: QueryList<ElementRef<HTMLCanvasElement>>;
  @ViewChildren('cardEl') cardEls!: QueryList<ElementRef<HTMLElement>>;

  private graphs: Graph[] = [];
  private rafId = 0;
  private startTime = 0;
  private isDark = false;
  private io?: IntersectionObserver;
  private themeObserver?: MutationObserver;
  private resizeObservers: ResizeObserver[] = [];
  private ctx?: gsap.Context;

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.isDark = document.documentElement.classList.contains('dark');
    this.watchTheme();
    this.setupGraphs();
    this.setupReveal();
    this.setupCardAnimations();
    this.startLoop();
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.io?.disconnect();
    this.themeObserver?.disconnect();
    this.resizeObservers.forEach((ro) => ro.disconnect());
    this.graphs.forEach((g) => g.zones?.forEach((z) => gsap.killTweensOf(z)));
    this.ctx?.revert();
  }

  /** Each room wanders to a new temperature so the heatmap keeps shifting. */
  private driftTemp(z: { temp: number }): void {
    gsap.to(z, {
      temp: Math.random(),
      duration: 2.5 + Math.random() * 2.5,
      ease: 'sine.inOut',
      onComplete: () => this.driftTemp(z),
    });
  }

  private watchTheme(): void {
    this.zone.runOutsideAngular(() => {
      this.themeObserver = new MutationObserver(() => {
        this.isDark = document.documentElement.classList.contains('dark');
      });
      this.themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });
    });
  }

  private setupGraphs(): void {
    const canvases = this.graphCanvases.toArray();
    const wraps = this.graphWraps.toArray();

    this.steps.forEach((step, i) => {
      const canvasRef = canvases[i];
      const wrapRef = wraps[i];
      if (!canvasRef || !wrapRef) return;

      const canvas = canvasRef.nativeElement;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const graph: Graph = {
        canvas,
        ctx,
        wrap: wrapRef.nativeElement,
        step,
        nodes:
          step.kind === 'network'
            ? Array.from({ length: step.nodeCount }, () => ({
                bx: 0.1 + Math.random() * 0.8,
                by: 0.14 + Math.random() * 0.72,
                phase: Math.random() * Math.PI * 2,
                speed: 0.15 + Math.random() * 0.25,
                r: 1.6 + Math.random() * 1.6,
              }))
            : [],
        building: step.kind === 'building' ? this.buildModel() : undefined,
        zones:
          step.kind === 'iot' || step.kind === 'analyze' || step.kind === 'predict'
            ? [0.12, 0.5, 0.88, 0.35, 0.72, 0.22].map((temp) => ({ temp }))
            : undefined,
        cloud: step.kind === 'analyze' ? this.buildCloud() : undefined,
        brain: step.kind === 'predict' ? this.buildBrain() : undefined,
        sc: step.kind === 'analyze' ? 0.74 : step.kind === 'predict' ? 0.7 : 1,
        oy: step.kind === 'analyze' ? 0.12 : step.kind === 'predict' ? 0.2 : 0,
        ox: step.kind === 'predict' ? -0.02 : 0,
        width: 0,
        height: 0,
        progress: 0,
        revealed: false,
        visible: false,
        spin: -0.55,
        yaw: -0.55,
        pitch: 0.3,
        lastT: 0,
        focus: 0,
        zoomK: 1,
        fx: 0,
        fy: 0,
        mouse: { x: 0.5, y: 0.5, active: false },
      };

      this.graphs.push(graph);
      if (step.kind === 'iot') graph.zones?.forEach((z) => this.driftTemp(z));

      this.zone.runOutsideAngular(() => {
        const ro = new ResizeObserver(() => this.resizeGraph(graph));
        ro.observe(graph.wrap);
        this.resizeObservers.push(ro);
      });

      this.resizeGraph(graph);
    });
  }

  /* ── Two-storey IFC/BIM style model ───────────────────────────────
     Assembled bottom-up: slab → columns → floor slab → columns → roof,
     so the reveal reads like a building being modelled.            */
  private buildModel(): Building {
    const edges: Edge[] = [];
    const faces: Face[] = [];
    const markers: Marker[] = [];

    const slab = (y: number, tier: number) => {
      const c = [v3(-HW, y, -HD), v3(HW, y, -HD), v3(HW, y, HD), v3(-HW, y, HD)];
      faces.push({ pts: c, tier, alpha: 0.07 });
      for (let i = 0; i < 4; i++) {
        edges.push({ a: c[i], b: c[(i + 1) % 4], tier, w: 1.25, alpha: 0.95 });
      }
      // Structural grid lines across the slab
      edges.push({ a: v3(0, y, -HD), b: v3(0, y, HD), tier, w: 0.7, alpha: 0.4 });
      edges.push({ a: v3(-HW, y, 0), b: v3(HW, y, 0), tier, w: 0.7, alpha: 0.4 });
      for (const x of [-HW, 0, HW]) {
        for (const z of [-HD, HD]) markers.push({ p: v3(x, y, z), tier });
      }
    };

    const storey = (yLow: number, yHigh: number, tier: number) => {
      // Columns on a 3 × 2 grid
      for (const x of [-HW, 0, HW]) {
        for (const z of [-HD, HD]) {
          edges.push({ a: v3(x, yLow, z), b: v3(x, yHigh, z), tier, w: 1.1, alpha: 0.85 });
        }
      }
      // Glazed facade panels, kept faint so the structure stays readable
      faces.push({
        pts: [v3(-HW, yLow, HD), v3(HW, yLow, HD), v3(HW, yHigh, HD), v3(-HW, yHigh, HD)],
        tier,
        alpha: 0.05,
      });
      faces.push({
        pts: [v3(-HW, yLow, -HD), v3(HW, yLow, -HD), v3(HW, yHigh, -HD), v3(-HW, yHigh, -HD)],
        tier,
        alpha: 0.05,
      });
      faces.push({
        pts: [v3(-HW, yLow, -HD), v3(-HW, yLow, HD), v3(-HW, yHigh, HD), v3(-HW, yHigh, -HD)],
        tier,
        alpha: 0.04,
      });
      faces.push({
        pts: [v3(HW, yLow, -HD), v3(HW, yLow, HD), v3(HW, yHigh, HD), v3(HW, yHigh, -HD)],
        tier,
        alpha: 0.04,
      });
    };

    /** Window opening on a facade plane, drawn as an outlined quad. */
    const window4 = (pts: V3[], tier: number) => {
      faces.push({ pts, tier, alpha: 0.16 });
      for (let i = 0; i < 4; i++) {
        edges.push({ a: pts[i], b: pts[(i + 1) % 4], tier, w: 0.8, alpha: 0.7 });
      }
    };

    const frontWindows = (yLow: number, yHigh: number, tier: number) => {
      const yb = yLow + (yHigh - yLow) * 0.3;
      const yt = yLow + (yHigh - yLow) * 0.78;
      const z = HD + 0.004;
      for (const cx of [-0.62, -0.2, 0.2, 0.62]) {
        window4(
          [v3(cx - 0.14, yb, z), v3(cx + 0.14, yb, z), v3(cx + 0.14, yt, z), v3(cx - 0.14, yt, z)],
          tier,
        );
      }
      // Side glazing
      for (const sx of [-HW - 0.004, HW + 0.004]) {
        for (const cz of [-0.28, 0.28]) {
          window4(
            [
              v3(sx, yb, cz - 0.13),
              v3(sx, yb, cz + 0.13),
              v3(sx, yt, cz + 0.13),
              v3(sx, yt, cz - 0.13),
            ],
            tier,
          );
        }
      }
    };

    /** Interior partition wall — the detail that makes it read as IFC, not a box. */
    const partition = (x: number, zFrom: number, zTo: number, yLow: number, yHigh: number, tier: number) => {
      const pts = [v3(x, yLow, zFrom), v3(x, yLow, zTo), v3(x, yHigh, zTo), v3(x, yHigh, zFrom)];
      faces.push({ pts, tier, alpha: 0.08 });
      for (let i = 0; i < 4; i++) {
        edges.push({ a: pts[i], b: pts[(i + 1) % 4], tier, w: 0.7, alpha: 0.5 });
      }
    };

    /** Solid brand-blue box used for every piece of furniture. */
    const box = (
      cx: number,
      cz: number,
      yBase: number,
      sx: number,
      sy: number,
      sz: number,
      tier: number,
      alpha = 0.8,
    ) => {
      const x0 = cx - sx / 2;
      const x1 = cx + sx / 2;
      const z0 = cz - sz / 2;
      const z1 = cz + sz / 2;
      const y1 = yBase + sy;
      const lo = [v3(x0, yBase, z0), v3(x1, yBase, z0), v3(x1, yBase, z1), v3(x0, yBase, z1)];
      const hi = lo.map((p) => v3(p.x, y1, p.z));
      faces.push({ pts: hi, tier, alpha: 0.3, accent: true });
      for (let i = 0; i < 4; i++) {
        const j = (i + 1) % 4;
        faces.push({ pts: [lo[i], lo[j], hi[j], hi[i]], tier, alpha: 0.16, accent: true });
        edges.push({ a: lo[i], b: lo[j], tier, w: 0.7, alpha, accent: true });
        edges.push({ a: hi[i], b: hi[j], tier, w: 0.7, alpha, accent: true });
        edges.push({ a: lo[i], b: hi[i], tier, w: 0.7, alpha, accent: true });
      }
    };

    /** Desk with a chair behind it, facing +z. */
    const desk = (cx: number, cz: number, yBase: number, tier: number) => {
      box(cx, cz, yBase + 0.1, 0.26, 0.02, 0.14, tier); // top
      for (const dx of [-0.11, 0.11]) {
        for (const dz of [-0.05, 0.05]) {
          box(cx + dx, cz + dz, yBase, 0.015, 0.1, 0.015, tier, 0.5); // legs
        }
      }
      box(cx, cz + 0.14, yBase + 0.05, 0.1, 0.02, 0.1, tier, 0.6); // seat
      box(cx, cz + 0.18, yBase + 0.07, 0.1, 0.09, 0.02, tier, 0.6); // back
    };

    const furnishGround = (tier: number) => {
      // Reception counter and waiting sofa in the entrance bay
      box(0.45, 0.3, Y0, 0.42, 0.14, 0.12, tier);
      box(0.72, -0.05, Y0, 0.12, 0.09, 0.3, tier, 0.6);
      box(0.1, -0.3, Y0, 0.3, 0.1, 0.13, tier, 0.7);
      // Meeting table with chairs behind the partition
      box(-0.62, -0.28, Y0 + 0.11, 0.3, 0.02, 0.18, tier);
      for (const dx of [-0.17, 0.17]) box(-0.62 + dx, -0.28, Y0, 0.09, 0.11, 0.09, tier, 0.55);
      // Planters flanking the stair
      box(-0.18, 0.42, Y0, 0.08, 0.13, 0.08, tier, 0.6);
    };

    const furnishUpper = (tier: number) => {
      // Open-plan desk bank
      desk(-0.62, -0.26, Y1, tier);
      desk(-0.24, -0.26, Y1, tier);
      desk(0.14, -0.26, Y1, tier);
      // Break-out area
      box(0.62, 0.26, Y1, 0.34, 0.1, 0.16, tier, 0.7); // sofa
      box(0.62, 0.02, Y1 + 0.08, 0.16, 0.02, 0.12, tier); // coffee table
      box(-0.5, 0.3, Y1, 0.1, 0.16, 0.1, tier, 0.6); // cabinet
    };

    const stairs = (tier: number) => {
      const steps = 7;
      const xL = -0.74;
      const xR = -0.4;
      const zA = -0.34;
      const zB = 0.3;
      for (let i = 0; i < steps; i++) {
        const y = Y0 + ((Y1 - Y0) * i) / steps;
        const yNext = Y0 + ((Y1 - Y0) * (i + 1)) / steps;
        const z = zA + ((zB - zA) * i) / steps;
        const zNext = zA + ((zB - zA) * (i + 1)) / steps;
        for (const x of [xL, xR]) {
          edges.push({ a: v3(x, y, z), b: v3(x, yNext, z), tier, w: 0.8, alpha: 0.75, accent: true });
          edges.push({ a: v3(x, yNext, z), b: v3(x, yNext, zNext), tier, w: 0.8, alpha: 0.75, accent: true });
        }
        edges.push({ a: v3(xL, yNext, z), b: v3(xR, yNext, z), tier, w: 0.8, alpha: 0.6, accent: true });
      }
    };

    // Site grid — the georeferenced context the copy talks about
    for (let i = -3; i <= 3; i++) {
      const x = (i / 3) * 1.55;
      edges.push({ a: v3(x, Y0, -1.05), b: v3(x, Y0, 1.05), tier: 0, w: 0.5, alpha: 0.14 });
    }
    for (let i = -2; i <= 2; i++) {
      const z = (i / 2) * 1.05;
      edges.push({ a: v3(-1.55, Y0, z), b: v3(1.55, Y0, z), tier: 0, w: 0.5, alpha: 0.14 });
    }

    slab(Y0, 0);
    storey(Y0, Y1, 1);
    furnishGround(2);
    partition(-0.3, -HD, 0.08, Y0, Y1, 1);
    frontWindows(Y0, Y1, 2);
    stairs(2);
    slab(Y1, 2);
    storey(Y1, Y2, 3);
    partition(0.32, -0.05, HD, Y1, Y2, 3);
    frontWindows(Y1, Y2, 4);
    furnishUpper(4);
    slab(Y2, 4);

    // Roof parapet
    const pY = Y2 + 0.07;
    const inset = 0.04;
    const p = [
      v3(-HW + inset, pY, -HD + inset),
      v3(HW - inset, pY, -HD + inset),
      v3(HW - inset, pY, HD - inset),
      v3(-HW + inset, pY, HD - inset),
    ];
    for (let i = 0; i < 4; i++) {
      edges.push({ a: p[i], b: p[(i + 1) % 4], tier: 4, w: 0.9, alpha: 0.6 });
      edges.push({
        a: v3(p[i].x, Y2, p[i].z),
        b: p[i],
        tier: 4,
        w: 0.7,
        alpha: 0.45,
      });
    }

    return { edges, faces, markers, tiers: TIERS };
  }

  private resizeGraph(graph: Graph): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = graph.wrap.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));

    graph.width = width;
    graph.height = height;
    graph.canvas.width = width * dpr;
    graph.canvas.height = height * dpr;
    graph.canvas.style.width = `${width}px`;
    graph.canvas.style.height = `${height}px`;
    graph.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /** Drives both the draw loop gate and the one-shot assembly animation. */
  private setupReveal(): void {
    this.zone.runOutsideAngular(() => {
      this.io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const graph = this.graphs.find((g) => g.wrap === entry.target);
            if (!graph) continue;
            graph.visible = entry.isIntersecting;
            if (entry.isIntersecting && !graph.revealed) {
              graph.revealed = true;
              const obj = { p: 0 };
              gsap.to(obj, {
                p: 1,
                duration: graph.step.kind === 'building' ? 2.2 : 1.4,
                delay: 0.1,
                ease: 'power2.out',
                onUpdate: () => {
                  graph.progress = obj.p;
                },
              });
            }
          }
        },
        { threshold: 0.12 },
      );
      this.graphs.forEach((g) => this.io?.observe(g.wrap));
    });
  }

  private setupCardAnimations(): void {
    this.ctx = gsap.context(() => {
      gsap.from('.wf-heading', {
        scrollTrigger: { trigger: '.wf-heading', start: 'top 85%', once: true },
        opacity: 0,
        y: 36,
        duration: 0.9,
        ease: 'power4.out',
      });

      this.cardEls.toArray().forEach((cardRef, i) => {
        gsap.from(cardRef.nativeElement, {
          scrollTrigger: { trigger: cardRef.nativeElement, start: 'top 88%', once: true },
          opacity: 0,
          y: 32,
          duration: 0.7,
          delay: i * 0.08,
          ease: 'power3.out',
        });
      });

      gsap.from('.wf-flow', {
        scrollTrigger: { trigger: '.wf-flow', start: 'top 90%', once: true },
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: 'power3.out',
      });
    }, this.sectionEl.nativeElement);
  }

  private startLoop(): void {
    this.startTime = performance.now();
    this.zone.runOutsideAngular(() => {
      const loop = () => {
        this.rafId = requestAnimationFrame(loop);
        const t = (performance.now() - this.startTime) / 1000;
        for (const graph of this.graphs) {
          if (!graph.visible) continue;
          if (graph.step.kind === 'building') this.drawBuilding(graph, t);
          else if (graph.step.kind === 'iot') this.drawIot(graph, t);
          else if (graph.step.kind === 'analyze') this.drawIot(graph, t, true);
          else if (graph.step.kind === 'predict') this.drawIot(graph, t, true, true);
          else this.drawNetwork(graph, t);
        }
      };
      this.rafId = requestAnimationFrame(loop);
    });
  }

  /* ── 3D renderer ── */

  private project(
    p: V3,
    graph: Graph,
  ): { x: number; y: number; d: number } {
    const cy = Math.cos(graph.yaw);
    const sy = Math.sin(graph.yaw);
    const x1 = p.x * cy - p.z * sy;
    const z1 = p.x * sy + p.z * cy;

    // Positive pitch looks down on the model, the usual BIM three-quarter view.
    const cx = Math.cos(graph.pitch);
    const sx = Math.sin(graph.pitch);
    const y1 = p.y * cx + z1 * sx;
    const z2 = z1 * cx - p.y * sx;

    const camZ = 3.4;
    const d = camZ + z2;
    const f = 2.9 / d;
    const s = Math.min(graph.width / 2.5, graph.height / 1.6) * graph.sc;

    const ax = graph.width / 2 + graph.width * graph.ox;
    const ay = graph.height / 2 - graph.height * graph.oy;
    const x = ax + x1 * f * s;
    const y = ay - y1 * f * s;
    if (graph.zoomK <= 1.001 || graph.focus <= 0.001) return { x, y, d };
    // Pan and scale both ride on focus, so the transform is the identity at focus 0
    // — pinning the focus point outright would make the model jump as the zoom engages.
    const panX = x + (ax - graph.fx) * graph.focus;
    const panY = y + (ay - graph.fy) * graph.focus;
    return {
      x: ax + (panX - ax) * graph.zoomK,
      y: ay + (panY - ay) * graph.zoomK,
      d,
    };
  }

  private drawBuilding(graph: Graph, t: number): void {
    const { ctx, width, height, building, progress } = graph;
    if (!building || width === 0 || height === 0) return;

    this.updateCamera(graph, t);

    ctx.clearRect(0, 0, width, height);
    if (progress <= 0.001) return;

    {
      // Hovering pulls the camera in on the furnished ground-floor reception
      graph.zoomK = 1;
      const fp = this.project(v3(0.45, Y0 + 0.07, 0.3), graph);
      graph.fx = fp.x;
      graph.fy = fp.y;
      graph.zoomK = 1 + graph.focus * 1.15;
    }

    const reveal = (tier: number) =>
      Math.max(0, Math.min(1, progress * building.tiers - tier));

    // Faces first, far to near, so the wireframe always reads on top.
    const faces = building.faces
      .map((face) => {
        const pts = face.pts.map((p) => this.project(p, graph));
        const depth = pts.reduce((sum, p) => sum + p.d, 0) / pts.length;
        return { face, pts, depth };
      })
      .sort((a, b) => b.depth - a.depth);

    for (const { face, pts } of faces) {
      const r = reveal(face.tier);
      if (r <= 0) continue;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.closePath();
      ctx.fillStyle = face.accent ? `rgba(6, 69, 251, ${face.alpha * r})` : this.brand(face.alpha * r);
      ctx.fill();
    }

    for (const edge of building.edges) {
      const r = reveal(edge.tier);
      if (r <= 0) continue;
      const eased = 1 - Math.pow(1 - r, 3);
      const a = this.project(edge.a, graph);
      // Members grow out of their start point as the model assembles.
      const grow = v3(
        edge.a.x + (edge.b.x - edge.a.x) * eased,
        edge.a.y + (edge.b.y - edge.a.y) * eased,
        edge.a.z + (edge.b.z - edge.a.z) * eased,
      );
      const b = this.project(grow, graph);
      const fade = Math.max(0.4, Math.min(1, 1.6 - (a.d + b.d) / 2 / 3.4));

      ctx.beginPath();
      ctx.strokeStyle = edge.accent
        ? `rgba(6, 69, 251, ${Math.min(1, edge.alpha * fade * r * 1.5)})`
        : this.brand(edge.alpha * fade * r);
      ctx.lineWidth = edge.w;
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }

  /** Idle turntable; the cursor takes over the camera while it is on the canvas. */
  private updateCamera(graph: Graph, t: number, basePitch = 0.3): void {
    const dt = Math.min(0.05, graph.lastT ? t - graph.lastT : 0.016);
    graph.lastT = t;
    const hovering = graph.mouse.active;
    // Pulls in gently, returns briskly so leaving the card settles without a long tail
    graph.focus += ((hovering ? 1 : 0) - graph.focus) * Math.min(1, dt * (hovering ? 3.5 : 6));
    if (graph.focus < 0.002) graph.focus = 0;

    if (hovering) {
      // Orbit gain drops as the camera closes in, so a zoomed model does not swing about
      const gain = 1 - 0.55 * graph.focus;
      const targetYaw = -0.55 + (graph.mouse.x - 0.5) * 1.6 * gain;
      const targetPitch = basePitch + (0.5 - graph.mouse.y) * 0.45 * gain;
      graph.yaw += (targetYaw - graph.yaw) * Math.min(1, dt * 6);
      graph.pitch += (targetPitch - graph.pitch) * Math.min(1, dt * 6);
      graph.spin = graph.yaw;
    } else {
      // The turntable only picks up again once the camera has pulled back out
      graph.spin += dt * 0.22 * (1 - graph.focus);
      graph.yaw += (graph.spin - graph.yaw) * Math.min(1, dt * 6);
      graph.pitch += (basePitch - graph.pitch) * Math.min(1, dt * 6);
    }
  }

  /* ── IoT floor: partitioned rooms, rectangular HVAC ducts, wireless sensors ── */
  private drawIot(graph: Graph, t: number, analyze = false, predict = false): void {
    const { ctx, width, height, progress, zones: temps } = graph;
    if (!temps || width === 0 || height === 0) return;
    this.updateCamera(graph, t, analyze ? 0.5 : 0.62);
    ctx.clearRect(0, 0, width, height);
    if (progress <= 0.001) return;
    {
      // Hovering pulls the camera in: on the duct/beam clash, or on the front-centre sensor
      const focusPt = analyze ? v3(0.55, 0.27, 0) : v3(0, -0.15, 0.3);
      graph.zoomK = 1;
      const fp = this.project(focusPt, graph);
      graph.fx = fp.x;
      graph.fy = fp.y;
      graph.zoomK = 1 + graph.focus * 1.15;
    }
    if (predict) this.drawBrainBackdrop(graph, t);

    const FY = -0.25;
    const CY = 0.25;
    const DY = CY + 0.02; // duct centreline
    const P = (p: V3) => this.project(p, graph);
    const clamp = (a: number) => Math.max(0, Math.min(1, a));
    // Sensors always use the exact brand blue so they pop on the grey in dark mode
    const sensor = (a: number) => `rgba(6, 69, 251, ${clamp(a)})`;
    // green (cool) → yellow → red (hot)
    const heat = (temp: number, a: number) =>
      `hsla(${Math.round(130 - 130 * temp)}, 85%, 50%, ${clamp(a)})`;

    const line = (
      a: V3,
      b: V3,
      alpha: number,
      w = 1,
      col: (x: number) => string = (x) => this.brand(x),
    ) => {
      const pa = P(a);
      const pb = P(b);
      ctx.beginPath();
      ctx.strokeStyle = col(alpha * progress);
      ctx.lineWidth = w;
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.stroke();
    };

    const quad = (pts: V3[], fill: string, strokeAlpha = 0) => {
      const q = pts.map(P);
      ctx.beginPath();
      ctx.moveTo(q[0].x, q[0].y);
      for (let i = 1; i < q.length; i++) ctx.lineTo(q[i].x, q[i].y);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      if (strokeAlpha > 0) {
        ctx.strokeStyle = this.brand(strokeAlpha * progress);
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    };

    /** Rectangular duct: an axis-aligned box from a to b with a w × h cross-section. */
    const duct = (
      a: V3,
      b: V3,
      w: number,
      h: number,
      alpha: number,
      col: (x: number) => string = (x) => this.brand(x),
    ) => {
      const alongX = Math.abs(b.x - a.x) > 1e-6;
      const alongZ = Math.abs(b.z - a.z) > 1e-6;
      const ex = alongX || alongZ ? v3(0, h / 2, 0) : v3(w / 2, 0, 0);
      const ey = alongX ? v3(0, 0, w / 2) : alongZ ? v3(w / 2, 0, 0) : v3(0, 0, w / 2);
      const ring = (p: V3): V3[] =>
        [
          [-1, -1],
          [1, -1],
          [1, 1],
          [-1, 1],
        ].map(([i, j]) =>
          v3(p.x + ex.x * i + ey.x * j, p.y + ex.y * i + ey.y * j, p.z + ex.z * i + ey.z * j),
        );
      const r0 = ring(a);
      const r1 = ring(b);
      const faces: V3[][] = [r0, r1];
      for (let k = 0; k < 4; k++) faces.push([r0[k], r0[(k + 1) % 4], r1[(k + 1) % 4], r1[k]]);

      faces
        .map((f) => {
          const q = f.map(P);
          return { f, d: q.reduce((s, p) => s + p.d, 0) / q.length };
        })
        .sort((x, y) => y.d - x.d)
        .forEach(({ f }) => quad(f, col(alpha * 0.22 * progress)));

      for (let k = 0; k < 4; k++) {
        line(r0[k], r0[(k + 1) % 4], alpha, 1, col);
        line(r1[k], r1[(k + 1) % 4], alpha, 1, col);
        line(r0[k], r1[k], alpha, 1, col);
      }
    };

    // 3 × 2 rooms; each carries its own temperature, tweened by gsap
    const xs = [-HW, -HW / 3, HW / 3, HW];
    const zs = [-HD, 0, HD];
    const rooms = temps.map((z, i) => {
      const c = i % 3;
      const r = Math.floor(i / 3);
      return {
        x0: xs[c],
        x1: xs[c + 1],
        z0: zs[r],
        z1: zs[r + 1],
        cx: (xs[c] + xs[c + 1]) / 2,
        cz: (zs[r] + zs[r + 1]) / 2,
        temp: z.temp,
      };
    });

    // Floor slab under the heat map, as in the Visualize model: site grid, slab edges and columns
    const SY = FY - 0.06;
    for (let i = -3; i <= 3; i++) {
      const x = (i / 3) * 1.55;
      line(v3(x, SY, -1.05), v3(x, SY, 1.05), 0.14, 0.5);
    }
    for (let i = -2; i <= 2; i++) {
      const z = (i / 2) * 1.05;
      line(v3(-1.55, SY, z), v3(1.55, SY, z), 0.14, 0.5);
    }
    const slabPts = [v3(-HW, SY, -HD), v3(HW, SY, -HD), v3(HW, SY, HD), v3(-HW, SY, HD)];
    quad(slabPts, this.brand(0.07 * progress));
    for (let i = 0; i < 4; i++) {
      const a = slabPts[i];
      const b = slabPts[(i + 1) % 4];
      line(a, b, 0.95, 1.25);
      line(v3(a.x, SY, a.z), v3(a.x, FY, a.z), 0.7, 1); // slab thickness
      line(v3(a.x, FY, a.z), v3(b.x, FY, b.z), 0.6, 1); // floor edge
    }
    line(v3(0, SY, -HD), v3(0, SY, HD), 0.4, 0.7);
    line(v3(-HW, SY, 0), v3(HW, SY, 0), 0.4, 0.7);
    for (const x of [-HW, 0, HW]) {
      for (const z of [-HD, HD]) line(v3(x, FY, z), v3(x, CY, z), 0.85, 1.1); // columns on the 3 × 2 grid
    }

    // Heat-map floor: a fine grid of separated cells whose temperature blends smoothly
    // between the room temperatures (Gaussian falloff from each room centre) plus a
    // little drifting noise, so it reads as a real thermal map rather than flat rooms.
    const NX = 60;
    const NZ = 36;
    const cw = (2 * HW) / NX;
    const cd = (2 * HD) / NZ;
    const LEVELS = 12;
    const sigma2 = 2 * (HW * 0.36) * (HW * 0.36);
    if (analyze) {
      quad([v3(-HW, FY, -HD), v3(HW, FY, -HD), v3(HW, FY, HD), v3(-HW, FY, HD)], this.brand(0.05 * progress));
    }
    for (let j = 0; !analyze && j < NZ; j++) {
      for (let i = 0; i < NX; i++) {
        const cx = -HW + (i + 0.5) * cw;
        const cz = -HD + (j + 0.5) * cd;
        let sum = 0;
        let wsum = 0;
        for (const r of rooms) {
          const w = Math.exp(-((cx - r.cx) ** 2 + (cz - r.cz) ** 2) / sigma2);
          sum += w * r.temp;
          wsum += w;
        }
        const noise = 0.06 * Math.sin(t * 1.3 + i * 1.7 + j * 2.3) + 0.04 * Math.sin(t * 0.8 - i * 0.9 + j * 1.1);
        const temp = Math.round(clamp(sum / wsum + noise) * LEVELS) / LEVELS; // quantised for a blocky pixel look
        const x0 = cx - cw / 2;
        const x1 = cx + cw / 2;
        const z0 = cz - cd / 2;
        const z1 = cz + cd / 2;
        const color = heat(temp, 0.92 * progress);
        quad([v3(x0, FY, z0), v3(x1, FY, z0), v3(x1, FY, z1), v3(x0, FY, z1)], color);
        // hairline in the same colour hides anti-aliasing seams between neighbouring tiles
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
    for (const r of rooms) {
      quad(
        [v3(r.x0, FY, r.z0), v3(r.x1, FY, r.z0), v3(r.x1, FY, r.z1), v3(r.x0, FY, r.z1)],
        'rgba(0,0,0,0)',
        0.45,
      );
    }

    // Partition walls and outer shell
    const wall = (a: V3, b: V3) => {
      quad([v3(a.x, FY, a.z), v3(b.x, FY, b.z), v3(b.x, CY, b.z), v3(a.x, CY, a.z)],
        analyze ? `rgba(6, 69, 251, ${0.2 * progress})` : this.brand(0.05 * progress),
        0.3,
      );
    };
    wall(v3(xs[1], 0, -HD), v3(xs[1], 0, HD));
    wall(v3(xs[2], 0, -HD), v3(xs[2], 0, HD));
    wall(v3(-HW, 0, 0), v3(HW, 0, 0));
    const corners = [v3(-HW, 0, -HD), v3(HW, 0, -HD), v3(HW, 0, HD), v3(-HW, 0, HD)];
    corners.forEach((c, i) => {
      const n = corners[(i + 1) % 4];
      line(v3(c.x, FY, c.z), v3(c.x, CY, c.z), 0.6);
      line(v3(c.x, CY, c.z), v3(n.x, CY, n.z), 0.4, 0.9);
    });

    // HVAC: air handler → supply trunk → branches → dampers → ceiling diffusers
    const load = rooms.reduce((s, r) => s + r.temp, 0) / rooms.length;
    const ahuEnd = v3(-HW - 0.22, DY, 0);
    duct(v3(-HW - 0.52, DY, 0), ahuEnd, 0.3, 0.2, 0.85);
    duct(ahuEnd, v3(HW - 0.08, DY, 0), 0.1, 0.1, 0.45 + 0.4 * load);

    const paths: { pts: V3[]; temp: number }[] = [];
    for (const r of rooms) {
      const a = 0.4 + 0.45 * r.temp;
      duct(v3(r.cx - 0.05, DY, 0), v3(r.cx + 0.05, DY, 0), 0.14, 0.14, 0.7); // damper
      duct(v3(r.cx, DY, 0), v3(r.cx, DY, r.cz), 0.06, 0.06, a);
      duct(v3(r.cx, DY, r.cz), v3(r.cx, CY - 0.04, r.cz), 0.06, 0.06, a);
      duct(v3(r.cx - 0.1, CY - 0.05, r.cz), v3(r.cx + 0.1, CY - 0.05, r.cz), 0.2, 0.02, a); // diffuser
      paths.push({
        pts: [ahuEnd, v3(r.cx, DY, 0), v3(r.cx, DY, r.cz), v3(r.cx, CY - 0.05, r.cz)],
        temp: r.temp,
      });
    }

    // Airflow runs faster and brighter into hot rooms
    for (const path of paths) {
      for (let k = 0; k < 4; k++) {
        const f = (t * (0.16 + 0.3 * path.temp) + k / 4) % 1;
        const seg = f * (path.pts.length - 1);
        const i = Math.min(path.pts.length - 2, Math.floor(seg));
        const u = seg - i;
        const a = path.pts[i];
        const b = path.pts[i + 1];
        const p = P(v3(a.x + (b.x - a.x) * u, a.y + (b.y - a.y) * u, a.z + (b.z - a.z) * u));
        ctx.beginPath();
        ctx.fillStyle = this.brand((0.55 + 0.4 * path.temp) * progress);
        ctx.arc(p.x, p.y, 1.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (analyze) {
      // Structural beam crossing the supply trunk: the clash
      duct(v3(0.55, DY, -HD + 0.02), v3(0.55, DY, HD - 0.02), 0.08, 0.14, 0.55);
      const red = (x: number) => `rgba(239, 68, 68, ${clamp(x)})`;
      duct(v3(0.47, DY, 0), v3(0.63, DY, 0), 0.18, 0.18, 0.55 + 0.45 * Math.sin(t * 4), red);
      const cp = P(v3(0.55, DY, 0));
      ctx.beginPath();
      ctx.fillStyle = red(0.2 * progress);
      ctx.arc(cp.x, cp.y, 9, 0, Math.PI * 2);
      ctx.fill();

      if (predict) {
        this.drawPredictOverlay(graph, t, P(v3(-0.55, FY + 0.1, 0.3)));
        return;
      }

      // Front wall deviation as a pixel heatmap, same tiles and palette as the Connect floor
      const drawWall = () => {
        const NX = 24;
        const NY = 6;
        const LEVELS = 7;
        const cw = (2 * HW) / NX;
        const ch = (CY - FY) / NY;
        for (let j = 0; j < NY; j++) {
          for (let i = 0; i < NX; i++) {
            const x = -HW + (i + 0.5) * cw;
            const y = FY + (j + 0.5) * ch;
            const base = Math.exp(-(((x - 0.25) / 0.45) ** 2) - ((y - 0.02) / 0.3) ** 2);
            const noise = 0.06 * Math.sin(t * 1.3 + i * 1.7 + j * 2.3) + 0.04 * Math.sin(t * 0.8 - i * 0.9 + j * 1.1);
            const dev = Math.round(clamp(base + noise) * LEVELS) / LEVELS;
            const z = HD + base * 0.06;
            const color = heat(dev, 0.3 * progress);
            quad(
              [
                v3(x - cw / 2, y - ch / 2, z),
                v3(x + cw / 2, y - ch / 2, z),
                v3(x + cw / 2, y + ch / 2, z),
                v3(x - cw / 2, y + ch / 2, z),
              ],
              color,
            );
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      };
      // Paint it before the scan when the wall faces away from the camera, after it otherwise
      const wallBehind = P(v3(0, 0, HD)).d > P(v3(0, 0, 0)).d;
      if (wallBehind) drawWall();

      // Synthetic scan revealed in capture order
      const cloud = graph.cloud ?? [];
      const n = Math.floor(cloud.length * progress);
      ctx.fillStyle = this.isDark ? `rgba(205, 220, 255, ${0.9 * progress})` : `rgba(107, 147, 255, ${0.9 * progress})`;
      for (let i = 0; i < n; i++) {
        const p = P(cloud[i].p);
        ctx.fillRect(p.x - 0.6, p.y - 0.6, 1.3, 1.3);
      }
      if (!wallBehind) drawWall();

      this.drawAnalyzeOverlay(graph, t);
      return;
    }

    // Wireless icon: three arcs pulsing outward in sequence
    const wifi = (x: number, y: number, phase: number, scale = 1) => {
      for (let r = 0; r < 3; r++) {
        const pulse = Math.max(0, Math.sin(t * 2.4 - r * 0.7 + phase));
        ctx.beginPath();
        ctx.strokeStyle = sensor((0.3 + 0.7 * pulse) * progress);
        ctx.lineWidth = 1.8;
        ctx.arc(x, y, (4 + r * 3.5) * scale, -Math.PI * 0.8, -Math.PI * 0.2);
        ctx.stroke();
      }
    };

    const dot = (x: number, y: number, r: number, ring: number) => {
      ctx.beginPath();
      ctx.fillStyle = sensor(progress);
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.9 * progress})`;
      ctx.lineWidth = ring;
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
    };

    // Sensors uplink readings to a ceiling gateway
    const gw = v3(HW - 0.1, DY + 0.14, 0);
    const gp = P(gw);
    rooms.forEach((r, i) => {
      const s = v3(r.cx, FY + 0.1, r.cz);
      const sp = P(s);

      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.strokeStyle = sensor(0.45 * progress);
      ctx.lineWidth = 0.9;
      ctx.moveTo(sp.x, sp.y);
      ctx.lineTo(gp.x, gp.y);
      ctx.stroke();
      ctx.setLineDash([]);

      const f = (t * 0.5 + i * 0.17) % 1;
      ctx.beginPath();
      ctx.fillStyle = sensor(progress);
      ctx.arc(sp.x + (gp.x - sp.x) * f, sp.y + (gp.y - sp.y) * f, 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = sensor((0.16 + 0.14 * Math.sin(t * 3 + i)) * progress);
      ctx.arc(sp.x, sp.y, 10, 0, Math.PI * 2);
      ctx.fill();
      dot(sp.x, sp.y, 3.6, 1.2);
      wifi(sp.x, sp.y - 7, i * 0.8);

      ctx.font = '600 8px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = this.isDark ? `rgba(255,255,255,${0.85 * progress})` : `rgba(17,17,17,${0.8 * progress})`;
      ctx.fillText(`${Math.round(18 + r.temp * 14)}°`, sp.x, sp.y + 15);
    });

    dot(gp.x, gp.y, 4.4, 1.4);
    wifi(gp.x, gp.y - 8, 0, 1.3);
  }

  /** Synthetic scan points (currently none). */
  private buildCloud(): CloudPt[] {
    // Scan points are hidden for now; the deviation heatmap wall and clash still render.
    return [];
  }

  /** Screen-space data table and desktop monitor with charts, drawn over the model. */
  private drawAnalyzeOverlay(graph: Graph, t: number): void {
    const { ctx, width: w, height: h, progress } = graph;
    const fg = this.isDark ? '255,255,255' : '17,17,17';
    const heat = (v: number, a = 1) => `hsla(${Math.round(130 - 130 * v)}, 85%, 50%, ${a})`;
    const rect = (x: number, y: number, rw: number, rh: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + rw, y, x + rw, y + rh, r);
      ctx.arcTo(x + rw, y + rh, x, y + rh, r);
      ctx.arcTo(x, y + rh, x, y, r);
      ctx.arcTo(x, y, x + rw, y, r);
      ctx.closePath();
    };

    ctx.save();
    ctx.globalAlpha = progress;
    ctx.textAlign = 'left';

    // Data table
    const tx = 4;
    const ty = h - 66;
    rect(tx, ty, 114, 54, 4);
    ctx.fillStyle = `rgba(${fg}, 0.05)`;
    ctx.fill();
    ctx.strokeStyle = `rgba(${fg}, 0.14)`;
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.font = '600 5.5px "JetBrains Mono", monospace';
    ctx.fillStyle = `rgba(${fg}, 0.5)`;
    ctx.fillText('ELEMENT', tx + 6, ty + 10);
    ctx.fillText('Δ MM', tx + 62, ty + 10);
    ctx.fillText('POINTS', tx + 86, ty + 10);
    ctx.beginPath();
    ctx.moveTo(tx + 5, ty + 14);
    ctx.lineTo(tx + 109, ty + 14);
    ctx.strokeStyle = `rgba(${fg}, 0.12)`;
    ctx.stroke();

    const rows: [string, string, number, string][] = [
      ['Wall F-02', '+18', 0.62, '12.4K'],
      ['Slab L1', '−2', 0.05, '9.1K'],
      ['Duct T-01', '+1', 0.08, '3.8K'],
    ];
    ctx.font = '500 6px "JetBrains Mono", monospace';
    rows.forEach(([name, dev, v, pts], i) => {
      const y = ty + 25 + i * 10;
      ctx.fillStyle = `rgba(${fg}, 0.85)`;
      ctx.fillText(name, tx + 6, y);
      ctx.fillStyle = heat(v);
      ctx.fillText(dev, tx + 62, y);
      ctx.fillStyle = `rgba(${fg}, 0.6)`;
      ctx.fillText(pts, tx + 86, y);
    });

    // Desktop monitor
    const mx = w - 122;
    const my = h - 72;
    const mw = 114;
    const mh = 56;
    rect(mx, my, mw, mh, 4);
    ctx.fillStyle = '#16161a';
    ctx.fill();
    ctx.strokeStyle = `rgba(${fg}, 0.25)`;
    ctx.stroke();
    ctx.fillStyle = `rgba(${fg}, 0.3)`;
    ctx.fillRect(mx + mw / 2 - 3, my + mh, 6, 4);
    ctx.fillRect(mx + mw / 2 - 16, my + mh + 4, 32, 2);

    const sx = mx + 4;
    const sy = my + 4;
    const sw = mw - 8;
    const sh = mh - 8;
    ctx.fillStyle = '#0b0b10';
    ctx.fillRect(sx, sy, sw, sh);

    ctx.font = '600 5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#7a9cff';
    ctx.fillText('DEVIATION · L1', sx + 4, sy + 8);

    // Bars, coloured by deviation level
    const base = sy + sh - 5;
    for (let i = 0; i < 6; i++) {
      const v = 0.5 + 0.5 * Math.sin(t * 0.8 + i * 1.1);
      const bh = 4 + v * 20;
      ctx.fillStyle = heat(v * 0.9, 0.9);
      ctx.fillRect(sx + 5 + i * 7, base - bh, 5, bh);
    }

    // Trend line with area fill
    const lx = sx + 52;
    const lw = sw - 58;
    const ly = sy + 14;
    const lh = sh - 22;
    ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const v = 0.5 + 0.28 * Math.sin(i * 0.7 + t * 0.9) + 0.12 * Math.sin(i * 1.9 - t);
      const px = lx + (i / 11) * lw;
      const py = ly + lh - v * lh;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = '#6b93ff';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.lineTo(lx + lw, ly + lh);
    ctx.lineTo(lx, ly + lh);
    ctx.closePath();
    ctx.fillStyle = 'rgba(107, 147, 255, 0.15)';
    ctx.fill();

    ctx.restore();
  }

  /** Brain silhouette filled with connected dots; deterministic so it never reshuffles. */
  private buildBrain(): Brain {
    // Side-view brain profile: frontal lobe at the left, cerebellum and stem lower right
    const outline: [number, number][] = [
      [0.09, 0.44], [0.10, 0.33], [0.15, 0.23], [0.23, 0.15], [0.33, 0.09], [0.45, 0.06],
      [0.57, 0.06], [0.69, 0.10], [0.79, 0.17], [0.86, 0.26], [0.90, 0.37], [0.90, 0.48],
      [0.86, 0.57], [0.80, 0.62], [0.83, 0.70], [0.79, 0.77], [0.71, 0.80], [0.63, 0.77],
      [0.59, 0.71], [0.56, 0.80], [0.51, 0.86], [0.46, 0.80], [0.45, 0.71], [0.36, 0.73],
      [0.27, 0.70], [0.18, 0.63], [0.12, 0.54],
    ];
    // Gyri: the folds that make it read as a brain rather than a blob
    const folds: { x: number; y: number }[][] = [
      [[0.2, 0.3], [0.3, 0.22], [0.42, 0.24], [0.48, 0.33], [0.4, 0.38], [0.3, 0.36]],
      [[0.5, 0.18], [0.6, 0.16], [0.7, 0.22], [0.72, 0.32], [0.63, 0.36], [0.55, 0.3]],
      [[0.18, 0.45], [0.28, 0.44], [0.36, 0.5], [0.34, 0.6], [0.24, 0.6], [0.17, 0.53]],
      [[0.44, 0.45], [0.55, 0.43], [0.64, 0.47], [0.66, 0.57], [0.56, 0.62], [0.46, 0.57]],
      [[0.74, 0.4], [0.82, 0.44], [0.83, 0.52], [0.76, 0.56]],
      [[0.66, 0.68], [0.73, 0.66], [0.78, 0.71]],
    ].map((pl) => pl.map(([x, y]) => ({ x, y })));

    const pts: { x: number; y: number }[] = [];
    outline.forEach((a, i) => {
      const b = outline[(i + 1) % outline.length];
      for (let k = 0; k < 2; k++) {
        const u = k / 2;
        pts.push({ x: a[0] + (b[0] - a[0]) * u, y: a[1] + (b[1] - a[1]) * u });
      }
    });
    const inside = (x: number, y: number) => {
      let c = false;
      for (let i = 0, j = outline.length - 1; i < outline.length; j = i++) {
        const [xi, yi] = outline[i];
        const [xj, yj] = outline[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
      }
      return c;
    };
    let seed = 7;
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    let guard = 0;
    while (pts.length < 120 && guard++ < 4000) {
      const x = 0.1 + rnd() * 0.82;
      const y = 0.06 + rnd() * 0.8;
      if (!inside(x, y) || pts.some((p) => Math.hypot(p.x - x, p.y - y) < 0.06)) continue;
      pts.push({ x, y });
    }

    const edges: [number, number][] = [];
    const adj: number[][] = pts.map(() => []);
    const seen = new Set<string>();
    pts.forEach((p, i) => {
      pts
        .map((q, j) => ({ j, d: Math.hypot(p.x - q.x, p.y - q.y) }))
        .filter((n) => n.j !== i && n.d < 0.15)
        .sort((a, b) => a.d - b.d)
        .slice(0, 3)
        .forEach(({ j }) => {
          const key = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (seen.has(key)) return;
          seen.add(key);
          edges.push([i, j]);
          adj[i].push(j);
          adj[j].push(i);
        });
    });

    // Fixed routes for the travelling impulses, so they glide instead of jumping about
    const paths: number[][] = [];
    for (let k = 0; k < 6; k++) {
      const path = [Math.floor(rnd() * pts.length)];
      for (let step = 0; step < 9; step++) {
        const near = adj[path[path.length - 1]].filter((n) => n !== path[path.length - 2]);
        if (!near.length) break;
        path.push(near[Math.floor(rnd() * near.length)]);
      }
      if (path.length > 3) paths.push(path);
    }

    return { pts, edges, folds, paths };
  }

  /** Faint oversized brain behind everything — the technology the prediction runs on. */
  private drawBrainBackdrop(graph: Graph, t: number): void {
    const { ctx, width: w, height: h, progress, brain } = graph;
    if (!brain) return;

    const scale = Math.max(w / 0.82, h / 0.78) * 0.53;
    const bw = scale;
    const bh = scale * 0.78;
    const bx = w / 2 - 0.5 * bw;
    const by = h / 2 - 0.47 * bh;
    const at = (i: number) => ({ x: bx + brain.pts[i].x * bw, y: by + brain.pts[i].y * bh });

    ctx.save();
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.globalAlpha = progress * (0.15 + 0.03 * Math.sin(t * 0.5));
    ctx.strokeStyle = this.brand(1);
    ctx.fillStyle = this.brand(1);

    // Folds, drawn as smooth curves through their control points
    ctx.lineWidth = 0.9;
    for (const fold of brain.folds) {
      ctx.beginPath();
      ctx.moveTo(bx + fold[0].x * bw, by + fold[0].y * bh);
      for (let i = 0; i < fold.length - 1; i++) {
        const p = fold[i];
        const q = fold[i + 1];
        ctx.quadraticCurveTo(
          bx + p.x * bw,
          by + p.y * bh,
          bx + ((p.x + q.x) / 2) * bw,
          by + ((p.y + q.y) / 2) * bh,
        );
      }
      ctx.stroke();
    }

    // Synapse mesh
    ctx.lineWidth = 0.55;
    ctx.beginPath();
    for (const [i, j] of brain.edges) {
      const a = at(i);
      const b = at(j);
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
    }
    ctx.stroke();

    brain.pts.forEach((_, i) => {
      const p = at(i);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.1 + 0.5 * Math.sin(t * 1.2 + i * 1.3), 0, Math.PI * 2);
      ctx.fill();
    });

    // Impulses gliding along fixed routes, with a short trail
    ctx.globalAlpha = progress * 0.32;
    brain.paths.forEach((path, k) => {
      const span = path.length - 1;
      const head = ((t * 0.22 + k * 0.37) % 1) * span;
      for (let trail = 0; trail < 5; trail++) {
        const pos = head - trail * 0.16;
        if (pos < 0) continue;
        const i = Math.min(span - 1, Math.floor(pos));
        const u = pos - i;
        const a = at(path[i]);
        const b = at(path[i + 1]);
        ctx.globalAlpha = progress * 0.32 * (1 - trail / 5);
        ctx.beginPath();
        ctx.arc(a.x + (b.x - a.x) * u, a.y + (b.y - a.y) * u, 2 - trail * 0.25, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.restore();
  }

  /** Small amber-red warning triangle with an exclamation mark. */
  private warnTriangle(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
    alpha: number,
  ): void {
    const hs = size / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - hs);
    ctx.lineTo(cx + hs, cy + hs * 0.8);
    ctx.lineTo(cx - hs, cy + hs * 0.8);
    ctx.closePath();
    ctx.fillStyle = `rgba(239, 68, 68, ${alpha})`;
    ctx.fill();
    ctx.lineWidth = Math.max(0.6, size * 0.06);
    ctx.strokeStyle = `rgba(255, 140, 140, ${alpha})`;
    ctx.stroke();

    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillRect(cx - size * 0.05, cy - hs * 0.32, size * 0.1, size * 0.4);
    ctx.beginPath();
    ctx.arc(cx, cy + hs * 0.44, size * 0.06, 0, Math.PI * 2);
    ctx.fill();
  }

  /** Maintenance dashboard and phone; a sensor alert flows model → dashboard → phone. */
  private drawPredictOverlay(graph: Graph, t: number, sp: { x: number; y: number }): void {
    const { ctx, width: w, height: h, progress } = graph;
    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
    const seg = (a: number, b: number) => clamp01((tc - a) / (b - a));
    const tc = (t % 7) / 7;
    const fade = 1 - seg(0.93, 1);
    const alertA = seg(0.3, 0.4) * fade;
    const smsA = seg(0.68, 0.76) * fade;
    const blue = (a: number) => `rgba(6, 69, 251, ${clamp01(a)})`;
    const rect = (x: number, y: number, rw: number, rh: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + rw, y, x + rw, y + rh, r);
      ctx.arcTo(x + rw, y + rh, x, y + rh, r);
      ctx.arcTo(x, y + rh, x, y, r);
      ctx.arcTo(x, y, x + rw, y, r);
      ctx.closePath();
    };

    ctx.save();
    ctx.globalAlpha = progress;
    ctx.textAlign = 'left';

    // Layout anchors — monitor matches the one in Analyze
    const mx = 4;
    const my = h - 72;
    const mw = 114;
    const mh = 56;
    const pw = 30;
    const ph = 54;
    const px = Math.min(w - pw - 6, mx + mw + 24);
    const py = h - 74;
    const monTop = { x: mx + mw * 0.5, y: my };
    const monRight = { x: mx + mw, y: my + mh * 0.5 };
    const phoneLeft = { x: px, y: py + ph * 0.5 };

    // Links and travelling signals
    const link = (a: { x: number; y: number }, b: { x: number; y: number }, f: number) => {
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.strokeStyle = blue(0.4);
      ctx.lineWidth = 0.9;
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.setLineDash([]);
      if (f > 0 && f < 1) {
        for (let k = 0; k < 4; k++) {
          const u = Math.max(0, f - k * 0.04);
          ctx.beginPath();
          ctx.fillStyle = blue(0.95 - k * 0.22);
          ctx.arc(a.x + (b.x - a.x) * u, a.y + (b.y - a.y) * u, 2.6 - k * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
    link(sp, monTop, seg(0, 0.3));
    link(monRight, phoneLeft, seg(0.45, 0.68));

    // Single sensor on the model
    ctx.beginPath();
    ctx.fillStyle = blue(0.18 + 0.14 * Math.sin(t * 3));
    ctx.arc(sp.x, sp.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = blue(1);
    ctx.arc(sp.x, sp.y, 3.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    for (let r = 0; r < 3; r++) {
      const pulse = Math.max(0, Math.sin(t * 2.4 - r * 0.7));
      ctx.beginPath();
      ctx.strokeStyle = blue(0.3 + 0.7 * pulse);
      ctx.lineWidth = 1.8;
      ctx.arc(sp.x, sp.y - 7, 4 + r * 3.5, -Math.PI * 0.8, -Math.PI * 0.2);
      ctx.stroke();
    }

    // Dashboard screen with the maintenance prediction
    rect(mx, my, mw, mh, 4);
    ctx.fillStyle = '#16161a';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(mx + mw / 2 - 3, my + mh, 6, 4);
    ctx.fillRect(mx + mw / 2 - 16, my + mh + 4, 32, 2);

    const sx = mx + 4;
    const sy = my + 4;
    const sw = mw - 8;
    const sh = mh - 8;
    ctx.fillStyle = '#0b0b10';
    ctx.fillRect(sx, sy, sw, sh);
    ctx.font = '600 5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#7a9cff';
    ctx.fillText('PREDICTIVE MAINTENANCE', sx + 4, sy + 8);

    // Wear trend: history, forecast and service threshold
    const cx0 = sx + 5;
    const cw = 64;
    const cy0 = sy + 14;
    const ch = sh - 20;
    const thrY = cy0 + ch * 0.22;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.8)';
    ctx.lineWidth = 0.7;
    ctx.moveTo(cx0, thrY);
    ctx.lineTo(cx0 + cw, thrY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    for (let i = 0; i <= 8; i++) {
      const v = 0.78 - i * 0.045 + 0.05 * Math.sin(i * 1.6 + t);
      const x = cx0 + (i / 14) * cw;
      const y = cy0 + ch * (1 - v);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#6b93ff';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    const forecast = seg(0.05, 0.35);
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(cx0 + (8 / 14) * cw, cy0 + ch * (1 - (0.78 - 8 * 0.045)));
    ctx.lineTo(cx0 + (8 / 14 + (6 / 14) * forecast) * cw, cy0 + ch * (1 - (0.42 + 0.42 * forecast)));
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.95)';
    ctx.stroke();
    ctx.setLineDash([]);

    // Alert: a small warning triangle on the dashboard
    if (alertA > 0) {
      this.warnTriangle(
        ctx,
        sx + sw - 13,
        sy + sh / 2 + 2,
        14,
        progress * alertA * (0.65 + 0.35 * Math.sin(t * 5)),
      );
    }

    // Phone receiving the SMS
    if (smsA > 0) {
      const pulse = (t * 1.6) % 1;
      ctx.beginPath();
      ctx.strokeStyle = blue(0.5 * (1 - pulse) * smsA);
      ctx.lineWidth = 1.2;
      rect(px - 3 - pulse * 5, py - 3 - pulse * 5, pw + 6 + pulse * 10, ph + 6 + pulse * 10, 8);
      ctx.stroke();
    }
    rect(px, py, pw, ph, 5);
    ctx.fillStyle = '#16161a';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 0.9;
    ctx.stroke();
    ctx.fillStyle = '#0b0b10';
    ctx.fillRect(px + 2.5, py + 6, pw - 5, ph - 12);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillRect(px + pw / 2 - 5, py + 2.5, 10, 1.6);

    // Incoming SMS shown as a warning triangle inside the screen
    if (smsA > 0) {
      this.warnTriangle(
        ctx,
        px + pw / 2,
        py + ph / 2,
        Math.min(pw - 12, 18),
        progress * smsA * (0.7 + 0.3 * Math.sin(t * 5)),
      );
    }

    ctx.restore();
  }

  /* ── Node network renderer ── */

  private drawNetwork(graph: Graph, t: number): void {
    const { ctx, width, height, nodes, step, progress, mouse } = graph;
    if (width === 0 || height === 0) return;

    ctx.clearRect(0, 0, width, height);
    if (progress <= 0.001) return;

    const amp = 0.018;
    const positions = nodes.map((n) => {
      let x = n.bx + Math.sin(t * n.speed + n.phase) * amp;
      let y = n.by + Math.cos(t * n.speed * 1.15 + n.phase) * amp;

      if (mouse.active) {
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const dist = Math.hypot(dx, dy);
        const radius = 0.22;
        if (dist < radius && dist > 0.0001) {
          const push = ((radius - dist) / radius) * 0.05;
          x += (dx / dist) * push;
          y += (dy / dist) * push;
        }
      }

      return { x, y, r: n.r };
    });

    ctx.lineWidth = 1;
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dx = positions[i].x - positions[j].x;
        const dy = positions[i].y - positions[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < step.connectDist) {
          ctx.strokeStyle = this.brand((1 - dist / step.connectDist) * 0.55 * progress);
          ctx.beginPath();
          ctx.moveTo(positions[i].x * width, positions[i].y * height);
          ctx.lineTo(positions[j].x * width, positions[j].y * height);
          ctx.stroke();
        }
      }
    }

    if (mouse.active) {
      const hlRadius = 0.26;
      ctx.lineWidth = 1.2;
      for (const p of positions) {
        const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (dist < hlRadius) {
          ctx.strokeStyle = this.brand((1 - dist / hlRadius) * 0.8 * progress);
          ctx.beginPath();
          ctx.moveTo(mouse.x * width, mouse.y * height);
          ctx.lineTo(p.x * width, p.y * height);
          ctx.stroke();
        }
      }
    }

    for (const p of positions) {
      ctx.beginPath();
      ctx.fillStyle = this.brand(0.9 * progress);
      ctx.arc(p.x * width, p.y * height, p.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = this.brand(0.16 * progress);
      ctx.arc(p.x * width, p.y * height, p.r * 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /** Brand blue, lifted in dark mode so it stays readable on grey. */
  private brand(alpha: number): string {
    const a = Math.max(0, Math.min(1, alpha));
    return this.isDark ? `rgba(122, 156, 255, ${a})` : `rgba(6, 69, 251, ${a})`;
  }

  onGraphMouseMove(event: MouseEvent, i: number): void {
    const graph = this.graphs[i];
    if (!graph) return;
    const rect = graph.wrap.getBoundingClientRect();
    graph.mouse.x = (event.clientX - rect.left) / rect.width;
    graph.mouse.y = (event.clientY - rect.top) / rect.height;
    graph.mouse.active = true;
  }

  onGraphMouseLeave(i: number): void {
    const graph = this.graphs[i];
    if (graph) graph.mouse.active = false;
  }
}
