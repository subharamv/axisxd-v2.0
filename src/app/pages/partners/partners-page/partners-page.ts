import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { LucideAngularModule, ArrowLeft, ExternalLink, Search, ChevronRight } from 'lucide-angular';
import { SeoService } from '../../../core/seo.service';

interface Integration {
  name: string;
  logo: string | null;
  initials: string;
  accent: string;
  category: string;
  description: string;
  tags: string[];
  status: 'Native' | 'API' | 'Plugin' | 'Import/Export';
  url?: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All Integrations' },
  { id: 'bim', label: 'BIM & CAD' },
  { id: 'scan', label: 'Scan & LiDAR' },
  { id: 'cloud', label: 'Cloud & Storage' },
  { id: 'project', label: 'Project Management' },
  { id: 'realitycapture', label: 'Reality Capture' },
];

const STATUS_COLORS: Record<string, string> = {
  Native: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
  API: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
  Plugin: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
  'Import/Export': 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20',
};

const INTEGRATIONS: Integration[] = [
  // BIM & CAD
  {
    name: 'Autodesk Revit',
    logo: null,
    initials: 'RVT',
    accent: '#0696D7',
    category: 'bim',
    description: 'Export IFC 4 models directly from Revit and load into AxisXD for browser-based BIM visualization, clash detection, and deviation analysis.',
    tags: ['IFC', 'BIM', 'Architecture'],
    status: 'Import/Export',
    url: 'https://www.autodesk.com/products/revit',
  },
  {
    name: 'Autodesk Navisworks',
    logo: null,
    initials: 'NWD',
    accent: '#0696D7',
    category: 'bim',
    description: 'Import NWC/NWD model files from Navisworks into AxisXD Clash Detection and Deviation Analyzer for multi-discipline coordination.',
    tags: ['Clash Detection', 'BIM', 'Coordination'],
    status: 'Import/Export',
    url: 'https://www.autodesk.com/products/navisworks',
  },
  {
    name: 'Graphisoft ArchiCAD',
    logo: null,
    initials: 'ARC',
    accent: '#C8402A',
    category: 'bim',
    description: 'Open IFC models exported from ArchiCAD in AxisXD IFC Viewer with full storey structure, element metadata, and section tools.',
    tags: ['IFC', 'Architecture', 'BIM'],
    status: 'Import/Export',
  },
  {
    name: 'Bentley MicroStation',
    logo: null,
    initials: 'MST',
    accent: '#005F9E',
    category: 'bim',
    description: 'Stream DGN-to-IFC exports from MicroStation into AxisXD for infrastructure project visualization and review.',
    tags: ['Infrastructure', 'IFC', 'Civil'],
    status: 'Import/Export',
  },
  {
    name: 'ALLPLAN',
    logo: null,
    initials: 'ALP',
    accent: '#1F3A8A',
    category: 'bim',
    description: 'Export IFC files from ALLPLAN and visualize structural, architectural, and MEP models with full property tree in AxisXD.',
    tags: ['IFC', 'Structural', 'BIM'],
    status: 'Import/Export',
  },
  {
    name: 'Tekla Structures',
    logo: null,
    initials: 'TKL',
    accent: '#E53E3E',
    category: 'bim',
    description: 'Load Tekla-exported IFC steel and concrete models into AxisXD for structural review, connection inspection, and deviation checking.',
    tags: ['Structural', 'Steel', 'Concrete'],
    status: 'Import/Export',
  },
  // Scan & LiDAR
  {
    name: 'NavVis IVION',
    logo: null,
    initials: 'NVS',
    accent: '#0645fb',
    category: 'scan',
    description: 'Import E57 and LAS point clouds from NavVis mobile mapping scans into AxisXD for as-built analysis and deviation heatmaps.',
    tags: ['Point Cloud', 'Indoor', 'Mobile Mapping'],
    status: 'Import/Export',
    url: 'https://www.navvis.com',
  },
  {
    name: 'Cintoo',
    logo: 'assets/images/partners/cintoo.png',
    initials: 'CTX',
    accent: '#FF6B35',
    category: 'scan',
    description: 'Connect Cintoo cloud point cloud streams with AxisXD for collaborative scan review and scan-to-BIM verification workflows.',
    tags: ['Point Cloud', 'Cloud', 'LiDAR'],
    status: 'API',
    url: 'https://www.cintoo.com',
  },
  {
    name: 'FARO Scene',
    logo: null,
    initials: 'FRO',
    accent: '#E53E3E',
    category: 'scan',
    description: 'Process terrestrial laser scans in FARO Scene and export E57 point clouds directly into AxisXD for spatial analysis.',
    tags: ['LiDAR', 'TLS', 'Point Cloud'],
    status: 'Import/Export',
  },
  {
    name: 'Leica Cyclone',
    logo: null,
    initials: 'LCA',
    accent: '#2B6CB0',
    category: 'scan',
    description: 'Export registered scans from Leica Cyclone in E57/LAS format for upload into AxisXD Point Cloud Viewer or Deviation Analyzer.',
    tags: ['TLS', 'Registration', 'LiDAR'],
    status: 'Import/Export',
  },
  {
    name: 'Trimble RealWorks',
    logo: null,
    initials: 'TRW',
    accent: '#0083BE',
    category: 'scan',
    description: 'Bring RCP/E57 exports from Trimble RealWorks into AxisXD for feature extraction, mesh comparison, and progress reporting.',
    tags: ['Point Cloud', 'Survey', 'RCP'],
    status: 'Import/Export',
  },
  // Reality Capture
  {
    name: 'Matterport',
    logo: null,
    initials: 'MPT',
    accent: '#3B3B9E',
    category: 'realitycapture',
    description: 'Import Matterport 360° panoramic tours and spatial data into AxisXD Pano Viewer for immersive site documentation.',
    tags: ['360°', 'Panorama', 'Virtual Tours'],
    status: 'Import/Export',
    url: 'https://www.matterport.com',
  },
  {
    name: 'DJI Terra',
    logo: null,
    initials: 'DJI',
    accent: '#111111',
    category: 'realitycapture',
    description: 'Process drone photogrammetry in DJI Terra and export point clouds or mesh models into AxisXD for construction monitoring.',
    tags: ['Drone', 'Photogrammetry', 'UAV'],
    status: 'Import/Export',
  },
  {
    name: 'Pix4D',
    logo: null,
    initials: 'P4D',
    accent: '#28A745',
    category: 'realitycapture',
    description: 'Export Pix4D point clouds and orthomosaics into AxisXD for site progress comparison and volume analysis.',
    tags: ['Photogrammetry', 'UAV', 'GIS'],
    status: 'Import/Export',
  },
  {
    name: 'RealityCapture',
    logo: null,
    initials: 'RCX',
    accent: '#7B2D8B',
    category: 'realitycapture',
    description: 'Import high-quality mesh and point cloud outputs from RealityCapture into AxisXD for detailed as-built verification.',
    tags: ['Photogrammetry', 'Mesh', 'Reconstruction'],
    status: 'Import/Export',
  },
  // Cloud & Storage
  {
    name: 'Microsoft Azure',
    logo: null,
    initials: 'AZR',
    accent: '#0078D4',
    category: 'cloud',
    description: 'Deploy AxisXD on Azure with SSO via Azure Active Directory and store model data in Azure Blob Storage for enterprise environments.',
    tags: ['Cloud', 'SSO', 'Enterprise'],
    status: 'Native',
  },
  {
    name: 'AWS S3',
    logo: null,
    initials: 'AWS',
    accent: '#FF9900',
    category: 'cloud',
    description: 'Connect AWS S3 buckets as a model data source for AxisXD; import large point cloud datasets and IFC files directly from S3.',
    tags: ['Cloud', 'Storage', 'Enterprise'],
    status: 'API',
  },
  {
    name: 'Google Cloud',
    logo: null,
    initials: 'GCP',
    accent: '#4285F4',
    category: 'cloud',
    description: 'Integrate Google Cloud Storage for scalable model hosting and leverage GCP compute for accelerated deviation analysis.',
    tags: ['Cloud', 'Storage', 'GCP'],
    status: 'API',
  },
  // Project Management
  {
    name: 'Procore',
    logo: null,
    initials: 'PRC',
    accent: '#F7941D',
    category: 'project',
    description: 'Link AxisXD clash and deviation reports directly into Procore RFIs and submittals for streamlined construction coordination.',
    tags: ['Project Management', 'RFI', 'Construction'],
    status: 'API',
    url: 'https://www.procore.com',
  },
  {
    name: 'Aconex',
    logo: null,
    initials: 'ACX',
    accent: '#CE1126',
    category: 'project',
    description: 'Attach AxisXD deviation and clash reports to Aconex document workflows for compliance-ready project documentation.',
    tags: ['Document Management', 'CDE', 'Compliance'],
    status: 'Plugin',
  },
  {
    name: 'BIMcollab',
    logo: null,
    initials: 'BCB',
    accent: '#006CB7',
    category: 'project',
    description: 'Export BCF issues from AxisXD Clash Detection directly into BIMcollab for team-based issue resolution and tracking.',
    tags: ['BCF', 'Issue Tracking', 'BIM'],
    status: 'Native',
  },
  {
    name: 'Rockfield',
    logo: 'assets/images/partners/rockfield.png',
    initials: 'RCK',
    accent: '#4A5568',
    category: 'project',
    description: 'Integrate Rockfield simulation data with AxisXD for geotechnical and structural performance review in digital twin environments.',
    tags: ['Simulation', 'Geotechnical', 'FEA'],
    status: 'API',
  },
];

const STATS = [
  { value: '22+', label: 'Integration Partners' },
  { value: '6', label: 'Categories' },
  { value: 'Open', label: 'REST API' },
  { value: 'BCF / IFC', label: 'Open Standards' },
];

@Component({
  selector: 'app-partners-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './partners-page.html',
  styleUrl: './partners-page.scss',
  animations: [
    trigger('cardsStagger', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(16px)' }),
            stagger(40, animate('350ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))),
          ],
          { optional: true },
        ),
      ]),
    ]),
  ],
})
export class PartnersPageComponent {
  readonly ArrowLeft = ArrowLeft;
  readonly ExternalLink = ExternalLink;
  readonly Search = Search;
  readonly ChevronRight = ChevronRight;

  readonly categories = CATEGORIES;
  readonly stats = STATS;
  readonly statusColors = STATUS_COLORS;
  private readonly integrations = INTEGRATIONS;

  activeCategory = 'all';
  search = '';

  constructor(private seo: SeoService) {
    this.seo.set({
      title: 'Integrations & Partners',
      description: 'AxisXD integrates with Autodesk, NavVis, Matterport, Procore, and 20+ AEC tools. Explore the full integration ecosystem.',
      canonicalPath: '/partners',
    });
  }

  get filtered(): Integration[] {
    const q = this.search.toLowerCase();
    return this.integrations.filter((p) => {
      const matchesCat = this.activeCategory === 'all' || p.category === this.activeCategory;
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }

  setCategory(id: string): void {
    this.activeCategory = id;
  }
}
