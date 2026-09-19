import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { LucideAngularModule, ArrowLeft, Search, X, ChevronDown } from 'lucide-angular';
import { SeoService } from '../../../core/seo.service';

interface GlossaryEntry {
  term: string;
  definition: string;
  category?: string;
}

const GLOSSARY: GlossaryEntry[] = [
  { term: '3D Mesh Viewer', definition: "AxisXD's tool for rendering and inspecting textured 3D meshes from photogrammetry and reality capture, supporting OBJ, FBX, glTF, STL, and PLY formats.", category: 'Viewers' },
  { term: 'ADF (Average Daylight Factor)', definition: 'A daylight measurement metric used in Rights of Light analysis to quantify average daylight levels in a room. AxisXD generates ADF-compliant reports per BRE/RIBA guidelines.', category: 'Concepts' },
  { term: 'AI Predictive Analytics', definition: 'Machine learning-based forecasting that analyzes historical operational data to predict equipment failures, energy demand, occupancy patterns, and maintenance needs within AxisXD Digital Twin.', category: 'Analysis' },
  { term: 'API Key', definition: 'A unique identifier used to authenticate requests to the AxisXD REST API. API keys come in two environments: test (axd_test_) and production (axd_live_).', category: 'Platform' },
  { term: 'Audit Logging', definition: 'A security feature that records all operations and access events for enterprise compliance and accountability. Available on AxisXD Enterprise plans.', category: 'Platform' },
  { term: 'AxisXD', definition: 'A browser-based digital twin platform for the AEC industry, providing a suite of 3D viewers (BIM, point cloud LiDAR, 360° panorama, CAD/DXF, 3D mesh) and analysis tools for deviation checking, clash detection, construction monitoring, and rights-of-light assessment.', category: 'Brand' },
  { term: 'BCF (BIM Collaboration Format)', definition: 'An open file format for exchanging issues, comments, and screenshots between BIM authoring tools. AxisXD supports BCF import/export for issue management and clash detection workflows.', category: 'Formats' },
  { term: 'BIM (Building Information Modeling)', definition: "A digital representation of a building's physical and functional characteristics. AxisXD supports IFC-based BIM models with property inspection, element filtering, and measurement tools.", category: 'Concepts' },
  { term: 'BMS (Building Management System)', definition: 'A centralized control system that monitors and manages building services including HVAC, lighting, and security. AxisXD Digital Twin integrates with BMS platforms.', category: 'Concepts' },
  { term: 'BRE Standards', definition: 'Building Research Establishment guidelines for daylight and sunlight assessment, including the 45° / 50% VSC threshold criteria. AxisXD ROL reports comply with BRE standards.', category: 'Concepts' },
  { term: 'CAD (Computer-Aided Design)', definition: "The use of computer software to create precision drawings and technical illustrations. AxisXD's CAD/DXF viewer renders layer-based engineering drawings in the browser.", category: 'Concepts' },
  { term: 'CAD / DXF Viewer', definition: "AxisXD's tool for opening, reviewing, and collaborating on DXF, DWG, and DWF engineering drawings directly in the browser. Supports layer management, smart measurements, and annotations.", category: 'Viewers' },
  { term: 'CAFM (Computer-Aided Facility Management)', definition: 'Software used by facility managers to track assets, space, and maintenance operations. AxisXD Digital Twin integrates with CAFM systems.', category: 'Concepts' },
  { term: 'Categories Filtering', definition: 'A feature that hides or shows entire BIM disciplines including architectural, structural, and MEP to focus on what matters. Available in AxisXD IFC Viewer.', category: 'Features' },
  { term: 'Change Detection Alerts', definition: 'Automated notifications when visual analysis or sensor data detects deviations from the planned construction schedule. Part of AxisXD Construction Monitoring.', category: 'Features' },
  { term: 'Clash Detection', definition: 'An automated analysis that identifies interferences between building elements such as a duct intersecting a beam in a BIM model. AxisXD provides real-time clash detection with visual overlay and reporting.', category: 'Viewers' },
  { term: 'Classification Filtering', definition: 'A point cloud feature that filters scan data by categories including ground, vegetation, buildings, utilities, and structural elements. Available in AxisXD Point Cloud Viewer.', category: 'Features' },
  { term: 'Cloud-First Architecture', definition: "AxisXD's deployment model where each viewer is a self-contained micro-frontend communicating with a shared backend API for model storage, processing, and access control.", category: 'Platform' },
  { term: 'CMMS (Computerized Maintenance Management System)', definition: 'Software used to schedule and track maintenance activities. AxisXD Digital Twin integrates with CMMS solutions for work order management.', category: 'Concepts' },
  { term: 'Colorization Modes', definition: 'Multiple rendering styles for point cloud visualization: RGB color, intensity values, elevation heatmaps, and classification views. Available in AxisXD Point Cloud Viewer.', category: 'Features' },
  { term: 'Construction Monitoring', definition: "AxisXD's progress tracking tool that compares site photos, 360° panoramas, and LiDAR scans against scheduled milestones with AI-powered change detection and status dashboards.", category: 'Viewers' },
  { term: 'Cross-Section Analysis', definition: 'A point cloud feature that slices through volumes at any elevation to inspect structural cross-sections and floor grids. Available in AxisXD Point Cloud Viewer.', category: 'Features' },
  { term: 'CSV (Comma-Separated Values)', definition: 'A data export format supported by AxisXD for reports, clash lists, and monitoring data. Used for contractor coordination and data analysis.', category: 'Formats' },
  { term: 'Data Residency', definition: 'An enterprise feature allowing customers to specify geographic regions for data storage. Available on AxisXD Enterprise Precision plans.', category: 'Platform' },
  { term: 'Daylight Assessment', definition: 'A Rights of Light feature that quantifies daylight levels and identifies which windows or zones fall below the 45° / 50% VSC threshold criteria.', category: 'Features' },
  { term: 'Deviation Analyzer', definition: "AxisXD's scan-vs-BIM comparison tool that generates color-coded deviation heatmaps with mm-level precision, tolerance threshold alerts, and ISO-12053 compliant automated reports.", category: 'Viewers' },
  { term: 'Deviation Analysis', definition: 'A comparison between an as-built point cloud scan and a design BIM model to identify surface deviations. AxisXD generates color-coded deviation maps with millimetre accuracy.', category: 'Analysis' },
  { term: 'Digital Twin', definition: 'A virtual representation of a physical asset or system that is updated with real-time data. AxisXD enables digital twin workflows by connecting 3D viewers with live sensor data and IoT platforms.', category: 'Concepts' },
  { term: 'Digital Twin Platform', definition: "AxisXD's connected asset platform that combines BIM models with live IoT data, operational monitoring, and AI-powered predictive analytics for facility management.", category: 'Viewers' },
  { term: 'DRACO', definition: "A 3D geometry compression library used by AxisXD's Mesh Viewer for efficient model streaming and rendering in the browser.", category: 'Platform' },
  { term: 'Drawing Navigator', definition: 'A CAD viewer feature enabling quick browsing of large drawings with smooth zoom and fast pan controls. Available in AxisXD CAD/DXF Viewer.', category: 'Features' },
  { term: 'DWF (Design Web Format)', definition: "Autodesk's web-based CAD format. AxisXD supports DWF for input alongside DXF and DWG.", category: 'Formats' },
  { term: 'DWG', definition: "Native AutoCAD binary file format. AxisXD's CAD/DXF viewer supports DWG with full layer and metadata preservation.", category: 'Formats' },
  { term: 'DXF (Drawing Exchange Format)', definition: "Autodesk's open CAD file format for enabling data interoperability between CAD programs. AxisXD's CAD viewer supports DXF files with layer management and dimension annotation.", category: 'Formats' },
  { term: 'E57', definition: 'An ASTM standard file format for 3D imaging data exchange, commonly used for LiDAR point clouds. AxisXD supports E57 files with full color and intensity data.', category: 'Formats' },
  { term: 'Element Isolation', definition: 'A viewer feature that inspects individual structural components with high clarity, precision, and metadata access. Available across multiple AxisXD viewers.', category: 'Features' },
  { term: 'Enterprise Precision', definition: "AxisXD's paid plan ($249/month Team, $549/month Organization) including higher rate limits, priority processing, dedicated support, custom branding, SSO/SAML, and volume pricing.", category: 'Brand' },
  { term: 'Entity Inspector', definition: 'A CAD viewer feature that inspects detailed properties of CAD elements including layer name, object type, coordinates, dimensions, and full CAD metadata.', category: 'Features' },
  { term: 'Exploded View', definition: 'An IFC viewer feature that separates assemblies to understand component relationships, connection details, and construction logic.', category: 'Features' },
  { term: 'FBX', definition: "Autodesk's 3D model format supporting animation. AxisXD Mesh Viewer supports FBX files for animated models and complex geometry.", category: 'Formats' },
  { term: 'Federated Model', definition: 'A combined view of multiple BIM models from different disciplines within a single viewer session, enabling cross-discipline coordination.', category: 'Features' },
  { term: 'GeoJSON', definition: 'A geographic data format for encoding spatial geometries. AxisXD ROL analysis supports GeoJSON for site geometry input and 3D urban context modeling.', category: 'Formats' },
  { term: 'GIS (Geographic Information System)', definition: 'A framework for gathering, managing, and analyzing spatial and geographic data. AxisXD integrates with GIS workflows through georeferenced model placement and coordinate system support.', category: 'Concepts' },
  { term: 'glTF / GLB', definition: 'A royalty-free 3D file format optimized for web delivery. AxisXD Mesh Viewer supports glTF as a web-standard format.', category: 'Formats' },
  { term: 'Google Gemini AI', definition: 'Artificial intelligence integration within AxisXD for automated compliance audits, change detection, and predictive analytics. Available on Enterprise Precision plans.', category: 'Platform' },
  { term: 'Hard Clash', definition: 'A type of clash where two building elements occupy the same physical space (geometric interference with 0 mm overlap). AxisXD Clash Detection identifies hard clashes automatically.', category: 'Concepts' },
  { term: 'Heatmap Deviation Map', definition: 'A Deviation Analyzer feature providing color-coded overlay highlighting deviations across the full model surface with mm-level precision.', category: 'Features' },
  { term: 'HTTPS Encryption', definition: 'Secure HTTP protocol used for all AxisXD data transmission, ensuring encrypted communication between clients and servers.', category: 'Platform' },
  { term: 'HVAC (Heating, Ventilation, and Air Conditioning)', definition: 'Building climate control systems. AxisXD Digital Twin integrates IoT data from HVAC systems for live operational monitoring.', category: 'Concepts' },
  { term: 'ICP Registration (Iterative Closest Point)', definition: "An algorithm used by AxisXD Deviation Analyzer to automatically align point cloud scans to BIM model coordinates for accurate comparison.", category: 'Platform' },
  { term: 'IFC (Industry Foundation Classes)', definition: "An open, neutral data format for BIM data exchange, standardized as ISO 16739. AxisXD's IFC viewer supports IFC 2×3, 4, and 4×3 schemas with full property set inspection.", category: 'Formats' },
  { term: 'IFC 2×3', definition: 'Legacy IFC schema version widely used in existing BIM projects. Supported by AxisXD IFC Viewer.', category: 'Formats' },
  { term: 'IFC 4', definition: 'Current standard IFC schema version with enhanced capabilities. Supported by AxisXD IFC Viewer and analysis tools.', category: 'Formats' },
  { term: 'IFC 4×3 (IFC 4.3)', definition: 'Latest IFC schema version with infrastructure extensions. Supported by AxisXD IFC Viewer, Deviation Analyzer, ROL, and Clash Detection.', category: 'Formats' },
  { term: 'IFC Viewer (RealityXD)', definition: "AxisXD's BIM model visualization tool with property inspection, filtering, measurement, section cuts, and multi-model overlay.", category: 'Viewers' },
  { term: 'IoT (Internet of Things)', definition: 'Networked physical devices such as sensors, meters, and cameras that collect and exchange data. AxisXD digital twins can ingest IoT data streams and visualize sensor readings on 3D models in real time.', category: 'Concepts' },
  { term: 'JavaScript SDK', definition: 'The @axisxd/sdk npm package for embedding AxisXD viewers into web applications with full programmatic control.', category: 'Platform' },
  { term: 'JPEG / JPG (Equirectangular)', definition: 'Panoramic image format used by AxisXD Pano Viewer. Equirectangular projection captures full 360° spherical views.', category: 'Formats' },
  { term: 'LAS / LAZ', definition: 'Standard file formats for storing LiDAR point cloud data. LAZ is the compressed version of LAS. AxisXD supports both with color, intensity, and classification attributes.', category: 'Formats' },
  { term: 'Layer Manager', definition: 'A CAD viewer feature that controls visibility of individual drawing layers to show or hide layers, isolate disciplines, reduce clutter, and improve readability.', category: 'Features' },
  { term: 'LiDAR (Light Detection and Ranging)', definition: 'A remote sensing technology that uses laser pulses to measure distances and create high-precision 3D representations of physical environments. AxisXD renders LiDAR point clouds with up to 500M+ points.', category: 'Concepts' },
  { term: 'Live Operational Monitoring', definition: 'A Digital Twin feature providing real-time dashboards with KPI tracking, equipment health monitoring, fault detection, and automated alert management.', category: 'Features' },
  { term: 'LOD (Level of Detail)', definition: 'A technique that adjusts the complexity of a 3D model based on viewing distance to optimize rendering performance. AxisXD uses progressive LOD streaming for point clouds and meshes.', category: 'Concepts' },
  { term: 'LPA (Local Planning Authority)', definition: 'The local government body responsible for planning regulations. AxisXD ROL analysis supports pre-application consultations and planning submissions.', category: 'Concepts' },
  { term: 'Matterport', definition: 'A virtual tour platform. AxisXD Pano Viewer supports Matterport virtual tour format alongside standard equirectangular images.', category: 'Formats' },
  { term: 'Measurement Tools', definition: 'Tools for measuring distances, dimensions, areas, volumes, angles, and curvature directly within 3D models, point clouds, and CAD drawings. Available across multiple AxisXD viewers.', category: 'Features' },
  { term: 'Mesh', definition: "A 3D surface representation composed of vertices, edges, and faces that are typically triangles. AxisXD's mesh viewer supports textured models from photogrammetry and reality capture.", category: 'Formats' },
  { term: 'MFA (Multi-Factor Authentication)', definition: 'An advanced security feature requiring multiple verification methods for user authentication. Available on AxisXD Enterprise plans.', category: 'Platform' },
  { term: 'Micro-Frontend Architecture', definition: "AxisXD's modular architecture where each viewer is a self-contained micro-frontend communicating with a shared backend API.", category: 'Platform' },
  { term: 'Model Tree Explorer', definition: 'An IFC viewer feature that browses every IFC entity from site structures down to individual fixtures in a hierarchical tree view.', category: 'Features' },
  { term: 'MQTT (Message Queuing Telemetry Transport)', definition: 'A lightweight IoT messaging protocol used for connecting sensor data to AxisXD Digital Twin platform.', category: 'Platform' },
  { term: 'Multi-Model Overlay', definition: 'A feature that compares revisions side-by-side or overlaid to spot design changes across versions without leaving the viewer.', category: 'Features' },
  { term: 'NWC / NWD', definition: 'Autodesk Navisworks Cache and Document formats. AxisXD Clash Detection supports NWC and NWD for model input alongside IFC.', category: 'Formats' },
  { term: 'OAuth 2.0', definition: 'An industry-standard protocol for authorizing third-party applications to access resources without sharing credentials. AxisXD supports OAuth 2.0 for user-facing integrations with scoped permissions.', category: 'Platform' },
  { term: 'OBJ', definition: 'A standard 3D file format for mesh geometry. AxisXD Mesh Viewer supports OBJ files with texture mapping and coordinate precision.', category: 'Formats' },
  { term: 'Octree', definition: 'A tree data structure used for spatial indexing of 3D point cloud data. AxisXD converts LiDAR scans into an octree structure for efficient streaming and rendering in the browser.', category: 'Concepts' },
  { term: 'Panorama (360°)', definition: "An equirectangular image that captures a full spherical view of a location. AxisXD's Pano viewer enables immersive site walkthroughs with hotspot annotations and measurement overlays.", category: 'Concepts' },
  { term: 'Pano Viewer (XploreXD)', definition: "AxisXD's 360° panoramic image viewer with hotspot annotations, navigation, BIM overlays, and site documentation capabilities.", category: 'Viewers' },
  { term: 'PCD (Point Cloud Data)', definition: 'A file format for storing 3D point cloud data, native to the Point Cloud Library (PCL). AxisXD supports PCD files with XYZ coordinates and optional RGB/Normal fields.', category: 'Formats' },
  { term: 'PDF (Portable Document Format)', definition: 'A document format supported for report export across AxisXD analysis tools including Deviation Analyzer, ROL, Clash Detection, and Construction Monitoring.', category: 'Formats' },
  { term: 'Photogrammetry', definition: 'The science of making measurements from photographs. Photogrammetry generates 3D meshes and point clouds from overlapping images. AxisXD renders photogrammetry outputs as textured meshes.', category: 'Concepts' },
  { term: 'Pilot Sandbox', definition: "AxisXD's free ($0) evaluation plan allowing users to load pre-set facilities with 3D LiDAR point cloud, interactive 360° panoramas, and manual element attribute inspection.", category: 'Brand' },
  { term: 'PLY (Polygon File Format)', definition: 'A file format for storing 3D polygonal models with vertex color and surface normals. AxisXD supports PLY files for both point cloud and mesh rendering.', category: 'Formats' },
  { term: 'PNG (Portable Network Graphics)', definition: 'An image format supported by AxisXD Pano Viewer for high-resolution equirectangular panoramas and export.', category: 'Formats' },
  { term: 'Point Cloud', definition: 'A set of data points in three-dimensional space, typically collected by LiDAR scanners or photogrammetry. Each point may carry attributes such as color, intensity, and classification.', category: 'Concepts' },
  { term: 'Point Cloud Viewer (VoxelXD)', definition: "AxisXD's LiDAR scan visualization tool with streaming of up to 500M+ points, cross-section analysis, classification filtering, BIM overlay, and deviation detection.", category: 'Viewers' },
  { term: 'Property Inspector', definition: 'An IFC viewer feature that displays BIM metadata instantly. Click any element to inspect Pset attributes, GUIDs, materials, and quantities.', category: 'Features' },
  { term: 'PTS', definition: 'A Leica file format for point cloud data. AxisXD Point Cloud Viewer supports PTS for LiDAR and laser scan input.', category: 'Formats' },
  { term: 'Python SDK', definition: "AxisXD's Python software development kit for managing platform resources, uploading models, and running analysis jobs programmatically.", category: 'Platform' },
  { term: 'RBAC (Role-Based Access Control)', definition: 'A permission management system that restricts system access based on user roles. Available on AxisXD Enterprise plans.', category: 'Platform' },
  { term: 'RCP / RCS', definition: 'Autodesk ReCap project and scan file formats. RCP is the project file referencing one or more RCS scan files. AxisXD supports both formats for direct upload of ReCap data.', category: 'Formats' },
  { term: 'Reality Capture', definition: 'The process of collecting physical site data using LiDAR, photogrammetry, or other sensors to create accurate 3D digital representations. AxisXD processes reality capture data into viewable digital twins.', category: 'Concepts' },
  { term: 'RealityXD', definition: "AxisXD's IFC Viewer sub-product brand for BIM model visualization with property inspection, filtering, and measurement.", category: 'Brand' },
  { term: 'Resolution Tracking', definition: 'A Clash Detection feature for assigning, tracking, and verifying clash resolutions with an integrated issue log and status-based workflow.', category: 'Features' },
  { term: 'REST API', definition: "A Representational State Transfer API that uses HTTP methods (GET, POST, PUT, DELETE) to interact with resources. AxisXD's REST API at api.axisxd.com/v1 provides programmatic access to all platform features.", category: 'Platform' },
  { term: 'RIBA (Royal Institute of British Architects)', definition: 'Professional body for architects in the UK. AxisXD ROL reports follow RIBA guidelines for daylight and sunlight assessment.', category: 'Concepts' },
  { term: 'RICS (Royal Institution of Chartered Surveyors)', definition: 'Professional body for surveyors. AxisXD ROL analysis supports RICS daylight and sunlight standards.', category: 'Concepts' },
  { term: 'Rights of Light (ROL)', definition: "A legal right to receive natural light through defined windows or apertures. AxisXD's ROL analysis tool assesses solar access and generates compliance reports for planning applications.", category: 'Analysis' },
  { term: 'Rights of Light Analyzer', definition: "AxisXD's solar analysis tool for simulating sun paths, analyzing shadow obstruction, assessing daylight compliance (VSC/ADF), and generating legally defensible ROL reports.", category: 'Viewers' },
  { term: 'SAML (Security Assertion Markup Language)', definition: 'An XML-based standard for exchanging authentication and authorization data between identity providers and service providers. AxisXD supports SAML SSO on Enterprise plans.', category: 'Platform' },
  { term: 'Saved Views', definition: 'A feature that stores and recalls camera positions, element selections, and filter states for repeatable review sessions.', category: 'Features' },
  { term: 'SCADA (Supervisory Control and Data Acquisition)', definition: 'An industrial control system for monitoring and controlling infrastructure. AxisXD Digital Twin integrates with SCADA systems.', category: 'Concepts' },
  { term: 'Scan-to-BIM', definition: 'The workflow of converting 3D scan data (LiDAR point clouds) into BIM models. AxisXD supports scan-to-BIM review sessions with direct point cloud to BIM overlay and comparison.', category: 'Concepts' },
  { term: 'SDK (Software Development Kit)', definition: 'A set of tools, libraries, and documentation that enables developers to build integrations. AxisXD provides JavaScript and Python SDKs for embedding viewers and managing platform resources.', category: 'Platform' },
  { term: 'Section Cuts', definition: 'A feature that slices through 3D models at any axis to inspect interior layouts, floor heights, and hidden components.', category: 'Features' },
  { term: 'Self-Hosted Deployment', definition: 'An enterprise option allowing customers to deploy AxisXD on their own infrastructure for enhanced data control and compliance.', category: 'Platform' },
  { term: 'Shadow Analysis', definition: 'A Rights of Light feature that projects accurate shadow footprints across any hour and season, mapped directly onto site and neighboring properties.', category: 'Features' },
  { term: 'Smart Measurements', definition: 'A CAD/DXF viewer feature for measuring linear dimensions, area, radius, angle, and perimeter directly within engineering drawings.', category: 'Features' },
  { term: 'SOC2', definition: 'A security compliance framework for service organizations. AxisXD infrastructure is SOC2-ready, providing enterprise-grade security controls.', category: 'Platform' },
  { term: 'Soft Clash', definition: 'A type of clash where elements violate clearance/access/maintenance buffer zones without direct geometric interference. AxisXD Clash Detection identifies soft clashes with configurable tolerance thresholds.', category: 'Concepts' },
  { term: 'SSO (Single Sign-On)', definition: 'An authentication scheme that allows users to log in to multiple applications with one set of credentials. AxisXD Enterprise plans support SSO via SAML and OIDC.', category: 'Platform' },
  { term: 'Status Dashboards', definition: 'A Construction Monitoring feature that tracks project health with automated KPIs, percent complete, schedule variance, and milestone achievement rates.', category: 'Features' },
  { term: 'STEP (Standard for the Exchange of Product Data)', definition: 'An ISO 10303 standard for exchanging product data between CAD systems. AxisXD supports partial STEP import for geometry extraction.', category: 'Formats' },
  { term: 'STL (Stereolithography)', definition: 'A file format for 3D mesh geometry commonly used in CAD and 3D printing. AxisXD Mesh Viewer supports STL files alongside OBJ, FBX, and glTF.', category: 'Formats' },
  { term: 'Streaming', definition: 'A delivery method where data is progressively loaded in chunks so the user can start interacting before the entire file is downloaded. AxisXD uses streaming for all large model formats.', category: 'Concepts' },
  { term: 'Sun Path Simulation', definition: 'A Rights of Light feature that animates real sun trajectory across any date, time, and geographic coordinate to model daylight access accurately.', category: 'Features' },
  { term: 'SVG (Scalable Vector Graphics)', definition: 'A vector image format supported by AxisXD for report export in ROL analysis and CAD/DXF viewer export workflows.', category: 'Formats' },
  { term: 'Three.js', definition: "A cross-browser JavaScript library for 3D graphics. Used by AxisXD Mesh Viewer for WebGL rendering.", category: 'Platform' },
  { term: 'TIFF (Tag Image File Format)', definition: 'A lossless image format supported by AxisXD Pano Viewer for high-quality equirectangular panoramas.', category: 'Formats' },
  { term: 'Timeline Comparison', definition: 'A Construction Monitoring feature that overlays progress photos, point cloud scans, and BIM models on a unified timeline for phase-by-phase review.', category: 'Features' },
  { term: 'Tolerance Threshold Alerts', definition: 'A Deviation Analyzer feature that defines custom tolerance bands per zone or element with automated alerts flagging breaches instantly.', category: 'Features' },
  { term: 'Trend & Drift Analysis', definition: 'A Deviation Analyzer feature that tracks deviation trends across construction phases to identify systematic drift before handover.', category: 'Features' },
  { term: 'VoxelXD', definition: "AxisXD's Point Cloud LiDAR Viewer sub-product brand for high-density LiDAR scan rendering with annotation, clipping, and export.", category: 'Brand' },
  { term: 'VSC (Vertical Sky Component)', definition: "A daylight measurement metric used in Rights of Light analysis to quantify the amount of sky visible from a window. AxisXD ROL reports include VSC per BRE 45°/50% standard.", category: 'Concepts' },
  { term: 'WebAssembly (WASM)', definition: 'A binary instruction format for stack-based virtual machines that runs near-native performance in the browser. AxisXD uses WebAssembly for compute-intensive tasks like geometry parsing and deviation analysis.', category: 'Platform' },
  { term: 'WebGL (Web Graphics Library)', definition: "A JavaScript API for rendering 2D and 3D graphics in the browser without plugins. AxisXD's viewers are built on WebGL 2.0 for hardware-accelerated rendering.", category: 'Platform' },
  { term: 'XLS (Microsoft Excel Spreadsheet)', definition: 'A report export format supported by AxisXD Deviation Analyzer for generating deviation reports with statistics and compliance data.', category: 'Formats' },
  { term: 'XploreXD', definition: "AxisXD's Pano 360° Viewer sub-product brand for equirectangular panoramic navigation with hotspot management and BIM overlays.", category: 'Brand' },
  { term: 'XYZ / PTX', definition: 'Raw point data coordinate formats. AxisXD Point Cloud Viewer supports XYZ and PTX for LiDAR and laser scan input.', category: 'Formats' },
  { term: 'Zero-Knowledge Architecture', definition: 'A security model where the platform cannot access or read customer model data. Available as an option on AxisXD Enterprise plans.', category: 'Platform' },
];

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

@Component({
  selector: 'app-glossary-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './glossary-page.html',
  styleUrl: './glossary-page.scss',
})
export class GlossaryPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heading') headingRef?: ElementRef<HTMLDivElement>;
  @ViewChild('searchBar') searchRef?: ElementRef<HTMLDivElement>;
  @ViewChild('letterNav') letterNavRef?: ElementRef<HTMLDivElement>;
  @ViewChild('content') contentRef?: ElementRef<HTMLDivElement>;

  readonly ArrowLeft = ArrowLeft;
  readonly Search = Search;
  readonly X = X;
  readonly ChevronDown = ChevronDown;

  readonly letters = LETTERS;
  readonly glossary = GLOSSARY;

  isDark = true;
  searchQuery = '';
  activeLetter: string | null = null;
  expandedTerms: Record<string, boolean> = {};

  readonly footerLinks = [{ label: 'Blog & Articles' }, { label: 'Whitepapers' }, { label: 'Webinars' }];

  private themeObserver: MutationObserver | null = null;
  private gsapCtx: gsap.Context | null = null;
  private filterTimeline: gsap.core.Timeline | null = null;
  private filterAnimFrame: number | null = null;

  constructor(private seo: SeoService) {
    this.seo.set({
      title: 'Glossary',
      description: 'Digital twin glossary: definitions of BIM, LiDAR, point cloud, and related terminology.',
      canonicalPath: '/glossary',
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
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power2.out' },
        );
      }
      if (this.searchRef) {
        gsap.fromTo(
          this.searchRef.nativeElement,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, delay: 0.3, ease: 'power2.out' },
        );
      }
      if (this.letterNavRef) {
        const letterButtons = Array.from(this.letterNavRef.nativeElement.children).slice(1);
        gsap.fromTo(
          letterButtons,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.03, delay: 0.45, ease: 'power2.out' },
        );
      }
      if (this.contentRef) {
        gsap.fromTo(
          this.contentRef.nativeElement.children,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, delay: 0.6, ease: 'power2.out' },
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.themeObserver?.disconnect();
    this.gsapCtx?.revert();
    this.filterTimeline?.kill();
    if (this.filterAnimFrame !== null) cancelAnimationFrame(this.filterAnimFrame);
  }

  get filtered(): GlossaryEntry[] {
    const q = this.searchQuery.toLowerCase();
    return this.glossary.filter((entry) => {
      const matchesSearch =
        !q ||
        entry.term.toLowerCase().includes(q) ||
        entry.definition.toLowerCase().includes(q) ||
        (entry.category && entry.category.toLowerCase().includes(q));
      const matchesLetter = !this.activeLetter || entry.term[0].toUpperCase() === this.activeLetter;
      return matchesSearch && matchesLetter;
    });
  }

  get groupedByLetter(): { letter: string; entries: GlossaryEntry[] }[] {
    const filtered = this.filtered;
    return this.letters
      .map((letter) => ({
        letter,
        entries: filtered.filter((e) => e.term[0].toUpperCase() === letter),
      }))
      .filter((g) => g.entries.length > 0);
  }

  get allExpanded(): boolean {
    const filtered = this.filtered;
    return filtered.length > 0 && filtered.every((e) => this.expandedTerms[e.term]);
  }

  hasEntries(letter: string): boolean {
    return this.glossary.some((e) => e.term[0].toUpperCase() === letter);
  }

  setActiveLetter(letter: string | null): void {
    if (letter && !this.hasEntries(letter)) return;
    this.activeLetter = this.activeLetter === letter ? null : letter;
    this.runFilterAnimation();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.runFilterAnimation();
  }

  onSearchChange(): void {
    this.runFilterAnimation();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.activeLetter = null;
    this.runFilterAnimation();
  }

  toggleAll(): void {
    if (this.allExpanded) {
      this.expandedTerms = {};
    } else {
      const all: Record<string, boolean> = {};
      this.filtered.forEach((e) => (all[e.term] = true));
      this.expandedTerms = all;
    }
  }

  toggleExpanded(term: string): void {
    this.expandedTerms = { ...this.expandedTerms, [term]: !this.expandedTerms[term] };
  }

  private runFilterAnimation(): void {
    if (this.filterAnimFrame !== null) cancelAnimationFrame(this.filterAnimFrame);
    this.filterAnimFrame = requestAnimationFrame(() => {
      const container = document.querySelector('.glossary-entries');
      if (!container) return;
      const entries = container.querySelectorAll('.glossary-entry');
      if (entries.length === 0) return;

      this.filterTimeline?.kill();
      this.filterTimeline = gsap.timeline({ overwrite: 'auto' });
      this.filterTimeline
        .set(entries, { opacity: 0, y: 12 })
        .to(entries, { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out' });
    });
  }
}
