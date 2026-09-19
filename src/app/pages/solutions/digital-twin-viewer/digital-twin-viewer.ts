import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Box,
  Search,
  Cpu,
  AlertTriangle,
  RefreshCw,
  Camera,
  MapPin,
  Sliders,
  Wand2,
  ChevronRight,
  Sparkles,
  Info,
} from 'lucide-angular';

import { ViewerMode, PointColorPalette, PresetScene, IFCElement, CoordinateIssue, Hotspot360 } from '../../../models/types';
import {
  PRESETS,
  MOCK_IFC_ELEMENTSByPreset,
  MOCK_COORDINATE_ISSUESByPreset,
  MOCK_HOTSPOTSByPreset,
} from '../../../data/preset-data';

interface WorkflowStep {
  id: number;
  title: string;
  desc: string;
  img: string;
  icon: string;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  { id: 1, title: 'Upload Your Model', desc: 'Drag & drop your IFC file directly into the browser without signing up or installing software.', img: 'assets/images/viewers/ifc_viewer.png', icon: '↑' },
  { id: 2, title: 'Model Loads Instantly', desc: 'WebGL-powered rendering processes your model in seconds, even for large files.', img: 'assets/images/viewers/point_cloud_viewer.png', icon: '⚡' },
  { id: 3, title: 'Navigate & Inspect', desc: 'Orbit, zoom, isolate elements, and inspect BIM properties with a single click.', img: 'assets/images/viewers/Pano_Viewer.png', icon: '◈' },
  { id: 4, title: 'Share & Collaborate', desc: 'Generate a shareable link with markups and annotations for your team.', img: 'assets/images/viewers/Dxf_Viewer.png', icon: '↗' },
];

const PALETTES: PointColorPalette[] = ['elevation', 'spectral', 'intensity', 'cyan-glow'];

@Component({
  selector: 'app-digital-twin-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './digital-twin-viewer.html',
  styleUrl: './digital-twin-viewer.scss',
})
export class DigitalTwinViewerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('pcCanvas') pcCanvasRef?: ElementRef<HTMLCanvasElement>;

  readonly Box = Box;
  readonly Search = Search;
  readonly Cpu = Cpu;
  readonly AlertTriangle = AlertTriangle;
  readonly RefreshCw = RefreshCw;
  readonly Camera = Camera;
  readonly MapPin = MapPin;
  readonly Sliders = Sliders;
  readonly Wand2 = Wand2;
  readonly ChevronRight = ChevronRight;
  readonly Sparkles = Sparkles;
  readonly Info = Info;

  readonly PRESETS = PRESETS;
  readonly WORKFLOW_STEPS = WORKFLOW_STEPS;
  readonly PALETTES = PALETTES;

  // Preset Selected
  selectedPreset: PresetScene = PRESETS[0];
  activeMode: ViewerMode = 'ifc';

  // IFC state
  ifcElements: IFCElement[] = [];
  selectedElement: IFCElement | null = null;
  hiddenElements = new Set<string>();
  searchQuery = '';

  // Point Cloud state
  palette: PointColorPalette = 'cyan-glow';
  pointCount = 3000;
  pointSize = 2.5;
  isRotating = true;

  // Panorama state
  activeHotspot: Hotspot360 | null = null;
  panAngle = 0;
  selectedIssue: CoordinateIssue | null = null;

  // Gemini simulated intelligence
  aiReport = '';
  isAiLoading = false;

  // Workflow step for IFC quickstart
  workflowStep = 1;

  private animationFrameId: number | null = null;
  private rotationAngle = 0;
  private resizeHandler?: () => void;

  constructor() {
    this.loadPreset();
  }

  ngAfterViewInit(): void {
    if (this.activeMode === 'point-cloud') {
      this.startPointCloud();
    }
  }

  ngOnDestroy(): void {
    this.stopPointCloud();
  }

  get activeWorkflowStep(): WorkflowStep {
    return this.WORKFLOW_STEPS.find((s) => s.id === this.workflowStep) ?? this.WORKFLOW_STEPS[0];
  }

  get filteredElements(): IFCElement[] {
    const q = this.searchQuery.toLowerCase();
    return this.ifcElements.filter(
      (el) =>
        el.name.toLowerCase().includes(q) ||
        el.id.toLowerCase().includes(q) ||
        el.category.toLowerCase().includes(q),
    );
  }

  get elementCategories(): string[] {
    return Array.from(new Set(this.ifcElements.map((e) => e.category)));
  }

  get clashCount(): number {
    return this.ifcElements.filter((e) => e.clashDetected).length;
  }

  padStep(id: number): string {
    return String(id).padStart(2, '0');
  }

  categoryCount(cat: string): number {
    return this.ifcElements.filter((e) => e.category === cat).length;
  }

  categoryPercent(cat: string): number {
    if (!this.ifcElements.length) return 0;
    return Math.round((this.categoryCount(cat) / this.ifcElements.length) * 100);
  }

  onPresetChange(id: string): void {
    const found = this.PRESETS.find((p) => p.id === id);
    if (!found) return;
    this.selectedPreset = found;
    this.loadPreset();
    this.restartPointCloudIfActive();
  }

  setActiveMode(mode: ViewerMode): void {
    if (this.activeMode === mode) return;
    this.stopPointCloud();
    this.activeMode = mode;
    if (mode === 'point-cloud') {
      setTimeout(() => this.startPointCloud());
    }
  }

  setWorkflowStep(id: number): void {
    this.workflowStep = id;
  }

  toggleVisibility(id: string, event: MouseEvent): void {
    event.stopPropagation();
    const next = new Set(this.hiddenElements);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    this.hiddenElements = next;
  }

  resetHiddenElements(): void {
    this.hiddenElements = new Set();
  }

  selectElement(el: IFCElement): void {
    this.selectedElement = el;
  }

  setPalette(p: PointColorPalette): void {
    this.palette = p;
    this.restartPointCloudIfActive();
  }

  setPointCount(value: number): void {
    this.pointCount = value;
    this.restartPointCloudIfActive();
  }

  setPointSize(value: number): void {
    this.pointSize = value;
    this.restartPointCloudIfActive();
  }

  toggleRotating(): void {
    this.isRotating = !this.isRotating;
    this.restartPointCloudIfActive();
  }

  setPanAngle(delta: number): void {
    this.panAngle += delta;
  }

  setActiveHotspot(hot: Hotspot360 | null): void {
    this.activeHotspot = hot;
  }

  getHotspots(): Hotspot360[] {
    return MOCK_HOTSPOTSByPreset[this.selectedPreset.id] || [];
  }

  hotspotOffset(hot: Hotspot360): number {
    return (hot.x + this.panAngle / 15) % 100;
  }

  triggerGeminiReport(): void {
    if (!this.selectedElement) return;
    this.isAiLoading = true;

    setTimeout(() => {
      const el = this.selectedElement!;
      let reportText = '';
      if (el.clashDetected) {
        reportText = `### Google Gemini AI Digital Twin Compliance Report
**Asset Anchor Node**: [${el.id}] (${el.name})
**Analysis Trigger**: Automated BIM Structural Collision Check vs Laser Point Cloud Lidar

**ENGINEERING CRITICAL AUDIT FINDINGS:**
1. **Severe Pipeline Encroachment detected**: The 3D laser scanner boundary registers coordinates intersection inside the spatial bounding shell of this element by **32mm**.
2. **Tolerance Deficit**: ISO-12053 Seismic deflection tolerance permits a maximum variance drift of ±10mm. Current drift is at **320% of limit**!
3. **Corrective Directives**: Recommended to adjust pipe hanging conduit anchors structurally by exactly **-450mm along the horizontal Y-axis**.

**REGULATORY STEWARDSHIP:**
* Re-scan structural core after physical pipeline adjustments before pouring subsequent floor grout.
* Structural Integrity Index: **6.2/10 (Requires immediate audit clearance)**.`;
      } else {
        reportText = `### Google Gemini AI Digital Twin Compliance Report
**Asset Anchor Node**: [${el.id}] (${el.name})
**Analysis Trigger**: Nominal Structural Parameter Validation

**STRUCTURAL EVALUATION METRICS:**
1. **Load Distribution Alignment**: Element structural load bearing capacity is nominal at **Grade C60 / A992**. Core alignment registers 0.00% angular deviation.
2. **Material Verification**: Surface intensity mapping matches structural design specifications exactly (Galvanized / Cast Reinforcements).
3. **Tolerance Profile**: Within safety limits (spatial deviation delta: 0.8mm).

**COMPLIANCE CLEARANCE**:
* Element certified compliant for Floor Construction Load-bearing operations.
* Structural Integrity Index: **9.8/10 (Clearance Status: PASS)**.`;
      }
      this.aiReport = reportText;
      this.isAiLoading = false;
    }, 1200);
  }

  private loadPreset(): void {
    const list = MOCK_IFC_ELEMENTSByPreset[this.selectedPreset.id] || [];
    this.ifcElements = list;
    this.selectedElement = list[0] || null;
    this.hiddenElements = new Set();
    this.activeHotspot = null;
    this.aiReport = '';

    const issues = MOCK_COORDINATE_ISSUESByPreset[this.selectedPreset.id] || [];
    this.selectedIssue = issues[0] || null;
  }

  private restartPointCloudIfActive(): void {
    if (this.activeMode !== 'point-cloud') return;
    this.stopPointCloud();
    setTimeout(() => this.startPointCloud());
  }

  private stopPointCloud(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = undefined;
    }
  }

  private startPointCloud(): void {
    const canvas = this.pcCanvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    this.resizeHandler = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 600;
      height = canvas.height = canvas.parentElement?.clientHeight || 450;
    };
    window.addEventListener('resize', this.resizeHandler);

    const presetId = this.selectedPreset.id;
    const particles: Array<{ x: number; y: number; z: number; r: number; g: number; b: number; intensity: number }> = [];
    const count = this.pointCount;

    for (let i = 0; i < count; i++) {
      let x = 0;
      let y = 0;
      let z = 0;
      const t = i / count;

      if (presetId === 'skyscraper-core') {
        if (i % 5 === 0) {
          const colIndex = i % 4;
          const cx = colIndex === 0 ? -1.5 : colIndex === 1 ? 1.5 : colIndex === 2 ? -1.5 : 1.5;
          const cz = colIndex < 2 ? -1.5 : 1.5;
          x = cx;
          z = cz;
          y = t * 6 - 3;
        } else {
          const floor = Math.floor(t * 6) - 3;
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * 2.5;
          x = Math.cos(angle) * dist;
          z = Math.sin(angle) * dist;
          y = floor + (Math.random() - 0.5) * 0.08;
        }
      } else if (presetId === 'refinery-station') {
        if (i % 3 === 0) {
          x = t * 6 - 3;
          y = Math.sin(t * Math.PI * 2) * 0.2 + 0.8;
          z = Math.cos(t * Math.PI * 2) * 0.2 - 0.5;
        } else if (i % 3 === 1) {
          x = -1.2 + Math.cos(t * Math.PI * 4) * 0.3;
          z = 1.0 + Math.sin(t * Math.PI * 4) * 0.3;
          y = t * 5 - 2.5;
        } else {
          const u = Math.random();
          const v = Math.random();
          const theta = u * 2.0 * Math.PI;
          const phi = Math.acos(2.0 * v - 1.0);
          x = 1.2 + Math.sin(phi) * Math.cos(theta) * 1.2;
          y = -1.0 + Math.sin(phi) * Math.sin(theta) * 1.2;
          z = Math.cos(phi) * 1.2;
        }
      } else if (presetId === 'concrete-viaduct') {
        if (i % 4 === 0) {
          const columnPivot = t < 0.5 ? -1.8 : 1.8;
          x = columnPivot + (Math.random() - 0.5) * 0.5;
          z = (Math.random() - 0.5) * 0.5;
          y = Math.random() * 4 - 3;
        } else {
          x = t * 7 - 3.5;
          y = 1.2 - Math.pow(x, 2) * 0.08;
          z = (Math.random() - 0.5) * 1.2;
        }
      } else {
        const angle = t * Math.PI * 20;
        const rCount = Math.floor(t * 12);
        const radius = 1.8 + (Math.random() - 0.5) * 0.12;
        z = Math.cos(angle) * radius;
        y = Math.sin(angle) * radius;
        x = rCount * 0.6 - 3;
      }

      const rVal = Math.floor((Math.sin(x) + 1) * 127);
      const gVal = Math.floor((Math.cos(y) + 1) * 127);
      const bVal = Math.floor((Math.sin(z) + 1) * 127);
      const intensity = Math.round(Math.abs(x * y * z) * 100) % 100;

      particles.push({ x, y, z, r: rVal, g: gVal, b: bVal, intensity });
    }

    const draw = () => {
      const isDarkTheme = document.documentElement.classList.contains('dark');
      ctx.fillStyle = isDarkTheme ? '#0c0c0e' : '#f4f4f5';
      ctx.fillRect(0, 0, width, height);

      if (this.isRotating) {
        this.rotationAngle += 0.004;
      }
      const cosAngle = Math.cos(this.rotationAngle);
      const sinAngle = Math.sin(this.rotationAngle);

      const fov = 400;
      const cameraDist = 6;

      particles.forEach((p) => {
        const rx = p.x * cosAngle - p.z * sinAngle;
        const rz = p.x * sinAngle + p.z * cosAngle;

        const perspective = fov / (cameraDist + rz);
        const projX = rx * perspective + width / 2;
        const projY = p.y * perspective + height / 2;

        if (projX < 0 || projX > width || projY < 0 || projY > height) return;

        let color = '#3b82f6';
        if (this.palette === 'elevation') {
          const factor = Math.min(Math.max((p.y + 2.5) / 5, 0), 1);
          color = `hsl(${(1 - factor) * 240}, 85%, 60%)`;
        } else if (this.palette === 'spectral') {
          color = `rgb(${p.r}, ${p.g}, ${p.b})`;
        } else if (this.palette === 'intensity') {
          const intensityVal = Math.floor((p.intensity / 100) * 200) + 55;
          color = `rgb(${intensityVal}, ${intensityVal}, 20)`;
        } else if (this.palette === 'cyan-glow') {
          color = `rgba(6, 182, 212, ${0.4 + p.intensity / 200})`;
        } else {
          color = `rgb(${p.r}, 120, 240)`;
        }

        ctx.fillStyle = color;
        ctx.fillRect(projX - this.pointSize / 2, projY - this.pointSize / 2, this.pointSize, this.pointSize);
      });

      const strokeColor = isDarkTheme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)';
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      ctx.strokeStyle = isDarkTheme ? 'rgba(59, 130, 246, 0.2)' : 'rgba(6, 69, 251, 0.2)';
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 100, 0, Math.PI * 2);
      ctx.stroke();

      this.animationFrameId = requestAnimationFrame(draw);
    };

    draw();
  }
}
