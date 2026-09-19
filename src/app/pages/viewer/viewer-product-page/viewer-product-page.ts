import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { trigger, transition, style, animate } from '@angular/animations';
import {
  LucideAngularModule,
  Box, Sliders, Camera, CheckCircle2, ArrowUpRight,
  Maximize2, Layers, Ruler, Users, ScanLine,
  Activity, MapPin, Eye, Cpu, Globe,
  AlertTriangle, BarChart3, FileCheck, Sun,
  Compass, Zap, Shield, TrendingDown, Building2,
  HelpCircle, Lock, TreePine, Search as SearchIcon, Scissors,
  Grid3x3, Bookmark, GitCompare, XCircle,
  ShieldCheck,
} from 'lucide-angular';
import type { LucideIconData } from '../../../core/lucide-icon.type';
import { SeoService } from '../../../core/seo.service';

gsap.registerPlugin(ScrollTrigger);

export type ViewerType =
  | 'ifc' | 'pointcloud' | 'pano' | 'deviation' | 'rol'
  | 'monitoring' | 'dxf' | 'cad' | 'mesh' | 'clash' | 'digital-twin';

interface Capability {
  icon: LucideIconData;
  title: string;
  description: string;
}

interface IconTitleDesc {
  icon: LucideIconData;
  title: string;
  desc: string;
}

interface ViewerConfig {
  type: ViewerType;
  heroHighlight: string;
  heroRest: string;
  accentClass: string;
  accentBg: string;
  accentBorder: string;
  accentCardBg: string;
  tagline: string;
  heroDescription: string;
  demoUrl: string;
  capabilityEyebrow: string;
  capabilityHeadingHighlight: string;
  capabilityHeadingRest: string;
  capabilitySubtext: string;
  capabilities: Capability[];
  workflowSubtext: string;
  formatsTitle: string;
  formats: { name: string; label: string }[];
  performance: { label: string; value: string }[];
  workflowHighlight: string;
  workflowBenefits: string[];
  stats: { value: string; label: string }[];
  metrics: { value: string; label: string; sub: string }[];
  steps: { num: string; title: string; desc: string; icon: string }[];
  faqs: { q: string; a: string }[];
  faqIcon?: boolean;
  whyChoose?: { feature: string; axisXd: string; competitor: string }[];
  competitorLabel?: string;
  useCases?: IconTitleDesc[];
  deepFeatures?: IconTitleDesc[];
  security?: { icon: LucideIconData; title: string; items: string[] }[];
}

const CONFIGS: Record<ViewerType, ViewerConfig> = {
  ifc: {
    type: 'ifc',
    heroHighlight: 'IFC',
    heroRest: 'Viewer',
    accentClass: 'text-[#0645fb] dark:text-blue-400',
    accentBg: 'bg-[#0645fb]',
    accentBorder: 'border-blue-500/20',
    accentCardBg: 'bg-blue-500/5 border-blue-500/15',
    tagline: 'IFC BIM Viewer',
    heroDescription: 'A browser-based IFC viewer that lets architects, engineers, and contractors inspect BIM models, measure elements, and share annotated reviews without installing Revit, Navisworks, or any desktop software.',
    demoUrl: 'https://realityxd.axisxd.com/',
    capabilityEyebrow: 'IFC / BIM Platform',
    capabilityHeadingHighlight: 'Powerful IFC',
    capabilityHeadingRest: 'Capabilities',
    capabilitySubtext: 'Everything you need to visualize, analyze, and collaborate on Building Information Models in one unified viewer.',
    capabilities: [
      { icon: Box, title: '3D Model Visualization', description: 'Navigate complex IFC models with smooth real-time 3D interaction and orbit controls.' },
      { icon: Eye, title: 'Element Isolation', description: 'Inspect individual structural components with high clarity, precision, and metadata access.' },
      { icon: Ruler, title: 'Measurement Tools', description: 'Measure distances, dimensions, and areas directly within the IFC model canvas.' },
      { icon: Users, title: 'Collaboration', description: 'Improve cross-team communication with shared annotations, markups, and comments.' },
    ],
    workflowSubtext: 'Our IFC Viewer eliminates friction in BIM collaboration, enabling teams to work more efficiently and make better decisions faster.',
    workflowHighlight: 'BIM',
    formatsTitle: 'Supported Formats',
    formats: [
      { name: 'IFC 2X3', label: 'Legacy Support' },
      { name: 'IFC 4', label: 'Current Standard' },
      { name: 'IFC 4.3', label: 'Latest Features' },
      { name: 'BCF', label: 'Issue Management' },
    ],
    performance: [
      { label: 'Model Size', value: 'Up to 3 GB' },
      { label: 'Load Time', value: '~30 Seconds' },
      { label: 'Concurrent Users', value: 'Unlimited' },
    ],
    workflowBenefits: [
      'Reduce design review time by 60%',
      'Improve cross-discipline coordination',
      'Enable remote project collaboration',
      'Ensure design intent communication',
      'Accelerate decision-making process',
      'Minimize construction conflicts',
    ],
    stats: [
      { value: '3 GB', label: 'Max Model Size' },
      { value: '<30s', label: 'Load Time' },
      { value: '∞', label: 'Users' },
    ],
    metrics: [
      { value: '5,000+', label: 'Buildings Digitized', sub: 'IFC assemblies validated' },
      { value: '30+', label: 'Active Teams', sub: 'Certified BIM coordinators' },
      { value: '230M', label: 'Sq Ft Digitized', sub: 'National coverage index' },
      { value: '98%', label: 'On-Time Delivery', sub: 'Schedule fidelity guaranteed' },
    ],
    steps: [
      { num: '01', title: 'Upload Your Model', desc: 'Drag & drop your IFC file directly into the browser without signing up or installing software.', icon: '↑' },
      { num: '02', title: 'Model Loads Instantly', desc: 'WebGL-powered rendering processes your model in seconds, even for large files.', icon: '⚡' },
      { num: '03', title: 'Navigate & Inspect', desc: 'Orbit, zoom, isolate elements, and inspect BIM properties with a single click.', icon: '◈' },
      { num: '04', title: 'Share & Collaborate', desc: 'Generate a shareable link with markups and annotations for your team.', icon: '↗' },
    ],
    faqs: [
      { q: 'How does the IFC Viewer work?', a: 'Upload your IFC file directly into the browser; the model loads instantly with WebGL rendering, and you can navigate, inspect properties, and collaborate without any installation.' },
      { q: 'What file formats are supported?', a: 'We support IFC 2X3, IFC 4, and IFC 4.3. BCF files for issue management are also supported, enabling seamless coordination workflows.' },
      { q: 'How large of a model can I view?', a: 'Our viewer handles IFC models up to 3 GB in size. Load times average under 30 seconds depending on file complexity and your connection.' },
      { q: 'Can I collaborate with my team?', a: 'Absolutely. Share annotated views with your team via generated links, add markups and comments, and coordinate across disciplines in real time.' },
      { q: 'Do I need to install anything?', a: 'No installation required. The viewer runs entirely in your browser via WebGL and is compatible with Chrome, Firefox, Edge, and Safari.' },
    ],
    faqIcon: true,
    whyChoose: [
      { feature: 'Browser Based', axisXd: '✓', competitor: '✗' },
      { feature: 'Installation Required', axisXd: '✗', competitor: '✓' },
      { feature: 'Team Collaboration', axisXd: '✓', competitor: '✗' },
      { feature: 'Shareable Links', axisXd: '✓', competitor: '✗' },
      { feature: 'Mobile Support', axisXd: '✓', competitor: 'Limited' },
      { feature: 'Real-Time Annotations', axisXd: '✓', competitor: '✗' },
      { feature: 'Multi-Model Overlay', axisXd: '✓', competitor: '✗' },
      { feature: 'Free to Use', axisXd: '✓', competitor: 'Paid' },
    ],
    useCases: [
      { icon: Box, title: 'Architects', desc: 'Review designs quickly, validate spatial intent, and share concepts with clients in the browser.' },
      { icon: Ruler, title: 'Engineers', desc: 'Inspect structural components, verify load-bearing elements, and check material properties.' },
      { icon: Users, title: 'Contractors', desc: 'Coordinate trades, detect clashes early, and align on-site teams with design intent.' },
      { icon: Eye, title: 'Facility Managers', desc: 'Access building data post-handover; navigate MEP systems, locate assets, and plan maintenance.' },
      { icon: Building2, title: 'Owners', desc: 'Track project information, review design decisions, and maintain a single source of truth.' },
    ],
    deepFeatures: [
      { icon: TreePine, title: 'Model Tree Explorer', desc: 'Browse every IFC entity from site structures down to individual fixtures in a hierarchical tree view.' },
      { icon: SearchIcon, title: 'Property Inspector', desc: 'View IFC metadata instantly. Click any element to inspect Pset attributes, GUIDs, materials, and quantities.' },
      { icon: Scissors, title: 'Section Cuts', desc: 'Slice through the model at any axis to inspect interior layouts, floor heights, and hidden components.' },
      { icon: Grid3x3, title: 'Categories Filtering', desc: 'Hide or show entire disciplines including architectural, structural, and MEP to focus on what matters.' },
      { icon: Bookmark, title: 'Saved Views', desc: 'Store and recall camera positions, element selections, and filter states for repeatable review sessions.' },
      { icon: Ruler, title: 'BIM Measurements', desc: 'Measure distance, area, and volume directly within the 3D model canvas with BIM-level precision.' },
      { icon: Layers, title: 'Exploded View', desc: 'Separate assemblies to understand component relationships, connection details, and construction logic.' },
      { icon: GitCompare, title: 'Multi-Model Overlay', desc: 'Compare revisions side-by-side or overlaid. Spot design changes across versions without leaving the viewer.' },
    ],
    security: [
      { icon: Lock, title: 'Enterprise-Grade Security', items: ['Secure cloud processing', 'HTTPS encryption on all data', 'SOC2-ready infrastructure', 'Files deleted automatically after session', 'No model sharing without explicit permission'] },
      { icon: ShieldCheck, title: 'Data Privacy', items: ['Zero-knowledge architecture; we never read your model data', 'GDPR compliant data handling', 'Optional self-hosted deployment', 'Audit logs for enterprise accounts', 'Role-based access control (RBAC)'] },
    ],
  },

  pointcloud: {
    type: 'pointcloud',
    heroHighlight: 'Point Cloud',
    heroRest: 'Viewer',
    accentClass: 'text-blue-600 dark:text-blue-400',
    accentBg: 'bg-blue-500',
    accentBorder: 'border-blue-500/20',
    accentCardBg: 'bg-blue-500/5 border-blue-500/15',
    tagline: 'LiDAR Point Cloud Viewer',
    heroDescription: 'A LiDAR point cloud viewer that loads billion-point scans in seconds; slice at any elevation, classify by feature type, and overlay against BIM models for scan-to-BIM validation and deviation analysis.',
    demoUrl: 'https://voxelxd.axisxd.com/',
    capabilityEyebrow: 'LiDAR / Reality Capture',
    capabilityHeadingHighlight: 'Powerful Point Cloud',
    capabilityHeadingRest: 'Capabilities',
    capabilitySubtext: 'Stream, analyze, and collaborate on massive LiDAR datasets from raw scans to BIM-integrated deviation reports.',
    capabilities: [
      { icon: ScanLine, title: 'LiDAR Visualization', description: 'Stream and render high-density point cloud files with custom color palettes and intensity mapping.' },
      { icon: Activity, title: 'Deviation Detection', description: 'Compare as-built scan data against design models and flag deviations beyond tolerance thresholds.' },
      { icon: Sliders, title: 'Cross-Section Analysis', description: 'Slice through point cloud volumes at any elevation to inspect structural cross-sections and floor grids.' },
      { icon: Layers, title: 'BIM Overlay', description: 'Overlay IFC model geometry onto point cloud scans for direct spatial comparison and clash review.' },
    ],
    workflowSubtext: 'Our Point Cloud Viewer brings scan data and BIM models together, enabling teams to detect deviations early and make decisions backed by real spatial data.',
    workflowHighlight: 'Point Cloud',
    formatsTitle: 'Supported Formats',
    formats: [
      { name: 'E57', label: 'Industry Standard' },
      { name: 'LAS / LAZ', label: 'LiDAR Archive' },
      { name: 'PTS', label: 'Leica Format' },
      { name: 'XYZ / PTX', label: 'Raw Point Data' },
    ],
    performance: [
      { label: 'Point Density', value: 'Up to 500M pts' },
      { label: 'Render Engine', value: 'WebGL 2.0' },
      { label: 'Concurrent Users', value: 'Unlimited' },
    ],
    workflowBenefits: [
      'Reduce site survey analysis time by 70%',
      'Detect construction deviations before handover',
      'Enable remote scan-to-BIM review sessions',
      'Validate as-built accuracy against design specs',
      'Accelerate QA/QC sign-off workflows',
      'Minimize rework from undetected clashes',
    ],
    stats: [
      { value: '500M', label: 'Max Points' },
      { value: 'WebGL', label: 'Renderer' },
      { value: '∞', label: 'Users' },
    ],
    metrics: [
      { value: '500M+', label: 'Points Streamed', sub: 'Real-time LiDAR rendering' },
      { value: '12K+', label: 'Scans Processed', sub: 'Certified survey integrations' },
      { value: '99.2%', label: 'Accuracy Rate', sub: 'mm-level spatial precision' },
      { value: '40%', label: 'Faster QA', sub: 'Reduced inspection cycles' },
    ],
    steps: [
      { num: '01', title: 'Upload Your Scan', desc: 'Drop E57, LAS, or LAZ files directly into the browser without pre-processing.', icon: '↑' },
      { num: '02', title: 'Auto-Indexes', desc: 'Point cloud loads with color, intensity, and spatial indexing for instant navigation.', icon: '⚡' },
      { num: '03', title: 'Analyze & Slice', desc: 'Cross-section, measure, and compare against IFC models with a single click.', icon: '◈' },
      { num: '04', title: 'Export & Report', desc: 'Generate deviation reports, screenshots, and shareable links for your team.', icon: '↗' },
    ],
    faqs: [
      { q: 'How does the Point Cloud Viewer work?', a: 'Upload E57, LAS, or LAZ files directly into the browser; the point cloud streams with spatial indexing, color, and intensity, ready for navigation and analysis.' },
      { q: 'What file formats are supported?', a: 'We support E57, LAS, LAZ, PTS, XYZ, and PTX formats for LiDAR and laser scan data.' },
      { q: 'How large of a point cloud can I view?', a: 'Our engine handles up to 500 million points with WebGL-accelerated rendering and spatial LOD streaming.' },
      { q: 'Can I overlay point cloud data with BIM?', a: 'Yes. Import IFC models alongside point cloud scans for direct spatial comparison and clash detection.' },
      { q: 'Do I need to install anything?', a: 'No installation required. Works in Chrome, Firefox, Edge, and Safari via WebGL 2.0.' },
    ],
    whyChoose: [
      { feature: 'Browser-Based Access', axisXd: '✓', competitor: '✗' },
      { feature: 'Installation Required', axisXd: '✗', competitor: '✓' },
      { feature: 'Shareable Project Links', axisXd: '✓', competitor: '✗' },
      { feature: 'Team Collaboration', axisXd: '✓', competitor: 'Limited' },
      { feature: 'Massive Point Cloud Streaming', axisXd: '✓', competitor: 'Limited' },
      { feature: 'Mobile & Tablet Access', axisXd: '✓', competitor: 'Limited' },
      { feature: 'Cloud-Based Viewing', axisXd: '✓', competitor: '✗' },
      { feature: 'Remote Site Review', axisXd: '✓', competitor: '✗' },
      { feature: 'Multi-User Access', axisXd: '✓', competitor: 'Limited' },
      { feature: 'Digital Twin Ready', axisXd: '✓', competitor: '✗' },
    ],
    competitorLabel: 'Desktop Point Cloud Viewer',
    useCases: [
      { icon: Building2, title: 'Architects', desc: 'Review existing conditions with millimeter-level accuracy before design begins.' },
      { icon: Ruler, title: 'Engineers', desc: 'Inspect structural elements, verify dimensions, and analyze complex site geometry.' },
      { icon: Users, title: 'Contractors', desc: 'Compare field conditions against plans and identify issues before construction delays occur.' },
      { icon: ScanLine, title: 'Surveyors', desc: 'Validate scan completeness, measure site conditions, and deliver reality-capture data efficiently.' },
      { icon: Building2, title: 'Facility Managers', desc: 'Access accurate digital representations of buildings for maintenance and asset management.' },
      { icon: Eye, title: 'Building Owners', desc: 'Visualize facilities remotely and make informed decisions using real-world site data.' },
      { icon: Bookmark, title: 'Heritage Teams', desc: 'Document historic structures and preserve highly detailed records for future restoration efforts.' },
      { icon: Layers, title: 'Digital Twin Teams', desc: 'Use point clouds as the foundation for creating and maintaining accurate digital twins.' },
    ],
    deepFeatures: [
      { icon: ScanLine, title: 'Point Cloud Explorer', desc: 'Navigate billions of points smoothly with optimized streaming and rendering for large campuses, industrial facilities, and city-scale scans.' },
      { icon: Ruler, title: 'Measurement Tools', desc: 'Measure distances, clearances, elevations, and dimensions directly inside the point cloud with point-to-point and area calculations.' },
      { icon: Scissors, title: 'Section Cuts & Clipping', desc: 'Slice through scans to inspect interiors, hidden utilities, and structural systems, revealing concealed conditions.' },
      { icon: Grid3x3, title: 'Classification Filtering', desc: 'Filter scan data by categories including ground, vegetation, buildings, utilities, and structural elements.' },
      { icon: Sun, title: 'Colorization Modes', desc: 'Visualize scans using multiple rendering styles: RGB color, intensity values, elevation heatmaps, and classification views.' },
      { icon: MapPin, title: 'Annotation & Markups', desc: 'Create comments, notes, and issue markers directly within the point cloud for QA/QC reviews and site inspections.' },
      { icon: Bookmark, title: 'Saved Viewpoints', desc: 'Capture and share specific locations, perspectives, and inspection areas for faster reviews and consistent reporting.' },
      { icon: GitCompare, title: 'Multi-Scan Overlay', desc: 'Compare multiple scans across different dates and project phases for construction progress tracking and change detection.' },
      { icon: Box, title: 'Point Cloud to BIM Review', desc: 'Validate scan data against BIM models to ensure design and reality remain aligned for as-built verification and digital twin workflows.' },
      { icon: Cpu, title: 'Massive Dataset Streaming', desc: 'Open and navigate extremely large scan datasets containing billions of points without downloading gigabytes of data, with fast browser-based rendering.' },
    ],
    faqIcon: true,
  },

  pano: {
    type: 'pano',
    heroHighlight: 'Pano',
    heroRest: 'Viewer',
    accentClass: 'text-blue-600 dark:text-blue-400',
    accentBg: 'bg-blue-500',
    accentBorder: 'border-blue-500/20',
    accentCardBg: 'bg-blue-500/5 border-blue-500/15',
    tagline: '360° Panorama Viewer',
    heroDescription: 'A 360° panorama viewer that walks job sites remotely, links immersive captures to BIM issues, and creates time-stamped photo records for progress tracking without a site visit.',
    demoUrl: 'https://xplorexd.axisxd.com/',
    capabilityEyebrow: '360° / Reality Capture',
    capabilityHeadingHighlight: 'Powerful Panorama',
    capabilityHeadingRest: 'Capabilities',
    capabilitySubtext: 'Document, navigate, and share 360° site reality and integrate it with BIM and point cloud data for complete spatial awareness.',
    capabilities: [
      { icon: Globe, title: '360° Navigation', description: 'Seamlessly pan and explore photogrammetric panoramas captured from any site location or vantage point.' },
      { icon: MapPin, title: 'Hotspot Inspection', description: 'Link inspection hotspots to BIM elements, measurement data, or issue annotations directly on the panorama.' },
      { icon: Camera, title: 'Reality Capture Fusion', description: 'Integrate panoramic imagery with point cloud and IFC data for full-context digital twin environments.' },
      { icon: Maximize2, title: 'Site Documentation', description: 'Capture and store time-stamped 360° records to track construction progress across project phases.' },
    ],
    workflowSubtext: 'Our Pano Viewer bridges the gap between physical site reality and digital design data, enabling remote inspection and progress monitoring at any project stage.',
    workflowHighlight: 'Pano',
    formatsTitle: 'Supported Formats',
    formats: [
      { name: 'JPEG / JPG', label: 'Equirectangular' },
      { name: 'PNG', label: 'High Resolution' },
      { name: 'TIFF', label: 'Lossless Quality' },
      { name: 'Matterport', label: 'Virtual Tours' },
    ],
    performance: [
      { label: 'Image Resolution', value: 'Up to 16K' },
      { label: 'Load Time', value: '< 5 Seconds' },
      { label: 'Concurrent Users', value: 'Unlimited' },
    ],
    workflowBenefits: [
      'Reduce physical site visits by up to 50%',
      'Enable remote progress monitoring at any phase',
      'Link 360° imagery to BIM inspection reports',
      'Accelerate client review and sign-off cycles',
      'Document as-built conditions with timestamps',
      'Improve stakeholder communication and transparency',
    ],
    stats: [
      { value: '16K', label: 'Max Resolution' },
      { value: '<5s', label: 'Load Time' },
      { value: '∞', label: 'Users' },
    ],
    metrics: [
      { value: '10K+', label: 'Panoramas Hosted', sub: 'Across active projects' },
      { value: '50+', label: 'Site Deployments', sub: 'Global construction sites' },
      { value: '16K', label: 'Max Resolution', sub: 'Ultra-high detail capture' },
      { value: '60%', label: 'Fewer Site Visits', sub: 'Remote inspection enabled' },
    ],
    steps: [
      { num: '01', title: 'Upload 360° Images', desc: 'Drop equirectangular JPEG, PNG, or TIFF files without stitching.', icon: '↑' },
      { num: '02', title: 'Auto-Stitches', desc: 'Panoramas link automatically into navigable tours with hotspot detection.', icon: '⚡' },
      { num: '03', title: 'Navigate & Inspect', desc: 'Explore sites remotely with smooth 360° navigation and BIM overlays.', icon: '◈' },
      { num: '04', title: 'Share & Collaborate', desc: 'Generate shareable tour links with annotations for stakeholder review.', icon: '↗' },
    ],
    faqs: [
      { q: 'How does the Panorama Viewer work?', a: 'Upload equirectangular JPEG, PNG, or TIFF files; panoramas link automatically into navigable tours with hotspot detection and BIM overlay.' },
      { q: 'What image formats are supported?', a: 'We support equirectangular JPEG, PNG, and TIFF. Matterport virtual tours are also supported.' },
      { q: 'What resolution is supported?', a: 'Our viewer handles up to 16K resolution panoramas with smooth 360° navigation and zoom.' },
      { q: 'Can I link panoramas to BIM data?', a: 'Yes. Overlay IFC model data onto panoramas, link hotspots to BIM elements, and document site conditions.' },
      { q: 'Do I need to install anything?', a: 'No installation required. Works in Chrome, Firefox, Edge, and Safari.' },
    ],
    useCases: [
      { icon: Camera, title: 'Construction Managers', desc: 'Conduct remote site walkthroughs, track progress, and keep stakeholders aligned without visiting the site.' },
      { icon: Building2, title: 'Architects', desc: 'Review as-built conditions remotely, verify spatial intent, and document design decisions with 360° records.' },
      { icon: Users, title: 'Contractors', desc: 'Share immersive site tours with subcontractors, coordinate trades, and document site conditions at each phase.' },
      { icon: Eye, title: 'Project Owners', desc: 'Monitor construction progress remotely with time-stamped panoramic records and progress comparison views.' },
      { icon: Shield, title: 'QA / QC Engineers', desc: 'Document site inspections with geotagged 360° imagery and link findings directly to BIM elements.' },
      { icon: MapPin, title: 'Surveyors', desc: 'Capture and share georeferenced panoramic surveys for site documentation and condition reporting.' },
      { icon: Globe, title: 'Facility Managers', desc: 'Maintain a visual record of as-built conditions for maintenance planning and handover documentation.' },
      { icon: Layers, title: 'Digital Twin Teams', desc: 'Use 360° panoramas as the visual layer in digital twin environments for immersive spatial context.' },
    ],
    deepFeatures: [
      { icon: Globe, title: '360° Immersive Navigation', desc: 'Smooth pan, tilt, and zoom navigation across equirectangular panoramas with hotspot-linked waypoint tours and scene transitions.' },
      { icon: MapPin, title: 'Hotspot Annotations', desc: 'Place inspection hotspots, issue markers, and informational tags at any point in the panorama for team collaboration and site documentation.' },
      { icon: Camera, title: 'BIM Overlay Integration', desc: 'Overlay IFC model data directly onto panoramic imagery to link 3D BIM elements with real site conditions.' },
      { icon: Ruler, title: 'Measurement Tools', desc: 'Measure distances and dimensions directly within panoramic scenes for spatial verification and site checking.' },
      { icon: Maximize2, title: 'Time-Stamped Records', desc: 'Automatically organize panoramas by date and location for chronological progress documentation and timeline comparison.' },
      { icon: Activity, title: 'Progress Comparison', desc: 'Compare panoramas captured at different project phases side by side to visually track construction milestones.' },
      { icon: Shield, title: 'Secure Sharing Links', desc: 'Generate shareable links to specific panorama scenes with access control for client reviews and stakeholder updates.' },
      { icon: Layers, title: 'Multi-Format Support', desc: 'Support for equirectangular JPEG, PNG, TIFF, and Matterport virtual tours up to 16K resolution.' },
    ],
  },

  deviation: {
    type: 'deviation',
    heroHighlight: 'Deviation',
    heroRest: 'Analyzer',
    accentClass: 'text-blue-600 dark:text-blue-400',
    accentBg: 'bg-blue-500',
    accentBorder: 'border-blue-500/20',
    accentCardBg: 'bg-blue-500/5 border-blue-500/15',
    tagline: 'Scan vs BIM Deviation Analysis',
    heroDescription: 'A deviation analyzer that compares LiDAR scans against BIM models, flags tolerance breaches in real time, and generates ISO-12053 compliant reports so you catch rework before it reaches the site.',
    demoUrl: '',
    capabilityEyebrow: 'Deviation / As-Built Analysis',
    capabilityHeadingHighlight: 'Powerful Deviation',
    capabilityHeadingRest: 'Capabilities',
    capabilitySubtext: 'Everything you need to compare design intent against physical reality with heatmap visualization, tolerance reporting, and automated compliance checks.',
    capabilities: [
      { icon: BarChart3, title: 'Heatmap Deviation Map', description: 'Color-coded heatmap overlay highlights deviations across the full model surface with mm-level precision.' },
      { icon: AlertTriangle, title: 'Tolerance Threshold Alerts', description: 'Define custom tolerance bands and receive automated alerts when deviations breach ISO-12053 limits.' },
      { icon: FileCheck, title: 'Automated Reports', description: 'Generate PDF/XLS deviation reports with annotated screenshots, statistics, and compliance status.' },
      { icon: TrendingDown, title: 'Trend & Drift Analysis', description: 'Track deviation trends across construction phases to identify systematic drift before handover.' },
    ],
    workflowSubtext: 'Our Deviation Analyzer eliminates manual comparison workflows, giving QA teams instant, quantifiable insight into as-built vs. design accuracy.',
    workflowHighlight: 'Deviation',
    formatsTitle: 'Supported Input Formats',
    formats: [
      { name: 'E57 / LAS', label: 'Point Cloud Input' },
      { name: 'IFC 4 / 4.3', label: 'BIM Reference' },
      { name: 'PDF / XLS', label: 'Report Export' },
      { name: 'DXF / OBJ', label: 'Mesh Reference' },
    ],
    performance: [
      { label: 'Deviation Precision', value: '±0.5 mm' },
      { label: 'Processing Speed', value: '<60s per M pts' },
      { label: 'Report Formats', value: 'PDF, XLS, SVG' },
    ],
    workflowBenefits: [
      'Detect deviations before concrete pour or handover',
      'Reduce re-inspection costs by up to 65%',
      'Validate as-built accuracy against ISO-12053',
      'Generate contractor-ready deviation reports instantly',
      'Prevent rework with early structural drift detection',
      'Support BIM mandate compliance documentation',
    ],
    stats: [
      { value: '±0.5mm', label: 'Precision' },
      { value: '<60s', label: 'Per Million pts' },
      { value: 'ISO', label: 'Compliant' },
    ],
    metrics: [
      { value: '±0.5mm', label: 'Deviation Precision', sub: 'ISO-12053 compliant' },
      { value: '<60s', label: 'Per Million Pts', sub: 'Fast processing engine' },
      { value: '99.8%', label: 'Detection Rate', sub: 'Automated deviation flagging' },
      { value: '65%', label: 'Less Rework', sub: 'Early drift detection savings' },
    ],
    steps: [
      { num: '01', title: 'Upload Scan + BIM', desc: 'Drop E57/LAS point cloud and IFC model; the analyzer aligns them automatically.', icon: '↑' },
      { num: '02', title: 'Auto-Registers', desc: 'Scans align to BIM coordinates with ICP registration in seconds.', icon: '⚡' },
      { num: '03', title: 'Review Heatmap', desc: 'Color-coded deviation map highlights every variance beyond tolerance.', icon: '◈' },
      { num: '04', title: 'Export Report', desc: 'Generate PDF/XLS deviation report with screenshots and compliance status.', icon: '↗' },
    ],
    faqs: [
      { q: 'How does the Deviation Analyzer work?', a: 'Upload point cloud scans and IFC models; the analyzer aligns them automatically using ICP registration and generates a color-coded deviation heatmap with mm-level precision.' },
      { q: 'What input formats are supported?', a: 'We accept E57, LAS, LAZ for point clouds and IFC 4/4.3, DXF, OBJ for reference models.' },
      { q: 'How accurate is the deviation detection?', a: 'Our engine detects deviations with ±0.5 mm precision, compliant with ISO-12053 standards.' },
      { q: 'Can I customize tolerance thresholds?', a: 'Yes. Define custom tolerance bands per zone or element. Automated alerts flag breaches instantly.' },
      { q: 'What report formats are available?', a: 'Generate PDF, XLS, and SVG reports with heatmap screenshots, statistics, and compliance documentation.' },
    ],
    faqIcon: true,
    whyChoose: [
      { feature: 'Automated Deviation Analysis', axisXd: '✓', competitor: '✗' },
      { feature: 'Browser-Based Access', axisXd: '✓', competitor: '✗' },
      { feature: 'Installation Required', axisXd: '✗', competitor: '✓' },
      { feature: 'Scan-to-BIM Comparison', axisXd: '✓', competitor: 'Limited' },
      { feature: 'Color-Coded Heatmaps', axisXd: '✓', competitor: '✗' },
      { feature: 'Team Collaboration', axisXd: '✓', competitor: 'Limited' },
      { feature: 'Progress Verification', axisXd: '✓', competitor: 'Manual' },
      { feature: 'Cloud Processing', axisXd: '✓', competitor: '✗' },
      { feature: 'Shareable Reports', axisXd: '✓', competitor: '✗' },
      { feature: 'Digital Twin Ready', axisXd: '✓', competitor: '✗' },
    ],
    competitorLabel: 'Desktop Deviation Analyzer',
    useCases: [
      { icon: Eye, title: 'BIM Coordinators', desc: 'Verify model accuracy and identify clashes between design and field conditions.' },
      { icon: Users, title: 'Contractors', desc: 'Detect installation errors early and reduce costly rework.' },
      { icon: BarChart3, title: 'Construction Managers', desc: 'Monitor project quality and track field progress against design milestones.' },
      { icon: Shield, title: 'Structural Engineers', desc: 'Validate steel, concrete, and structural components against approved models.' },
      { icon: Zap, title: 'MEP Engineers', desc: 'Confirm accurate placement of mechanical, electrical, and plumbing systems.' },
      { icon: MapPin, title: 'Surveyors', desc: 'Perform high-accuracy as-built verification using laser scan data.' },
      { icon: Building2, title: 'Facility Owners', desc: 'Ensure delivered assets match contractual design requirements.' },
      { icon: Layers, title: 'Digital Twin Teams', desc: 'Maintain alignment between physical assets and digital representations.' },
    ],
    deepFeatures: [
      { icon: GitCompare, title: 'Scan-to-BIM Comparison', desc: 'Compare point cloud scans directly against BIM models for accurate as-built verification, faster inspections, and improved project quality.' },
      { icon: BarChart3, title: 'Color-Coded Deviation Heatmaps', desc: 'Instantly visualize where field conditions differ from design intent using green for within tolerance, yellow for minor deviations, orange for warnings, and red for out of tolerance.' },
      { icon: AlertTriangle, title: 'Tolerance-Based Analysis', desc: 'Define project-specific acceptance thresholds of ±5 mm, ±10 mm, ±25 mm, or custom settings, suitable for fabrication, construction, and commissioning.' },
      { icon: SearchIcon, title: 'Automated Issue Detection', desc: 'Quickly identify areas requiring review without manually inspecting entire datasets. Find misaligned members, MEP errors, concrete deviations, and more.' },
      { icon: Scissors, title: 'Section-Based Validation', desc: 'Analyze deviations within specific floors, rooms, systems, or construction zones for focused reviews, faster investigations, and improved issue resolution.' },
      { icon: Eye, title: 'Element-Level Inspection', desc: 'Inspect individual model components and their associated deviation values including max deviation, average deviation, pass/fail status, and tolerance compliance.' },
      { icon: TrendingDown, title: 'Construction Progress Verification', desc: 'Compare reality capture data against planned design to track installation progress through weekly reviews, milestone validation, contractor reporting, and owner updates.' },
      { icon: Activity, title: 'Multi-Scan Comparison', desc: 'Compare scans captured at different stages of construction for progress monitoring, change detection, historical analysis, and quality tracking.' },
      { icon: FileCheck, title: 'Interactive Reporting', desc: 'Generate visual reports highlighting deviations and compliance status including heatmaps, screenshots, measurements, summary statistics, and compliance results.' },
      { icon: MapPin, title: 'Collaboration & Issue Tracking', desc: 'Share findings with stakeholders through annotations and review workflows for faster issue resolution, improved accountability, and better communication.' },
    ],
  },

  rol: {
    type: 'rol',
    heroHighlight: 'Rights of',
    heroRest: 'Light',
    accentClass: 'text-blue-600 dark:text-blue-400',
    accentBg: 'bg-blue-500',
    accentBorder: 'border-blue-500/20',
    accentCardBg: 'bg-blue-500/5 border-blue-500/15',
    tagline: 'Sun Path & Daylight Analysis',
    heroDescription: 'A rights of light analyzer that simulates sun paths, measures VSC and ADF against BRE standards, and generates planning-compliant daylight reports so you can submit with confidence and defend against ROL challenges.',
    demoUrl: '',
    capabilityEyebrow: 'Rights of Light / Solar Analysis',
    capabilityHeadingHighlight: 'Powerful Solar',
    capabilityHeadingRest: 'Capabilities',
    capabilitySubtext: 'Everything you need to assess daylight access, simulate shadow impact, and generate legally defensible Rights of Light reports for planning submissions.',
    capabilities: [
      { icon: Sun, title: 'Sun Path Simulation', description: 'Animate real sun trajectory across any date, time, and geographic coordinate to model daylight access accurately.' },
      { icon: Compass, title: 'Shadow Analysis', description: 'Project accurate shadow footprints across any hour and season, mapped directly onto site and neighboring properties.' },
      { icon: Zap, title: 'Daylight Assessment', description: 'Quantify daylight levels and identify which windows or zones fall below the 45° / 50% VSC threshold criteria.' },
      { icon: Shield, title: 'ROL Compliance Report', description: 'Generate professionally formatted Rights of Light reports with obstruction analysis and legal compliance notes.' },
    ],
    workflowSubtext: 'Our ROL platform gives architects, developers, and planning consultants the evidence they need to defend proposals and avoid costly legal challenges from neighbors.',
    workflowHighlight: 'ROL',
    formatsTitle: 'Supported Input Formats',
    formats: [
      { name: 'IFC 4 / 4.3', label: 'BIM Input' },
      { name: 'DXF / DWG', label: 'CAD Plans' },
      { name: 'GeoJSON', label: 'Site Geometry' },
      { name: 'PDF / SVG', label: 'Report Export' },
    ],
    performance: [
      { label: 'Solar Accuracy', value: '±1° Arc' },
      { label: 'Analysis Speed', value: '< 30 Seconds' },
      { label: 'Report Formats', value: 'PDF, SVG, PNG' },
    ],
    workflowBenefits: [
      'Identify ROL risks before planning submission',
      'Simulate shadow impact on neighboring properties',
      'Generate VSC / ADF compliant daylight reports',
      'Reduce planning rejection risk with evidence-based data',
      'Accelerate pre-application consultations with LPA',
      'Support BRE / RICS daylight and sunlight standards',
    ],
    stats: [
      { value: '±1°', label: 'Solar Accuracy' },
      { value: '<30s', label: 'Analysis Time' },
      { value: 'VSC', label: 'Compliant' },
    ],
    metrics: [
      { value: '±1°', label: 'Solar Arc Accuracy', sub: 'Precision sun-path modeling' },
      { value: '<30s', label: 'Analysis Time', sub: 'Rapid simulation engine' },
      { value: 'VSC', label: 'Daylight Compliant', sub: 'BRE 45°/50% standard' },
      { value: '100%', label: 'Defensible Reports', sub: 'Legally admissible output' },
    ],
    steps: [
      { num: '01', title: 'Upload Your Model', desc: 'Drop IFC, DXF, or GeoJSON files; the platform auto-detects site coordinates.', icon: '↑' },
      { num: '02', title: 'Set Location & Date', desc: 'Geo-coordinates and date range set automatically or customized manually.', icon: '⚡' },
      { num: '03', title: 'Simulate Shadows', desc: 'Animate sun paths, analyze shadow obstruction, and review VSC compliance.', icon: '◈' },
      { num: '04', title: 'Export ROL Report', desc: 'Generate a professionally formatted Rights of Light report with legal compliance notes.', icon: '↗' },
    ],
    faqs: [
      { q: 'How does Rights of Light analysis work?', a: 'Upload your BIM or CAD model; the platform auto-detects site coordinates, simulates sun paths, and generates VSC/ADF compliant daylight reports.' },
      { q: 'What file formats are supported?', a: 'We support IFC 4/4.3, DXF, DWG, GeoJSON for model input and PDF, SVG, PNG for report export.' },
      { q: 'How accurate is the solar simulation?', a: 'Our engine computes sun trajectory with ±1 degree arc accuracy for any geographic location and date.' },
      { q: 'Does it comply with BRE standards?', a: 'Yes. Reports include VSC (Vertical Sky Component) and ADF (Average Daylight Factor) per BRE/RIBA guidelines.' },
      { q: 'Can I use this for planning submissions?', a: 'Absolutely. Generate legally defensible ROL reports suitable for planning applications and neighbor consultations.' },
    ],
    faqIcon: true,
    whyChoose: [
      { feature: 'Browser-Based Access', axisXd: '✓', competitor: '✗' },
      { feature: 'Automated Daylight Analysis', axisXd: '✓', competitor: 'Limited' },
      { feature: '3D Context Modeling', axisXd: '✓', competitor: 'Manual' },
      { feature: 'Real-Time Impact Visualization', axisXd: '✓', competitor: '✗' },
      { feature: 'Shareable Results', axisXd: '✓', competitor: 'Limited' },
      { feature: 'Cloud-Based Processing', axisXd: '✓', competitor: '✗' },
      { feature: 'Collaboration Tools', axisXd: '✓', competitor: 'Limited' },
      { feature: 'Development Scenario Testing', axisXd: '✓', competitor: 'Manual' },
      { feature: 'Planning Support Outputs', axisXd: '✓', competitor: 'Limited' },
      { feature: 'No Software Installation', axisXd: '✓', competitor: '✗' },
    ],
    competitorLabel: 'Desktop ROL Software',
    useCases: [
      { icon: Building2, title: 'Property Developers', desc: 'Evaluate development feasibility and identify rights-of-light risks before planning submission.' },
      { icon: Box, title: 'Architects', desc: 'Optimize building massing and design strategies while minimizing daylight impacts on neighboring properties.' },
      { icon: FileCheck, title: 'Planning Consultants', desc: 'Support planning applications with visual evidence and impact assessments.' },
      { icon: Sun, title: 'ROL Surveyors', desc: 'Conduct professional daylight and sunlight studies with greater efficiency.' },
      { icon: Globe, title: 'Urban Designers', desc: 'Understand how new developments affect surrounding urban environments.' },
      { icon: Shield, title: 'Legal Advisors', desc: 'Assess potential rights-of-light concerns and support dispute resolution processes.' },
      { icon: Eye, title: 'Local Authorities', desc: 'Review development proposals and understand daylight impacts on existing communities.' },
      { icon: Building2, title: 'Asset Owners', desc: 'Protect access to natural light and understand how nearby developments may affect property value.' },
    ],
    deepFeatures: [
      { icon: GitCompare, title: 'Existing vs Proposed Analysis', desc: 'Compare current site conditions against proposed building designs for early risk identification, better design decisions, and faster stakeholder reviews.' },
      { icon: Sun, title: 'Daylight Impact Visualization', desc: 'Understand how proposed developments affect surrounding properties through shadow studies, daylight reduction maps, impact zones, and exposure analysis.' },
      { icon: Globe, title: '3D Urban Context Modeling', desc: 'Analyze developments within the context of surrounding buildings and urban environments, supporting city blocks, neighborhoods, commercial districts, and mixed-use developments.' },
      { icon: Compass, title: 'Shadow Analysis', desc: 'Visualize shadows throughout the day and across different seasons; evaluate morning shadows, midday conditions, evening impacts, and seasonal variations.' },
      { icon: Zap, title: 'Sun Path Simulation', desc: 'Simulate solar movement and understand how sunlight interacts with buildings over time for improved design optimization and better daylight access.' },
      { icon: Layers, title: 'Multi-Scenario Testing', desc: 'Compare alternative building designs to determine the optimal development strategy by testing height adjustments, massing changes, setback variations, and orientation options.' },
      { icon: FileCheck, title: 'Impact Assessment Reporting', desc: 'Generate visual reports that clearly communicate findings to stakeholders including daylight analysis results, shadow diagrams, and development comparisons.' },
      { icon: Maximize2, title: 'Interactive 3D Review', desc: 'Explore developments and surrounding properties from any perspective with orbit navigation, building isolation, viewpoint analysis, and stakeholder presentations.' },
      { icon: Users, title: 'Collaboration Workflows', desc: 'Share assessments and findings with project teams, consultants, and decision makers for faster reviews, improved communication, and better planning coordination.' },
      { icon: Shield, title: 'Planning & Development Support', desc: 'Provide evidence-based insights to support planning submissions and development decisions for applications, feasibility studies, design reviews, and consultations.' },
    ],
  },

  monitoring: {
    type: 'monitoring',
    heroHighlight: 'Construction',
    heroRest: 'Monitoring',
    accentClass: 'text-blue-600 dark:text-blue-400',
    accentBg: 'bg-blue-500',
    accentBorder: 'border-blue-500/20',
    accentCardBg: 'bg-blue-500/5 border-blue-500/15',
    tagline: 'Site Progress Intelligence',
    heroDescription: 'A construction monitoring platform that turns site photos, 360° panoramas, and LiDAR scans into timeline comparisons with AI-powered change alerts so project teams spot schedule drift early and keep stakeholders aligned without weekly walks.',
    demoUrl: '',
    capabilityEyebrow: 'Construction / Progress Monitoring',
    capabilityHeadingHighlight: 'Powerful Site',
    capabilityHeadingRest: 'Monitoring',
    capabilitySubtext: 'Everything you need to document, track, and verify construction progress against schedules with time-based comparisons and automated status reporting.',
    capabilities: [
      { icon: Camera, title: 'Visual Progress Tracking', description: 'Capture and compare site photographs across time to visualize construction progress between any two dates.' },
      { icon: Activity, title: 'Timeline Comparison', description: 'Overlay progress photos, point cloud scans, and BIM models on a unified timeline for phase-by-phase review.' },
      { icon: BarChart3, title: 'Status Dashboards', description: 'Monitor project health with automated KPIs, percent complete, schedule variance, and milestone achievement rates.' },
      { icon: Shield, title: 'Change Detection Alerts', description: 'Receive automated alerts when visual analysis or sensor data detects deviations from the planned construction schedule.' },
    ],
    workflowSubtext: 'Our Construction Monitoring platform transforms site data into actionable insights, keeping project teams aligned and ahead of schedule.',
    workflowHighlight: 'Monitoring',
    formatsTitle: 'Supported Input Formats',
    formats: [
      { name: 'JPEG / PNG', label: 'Site Photography' },
      { name: '360 Pano', label: 'Immersive Capture' },
      { name: 'E57 / LAS', label: 'LiDAR Scans' },
      { name: 'IFC 4', label: 'BIM Reference' },
    ],
    performance: [
      { label: 'Comparison Speed', value: '< 10 Seconds' },
      { label: 'Photo Storage', value: 'Unlimited' },
      { label: 'Reports', value: 'PDF / CSV / SVG' },
    ],
    workflowBenefits: [
      'Reduce physical site visit frequency by 60%',
      'Detect schedule drift before it impacts milestones',
      'Enable remote stakeholder progress reviews',
      'Generate time-lapse documentation for handover',
      'Validate contractor claimed progress against visual data',
      'Support delay claim analysis with timestamped records',
    ],
    stats: [
      { value: '640+', label: 'Sites Monitored' },
      { value: '<10s', label: 'Comparison Time' },
      { value: '99.9%', label: 'Uptime' },
    ],
    metrics: [
      { value: '640+', label: 'Sites Monitored', sub: 'Global construction portfolio' },
      { value: '<10s', label: 'Comparison Time', sub: 'Instant timeline diff analysis' },
      { value: '99.9%', label: 'Platform Uptime', sub: 'Enterprise-grade reliability' },
      { value: '60%', label: 'Fewer Site Visits', sub: 'Remote monitoring savings' },
    ],
    steps: [
      { num: '01', title: 'Upload Site Data', desc: 'Drop photos, 360° panoramas, or LiDAR scans; all formats are accepted.', icon: '↑' },
      { num: '02', title: 'Auto-Timelines', desc: 'Data organizes chronologically with date-stamped comparison points.', icon: '⚡' },
      { num: '03', title: 'Track Progress', desc: 'Side-by-side timeline view with AI-powered change detection and KPIs.', icon: '◈' },
      { num: '04', title: 'Share Reports', desc: 'Generate status dashboards and timeline reports for stakeholder review.', icon: '↗' },
    ],
    faqs: [
      { q: 'How does Construction Monitoring work?', a: 'Upload site photos, 360° panoramas, or LiDAR scans; the platform auto-organizes data into timelines and detects changes using AI-powered comparison.' },
      { q: 'What data formats are supported?', a: 'We accept JPEG, PNG, 360° panoramas, E57, LAS, and IFC 4 for comprehensive site documentation.' },
      { q: 'How fast is the comparison?', a: 'Timeline comparisons process in under 10 seconds, with AI-powered change detection flagging differences automatically.' },
      { q: 'Can I share progress with stakeholders?', a: 'Yes. Generate shareable dashboard links and PDF/CSV reports for contractors, clients, and project managers.' },
      { q: 'Do I need to install anything?', a: 'No installation required. Works in Chrome, Firefox, Edge, and Safari.' },
    ],
    useCases: [
      { icon: BarChart3, title: 'Construction Managers', desc: 'Track project milestones, detect schedule drift early, and keep all stakeholders aligned with visual progress reports.' },
      { icon: Users, title: 'General Contractors', desc: 'Document site conditions at every phase, validate subcontractor progress, and maintain an auditable site record.' },
      { icon: Building2, title: 'Project Owners', desc: 'Monitor construction remotely with timestamped documentation and automated progress dashboards.' },
      { icon: Shield, title: 'QA / QC Engineers', desc: 'Validate as-built conditions against design milestones and flag deviations before they become costly issues.' },
      { icon: Eye, title: 'BIM Coordinators', desc: 'Overlay point cloud and panoramic data against BIM schedules for phase-accurate verification.' },
      { icon: Camera, title: 'Site Engineers', desc: 'Capture daily site photos and 360° panoramas that auto-organize into dated timeline comparisons.' },
      { icon: FileCheck, title: 'Project Consultants', desc: 'Provide clients with evidence-based progress reports backed by visual records and AI change detection.' },
      { icon: Layers, title: 'Digital Twin Teams', desc: 'Use construction monitoring data to keep digital twin models updated with real site progress.' },
    ],
    deepFeatures: [
      { icon: Activity, title: 'Timeline Comparison Engine', desc: 'Automatically organise site photos, 360° panoramas, and LiDAR scans by date and location for side-by-side phase comparisons.' },
      { icon: Camera, title: 'AI-Powered Change Detection', desc: 'Computer vision algorithms automatically identify construction changes between captures, flagging new elements, removals, and deviations.' },
      { icon: BarChart3, title: 'Progress Dashboards', desc: 'Automated KPI dashboards tracking percent complete, schedule variance, milestone achievement, and trend analysis across the full project.' },
      { icon: MapPin, title: 'Geotagged Site Records', desc: 'All site captures are geotagged and location-referenced, enabling spatial filtering and site-zone progress tracking.' },
      { icon: Shield, title: 'Contractor Progress Validation', desc: 'Cross-reference contractor-claimed progress against visual documentation with evidence-backed acceptance or rejection workflows.' },
      { icon: Eye, title: 'BIM Schedule Overlay', desc: 'Overlay IFC BIM schedules onto captured site reality to compare planned vs actual construction progress by element.' },
      { icon: FileCheck, title: 'Automated Report Generation', desc: 'Generate PDF progress reports with timeline screenshots, KPI summaries, and change detection findings for stakeholder distribution.' },
      { icon: Globe, title: 'Remote Stakeholder Access', desc: 'Secure shareable links allow clients, consultants, and remote teams to review site progress from anywhere, anytime.' },
    ],
  },

  dxf: {
    type: 'dxf',
    heroHighlight: 'DXF / 2D',
    heroRest: 'Viewer',
    accentClass: 'text-blue-600 dark:text-blue-400',
    accentBg: 'bg-blue-500',
    accentBorder: 'border-blue-500/20',
    accentCardBg: 'bg-blue-500/5 border-blue-500/15',
    tagline: 'DXF / DWG CAD Viewer',
    heroDescription: 'A DXF/DWG CAD viewer that opens engineering drawings instantly in the browser; measure dimensions, toggle layers, add redlines, and share with stakeholders. No AutoCAD seat required.',
    demoUrl: '',
    capabilityEyebrow: 'CAD / 2D Drawings',
    capabilityHeadingHighlight: 'Powerful CAD',
    capabilityHeadingRest: 'Capabilities',
    capabilitySubtext: 'Navigate complex technical drawings with speed, precision, and collaboration built into every workflow.',
    capabilities: [
      { icon: Layers, title: 'Drawing Navigator', description: 'Quickly browse large drawings, move between layouts and sheets with smooth zoom and fast pan controls.' },
      { icon: Ruler, title: 'Smart Measurements', description: 'Measure directly within the CAD drawing with linear dimensions, area, radius, angle, and perimeter calculations.' },
      { icon: Grid3x3, title: 'Layer Manager', description: 'Control visibility of individual drawing layers to show or hide layers, isolate disciplines, reduce clutter, and improve readability.' },
      { icon: MapPin, title: 'Drawing Markups', description: 'Collaborate using comments, annotations, and issue markers directly on drawings for design reviews and QA/QC workflows.' },
    ],
    workflowSubtext: 'AXIS XD enables teams to open, review, and collaborate on DXF drawings directly in the browser, eliminating software installations and providing instant access from any device.',
    workflowHighlight: 'DXF',
    formatsTitle: 'Supported Drawing Types',
    formats: [
      { name: 'DXF', label: 'CAD Exchange' },
      { name: 'DWG', label: 'Native AutoCAD' },
      { name: 'DWF', label: 'Web Format' },
      { name: 'PDF / SVG', label: 'Export' },
    ],
    performance: [
      { label: 'Drawing Size', value: 'Up to 500 MB' },
      { label: 'Load Time', value: '< 5 Seconds' },
      { label: 'Concurrent Users', value: 'Unlimited' },
    ],
    workflowBenefits: [
      'Eliminate CAD software installation barriers',
      'Enable instant drawing sharing across teams',
      'Accelerate design review and approval cycles',
      'Reduce project coordination delays',
      'Improve cross-team collaboration',
      'Minimize costly print and shipping costs',
    ],
    stats: [
      { value: '500 MB', label: 'Max Drawing Size' },
      { value: '<5s', label: 'Load Time' },
      { value: '∞', label: 'Users' },
    ],
    metrics: [
      { value: '10K+', label: 'Drawings Hosted', sub: 'CAD files across active projects' },
      { value: '500+', label: 'Active Teams', sub: 'Architects, engineers & contractors' },
      { value: '99.9%', label: 'Uptime', sub: 'Enterprise-grade platform reliability' },
      { value: '60%', label: 'Faster Reviews', sub: 'Reduced design review cycle time' },
    ],
    steps: [
      { num: '01', title: 'Upload Your Drawing', desc: 'Drag & drop DXF, DWG, or DWF files directly into the browser without signing up or installing software.', icon: '↑' },
      { num: '02', title: 'Auto-Renders', desc: 'Drawing loads instantly with all layers, entities, and metadata preserved for immediate navigation.', icon: '⚡' },
      { num: '03', title: 'Navigate & Measure', desc: 'Pan, zoom, inspect entities, manage layers, and measure precisely with smart measurement tools.', icon: '◈' },
      { num: '04', title: 'Share & Collaborate', desc: 'Generate secure shareable links with markups and annotations for your team and stakeholders.', icon: '↗' },
    ],
    faqs: [
      { q: 'How does the DXF Viewer work?', a: 'Upload DXF, DWG, or DWF files directly into the browser; all layers, entities, and metadata are preserved for instant navigation and measurement.' },
      { q: 'What file formats are supported?', a: 'We support DXF, DWG, and DWF for input. Export drawings as PDF or SVG for reporting and distribution.' },
      { q: 'How large of a drawing can I view?', a: 'Our viewer handles DXF and DWG files up to 500 MB in size, with cloud-optimized rendering for fast load times.' },
      { q: 'Can I collaborate with my team?', a: 'Absolutely. Share annotated views via secure generated links, add markups and comments, and coordinate across disciplines in real time.' },
      { q: 'Do I need to install anything?', a: 'No installation required. Works entirely in your browser and is compatible with Chrome, Firefox, Edge, and Safari.' },
    ],
    faqIcon: true,
    whyChoose: [
      { feature: 'Browser-Based Access', axisXd: '✓', competitor: '✗' },
      { feature: 'Installation Required', axisXd: '✗', competitor: '✓' },
      { feature: 'Instant Drawing Sharing', axisXd: '✓', competitor: '✗' },
      { feature: 'Team Collaboration', axisXd: '✓', competitor: 'Limited' },
      { feature: 'Mobile & Tablet Access', axisXd: '✓', competitor: 'Limited' },
      { feature: 'Cloud-Based Viewing', axisXd: '✓', competitor: '✗' },
      { feature: 'Drawing Markups', axisXd: '✓', competitor: 'Limited' },
      { feature: 'Measurement Tools', axisXd: '✓', competitor: '✓' },
      { feature: 'Version Accessibility', axisXd: '✓', competitor: '✗' },
      { feature: 'No CAD License Needed', axisXd: '✓', competitor: '✗' },
    ],
    competitorLabel: 'Desktop CAD / DXF Viewer',
    useCases: [
      { icon: Building2, title: 'Architects', desc: 'Review floor plans, elevations, and design layouts without opening CAD software.' },
      { icon: Ruler, title: 'Civil Engineers', desc: 'Analyze site plans, utility networks, grading layouts, and infrastructure drawings.' },
      { icon: Shield, title: 'Structural Engineers', desc: 'Inspect framing plans, foundation layouts, and structural details with precision.' },
      { icon: Users, title: 'Contractors', desc: 'Coordinate field activities using up-to-date construction drawings from any device.' },
      { icon: MapPin, title: 'Surveyors', desc: 'Review boundary maps, topographic drawings, and site layouts directly in the browser.' },
      { icon: Layers, title: 'Manufacturing Teams', desc: 'Visualize fabrication drawings, machine layouts, and production plans without CAD.' },
      { icon: Eye, title: 'Facility Managers', desc: 'Access building plans and maintenance documentation from any device, anywhere.' },
      { icon: Building2, title: 'Project Owners', desc: 'Review project documentation and provide feedback without requiring CAD expertise.' },
    ],
    deepFeatures: [
      { icon: Layers, title: 'Drawing Navigator', desc: 'Quickly browse large drawings and move between layouts and sheets with smooth zooming, fast pan controls, and instant navigation.' },
      { icon: Grid3x3, title: 'Layer Manager', desc: 'Control visibility of individual drawing layers to show or hide disciplines, reduce clutter, and improve drawing readability.' },
      { icon: Ruler, title: 'Smart Measurements', desc: 'Measure directly within the CAD drawing with support for linear dimensions, area calculations, radius, angle, and perimeter measurements.' },
      { icon: SearchIcon, title: 'Entity Inspector', desc: 'Inspect detailed properties of CAD elements including layer name, object type, coordinates, dimensions, and full CAD metadata.' },
      { icon: MapPin, title: 'Drawing Markups', desc: 'Collaborate using comments and annotations directly on drawings for design reviews, QA/QC workflows, and client feedback.' },
      { icon: Bookmark, title: 'Saved Views', desc: 'Save important drawing locations for future access, enabling faster navigation, team consistency, and efficient reviews.' },
      { icon: GitCompare, title: 'Multi-Drawing Comparison', desc: 'Compare revisions and drawing versions side by side for design updates, change tracking, and construction coordination.' },
      { icon: SearchIcon, title: 'Precision Zoom & Snap', desc: 'Navigate intricate drawing details without losing accuracy with infinite zoom, coordinate precision, and smooth detail inspection.' },
      { icon: Globe, title: 'Shareable Drawing Links', desc: 'Generate secure links to share drawings with project stakeholders for faster collaboration and real-time access without software installation.' },
      { icon: Cpu, title: 'Large Drawing Performance', desc: 'Open complex DXF files efficiently using cloud-optimized rendering with support for large site plans, utility networks, and multi-layer CAD files.' },
    ],
  },

  cad: {
    type: 'cad',
    heroHighlight: 'CAD / DXF',
    heroRest: 'Viewer',
    accentClass: 'text-blue-600 dark:text-blue-400',
    accentBg: 'bg-blue-500',
    accentBorder: 'border-blue-500/20',
    accentCardBg: 'bg-blue-500/5 border-blue-500/15',
    tagline: 'CAD / DXF Drawing Viewer',
    heroDescription: 'A CAD drawing viewer that opens DXF, DWG, and DWF files in the browser; pan large drawings at 60 FPS, toggle layer visibility, take smart measurements, and share with stakeholders. No CAD license needed.',
    demoUrl: '',
    capabilityEyebrow: 'CAD / 2D Drawings',
    capabilityHeadingHighlight: 'Powerful CAD',
    capabilityHeadingRest: 'Capabilities',
    capabilitySubtext: 'Navigate complex technical drawings with speed, precision, and collaboration built into every workflow.',
    capabilities: [
      { icon: Layers, title: 'Drawing Navigator', description: 'Quickly browse large drawings, move between layouts and sheets with smooth zoom and fast pan controls.' },
      { icon: Ruler, title: 'Smart Measurements', description: 'Measure directly within the CAD drawing with linear dimensions, area, radius, angle, and perimeter calculations.' },
      { icon: Grid3x3, title: 'Layer Manager', description: 'Control visibility of individual drawing layers to show or hide layers, isolate disciplines, reduce clutter, and improve readability.' },
      { icon: MapPin, title: 'Drawing Markups', description: 'Collaborate using comments, annotations, and issue markers directly on drawings for design reviews and QA/QC workflows.' },
    ],
    workflowSubtext: 'AXIS XD enables teams to open, review, and collaborate on CAD and DXF drawings directly in the browser, eliminating software installations and providing instant access from any device.',
    workflowHighlight: 'CAD / DXF',
    formatsTitle: 'Supported Drawing Types',
    formats: [
      { name: 'DXF', label: 'CAD Exchange' },
      { name: 'DWG', label: 'Native AutoCAD' },
      { name: 'DWF', label: 'Web Format' },
      { name: 'PDF / SVG', label: 'Export' },
    ],
    performance: [
      { label: 'Drawing Size', value: 'Up to 500 MB' },
      { label: 'Load Time', value: '< 5 Seconds' },
      { label: 'Concurrent Users', value: 'Unlimited' },
    ],
    workflowBenefits: [
      'Eliminate CAD software installation barriers',
      'Enable instant drawing sharing across teams',
      'Accelerate design review and approval cycles',
      'Reduce project coordination delays',
      'Improve cross-team collaboration',
      'Minimize costly print and shipping costs',
    ],
    stats: [
      { value: '500 MB', label: 'Max Drawing Size' },
      { value: '<5s', label: 'Load Time' },
      { value: '∞', label: 'Users' },
    ],
    metrics: [
      { value: '10K+', label: 'Drawings Hosted', sub: 'CAD files across active projects' },
      { value: '500+', label: 'Active Teams', sub: 'Architects, engineers & contractors' },
      { value: '99.9%', label: 'Uptime', sub: 'Enterprise-grade platform reliability' },
      { value: '60%', label: 'Faster Reviews', sub: 'Reduced design review cycle time' },
    ],
    steps: [
      { num: '01', title: 'Upload Your Drawing', desc: 'Drag & drop DXF, DWG, or DWF files directly into the browser without signing up or installing software.', icon: '↑' },
      { num: '02', title: 'Auto-Renders', desc: 'Drawing loads instantly with all layers, entities, and metadata preserved for immediate navigation.', icon: '⚡' },
      { num: '03', title: 'Navigate & Measure', desc: 'Pan, zoom, inspect entities, manage layers, and measure precisely with smart measurement tools.', icon: '◈' },
      { num: '04', title: 'Share & Collaborate', desc: 'Generate secure shareable links with markups and annotations for your team and stakeholders.', icon: '↗' },
    ],
    faqs: [
      { q: 'How does the CAD / DXF Viewer work?', a: 'Upload CAD and DXF drawings directly into the browser; the viewer preserves all layers, measurements, and metadata for instant review and collaboration.' },
      { q: 'What file formats are supported?', a: 'We support DXF, DWG, and DWF for input. Export drawings as PDF or SVG for reporting and distribution.' },
      { q: 'How large of a drawing can I view?', a: 'Our viewer handles DXF and DWG files up to 500 MB in size, with cloud-optimized rendering for fast load times.' },
      { q: 'Can I collaborate with my team?', a: 'Absolutely. Share annotated views via secure generated links, add markups and comments, and coordinate across disciplines in real time.' },
      { q: 'Do I need to install anything?', a: 'No installation required. Works entirely in your browser and is compatible with Chrome, Firefox, Edge, and Safari.' },
    ],
    faqIcon: true,
    whyChoose: [
      { feature: 'Browser-Based Access', axisXd: '✓', competitor: '✗' },
      { feature: 'Installation Required', axisXd: '✗', competitor: '✓' },
      { feature: 'Instant Drawing Sharing', axisXd: '✓', competitor: '✗' },
      { feature: 'Team Collaboration', axisXd: '✓', competitor: 'Limited' },
      { feature: 'Mobile & Tablet Access', axisXd: '✓', competitor: 'Limited' },
      { feature: 'Cloud-Based Viewing', axisXd: '✓', competitor: '✗' },
      { feature: 'Drawing Markups', axisXd: '✓', competitor: 'Limited' },
      { feature: 'Measurement Tools', axisXd: '✓', competitor: '✓' },
      { feature: 'Version Accessibility', axisXd: '✓', competitor: '✗' },
      { feature: 'No CAD License Needed', axisXd: '✓', competitor: '✗' },
    ],
    competitorLabel: 'Desktop CAD / DXF Viewer',
    useCases: [
      { icon: Building2, title: 'Architects', desc: 'Review floor plans, elevations, and design layouts without opening CAD software.' },
      { icon: Ruler, title: 'Civil Engineers', desc: 'Analyze site plans, utility networks, grading layouts, and infrastructure drawings.' },
      { icon: Shield, title: 'Structural Engineers', desc: 'Inspect framing plans, foundation layouts, and structural details with precision.' },
      { icon: Users, title: 'Contractors', desc: 'Coordinate field activities using up-to-date construction drawings from any device.' },
      { icon: MapPin, title: 'Surveyors', desc: 'Review boundary maps, topographic drawings, and site layouts directly in the browser.' },
      { icon: Layers, title: 'Manufacturing Teams', desc: 'Visualize fabrication drawings, machine layouts, and production plans without CAD.' },
      { icon: Eye, title: 'Facility Managers', desc: 'Access building plans and maintenance documentation from any device, anywhere.' },
      { icon: Building2, title: 'Project Owners', desc: 'Review project documentation and provide feedback without requiring CAD expertise.' },
    ],
    deepFeatures: [
      { icon: Layers, title: 'Drawing Navigator', desc: 'Quickly browse large drawings and move between layouts and sheets with smooth zooming, fast pan controls, and instant navigation.' },
      { icon: Grid3x3, title: 'Layer Manager', desc: 'Control visibility of individual drawing layers to show or hide disciplines, reduce clutter, and improve drawing readability.' },
      { icon: Ruler, title: 'Smart Measurements', desc: 'Measure directly within the CAD drawing with support for linear dimensions, area calculations, radius, angle, and perimeter measurements.' },
      { icon: SearchIcon, title: 'Entity Inspector', desc: 'Inspect detailed properties of CAD elements including layer name, object type, coordinates, dimensions, and full CAD metadata.' },
      { icon: MapPin, title: 'Drawing Markups', desc: 'Collaborate using comments and annotations directly on drawings for design reviews, QA/QC workflows, and client feedback.' },
      { icon: Bookmark, title: 'Saved Views', desc: 'Save important drawing locations for future access, enabling faster navigation, team consistency, and efficient reviews.' },
      { icon: GitCompare, title: 'Multi-Drawing Comparison', desc: 'Compare revisions and drawing versions side by side for design updates, change tracking, and construction coordination.' },
      { icon: SearchIcon, title: 'Precision Zoom & Snap', desc: 'Navigate intricate drawing details without losing accuracy with infinite zoom, coordinate precision, and smooth detail inspection.' },
      { icon: Globe, title: 'Shareable Drawing Links', desc: 'Generate secure links to share drawings with project stakeholders for faster collaboration and real-time access without software installation.' },
      { icon: Cpu, title: 'Large Drawing Performance', desc: 'Open complex DXF files efficiently using cloud-optimized rendering with support for large site plans, utility networks, and multi-layer CAD files.' },
    ],
  },

  mesh: {
    type: 'mesh',
    heroHighlight: '3D Mesh',
    heroRest: 'Viewer',
    accentClass: 'text-blue-600 dark:text-blue-400',
    accentBg: 'bg-blue-500',
    accentBorder: 'border-blue-500/20',
    accentCardBg: 'bg-blue-500/5 border-blue-500/15',
    tagline: '3D Mesh & Model Viewer',
    heroDescription: 'A 3D mesh viewer that opens photogrammetry and reality-capture meshes in OBJ, FBX, glTF, and STL formats with DRACO compression and smooth WebGL rendering. Inspect surfaces, take measurements, and share models with stakeholders.',
    demoUrl: '',
    capabilityEyebrow: '3D / Mesh Models',
    capabilityHeadingHighlight: 'Powerful 3D Mesh',
    capabilityHeadingRest: 'Capabilities',
    capabilitySubtext: 'Render, inspect, and analyze detailed 3D mesh models with real-time performance and precision measurement.',
    capabilities: [
      { icon: Box, title: '3D Model Rendering', description: 'Render textured 3D meshes with real-time WebGL performance, LOD scaling, and smooth orbit controls.' },
      { icon: Eye, title: 'Mesh Inspection', description: 'Inspect individual mesh surfaces, vertices, and polygons with real-time highlight and selection.' },
      { icon: Ruler, title: 'Surface Measurements', description: 'Measure distances, surface areas, and curvature directly on 3D mesh geometry.' },
      { icon: Scissors, title: 'Section Cuts', description: 'Slice through mesh geometry at any axis to inspect interior surfaces and hidden structures.' },
    ],
    workflowSubtext: 'Our 3D Mesh Viewer brings complex geometry to life, enabling teams to inspect, measure, and validate reality-captured surfaces with precision and speed.',
    workflowHighlight: '3D Mesh',
    formatsTitle: 'Supported Formats',
    formats: [
      { name: 'OBJ', label: 'Standard Mesh' },
      { name: 'FBX', label: 'Animated Models' },
      { name: 'glTF', label: 'Web Standard' },
      { name: 'STL / PLY', label: 'CAD / Scan' },
    ],
    performance: [
      { label: 'Max Vertices', value: 'Up to 50M' },
      { label: 'Render Engine', value: 'WebGL 2.0' },
      { label: 'Concurrent Users', value: 'Unlimited' },
    ],
    workflowBenefits: [
      'Inspect reality-captured surfaces with full fidelity',
      'Validate as-built conditions against design intent',
      'Reduce site visit frequency with remote inspection',
      'Enable cross-team review of complex geometry',
      'Accelerate QA/QC sign-off on mesh deliverables',
      'Improve asset condition assessment workflows',
    ],
    stats: [
      { value: '50M', label: 'Max Vertices' },
      { value: 'WebGL', label: 'Render Engine' },
      { value: '∞', label: 'Users' },
    ],
    metrics: [
      { value: '50M+', label: 'Vertices Streamed', sub: 'Real-time mesh rendering' },
      { value: '5K+', label: 'Models Processed', sub: 'Certified mesh integrations' },
      { value: '99.7%', label: 'Accuracy Rate', sub: 'Surface fidelity preserved' },
      { value: '45%', label: 'Faster Inspections', sub: 'Reduced review cycles' },
    ],
    steps: [
      { num: '01', title: 'Upload Your Mesh', desc: 'Drag & drop OBJ, FBX, glTF, or STL files directly into the browser without signing up or installing software.', icon: '↑' },
      { num: '02', title: 'Auto-Optimizes', desc: 'Mesh loads with LOD optimization, texture mapping, and spatial indexing for instant navigation.', icon: '⚡' },
      { num: '03', title: 'Navigate & Inspect', desc: 'Orbit, zoom, section cut, and inspect mesh surfaces with precise measurement tools.', icon: '◈' },
      { num: '04', title: 'Share & Collaborate', desc: 'Generate secure shareable links with annotations and markups for your team and stakeholders.', icon: '↗' },
    ],
    faqs: [
      { q: 'How does the 3D Mesh Viewer work?', a: 'Upload OBJ, FBX, glTF, STL, or PLY files directly into the browser; meshes load with LOD optimization, texture mapping, and full measurement tools.' },
      { q: 'What file formats are supported?', a: 'We support OBJ, FBX, glTF, STL, and PLY for mesh input. Export as screenshots or shareable links.' },
      { q: 'How large of a mesh can I view?', a: 'Our engine handles up to 50 million vertices with WebGL-accelerated rendering and LOD streaming.' },
      { q: 'Can I measure dimensions on the mesh?', a: 'Yes. Measure distances, surface areas, and curvature directly on the 3D mesh geometry with precision.' },
      { q: 'Do I need to install anything?', a: 'No installation required. Works in Chrome, Firefox, Edge, and Safari via WebGL 2.0.' },
    ],
    faqIcon: true,
    whyChoose: [
      { feature: 'Browser-Based Access', axisXd: '✓', competitor: '✗' },
      { feature: 'Installation Required', axisXd: '✗', competitor: '✓' },
      { feature: 'Real-Time Mesh Rendering', axisXd: '✓', competitor: 'Limited' },
      { feature: 'Team Collaboration', axisXd: '✓', competitor: 'Limited' },
      { feature: 'Mobile & Tablet Access', axisXd: '✓', competitor: 'Limited' },
      { feature: 'Cloud-Based Viewing', axisXd: '✓', competitor: '✗' },
      { feature: 'Section Cut Tools', axisXd: '✓', competitor: 'Limited' },
      { feature: 'Surface Measurements', axisXd: '✓', competitor: 'Limited' },
      { feature: 'Large Dataset Support', axisXd: '✓', competitor: '✗' },
      { feature: 'Shareable Links', axisXd: '✓', competitor: '✗' },
    ],
    competitorLabel: 'Desktop 3D Mesh Viewer',
    useCases: [
      { icon: Building2, title: 'Architects', desc: 'Review textured facade models and reality-captured surface geometry from any device.' },
      { icon: Ruler, title: 'Structural Engineers', desc: 'Inspect steel connections, concrete surfaces, and complex structural mesh geometry.' },
      { icon: Users, title: 'Contractors', desc: 'Validate as-built mesh models against design intent during construction phases.' },
      { icon: Eye, title: 'Facility Managers', desc: 'Access accurate 3D representations of assets for maintenance planning and inspections.' },
      { icon: Box, title: 'Heritage Teams', desc: 'Document and preserve detailed 3D scans of historic structures and artifacts.' },
      { icon: Layers, title: 'Digital Twin Teams', desc: 'Use high-fidelity mesh models as the visual foundation for digital twin environments.' },
      { icon: Cpu, title: 'Manufacturing Teams', desc: 'Inspect product geometry and validate fabricated parts against reference models.' },
      { icon: Globe, title: 'Urban Planners', desc: 'Visualize city-scale mesh models for planning, simulation, and stakeholder presentations.' },
    ],
    deepFeatures: [
      { icon: Box, title: 'Real-Time Mesh Rendering', desc: 'Stream and render high-detail 3D meshes with WebGL 2.0 acceleration and automatic LOD optimization for smooth navigation.' },
      { icon: Grid3x3, title: 'Textured Surface Display', desc: 'View full-color textured meshes with UV mapping, material properties, and high-resolution surface detail preservation.' },
      { icon: Scissors, title: 'Section Cuts & Clipping', desc: 'Slice through mesh geometry at any axis to inspect interior surfaces, hidden structures, and cross-sectional profiles.' },
      { icon: Ruler, title: 'Precision Measurements', desc: 'Measure distances, surface areas, angles, and curvature directly on the mesh geometry with point-to-point accuracy.' },
      { icon: SearchIcon, title: 'Surface Deviation Analysis', desc: 'Compare mesh surfaces against reference geometry to detect deformation, wear, or manufacturing deviations.' },
      { icon: Eye, title: 'Element Isolation & Highlight', desc: 'Isolate specific mesh components or regions for focused inspection and detailed surface analysis.' },
      { icon: Bookmark, title: 'Saved Viewpoints', desc: 'Capture and share specific camera positions, section cuts, and inspection states for faster review cycles.' },
      { icon: MapPin, title: 'Annotations & Markups', desc: 'Add comments, issue markers, and measurement annotations directly on the mesh surface for team collaboration.' },
      { icon: Cpu, title: 'LOD Performance Scaling', desc: 'Automatic level-of-detail optimization enables smooth navigation of massive datasets without compromising visual quality.' },
      { icon: Globe, title: 'Shareable Model Links', desc: 'Generate secure links to share 3D mesh models with stakeholders, providing instant access from any browser and no software installation.' },
    ],
  },

  clash: {
    type: 'clash',
    heroHighlight: 'Clash',
    heroRest: 'Detection',
    accentClass: 'text-blue-600 dark:text-blue-400',
    accentBg: 'bg-blue-500',
    accentBorder: 'border-blue-500/20',
    accentCardBg: 'bg-blue-500/5 border-blue-500/15',
    tagline: 'BIM Clash Detection & Resolution',
    heroDescription: 'A BIM clash detection engine that finds hard and soft interferences across federated models, prioritises by severity, and exports BCF issues so teams resolve conflicts before they become RFIs and change orders.',
    demoUrl: '',
    capabilityEyebrow: 'Clash / Conflict Analysis',
    capabilityHeadingHighlight: 'Powerful Clash',
    capabilityHeadingRest: 'Detection',
    capabilitySubtext: 'Everything you need to identify, prioritize, and resolve BIM clashes across disciplines with automated rule-based detection and collaborative resolution workflows.',
    capabilities: [
      { icon: AlertTriangle, title: 'Automated Clash Detection', description: 'Run rule-based clash detection across all BIM disciplines including structural, MEP, architectural, and civil with configurable tolerance thresholds.' },
      { icon: XCircle, title: 'Hard & Soft Clash Analysis', description: 'Identify hard clashes (geometric interference) and soft clashes (clearance/access violations) in a single unified scan.' },
      { icon: GitCompare, title: 'Multi-Discipline Comparison', description: 'Compare models from different authors and disciplines side-by-side to pinpoint cross-team conflicts and coordination issues.' },
      { icon: CheckCircle2, title: 'Resolution Tracking', description: 'Assign, track, and verify clash resolutions with an integrated issue log and status-based workflow.' },
    ],
    workflowSubtext: 'Our Clash Detection engine surfaces every conflict in your BIM model before it reaches the jobsite, saving time, materials, and coordination overhead.',
    workflowHighlight: 'Clash',
    formatsTitle: 'Supported Input Formats',
    formats: [
      { name: 'IFC 4 / 4.3', label: 'BIM Models' },
      { name: 'NWC / NWD', label: 'Navisworks' },
      { name: 'BCF', label: 'Issue Exchange' },
      { name: 'PDF / CSV', label: 'Report Export' },
    ],
    performance: [
      { label: 'Detection Speed', value: '< 30 Seconds' },
      { label: 'Clash Types', value: 'Hard + Soft' },
      { label: 'Model Size', value: 'Up to 5 GB' },
    ],
    workflowBenefits: [
      'Identify clashes before construction begins',
      'Reduce RFI and change order frequency by 50%',
      'Enable cross-discipline coordination in minutes',
      'Prioritize critical clashes with automated severity scoring',
      'Track resolution progress through closure',
      'Generate contractor-ready clash reports instantly',
    ],
    stats: [
      { value: '<30s', label: 'Analysis Speed' },
      { value: '2,500+', label: 'Clashes Found' },
      { value: 'BCF', label: 'Open Standard' },
    ],
    metrics: [
      { value: '<30s', label: 'Analysis Speed', sub: 'Full model clash scan engine' },
      { value: '2,500+', label: 'Clashes Detected', sub: 'Average per large project' },
      { value: '99.5%', label: 'Detection Rate', sub: 'Automated rule-based scanning' },
      { value: '50%', label: 'Fewer RFIs', sub: 'Pre-construction conflict resolution' },
    ],
    steps: [
      { num: '01', title: 'Upload BIM Models', desc: 'Drop IFC, NWC, or NWD files from multiple disciplines including structural, MEP, and architectural models.', icon: '↑' },
      { num: '02', title: 'Auto-Detects', desc: 'Engine scans all model combinations with configurable tolerance thresholds and clash rules.', icon: '⚡' },
      { num: '03', title: 'Review & Prioritize', desc: 'Review clash results in a prioritised list with severity scoring, 3D context, and discipline tags.', icon: '◈' },
      { num: '04', title: 'Resolve & Export', desc: 'Assign resolutions, track status, and export BCF/PDF clash reports for contractor coordination.', icon: '↗' },
    ],
    faqs: [
      { q: 'How does Clash Detection work?', a: 'Upload IFC, NWC, or NWD models from multiple disciplines; the engine scans all combinations with configurable tolerances and surfaces every conflict.' },
      { q: 'What file formats are supported?', a: 'We support IFC 4/4.3, NWC, and NWD for model input. Export clash reports as PDF, CSV, or BCF for issue exchange.' },
      { q: 'How fast is the clash detection?', a: 'Full model clash scans complete in under 30 seconds, even for large multi-discipline assemblies up to 5 GB.' },
      { q: 'Can I customize clash detection rules?', a: 'Yes. Define custom tolerance thresholds per discipline pair, set hard/soft clash rules, and configure severity scoring per project.' },
      { q: 'Can I export clash reports for contractors?', a: 'Yes. Generate PDF, CSV, and BCF reports with clash descriptions, 3D context screenshots, and resolution status.' },
    ],
    faqIcon: true,
    whyChoose: [
      { feature: 'Automated Clash Detection', axisXd: '✓', competitor: '✗' },
      { feature: 'Browser-Based Access', axisXd: '✓', competitor: '✗' },
      { feature: 'Installation Required', axisXd: '✗', competitor: '✓' },
      { feature: 'Multi-Discipline Support', axisXd: '✓', competitor: 'Limited' },
      { feature: 'Hard + Soft Clash Analysis', axisXd: '✓', competitor: '✗' },
      { feature: '3D Clash Visualization', axisXd: '✓', competitor: 'Limited' },
      { feature: 'Collaborative Resolution', axisXd: '✓', competitor: 'Limited' },
      { feature: 'Cloud Processing', axisXd: '✓', competitor: '✗' },
      { feature: 'BCF Issue Exchange', axisXd: '✓', competitor: '✗' },
      { feature: 'Severity Scoring', axisXd: '✓', competitor: 'Manual' },
    ],
    competitorLabel: 'Desktop Clash Detector',
    useCases: [
      { icon: Building2, title: 'BIM Coordinators', desc: 'Run multi-discipline clash detection across structural, MEP, and architectural models in one platform.' },
      { icon: Shield, title: 'Structural Engineers', desc: 'Identify conflicts between steel framing, concrete structure, and MEP routing before fabrication.' },
      { icon: Zap, title: 'MEP Engineers', desc: 'Detect pipe/duct clashes with structural elements and ensure service clearance compliance.' },
      { icon: Users, title: 'General Contractors', desc: 'Prevent costly field conflicts by resolving clashes during pre-construction coordination.' },
      { icon: Eye, title: 'Project Managers', desc: 'Track clash resolution progress and maintain coordination accountability across disciplines.' },
      { icon: Layers, title: 'Digital Twin Teams', desc: 'Maintain clash-free digital twin models for accurate facility management and operations.' },
      { icon: Box, title: 'Architects', desc: 'Ensure architectural elements are free from structural and MEP interference.' },
      { icon: FileCheck, title: 'Quality Assurance', desc: 'Verify that all identified clashes are resolved before construction milestones.' },
    ],
    deepFeatures: [
      { icon: AlertTriangle, title: 'Rule-Based Clash Detection', desc: 'Define project-specific clash rules including hard clash tolerance (0 mm overlap), soft clash clearance (50–300 mm), and discipline-pair-specific thresholds.' },
      { icon: GitCompare, title: 'Multi-Model Comparison', desc: 'Compare any combination of IFC models from different authors and disciplines. Structural vs MEP, architectural vs structural, or full federated model scan.' },
      { icon: XCircle, title: 'Hard Clash Identification', desc: 'Detect geometric interference where two elements occupy the same physical space such as pipes through beams, ducts through columns, and conduit through walls.' },
      { icon: TrendingDown, title: 'Soft Clash Analysis', desc: 'Identify clearance violations where elements are too close for access, maintenance, or insulation, including working space, service access, and fire safety zones.' },
      { icon: BarChart3, title: 'Severity-Based Prioritization', desc: 'Automatically score clashes by severity using critical (structural), high (MEP-main routing), medium (architectural), and low (finishes) ratings for focused resolution.' },
      { icon: Eye, title: '3D Clash Visualization', desc: 'View each clash in its full 3D context with the ability to orbit, zoom, isolate conflicting elements, and inspect element properties.' },
      { icon: SearchIcon, title: 'Element-Level Inspection', desc: 'Inspect individual clashing elements by element type, material, level, discipline, and author for informed resolution decisions.' },
      { icon: MapPin, title: 'Clash Annotation & Markup', desc: 'Add comments, screenshots, and resolution instructions directly to each clash for clear communication and faster issue resolution.' },
      { icon: FileCheck, title: 'BCF Issue Exchange', desc: 'Export clashes as BCF (BIM Collaboration Format) for import into Navisworks, Solibri, Revit, or any BCF-compatible platform.' },
      { icon: CheckCircle2, title: 'Resolution Tracking Dashboard', desc: 'Monitor clash resolution progress with real-time status tracking through open, assigned, in review, resolved, and verified states across the entire project.' },
    ],
  },

  'digital-twin': {
    type: 'digital-twin',
    heroHighlight: 'Digital',
    heroRest: 'Twin',
    accentClass: 'text-blue-600 dark:text-blue-400',
    accentBg: 'bg-blue-500',
    accentBorder: 'border-blue-500/20',
    accentCardBg: 'bg-blue-500/5 border-blue-500/15',
    tagline: 'Digital Twin Platform',
    heroDescription: 'A digital twin platform that connects BIM models with live IoT sensors, BMS data, and operational dashboards so facility teams monitor equipment health, predict maintenance needs, and optimize building performance from a single pane of glass.',
    demoUrl: '',
    capabilityEyebrow: 'Digital Twin / IoT Platform',
    capabilityHeadingHighlight: 'Intelligent Digital',
    capabilityHeadingRest: 'Twin Platform',
    capabilitySubtext: 'Everything you need to create, monitor, and optimize digital twins from BIM-based visualization to live IoT integration and AI-powered predictive analytics.',
    capabilities: [
      { icon: Box, title: 'Interactive 3D Visualization', description: 'Browser-based multi-model federation with BIM, GIS, and reality capture integration without installing software.' },
      { icon: Cpu, title: 'IoT & Sensor Integration', description: 'Connect real-time data from HVAC, energy meters, occupancy sensors, lighting controls, and environmental monitoring systems.' },
      { icon: Activity, title: 'Live Operational Monitoring', description: 'Real-time dashboards with KPI tracking, equipment health monitoring, fault detection, and automated alert management.' },
      { icon: BarChart3, title: 'AI Predictive Analytics', description: 'Leverage historical data for predictive maintenance, energy optimization, equipment failure forecasting, and operational risk assessment.' },
    ],
    workflowSubtext: 'AXIS XD Digital Twin transforms BIM data into a living operational platform that improves facility performance, reduces costs, and enables smarter decisions across the entire asset lifecycle.',
    workflowHighlight: 'Digital Twin',
    formatsTitle: 'Platform Capabilities',
    formats: [
      { name: 'IFC 4 / 4.3', label: 'BIM Model Input' },
      { name: 'IoT / MQTT', label: 'Sensor Integration' },
      { name: 'REST API', label: 'Enterprise Data' },
      { name: 'PDF / CSV', label: 'Report & Export' },
    ],
    performance: [
      { label: 'Model Size', value: 'Unlimited' },
      { label: 'IoT Data Rate', value: 'Real-Time' },
      { label: 'Uptime SLA', value: '99.9%' },
    ],
    workflowBenefits: [
      'Turn static BIM into a living operational platform',
      'Connect IoT sensors for real-time building intelligence',
      'Reduce maintenance costs with predictive analytics',
      'Centralize data from multiple systems into one view',
      'Improve space utilization and energy efficiency',
      'Enable faster decision-making with live dashboards',
    ],
    stats: [
      { value: '99.9%', label: 'Uptime' },
      { value: 'Real-Time', label: 'IoT Data' },
      { value: 'Unlimited', label: 'Models' },
    ],
    metrics: [
      { value: '10K+', label: 'Assets Connected', sub: 'Digital twin deployments worldwide' },
      { value: '99.9%', label: 'Platform Uptime', sub: 'Enterprise-grade reliability' },
      { value: '60%', label: 'Lower Maintenance Cost', sub: 'Predictive maintenance savings' },
      { value: 'Real-Time', label: 'IoT Data Streaming', sub: 'Live sensor integration' },
    ],
    steps: [
      { num: '01', title: 'Upload BIM Model', desc: 'Import IFC, CAD, or reality capture data to create your interactive 3D digital twin environment.', icon: '↑' },
      { num: '02', title: 'Connect IoT Sensors', desc: 'Integrate real-time data from HVAC, energy meters, occupancy sensors, and building systems.', icon: '⚡' },
      { num: '03', title: 'Monitor & Analyze', desc: 'Live dashboards, KPI tracking, equipment health monitoring, and automated alerts.', icon: '◈' },
      { num: '04', title: 'Predict & Optimize', desc: 'AI-powered analytics for predictive maintenance, energy optimization, and operational forecasting.', icon: '↗' },
    ],
    faqs: [
      { q: 'What is a Digital Twin?', a: 'A digital twin is a dynamic digital replica of a physical asset that combines BIM models with live IoT data, enabling real-time monitoring, analysis, and predictive insights throughout the asset lifecycle.' },
      { q: 'What data sources can be integrated?', a: 'We support IFC, BIM, CAD, and reality capture models combined with live IoT data from HVAC systems, energy meters, temperature sensors, occupancy sensors, lighting controls, security systems, SCADA, BMS, and asset management platforms.' },
      { q: 'How does predictive analytics work?', a: 'Our AI engine analyzes historical operational data and trends to predict equipment failures, energy demand, occupancy patterns, and maintenance needs, enabling proactive decision-making.' },
      { q: 'Can I start with just BIM data?', a: 'Yes. Begin with a BIM-based digital twin for asset information management, then gradually add IoT sensors and real-time data as your program matures.' },
      { q: 'Is the platform accessible from any device?', a: 'Yes. The entire platform runs in the browser without installing software. Accessible from desktop, tablet, and mobile devices.' },
    ],
    faqIcon: true,
    whyChoose: [
      { feature: '3D Visualization', axisXd: '✓', competitor: '✓' },
      { feature: 'Asset Information', axisXd: '✓', competitor: '✓' },
      { feature: 'Real-Time IoT Data', axisXd: '✓', competitor: '✗' },
      { feature: 'Live Monitoring', axisXd: '✓', competitor: '✗' },
      { feature: 'Predictive Analytics', axisXd: '✓', competitor: '✗' },
      { feature: 'AI Insights', axisXd: '✓', competitor: '✗' },
      { feature: 'Maintenance Integration', axisXd: '✓', competitor: 'Limited' },
      { feature: 'Browser Access', axisXd: '✓', competitor: 'Limited' },
      { feature: 'Multi-System Integration', axisXd: '✓', competitor: '✗' },
      { feature: 'Operational Decision Support', axisXd: '✓', competitor: '✗' },
    ],
    useCases: [
      { icon: Building2, title: 'Commercial Real Estate', desc: 'Optimize building operations, tenant experience, energy usage, and asset performance across your portfolio.' },
      { icon: Shield, title: 'Healthcare', desc: 'Monitor critical hospital equipment, ensure environmental compliance, and optimize space utilization.' },
      { icon: Cpu, title: 'Manufacturing', desc: 'Track production equipment performance, predict maintenance needs, and improve operational efficiency.' },
      { icon: Globe, title: 'Airports & Transportation', desc: 'Monitor infrastructure health, analyze passenger flow, and manage asset lifecycles across transport networks.' },
      { icon: Building2, title: 'Education Campuses', desc: 'Manage campus-wide facilities, plan space utilization, and drive sustainability initiatives.' },
      { icon: Zap, title: 'Data Centers', desc: 'Environmental monitoring, capacity planning, energy management, and critical infrastructure visibility.' },
      { icon: Sun, title: 'Utilities & Energy', desc: 'Network monitoring, infrastructure performance tracking, predictive maintenance, and risk management.' },
      { icon: Layers, title: 'Smart Cities', desc: 'Urban infrastructure management, public asset monitoring, mobility analytics, and sustainability reporting.' },
    ],
    deepFeatures: [
      { icon: Box, title: 'Interactive 3D Visualization', desc: 'Browser-based access with multi-model federation, BIM and GIS integration, and full mobile and desktop support.' },
      { icon: Cpu, title: 'Asset Intelligence', desc: 'Equipment tracking, asset history management, warranty information, maintenance records, and performance analytics.' },
      { icon: Activity, title: 'Operational Monitoring', desc: 'Live dashboards, KPI tracking, alert management, fault detection, and incident investigation tools.' },
      { icon: BarChart3, title: 'AI & Predictive Analytics', desc: 'Predictive maintenance, failure prediction, energy optimization, capacity planning, and operational forecasting.' },
      { icon: Building2, title: 'Facility Management Integration', desc: 'CMMS and CAFM integration, work order management, asset lifecycle management, and maintenance scheduling.' },
      { icon: MapPin, title: 'Space Management', desc: 'Track occupancy, utilization rates, and workplace performance across floors, zones, and entire campuses.' },
      { icon: Zap, title: 'Energy & Sustainability', desc: 'Monitor energy consumption, carbon performance, environmental conditions, and drive sustainability initiatives.' },
      { icon: Globe, title: 'Multi-System Integration', desc: 'Connect HVAC, BMS, SCADA, security, lighting, and enterprise systems into one unified digital twin environment.' },
      { icon: Eye, title: 'Scenario Planning & Simulation', desc: 'Run what-if scenarios, simulate operational changes, and model the impact of equipment upgrades or layout changes.' },
      { icon: FileCheck, title: 'Compliance & Reporting', desc: 'Automated compliance monitoring, environmental reporting, and operational audit trails for regulatory requirements.' },
    ],
    security: [
      { icon: Lock, title: 'Enterprise-Grade Security', items: ['SOC2-ready infrastructure', 'HTTPS encryption on all data', 'Role-based access control (RBAC)', 'Multi-factor authentication (MFA)', 'Audit logging for all operations'] },
      { icon: ShieldCheck, title: 'Data Privacy & Compliance', items: ['GDPR compliant data handling', 'Data residency options available', 'Zero-knowledge architecture options', 'Self-hosted deployment available', 'SSO / SAML integration support'] },
    ],
  },
};

const VIEWER_SEO: Record<ViewerType, { title: string; description: string; canonicalPath: string }> = {
  ifc: { title: 'IFC Viewer', description: 'View and analyze BIM models online with AxisXD IFC Viewer with support for Revit, ArchiCAD, and more.', canonicalPath: '/viewer/ifc' },
  pointcloud: { title: 'Point Cloud LiDAR Viewer', description: 'Visualize LiDAR point cloud data in your browser with AxisXD Point Cloud Viewer.', canonicalPath: '/viewer/point-cloud' },
  pano: { title: 'Pano 360° Viewer', description: 'Explore panoramic site imagery with AxisXD 360° Panoramic Viewer for construction and facility management.', canonicalPath: '/viewer/pano' },
  dxf: { title: 'DXF Viewer', description: 'View CAD drawings and DXF files online with AxisXD CAD Viewer without installation.', canonicalPath: '/viewer/dxf' },
  cad: { title: 'CAD/DXF Viewer', description: 'View CAD drawings and DXF files online with AxisXD CAD Viewer without installation.', canonicalPath: '/viewer/cad' },
  mesh: { title: '3D Mesh Viewer', description: 'Render and inspect 3D mesh models in real time with AxisXD Mesh Viewer.', canonicalPath: '/viewer/mesh' },
  'digital-twin': { title: 'Digital Twin Platform', description: 'Unify BIM, point cloud, panoramic, and CAD data into a single digital twin with AxisXD.', canonicalPath: '/viewer/digital-twin' },
  deviation: { title: 'Deviation Analysis', description: 'Compare as-built 3D data against design models with AxisXD Deviation Analysis tools.', canonicalPath: '/analysis/deviation' },
  rol: { title: 'Rights of Light Analysis', description: 'Simulate solar access and rights of light with AxisXD analysis tools.', canonicalPath: '/analysis/rol' },
  monitoring: { title: 'Construction Monitoring', description: 'Track construction progress over time with AxisXD Construction Monitoring.', canonicalPath: '/analysis/monitoring' },
  clash: { title: 'Clash Detection', description: 'Detect interferences between BIM elements with AxisXD Clash Detection engine.', canonicalPath: '/analysis/clash' },
};

// All viewer types currently render the same blue accent classes — ported verbatim from the
// source getIconColors/getDividerColor/getHUDColor maps (which are per-type but identical values).
const ICON_COLOR_CLASS = 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20';
const DIVIDER_COLOR_CLASS = 'bg-blue-500/20';
const HUD_COLOR_CLASS = 'text-blue-400';

const VERSION_TAGS: Record<ViewerType, string> = {
  ifc: 'IFC_VIEWER_v2.4',
  pointcloud: 'LIDAR_STREAM_v3.1',
  pano: 'PANO_360_v1.8',
  deviation: 'DEVIATION_v2.0',
  rol: 'ROL_SOLAR_v1.5',
  monitoring: 'MONITORING_v1.2',
  dxf: 'DXF_CAD_v1.0',
  cad: 'CAD_DXF_v1.0',
  mesh: 'MESH_3D_v1.0',
  clash: 'CLASH_DETECT_v1.0',
  'digital-twin': 'DTWIN_PLATFORM_v1.0',
};

const VIEWER_HERO_IMAGES: Partial<Record<ViewerType, string>> = {
  ifc: 'assets/images/viewers/ifc_viewer.webp',
  pointcloud: 'assets/images/viewers/point_cloud_viewer.webp',
  pano: 'assets/images/viewers/Pano_Viewer.webp',
  dxf: 'assets/images/viewers/Dxf_Viewer.webp',
  cad: 'assets/images/viewers/Dxf_Viewer.webp',
  mesh: 'assets/images/viewers/Mesh_viewer.webp',
  'digital-twin': 'assets/images/viewers/ifc_viewer.webp',
};

const ANALYSIS_HERO_IMAGES: Partial<Record<ViewerType, string>> = {
  deviation: 'assets/images/analysis/deviation_analyzer.webp',
  rol: 'assets/images/analysis/rights_of_light.webp',
  clash: 'assets/images/analysis/clash_detection.webp',
  monitoring: 'assets/images/analysis/construction_monitoring.webp',
};

const SYS_TAGS: Record<ViewerType, string> = {
  ifc: 'SYS_BIM',
  pointcloud: 'SYS_LIDAR',
  pano: 'SYS_PANO',
  deviation: 'SYS_DEVIATION',
  rol: 'SYS_ROL',
  dxf: 'SYS_DXF',
  cad: 'SYS_CAD',
  mesh: 'SYS_MESH',
  clash: 'SYS_CLASH',
  monitoring: 'SYS_MONITOR',
  'digital-twin': 'SYS_MONITOR',
};

const HERO_GLOW_COLORS: Partial<Record<ViewerType, string>> = {
  pano: '#A855F7',
  pointcloud: '#06B6D4',
  dxf: '#3B82F6',
  cad: '#3B82F6',
  mesh: '#8B5CF6',
};

const NO_FREE_BADGE: ViewerType[] = ['digital-twin', 'deviation', 'rol', 'monitoring', 'clash'];

const CONTEXT_LINES: Record<ViewerType, string> = {
  ifc: 'Upload an IFC file and start reviewing BIM models with property inspection, element isolation, and team markups from your browser. No install.',
  pointcloud: 'Drop a LAS or E57 file and explore billion-point LiDAR scans with cross-section slicing, classification filters, and BIM overlay instantly in the browser.',
  pano: 'Upload a 360° equirectangular image and walk your site remotely; link panoramas to BIM issues, add hotspots, and document progress without leaving your desk.',
  deviation: 'Upload a point cloud and a BIM model side by side; see color-coded deviation heatmaps in seconds. Detect tolerance breaches before they reach the site.',
  rol: 'Enter a site address and run a full sun-path simulation. Get BRE-compliant VSC and ADF reports ready for planning submissions in minutes.',
  monitoring: 'Drop site photos or panoramas onto a timeline; AI detects changes automatically. See what progressed, what drifted, and what needs attention.',
  dxf: 'Open a DWG or DXF instantly: measure, toggle layers, add redlines, and share a link. No CAD software or license needed.',
  cad: 'Open a DWG or DXF instantly: measure, toggle layers, add redlines, and share a link. No CAD software or license needed.',
  mesh: 'Upload an OBJ, FBX, or glTF mesh; inspect textured surfaces, take measurements, and share with stakeholders. DRACO compression included.',
  clash: 'Load federated IFC models and run clash detection; hard and soft clashes are flagged with severity scores. Export issues as BCF for your authoring tools.',
  'digital-twin': 'Connect a BIM model to live IoT data streams; monitor equipment health, track occupancy, and get AI-powered maintenance alerts from a single dashboard.',
};

@Component({
  selector: 'app-viewer-product-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './viewer-product-page.html',
  styleUrl: './viewer-product-page.scss',
  animations: [
    trigger('pageEnter', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ViewerProductPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() viewerType!: string;

  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly hostEl = inject(ElementRef<HTMLElement>);

  @ViewChild('mockupEl') mockupEl?: ElementRef<HTMLDivElement>;
  @ViewChildren('stepImgRef') stepImgRefs?: QueryList<ElementRef<HTMLDivElement>>;

  // icons used in the template
  readonly ArrowUpRight = ArrowUpRight;
  readonly Cpu = Cpu;
  readonly CheckCircle2 = CheckCircle2;
  readonly HelpCircle = HelpCircle;
  readonly XCircle = XCircle;

  openFaq: number | null = 0;
  activeStep = 0;

  private ctx?: gsap.Context;
  private mobileStepObserver?: IntersectionObserver;
  private mobileEntranceTriggers: ScrollTrigger[] = [];
  private prevActiveStep = 0;
  private destroyed = false;

  get cfg(): ViewerConfig {
    return CONFIGS[this.viewerType as ViewerType];
  }

  get accentIcon(): string {
    return ICON_COLOR_CLASS;
  }

  get accentDiv(): string {
    return DIVIDER_COLOR_CLASS;
  }

  get hudColor(): string {
    return HUD_COLOR_CLASS;
  }

  get versionTag(): string {
    return VERSION_TAGS[this.viewerType as ViewerType];
  }

  get sysTag(): string {
    return SYS_TAGS[this.viewerType as ViewerType];
  }

  get heroGlowColor(): string {
    return HERO_GLOW_COLORS[this.viewerType as ViewerType] ?? '#0645fb';
  }

  get heroImage(): string {
    const type = this.viewerType as ViewerType;
    return VIEWER_HERO_IMAGES[type] || ANALYSIS_HERO_IMAGES[type] || '';
  }

  get stepImage(): string | null {
    const type = this.viewerType as ViewerType;
    if (VIEWER_HERO_IMAGES[type]) return VIEWER_HERO_IMAGES[type]!;
    if (ANALYSIS_HERO_IMAGES[type]) return ANALYSIS_HERO_IMAGES[type]!;
    return null;
  }

  get showFreeBadge(): boolean {
    return !NO_FREE_BADGE.includes(this.viewerType as ViewerType);
  }

  get contextLine(): string {
    return CONTEXT_LINES[this.viewerType as ViewerType];
  }

  get avatarLetters(): string[] {
    return [1, 2, 3, 4].map((i) => String.fromCharCode(64 + i));
  }

  ngOnInit(): void {
    const seoEntry = VIEWER_SEO[this.viewerType as ViewerType];
    if (seoEntry) {
      this.seo.set(seoEntry);
    }
  }

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {
      // Hero heading words slide up
      gsap.from('.vp-hero-word', {
        y: 60, opacity: 0, duration: 0.7,
        stagger: 0.12, ease: 'power3.out', delay: 0.15,
      });

      // Hero sub-elements
      gsap.from('.vp-hero-tag', { y: -20, opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.1 });
      gsap.from('.vp-hero-desc', { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.55 });
      gsap.from('.vp-hero-cta', { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.7 });
      gsap.from('.vp-hero-stats', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.85 });

      // Mockup floats gently
      if (this.mockupEl?.nativeElement) {
        const mockup = this.mockupEl.nativeElement;
        gsap.from(mockup, { opacity: 0, scale: 0.92, duration: 0.8, ease: 'power3.out', delay: 0.3 });
        gsap.to(mockup, {
          y: -14, duration: 3, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1,
        });
      }

      // Free badge pop-in
      gsap.from('.vp-free-badge', {
        scale: 0, rotate: -15, duration: 0.5, delay: 0.9,
        ease: 'back.out(2)',
      });

      // Capability cards reveal on scroll
      gsap.utils.toArray<HTMLElement>('.vp-cap-card').forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
          y: 40, opacity: 0, duration: 0.55, ease: 'power3.out', delay: i * 0.09,
        });
      });

      // Section headings reveal
      gsap.utils.toArray<HTMLElement>('.vp-section-heading').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
          y: 30, opacity: 0, duration: 0.6, ease: 'power3.out',
        });
      });

      // Format cards pop in
      gsap.utils.toArray<HTMLElement>('.vp-format-card').forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' },
          scale: 0.88, opacity: 0, duration: 0.45, ease: 'back.out(1.4)', delay: i * 0.07,
        });
      });

      // Workflow list items slide from left
      gsap.utils.toArray<HTMLElement>('.vp-workflow-item').forEach((item, i) => {
        gsap.from(item, {
          scrollTrigger: { trigger: item, start: 'top 92%', toggleActions: 'play none none none' },
          x: -24, opacity: 0, duration: 0.5, ease: 'power3.out', delay: i * 0.07,
        });
      });

      // Desktop step cards — stagger from bottom
      if (window.innerWidth >= 768) {
        gsap.utils.toArray<HTMLElement>('.vp-step-card').forEach((card, i) => {
          gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
            y: 40, opacity: 0, scale: 0.96, duration: 0.55, ease: 'power3.out', delay: i * 0.1,
          });
        });
      }

      // Formats/performance card slides in from the left
      gsap.utils.toArray<HTMLElement>('.vp-formats-panel').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
          x: -30, opacity: 0, duration: 0.6, ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
        });
      });

      // Workflow benefits column slides in from the right
      gsap.utils.toArray<HTMLElement>('.vp-workflow-panel').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
          x: 30, opacity: 0, duration: 0.6, ease: 'cubic-bezier(0.22, 1, 0.36, 1)', delay: 0.1,
        });
      });

      // Performance rows fade in
      gsap.utils.toArray<HTMLElement>('.vp-perf-row').forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 95%', toggleActions: 'play none none none' },
          opacity: 0, duration: 0.4, delay: i * 0.1,
        });
      });

      // Metric stats stagger up
      gsap.utils.toArray<HTMLElement>('.vp-metric-card').forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' },
          y: 16, opacity: 0, duration: 0.5, delay: i * 0.08, ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        });
      });

      // Use-case / deep-feature cards stagger up
      gsap.utils.toArray<HTMLElement>('.vp-usecase-card, .vp-feature-card').forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' },
          y: 12, opacity: 0, duration: 0.4, delay: (i % 4) * 0.06,
        });
      });

      // Why-choose comparison rows slide from left
      gsap.utils.toArray<HTMLElement>('.vp-whychoose-row').forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 94%', toggleActions: 'play none none none' },
          x: -12, opacity: 0, duration: 0.35, delay: i * 0.04,
        });
      });

      // FAQ items stagger up
      gsap.utils.toArray<HTMLElement>('.vp-faq-item').forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 94%', toggleActions: 'play none none none' },
          y: 12, opacity: 0, duration: 0.4, delay: i * 0.06,
        });
      });
    }, this.hostEl.nativeElement);

    this.setupMobileStepObserver();
    this.setupMobileStepEntrance();

    this.scheduleScrollTriggerRefresh();
  }

  /**
   * ScrollTrigger caches each trigger's start position when the trigger is
   * created. On client-side (soft) navigation the animations are created in
   * ngAfterViewInit — typically BEFORE images, custom fonts, and the final
   * page layout have settled — so the cached positions can be stale and the
   * entrance tweens (opacity 0 → 1) may never fire, leaving whole sections
   * invisible until a hard refresh re-creates everything with a stable layout.
   *
   * Re-running ScrollTrigger.refresh() after the browser has laid out the new
   * route view AND once fonts/images finish loading makes every trigger
   * re-measure itself, so sections animate in correctly on both direct loads
   * and soft (client-side) navigations.
   */
  private scheduleScrollTriggerRefresh(): void {
    // Deferred callbacks may outlive the component (e.g. if the user navigates
    // away before images load) — no-op after teardown.
    const refresh = (): void => {
      if (this.destroyed) return;
      ScrollTrigger.refresh();
    };

    // Let the browser finish layout/paint of the newly inserted route view.
    requestAnimationFrame(() => requestAnimationFrame(refresh));

    // Re-measure once the whole document (including images) has loaded.
    if (document.readyState === 'complete') {
      refresh();
    } else {
      window.addEventListener('load', refresh, { once: true });
    }

    // Re-measure once custom web fonts are ready (they change text metrics).
    if (document.fonts?.ready) {
      document.fonts.ready.then(refresh);
    }

    // Re-measure once every image inside this component has loaded.
    const images = this.hostEl.nativeElement.querySelectorAll('img') as unknown as NodeListOf<HTMLImageElement>;
    let pending = images.length;
    if (pending === 0) return;
    const onImageLoad = (): void => {
      pending -= 1;
      if (pending === 0) refresh();
    };
    images.forEach((img) => {
      if (img.complete) onImageLoad();
      else img.addEventListener('load', onImageLoad, { once: true });
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.ctx?.revert();
    this.mobileStepObserver?.disconnect();
    this.mobileEntranceTriggers.forEach((t) => t.kill());
    // Kill ALL remaining ScrollTrigger instances to prevent stale triggers
    // from interfering with re-navigation
    ScrollTrigger.getAll().forEach((t) => t.kill());
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  toggleFaq(i: number): void {
    this.openFaq = this.openFaq === i ? null : i;
  }

  setActiveStep(i: number): void {
    if (this.activeStep === i) return;
    this.animateStepChange(this.activeStep, i);
    this.activeStep = i;
  }

  onStepClick(i: number): void {
    this.setActiveStep(this.activeStep === i ? -1 : i);
  }

  onStepHoverLeave(): void {
    this.setActiveStep(0);
  }

  stepImageClasses(i: number): string {
    if (this.activeStep === 0) return 'object-cover scale-100';
    if (this.activeStep === 1) return 'object-contain scale-95';
    if (this.activeStep === 2) return 'object-left scale-105';
    return 'object-right scale-95';
  }

  private animateStepChange(prev: number, curr: number): void {
    const refs = this.stepImgRefs?.toArray();
    if (!refs) return;
    const currEl = refs[curr]?.nativeElement;
    if (currEl) {
      gsap.fromTo(currEl, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' });
    }
    if (prev !== curr) {
      const prevEl = refs[prev]?.nativeElement;
      if (prevEl) {
        gsap.to(prevEl, { opacity: 0, scale: 0.92, duration: 0.35, ease: 'power2.out' });
      }
    }
  }

  private setupMobileStepObserver(): void {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 767px)');
    if (!mq.matches) return;

    this.mobileStepObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const idx = Number((entry.target as HTMLElement).getAttribute('data-step-index') || '0');
            this.activeStep = idx;
          }
        });
      },
      { threshold: [0.5] },
    );

    const els = Array.from(this.hostEl.nativeElement.querySelectorAll('.vp-step-card')) as HTMLElement[];
    els.forEach((el) => this.mobileStepObserver!.observe(el));
  }

  private setupMobileStepEntrance(): void {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 767px)');
    if (!mq.matches) return;

    const cards = Array.from(this.hostEl.nativeElement.querySelectorAll('.vp-step-card')) as HTMLElement[];
    gsap.set(cards, { opacity: 0, y: 56, scale: 0.95 });

    this.mobileEntranceTriggers = cards.map((card) =>
      ScrollTrigger.create({
        trigger: card,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'power3.out' });
        },
      }),
    );
  }
}
