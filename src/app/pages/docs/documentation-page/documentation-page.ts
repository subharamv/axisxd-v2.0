import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  LucideAngularModule,
  Search,
  ChevronDown,
  ArrowUpRight,
  BookOpen,
  Box,
  Activity,
  Code2,
  Cpu,
  Menu,
  X,
} from 'lucide-angular';
import { SeoService } from '../../../core/seo.service';

// ── Types ───────────────────────────────────────────────────────────────────

interface NavItem {
  id: string;
  title: string;
  badge?: string;
}
interface NavGroup {
  id: string;
  title: string;
  icon: any;
  items: NavItem[];
}
interface TocEntry {
  id: string;
  title: string;
  level: number;
}
interface DocPage {
  title: string;
  toc: TocEntry[];
  content: string;
}

// ── Navigation ────────────────────────────────────────────────────────────

const NAV_GROUPS: NavGroup[] = [
  {
    id: 'overview',
    title: 'Overview',
    icon: BookOpen,
    items: [
      { id: 'introduction', title: 'Introduction' },
      { id: 'quick-start', title: 'Quick Start' },
      { id: 'authentication', title: 'Authentication' },
    ],
  },
  {
    id: 'viewers',
    title: 'Viewers',
    icon: Box,
    items: [
      { id: 'ifc-viewer', title: 'IFC Viewer' },
      { id: 'point-cloud', title: 'Point Cloud LiDAR' },
      { id: 'pano-viewer', title: 'Pano 360° Viewer' },
      { id: 'cad-viewer', title: 'CAD / DXF Viewer', badge: 'New' },
      { id: 'mesh-viewer', title: '3D Mesh Viewer', badge: 'New' },
    ],
  },
  {
    id: 'analysis',
    title: 'Analysis Tools',
    icon: Activity,
    items: [
      { id: 'deviation-analyzer', title: 'Deviation Analyzer' },
      { id: 'rights-of-light', title: 'Rights of Light' },
      { id: 'construction-monitoring', title: 'Construction Monitoring' },
      { id: 'clash-detection', title: 'BIM Clash Detection' },
    ],
  },
  {
    id: 'api',
    title: 'API Reference',
    icon: Code2,
    items: [
      { id: 'api-overview', title: 'API Overview' },
      { id: 'api-auth', title: 'Authentication' },
      { id: 'api-endpoints', title: 'Endpoints' },
      { id: 'api-webhooks', title: 'Webhooks' },
    ],
  },
  {
    id: 'sdk',
    title: 'SDK',
    icon: Cpu,
    items: [
      { id: 'sdk-js', title: 'JavaScript SDK' },
      { id: 'sdk-python', title: 'Python SDK' },
    ],
  },
];

// ── Content builder helpers ─────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function codeBlock(code: string, language = 'bash'): string {
  const escaped = escapeHtml(code);
  const encoded = encodeURIComponent(code);
  return `<div class="relative my-5 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
    <div class="flex items-center justify-between px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
      <span class="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">${language}</span>
      <button type="button" class="doc-copy-btn flex items-center gap-1.5 text-[10px] text-zinc-400 hover:text-zinc-100 transition-colors" data-code="${encoded}">
        <svg class="doc-copy-icon w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="13" height="13" rx="2" ry="2"></rect><path d="M21 8v11a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h9z" style="display:none"></path><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" style="display:none"></path></svg>
        <svg class="doc-check-icon w-3 h-3 hidden text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span class="doc-copy-label">Copy</span>
      </button>
    </div>
    <pre class="p-4 text-xs font-mono overflow-x-auto leading-relaxed whitespace-pre"><code>${escaped}</code></pre>
  </div>`;
}

function callout(type: 'info' | 'warning' | 'tip', html: string): string {
  const s = {
    info: { cls: 'border-blue-500/25 bg-blue-500/5', icon: 'ℹ️', lbl: 'Note', lc: 'text-blue-400' },
    warning: { cls: 'border-amber-500/25 bg-amber-500/5', icon: '⚠️', lbl: 'Warning', lc: 'text-amber-400' },
    tip: { cls: 'border-green-500/25 bg-green-500/5', icon: '✅', lbl: 'Tip', lc: 'text-green-400' },
  }[type];
  return `<div class="my-5 p-4 rounded-xl border ${s.cls}">
    <p class="text-[11px] font-bold uppercase tracking-wider mb-1.5 ${s.lc}">${s.icon} ${s.lbl}</p>
    <div class="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">${html}</div>
  </div>`;
}

function statCard(label: string, value: string): string {
  return `<div class="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
    <p class="text-[10px] text-zinc-500 mb-1">${label}</p>
    <p class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">${value}</p>
  </div>`;
}

// ── Doc content ───────────────────────────────────────────────────────────

const DOCS: Record<string, DocPage> = {
  /* ── Introduction ── */
  introduction: {
    title: 'Introduction to AxisXD',
    toc: [
      { id: 'what-is-axisxd', title: 'What is AxisXD?', level: 2 },
      { id: 'core-products', title: 'Core Products', level: 2 },
      { id: 'platform-architecture', title: 'Platform Architecture', level: 2 },
      { id: 'use-cases', title: 'Use Cases', level: 2 },
      { id: 'next-steps', title: 'Next Steps', level: 2 },
    ],
    content: `
      <p class="text-base text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
        AxisXD is a comprehensive digital twin viewer platform for the AEC industry, enabling teams to visualize,
        analyze, and collaborate on BIM models, point clouds, 360° panoramas, and engineering drawings all in the browser.
      </p>

      <h2 id="what-is-axisxd" class="text-xl font-bold mt-10 mb-3">What is AxisXD?</h2>
      <p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
        AxisXD provides a suite of web-based 3D viewers and analysis tools that allow construction professionals to
        interact with complex spatial data directly in the browser; no plugins or desktop software required.
      </p>
      <p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
        Built on WebGL 2.0 and powered by WebAssembly, AxisXD handles large-scale BIM models (IFC), LiDAR point
        clouds, panoramic imagery, CAD/DXF drawings, and textured 3D meshes with high performance and millimetre accuracy.
      </p>
      ${callout('tip', 'AxisXD viewers are embeddable via iframe or JavaScript SDK, making it easy to integrate spatial visualization into your existing project management and BIM workflows.')}

      <h2 id="core-products" class="text-xl font-bold mt-10 mb-3">Core Products</h2>
      <div class="flex flex-col gap-2.5 mb-6">
        ${[
          { name: 'IFC Viewer', sub: 'RealityXD', desc: 'BIM model visualization with property inspection, filtering, and measurement.', color: '#3B82F6' },
          { name: 'Point Cloud LiDAR', sub: 'VoxelXD', desc: 'High-density LiDAR scan rendering with annotation, clipping, and export.', color: '#0645fb' },
          { name: 'Pano 360° Viewer', sub: 'XploreXD', desc: 'Equirectangular panoramic navigation with hotspot management.', color: '#8B5CF6' },
          { name: 'CAD / DXF Viewer', sub: 'Coming Soon', desc: 'Layer-based engineering drawing viewer with dimension and annotation support.', color: '#10b981' },
          { name: '3D Mesh Viewer', sub: 'Coming Soon', desc: 'Textured mesh rendering for photogrammetry outputs and digital site models.', color: '#f59e0b' },
        ]
          .map(
            (p) => `<div class="flex items-start gap-4 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div class="w-2 h-2 rounded-full mt-1.5 shrink-0" style="background:${p.color}"></div>
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">${p.name}</span>
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">${p.sub}</span>
                </div>
                <p class="text-xs text-zinc-500 leading-relaxed">${p.desc}</p>
              </div>
            </div>`,
          )
          .join('')}
      </div>

      <h2 id="platform-architecture" class="text-xl font-bold mt-10 mb-3">Platform Architecture</h2>
      <p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
        AxisXD is modular and cloud-first. Each viewer is a self-contained micro-frontend communicating with a shared
        backend API for model storage, processing, and access control.
      </p>
      ${codeBlock(
        `Client Browser
├── IFC Viewer (RealityXD)       → WASM + WebGL 2.0
├── Point Cloud Viewer (VoxelXD) → WebGL + LOD Streaming
├── Pano Viewer (XploreXD)       → WebGL + Equirectangular
├── CAD Viewer                   → SVG + Canvas 2D
└── Mesh Viewer                  → Three.js + DRACO

AxisXD REST API  (api.axisxd.com/v1)
├── /models: IFC & mesh model management
├── /scans: Point cloud data streams
├── /panos: Panoramic image sets
├── /drawings: CAD / DXF files
└── /analysis: Deviation, clash, ROL reports`,
        'diagram',
      )}
      ${callout('info', 'All viewers share a single authentication layer. One API key grants access to every product included in your plan.')}

      <h2 id="use-cases" class="text-xl font-bold mt-10 mb-3">Use Cases</h2>
      <ul class="flex flex-col gap-2 mb-6">
        ${[
          'Compare as-built LiDAR scans against BIM design models for automated deviation reporting',
          'Embed live 360° site walkthroughs into project management platforms',
          'Conduct BIM clash detection before construction begins to avoid costly rework',
          'Assess solar access and rights of light for planning applications',
          'Deliver real-time construction progress monitoring with photo documentation',
        ]
          .map(
            (uc) => `<li class="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400 p-3 rounded-lg bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50">
              <span class="text-blue-500 mt-0.5 shrink-0 font-bold">→</span>
              ${uc}
            </li>`,
          )
          .join('')}
      </ul>

      <h2 id="next-steps" class="text-xl font-bold mt-10 mb-3">Next Steps</h2>
      <div class="grid grid-cols-2 gap-3">
        ${[
          { title: 'Quick Start', desc: 'Get your first viewer running in 5 minutes' },
          { title: 'IFC Viewer', desc: 'Load and explore BIM models in the browser' },
          { title: 'API Reference', desc: 'Explore the full REST API surface' },
          { title: 'Authentication', desc: 'Set up API keys and access control' },
        ]
          .map(
            (card) => `<div class="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/40 hover:bg-zinc-800/60 transition-all group cursor-pointer">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">${card.title}</span>
                <svg class="w-3.5 h-3.5 text-zinc-600 group-hover:text-blue-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </div>
              <p class="text-xs text-zinc-500">${card.desc}</p>
            </div>`,
          )
          .join('')}
      </div>
    `,
  },

  /* ── Quick Start ── */
  'quick-start': {
    title: 'Quick Start',
    toc: [
      { id: 'prerequisites', title: 'Prerequisites', level: 2 },
      { id: 'get-api-key', title: 'Get Your API Key', level: 2 },
      { id: 'embed-viewer', title: 'Embed a Viewer', level: 2 },
      { id: 'upload-model', title: 'Upload Your First Model', level: 2 },
    ],
    content: `
      <p class="text-base text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
        Get AxisXD running in minutes. This guide walks you through embedding your first viewer and uploading a model.
      </p>

      <h2 id="prerequisites" class="text-xl font-bold mt-10 mb-3">Prerequisites</h2>
      <ul class="flex flex-col gap-1.5 mb-6 text-sm text-zinc-600 dark:text-zinc-400">
        ${['An AxisXD account (free trial available at axisxd.com)', 'A BIM model in IFC format, or a DXF drawing', 'Basic knowledge of HTML or JavaScript']
          .map((p) => `<li class="flex items-center gap-2"><span class="text-blue-400">•</span>${p}</li>`)
          .join('')}
      </ul>

      <h2 id="get-api-key" class="text-xl font-bold mt-10 mb-3">Get Your API Key</h2>
      <p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
        Navigate to <strong class="text-zinc-800 dark:text-zinc-200">Dashboard → Settings → API Keys</strong> and create a new key.
      </p>
      ${callout('warning', 'Keep your API key secret. Never expose it in client-side code or commit it to version control. Use environment variables.')}

      <h2 id="embed-viewer" class="text-xl font-bold mt-10 mb-3">Embed a Viewer</h2>
      <p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">The fastest integration is an iframe embed:</p>
      ${codeBlock(
        `<iframe
  src="https://realityxd.axisxd.com/embed?model=YOUR_MODEL_ID&token=YOUR_API_KEY"
  width="100%"
  height="600"
  frameborder="0"
  allowfullscreen
></iframe>`,
        'html',
      )}
      <p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">Or use the JavaScript SDK for full control:</p>
      ${codeBlock(
        `import { AxisXD } from '@axisxd/sdk';

const viewer = new AxisXD.IFCViewer({
  container: document.getElementById('viewer'),
  apiKey: 'YOUR_API_KEY',
  modelId: 'YOUR_MODEL_ID',
  theme: 'dark',
});

viewer.on('ready', () => {
  console.log('Model loaded:', viewer.getModelInfo());
});`,
        'javascript',
      )}

      <h2 id="upload-model" class="text-xl font-bold mt-10 mb-3">Upload Your First Model</h2>
      ${codeBlock(
        `curl -X POST https://api.axisxd.com/v1/models \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@path/to/model.ifc" \\
  -F "name=My First Model"`,
        'bash',
      )}
      ${codeBlock(
        `{
  "id": "mdl_abc123",
  "name": "My First Model",
  "status": "processing",
  "format": "ifc",
  "size_bytes": 14802345,
  "created_at": "2025-06-01T10:00:00Z"
}`,
        'json',
      )}
      ${callout('tip', 'Processing typically takes 30–120 seconds depending on model size. Use webhooks to receive a notification when processing completes instead of polling.')}
    `,
  },

  /* ── Authentication ── */
  authentication: {
    title: 'Authentication',
    toc: [
      { id: 'api-keys', title: 'API Keys', level: 2 },
      { id: 'oauth', title: 'OAuth 2.0', level: 2 },
      { id: 'scopes', title: 'Scopes', level: 2 },
    ],
    content: `
      <p class="text-base text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
        AxisXD supports API key authentication for server-to-server calls and OAuth 2.0 for user-facing integrations.
      </p>
      <h2 id="api-keys" class="text-xl font-bold mt-10 mb-3">API Keys</h2>
      <p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">Pass your key as a Bearer token:</p>
      ${codeBlock(
        `curl https://api.axisxd.com/v1/models \\
  -H "Authorization: Bearer axd_live_xxxxxxxxxxxxxxxx"`,
        'bash',
      )}
      <p class="text-sm text-zinc-600 dark:text-zinc-400 mb-4">Key prefixes indicate the environment:</p>
      <div class="flex flex-col gap-2 mb-6">
        ${[
          { prefix: 'axd_live_', env: 'Production', note: 'Billable: use in your live product.' },
          { prefix: 'axd_test_', env: 'Test', note: 'Not billable and safe for development.' },
        ]
          .map(
            (k) => `<div class="flex items-start gap-4 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <code class="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded shrink-0">${k.prefix}</code>
              <div>
                <p class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">${k.env}</p>
                <p class="text-xs text-zinc-500 mt-0.5">${k.note}</p>
              </div>
            </div>`,
          )
          .join('')}
      </div>
      <h2 id="oauth" class="text-xl font-bold mt-10 mb-3">OAuth 2.0</h2>
      <p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">For user-authorized integrations, use the Authorization Code flow:</p>
      ${codeBlock(
        `# 1. Redirect user to authorize
GET https://auth.axisxd.com/oauth/authorize
  ?client_id=YOUR_CLIENT_ID
  &redirect_uri=https://yourapp.com/callback
  &response_type=code
  &scope=models:read scans:write

# 2. Exchange code for token
POST https://auth.axisxd.com/oauth/token
  client_id=...&client_secret=...&code=...&grant_type=authorization_code`,
        'bash',
      )}
      <h2 id="scopes" class="text-xl font-bold mt-10 mb-3">Scopes</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b border-zinc-800">
              ${['Scope', 'Description'].map((h) => `<th class="text-left py-2 pr-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider">${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody class="text-zinc-600 dark:text-zinc-300">
            ${[
              ['models:read', 'View models and their metadata'],
              ['models:write', 'Upload and delete models'],
              ['scans:read', 'View point cloud scans'],
              ['scans:write', 'Upload and manage scans'],
              ['analysis:read', 'Access analysis reports'],
              ['analysis:write', 'Run analysis jobs'],
            ]
              .map(
                ([s, d]) => `<tr class="border-b border-zinc-800/50">
                  <td class="py-2.5 pr-6"><code class="text-xs text-blue-400 font-mono">${s}</code></td>
                  <td class="py-2.5 text-zinc-400 text-xs">${d}</td>
                </tr>`,
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `,
  },

  /* ── IFC Viewer ── */
  'ifc-viewer': {
    title: 'IFC Viewer',
    toc: [
      { id: 'overview', title: 'Overview', level: 2 },
      { id: 'supported-formats', title: 'Supported Formats', level: 2 },
      { id: 'features', title: 'Features', level: 2 },
      { id: 'bim-integration', title: 'BIM Integration', level: 2 },
      { id: 'measurement-tools', title: 'Measurement Tools', level: 2 },
      { id: 'configuration', title: 'Configuration', level: 2 },
    ],
    content: `
      <p class="text-base text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
        RealityXD, AxisXD's IFC Viewer, renders BIM models at scale in the browser with full property inspection,
        layer filtering, and precision measurement tools.
      </p>

      <h2 id="overview" class="text-xl font-bold mt-10 mb-3">Overview</h2>
      <p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
        The IFC Viewer supports models up to 2 GB and all IFC schema versions. A streaming architecture means users
        can start interacting before the full file is downloaded.
      </p>
      <div class="grid grid-cols-3 gap-3 mb-6">
        ${statCard('Max Model Size', '2 GB')}
        ${statCard('IFC Schemas', '2X3 · 4 · 4X3')}
        ${statCard('Render Engine', 'WebGL 2.0 + WASM')}
      </div>

      <h2 id="supported-formats" class="text-xl font-bold mt-10 mb-3">Supported Formats</h2>
      <ul class="flex flex-col gap-1.5 mb-6 text-sm text-zinc-600 dark:text-zinc-400">
        ${['IFC 2×3', 'IFC 4', 'IFC 4×3 (RC4)', 'IFC-ZIP (compressed)', 'STEP (partial)']
          .map((f) => `<li class="flex items-center gap-2"><span class="text-green-400">✓</span>${f}</li>`)
          .join('')}
      </ul>

      <h2 id="features" class="text-xl font-bold mt-10 mb-3">Features</h2>
      <div class="grid grid-cols-2 gap-2.5 mb-6">
        ${[
          'Property set inspection (Pset_*)',
          'Spatial structure tree navigation',
          'Element isolation & X-ray mode',
          'Type & discipline filtering',
          'Section cut planes (X/Y/Z)',
          'Point-to-point measurement',
          'Clash visualization overlay',
          'Orthographic + perspective camera',
        ]
          .map(
            (f) => `<div class="flex items-center gap-2.5 text-xs text-zinc-600 dark:text-zinc-400 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span class="text-blue-400 shrink-0">→</span>${f}
            </div>`,
          )
          .join('')}
      </div>

      <h2 id="bim-integration" class="text-xl font-bold mt-10 mb-3">BIM Integration</h2>
      ${codeBlock(
        `// Listen for element selection
viewer.on('element:select', (element) => {
  console.log('GUID:',       element.globalId);
  console.log('Type:',       element.type);        // e.g. IfcWall
  console.log('Properties:', element.properties);  // Pset data
});

// Filter by discipline
viewer.setFilter({ discipline: ['structural', 'mechanical'] });

// Highlight elements by GUID list
viewer.highlight(['2o2Fr\$t4X7Ar8qXyVRpfTC', '3KjHnZ...']);`,
        'javascript',
      )}

      <h2 id="measurement-tools" class="text-xl font-bold mt-10 mb-3">Measurement Tools</h2>
      ${codeBlock(
        `// Start a distance measurement
const measure = viewer.startMeasurement({ type: 'distance' });
measure.on('complete', ({ value, unit }) => {
  console.log(\`Distance: \${value} \${unit}\`);  // e.g. "3.45 m"
});

// Export all saved annotations
const annotations = viewer.getAnnotations();
console.log(annotations);`,
        'javascript',
      )}

      <h2 id="configuration" class="text-xl font-bold mt-10 mb-3">Configuration</h2>
      ${codeBlock(
        `const viewer = new AxisXD.IFCViewer({
  container: '#viewer',
  apiKey:    'YOUR_KEY',
  modelId:   'mdl_abc123',

  // Display
  theme:      'dark',          // 'dark' | 'light'
  background: '#0a0a0f',

  // Features
  measurementEnabled: true,
  sectionCutEnabled:  true,
  propertiesPanel:    true,

  // Performance
  qualityPreset:    'high',   // 'low' | 'medium' | 'high' | 'ultra'
  streamingEnabled: true,
});`,
        'javascript',
      )}
    `,
  },

  /* ── Point Cloud ── */
  'point-cloud': {
    title: 'Point Cloud LiDAR',
    toc: [
      { id: 'overview', title: 'Overview', level: 2 },
      { id: 'supported-formats', title: 'Supported Formats', level: 2 },
      { id: 'visualization', title: 'Visualization', level: 2 },
      { id: 'api-usage', title: 'API Usage', level: 2 },
    ],
    content: `
      <p class="text-base text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
        VoxelXD renders high-density point clouds from LiDAR scans and reality capture data directly in the browser,
        supporting datasets with hundreds of millions of points via progressive LOD streaming.
      </p>
      <h2 id="overview" class="text-xl font-bold mt-10 mb-3">Overview</h2>
      <p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
        Scans are processed into an octree structure optimized for web delivery, allowing immediate interaction while
        higher-density data loads in the background.
      </p>
      <div class="grid grid-cols-3 gap-3 mb-6">
        ${statCard('Max Points', '500M+')}
        ${statCard('Accuracy', '±2 mm')}
        ${statCard('Streaming', 'LOD Octree')}
      </div>
      <h2 id="supported-formats" class="text-xl font-bold mt-10 mb-3">Supported Formats</h2>
      <ul class="flex flex-col gap-1.5 mb-6 text-sm text-zinc-600 dark:text-zinc-400">
        ${['LAS / LAZ (LiDAR Exchange Format)', 'E57 (ASTM Standard)', 'PLY (Polygon File Format)', 'PCD (Point Cloud Data)', 'RCP / RCS (Autodesk ReCap)']
          .map((f) => `<li class="flex items-center gap-2"><span class="text-green-400">✓</span>${f}</li>`)
          .join('')}
      </ul>
      <h2 id="visualization" class="text-xl font-bold mt-10 mb-3">Visualization Options</h2>
      ${codeBlock(
        `const viewer = new AxisXD.PointCloudViewer({
  container: '#viewer',
  apiKey:    'KEY',
  scanId:    'scan_xyz',
});

// Color mode: 'rgb' | 'intensity' | 'height' | 'classification'
viewer.setColorMode('classification');

// Point size (1–5)
viewer.setPointSize(2.5);

// Clipping box
viewer.setClipBox({
  min: { x: -10, y: -10, z: 0 },
  max: { x:  10, y:  10, z: 5 },
});`,
        'javascript',
      )}
      <h2 id="api-usage" class="text-xl font-bold mt-10 mb-3">API Usage</h2>
      ${codeBlock(
        `curl -X POST https://api.axisxd.com/v1/scans \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -F "file=@scan.las" \\
  -F "name=Site Scan - Block A"`,
        'bash',
      )}
      ${codeBlock(
        `{
  "id": "scan_abc123",
  "name": "Site Scan - Block A",
  "status": "processing",
  "point_count": null,
  "format": "las",
  "created_at": "2025-06-01T10:00:00Z"
}`,
        'json',
      )}
    `,
  },

  /* ── API Overview ── */
  'api-overview': {
    title: 'API Overview',
    toc: [
      { id: 'base-url', title: 'Base URL', level: 2 },
      { id: 'auth', title: 'Authentication', level: 2 },
      { id: 'rate-limits', title: 'Rate Limits', level: 2 },
      { id: 'error-codes', title: 'Error Codes', level: 2 },
    ],
    content: `
      <p class="text-base text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
        The AxisXD REST API gives you programmatic access to all platform capabilities including model uploads,
        viewer configuration, analysis jobs, and more.
      </p>
      <h2 id="base-url" class="text-xl font-bold mt-10 mb-3">Base URL</h2>
      ${codeBlock('https://api.axisxd.com/v1', 'bash')}
      <p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">All requests must use HTTPS. HTTP requests are automatically redirected.</p>

      <h2 id="auth" class="text-xl font-bold mt-10 mb-3">Authentication</h2>
      ${codeBlock(
        `curl https://api.axisxd.com/v1/models \\
  -H "Authorization: Bearer axd_live_xxxxxxxxxxxxxxxx"`,
        'bash',
      )}
      ${callout('warning', 'Use <code class="text-amber-300 bg-amber-500/10 px-1 rounded text-xs">axd_test_</code> prefixed keys during development; they won\'t charge your account.')}

      <h2 id="rate-limits" class="text-xl font-bold mt-10 mb-3">Rate Limits</h2>
      <div class="overflow-x-auto mb-6">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b border-zinc-800">
              ${['Plan', 'Requests / min', 'Concurrent Uploads'].map((h) => `<th class="text-left py-2 pr-6 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody class="text-zinc-600 dark:text-zinc-300">
            ${[
              ['Starter', '60', '2'],
              ['Pro', '300', '10'],
              ['Enterprise', '1,200', 'Unlimited'],
            ]
              .map(
                ([plan, rpm, cu]) => `<tr class="border-b border-zinc-800/50">
                  <td class="py-2.5 pr-6 text-sm font-medium">${plan}</td>
                  <td class="py-2.5 pr-6 text-sm text-zinc-600 dark:text-zinc-400">${rpm}</td>
                  <td class="py-2.5 text-sm text-zinc-600 dark:text-zinc-400">${cu}</td>
                </tr>`,
              )
              .join('')}
          </tbody>
        </table>
      </div>

      <h2 id="error-codes" class="text-xl font-bold mt-10 mb-3">Error Codes</h2>
      <div class="flex flex-col gap-2 mb-6">
        ${[
          { code: '400', name: 'Bad Request', desc: 'Invalid parameters or malformed request body.' },
          { code: '401', name: 'Unauthorized', desc: 'Missing or invalid API key.' },
          { code: '403', name: 'Forbidden', desc: 'Valid key but insufficient permissions for this resource.' },
          { code: '404', name: 'Not Found', desc: 'The requested resource does not exist.' },
          { code: '429', name: 'Too Many Requests', desc: 'Rate limit exceeded. Check the Retry-After header.' },
          { code: '500', name: 'Internal Server Error', desc: 'Something went wrong on our side. Contact support.' },
        ]
          .map(
            (e) => `<div class="flex items-start gap-4 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span class="font-mono text-sm font-bold text-red-400 shrink-0 w-8">${e.code}</span>
              <div>
                <p class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">${e.name}</p>
                <p class="text-xs text-zinc-500 mt-0.5">${e.desc}</p>
              </div>
            </div>`,
          )
          .join('')}
      </div>
    `,
  },
};

const FLAT_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

@Component({
  selector: 'app-documentation-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './documentation-page.html',
  styleUrl: './documentation-page.scss',
})
export class DocumentationPageComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('contentEl') contentRef?: ElementRef<HTMLDivElement>;

  readonly Search = Search;
  readonly ChevronDown = ChevronDown;
  readonly ArrowUpRight = ArrowUpRight;
  readonly Menu = Menu;
  readonly X = X;

  readonly navGroups = NAV_GROUPS;
  readonly footerLinks = [{ label: 'Blog & Articles' }, { label: 'Whitepapers' }, { label: 'Webinars' }];

  isDark = true;
  activeDoc = 'introduction';
  openGroups: string[] = ['overview', 'viewers'];
  searchQuery = '';
  sidebarOpen = false;
  activeSection = '';

  private themeObserver: MutationObserver | null = null;
  private lastActiveDoc = '';
  private contentClickHandler = (e: Event) => this.onContentClick(e);
  private contentScrollHandler = () => this.onContentScroll();

  constructor(private seo: SeoService, private sanitizer: DomSanitizer) {
    this.seo.set({
      title: 'Documentation',
      description: 'AxisXD documentation: guides, API references, and tutorials for the digital twin platform.',
      canonicalPath: '/docs',
    });
  }

  ngOnInit(): void {
    this.isDark = document.documentElement.classList.contains('dark');
    this.themeObserver = new MutationObserver(() => {
      this.isDark = document.documentElement.classList.contains('dark');
    });
    this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }

  ngAfterViewChecked(): void {
    if (this.activeDoc !== this.lastActiveDoc) {
      this.lastActiveDoc = this.activeDoc;
      this.activeSection = '';
      if (this.contentRef) {
        this.contentRef.nativeElement.scrollTop = 0;
        this.contentRef.nativeElement.removeEventListener('scroll', this.contentScrollHandler);
        this.contentRef.nativeElement.addEventListener('scroll', this.contentScrollHandler);
        this.contentRef.nativeElement.removeEventListener('click', this.contentClickHandler);
        this.contentRef.nativeElement.addEventListener('click', this.contentClickHandler);
      }
    }
  }

  ngOnDestroy(): void {
    this.themeObserver?.disconnect();
    this.contentRef?.nativeElement.removeEventListener('scroll', this.contentScrollHandler);
    this.contentRef?.nativeElement.removeEventListener('click', this.contentClickHandler);
  }

  get currentDoc(): DocPage | undefined {
    return DOCS[this.activeDoc];
  }

  get currentToc(): TocEntry[] {
    return this.currentDoc?.toc ?? [];
  }

  get currentHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.currentDoc?.content ?? '');
  }

  get placeholderTitle(): string {
    return FLAT_ITEMS.find((i) => i.id === this.activeDoc)?.title ?? this.activeDoc;
  }

  get filteredGroups(): NavGroup[] {
    const q = this.searchQuery.toLowerCase();
    return this.navGroups
      .map((g) => ({
        ...g,
        items: q ? g.items.filter((i) => i.title.toLowerCase().includes(q)) : g.items,
      }))
      .filter((g) => g.items.length > 0);
  }

  isGroupOpen(id: string): boolean {
    return this.openGroups.includes(id) || !!this.searchQuery;
  }

  toggleGroup(id: string): void {
    this.openGroups = this.openGroups.includes(id) ? this.openGroups.filter((g) => g !== id) : [...this.openGroups, id];
  }

  navigateDoc(id: string): void {
    this.activeDoc = id;
    this.sidebarOpen = false;
    const group = this.navGroups.find((g) => g.items.some((i) => i.id === id));
    if (group && !this.openGroups.includes(group.id)) {
      this.openGroups = [...this.openGroups, group.id];
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  scrollToSection(id: string): void {
    const el = this.contentRef?.nativeElement.querySelector(`#${CSS.escape(id)}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  get prevItem(): NavItem | undefined {
    const idx = FLAT_ITEMS.findIndex((i) => i.id === this.activeDoc);
    return FLAT_ITEMS[idx - 1];
  }

  get nextItem(): NavItem | undefined {
    const idx = FLAT_ITEMS.findIndex((i) => i.id === this.activeDoc);
    return FLAT_ITEMS[idx + 1];
  }

  private onContentScroll(): void {
    const el = this.contentRef?.nativeElement;
    if (!el) return;
    const headings = el.querySelectorAll('h2[id]');
    let current = '';
    headings.forEach((h: Element) => {
      if (h.getBoundingClientRect().top < 130) current = h.id;
    });
    this.activeSection = current;
  }

  private onContentClick(e: Event): void {
    const target = (e.target as HTMLElement).closest('.doc-copy-btn') as HTMLElement | null;
    if (!target) return;
    const code = decodeURIComponent(target.dataset['code'] || '');
    navigator.clipboard?.writeText(code).catch(() => {});
    const label = target.querySelector('.doc-copy-label');
    const copyIcon = target.querySelector('.doc-copy-icon');
    const checkIcon = target.querySelector('.doc-check-icon');
    if (label) label.textContent = 'Copied';
    copyIcon?.classList.add('hidden');
    checkIcon?.classList.remove('hidden');
    setTimeout(() => {
      if (label) label.textContent = 'Copy';
      copyIcon?.classList.remove('hidden');
      checkIcon?.classList.add('hidden');
    }, 2000);
  }
}
