import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { LucideAngularModule, X, Send, MessageCircle, ChevronRight, RotateCcw, Minimize2 } from 'lucide-angular';
import { ConsultationService } from '../../core/consultation.service';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  quickReplies?: string[];
}

const KB: { patterns: RegExp[]; response: string; quickReplies?: string[] }[] = [
  {
    patterns: [/ifc/i, /bim/i, /revit/i, /archicad/i],
    response: "**IFC Viewer** supports IFC 2×3, 4, and 4.3 files. You can load models from Revit, ArchiCAD, Tekla, and any IFC-compliant authoring tool.\n\nKey features: storey navigation, element property tree, section cuts, measurement tools, and shareable links with everything available in the browser and no installation needed.",
    quickReplies: ['What file size is supported?', 'Book a demo', 'See pricing'],
  },
  {
    patterns: [/point.?cloud/i, /lidar/i, /las/i, /e57/i, /scan/i],
    response: "**Point Cloud Viewer** handles E57, LAS, LAZ, PCD, PLY, and RCP/RCS files up to 500 million points.\n\nSupports WebGL 2.0 streaming with LOD, IFC overlay for scan-to-BIM comparison, and live deviation heatmaps. No desktop software required.",
    quickReplies: ['Deviation analysis', 'Supported formats', 'Book a demo'],
  },
  {
    patterns: [/deviation/i, /as.built/i, /heatmap/i, /tolerance/i],
    response: "**Deviation Analyzer** compares point cloud scans against IFC/BIM reference models with ±0.5 mm precision.\n\nColor-coded heatmaps highlight variances beyond your tolerance thresholds. Generates ISO-12053 compliant PDF/XLS reports in under 60 seconds per million points.",
    quickReplies: ['Supported formats', 'See pricing', 'Book a demo'],
  },
  {
    patterns: [/clash/i, /conflict/i, /nwc/i, /navisworks/i, /coordination/i],
    response: "**Clash Detection** scans multi-discipline IFC, NWC, and NWD models for hard and soft clashes in under 30 seconds.\n\nFeatures: discipline filtering, severity scoring, BCF export, 3D clash visualization, and resolution tracking without a Navisworks license.",
    quickReplies: ['What file formats?', 'Book a demo', 'See pricing'],
  },
  {
    patterns: [/pano/i, /360/i, /panoram/i, /matterport/i, /site.?photo/i],
    response: "**Pano 360° Viewer** supports equirectangular JPEG, PNG, TIFF, and Matterport tours up to 16K resolution.\n\nLink hotspots to BIM elements, annotate site conditions, and share immersive tours with stakeholders, reducing site visits by up to 60%.",
    quickReplies: ['What formats?', 'Construction monitoring', 'Book a demo'],
  },
  {
    patterns: [/cad/i, /dxf/i, /dwg/i, /drawing/i, /autocad/i],
    response: "**CAD / DXF Viewer** opens DXF, DWG, and DWF files up to 500 MB instantly in the browser.\n\nMeasure dimensions, toggle layers, add markups, and share annotated drawing links without an AutoCAD license.",
    quickReplies: ['Supported formats', 'Book a demo', 'See pricing'],
  },
  {
    patterns: [/mesh/i, /obj/i, /gltf/i, /fbx/i, /3d.model/i],
    response: "**3D Mesh Viewer** handles OBJ, GLTF, GLB, FBX, and STL models with up to 50 million vertices using WebGL LOD streaming.\n\nSection cuts, surface measurements, and texture rendering are supported out of the box.",
    quickReplies: ['Deviation analysis', 'Book a demo', 'See pricing'],
  },
  {
    patterns: [/rights.?of.?light/i, /\brol\b/i, /daylight/i, /sunlight/i, /shadow/i, /planning/i],
    response: "**Rights of Light Analyzer** simulates solar access and daylight impacts for proposed developments with ±1° arc accuracy.\n\nGenerates VSC and ADF reports per BRE/RIBA guidelines for use for planning submissions and neighbour consultations.",
    quickReplies: ['See pricing', 'Book a demo', 'Supported standards'],
  },
  {
    patterns: [/monitor/i, /construction.?progress/i, /site.?track/i, /timeline/i],
    response: "**Construction Monitoring** turns site photos, 360° panoramas, and LiDAR scans into AI-powered timeline comparisons.\n\nDetects schedule drift automatically and generates shareable progress dashboards, reducing physical site visits by 60%.",
    quickReplies: ['How does it work?', 'Book a demo', 'See pricing'],
  },
  {
    patterns: [/digital.?twin/i, /iot/i, /sensor/i, /live.?data/i],
    response: "**Digital Twin Platform** unifies IFC models, point clouds, panoramic imagery, and live IoT sensor data into a single environment.\n\nSupports real-time data overlays, facility management dashboards, and API-driven automation for enterprise deployments.",
    quickReplies: ['Enterprise pricing', 'Book a demo', 'API docs'],
  },
  {
    patterns: [/pric/i, /cost/i, /plan/i, /free/i, /trial/i, /sandbox/i, /subscri/i],
    response: "AxisXD offers three tiers:\n\n• **Pilot Sandbox**: Free, full access with usage limits. Great for evaluation.\n• **Professional**: $199/mo per seat. Unlimited uploads, team sharing, priority support.\n• **Enterprise**: Custom pricing. SSO, self-hosted deployment, SLA, dedicated support.\n\nAll plans include every viewer and analysis tool.",
    quickReplies: ['Book a demo', 'Contact sales', 'Free trial'],
  },
  {
    patterns: [/demo/i, /book/i, /consul/i, /sales/i, /trial/i, /get.?start/i],
    response: "I can help you book a free consultation with the AxisXD team. We'll walk you through the platform live, answer technical questions, and build a proof-of-concept with your own data.\n\nReply **'Book now'** and I'll direct you to our consultation form.",
    quickReplies: ['Book now', 'See pricing', 'Talk to sales'],
  },
  {
    patterns: [/book.?now/i, /schedule/i],
    response: 'Opening the consultation booking form for you now. Our team typically responds within 1 business day to confirm your slot.',
    quickReplies: ['See pricing', 'Product overview'],
  },
  {
    patterns: [/api/i, /webhook/i, /sdk/i, /integrat/i, /developer/i, /embed/i],
    response: "AxisXD provides a **REST API** for programmatic model uploads, viewer embedding, analysis triggers, and webhook notifications.\n\nCheck our documentation for endpoint references, authentication guides, and code examples in JavaScript, Python, and cURL.",
    quickReplies: ['API docs', 'See integrations', 'Book a demo'],
  },
  {
    patterns: [/format/i, /upload/i, /file.?type/i, /support.*file/i],
    response: "**Supported formats by tool:**\n\n• IFC Viewer: IFC 2×3, 4, 4.3\n• Point Cloud: E57, LAS, LAZ, PCD, PLY, RCP/RCS\n• CAD Viewer: DXF, DWG, DWF\n• Mesh Viewer: OBJ, GLTF, GLB, FBX, STL\n• Pano: JPEG, PNG, TIFF, Matterport\n• Analysis: all of the above as inputs",
    quickReplies: ['File size limits', 'Book a demo', 'See pricing'],
  },
  {
    patterns: [/size/i, /limit/i, /large/i, /big.?file/i, /how.?large/i],
    response: "**File size limits by tier:**\n\n• Pilot Sandbox: up to 200 MB per file\n• Professional: up to 2 GB per file\n• Enterprise: unlimited (cloud-streamed)\n\nPoint clouds stream progressively; even 500M-point files open without full download.",
    quickReplies: ['See pricing', 'Upload guide', 'Book a demo'],
  },
  {
    patterns: [/security/i, /gdpr/i, /complian/i, /iso/i, /privacy/i, /data.*protect/i],
    response: "AxisXD is **GDPR compliant**, **ISO 19650** and **ISO 27001** certified, and **SOC 2 Type II** ready.\n\nAll data is encrypted in transit (TLS 1.3) and at rest. Files are deleted automatically after each session unless saved to a project. Enterprise accounts support self-hosted deployment and RBAC.",
    quickReplies: ['Self-hosted option', 'Enterprise pricing', 'Privacy policy'],
  },
  {
    patterns: [/install/i, /download/i, /browser/i, /desktop/i, /plugin/i, /extension/i],
    response: "AxisXD is **100% browser-based** and requires no installation, plugins, or downloads.\n\nIt runs via WebGL 2.0 and WebAssembly, compatible with Chrome 90+, Firefox 88+, Edge 90+, and Safari 16+. Works on desktop, tablet, and most modern mobile browsers.",
    quickReplies: ['Supported browsers', 'Book a demo', 'See pricing'],
  },
  {
    patterns: [/hello/i, /hi\b/i, /hey\b/i, /good.?(morning|afternoon|evening)/i],
    response: "Hi there! 👋 I'm the AxisXD assistant. I can help you with:\n\n• Product features and capabilities\n• Pricing and plans\n• Technical questions and file formats\n• Booking a demo or consultation\n\nWhat can I help you with today?",
    quickReplies: ['Product overview', 'See pricing', 'Book a demo', 'Technical support'],
  },
  {
    patterns: [/product/i, /overview/i, /what.*do/i, /what.*offer/i, /features/i],
    response: "AxisXD is a unified digital twin platform for the AEC industry with 6 viewers and 4 analysis tools:\n\n**Viewers:** IFC/BIM, Point Cloud LiDAR, 360° Pano, CAD/DXF, 3D Mesh, Digital Twin\n\n**Analysis:** Deviation Analyzer, Clash Detection, Rights of Light, Construction Monitoring\n\nAll browser-based, no installation needed.",
    quickReplies: ['IFC Viewer', 'Point Cloud', 'Clash Detection', 'See pricing'],
  },
  {
    patterns: [/support/i, /help/i, /issue/i, /problem/i, /error/i, /broken/i, /not.?work/i],
    response: "I'm sorry to hear you're having trouble. Here are the fastest ways to get help:\n\n• **Documentation**: guides and troubleshooting at /docs\n• **Email**: contact@axisxd.com (response within 4 hours)\n• **Enterprise support**: dedicated Slack channel and SLA\n\nCan you describe the issue? I may be able to help directly.",
    quickReplies: ['File upload issue', 'Viewer not loading', 'API error', 'Contact support'],
  },
];

const FALLBACK: { response: string; quickReplies: string[] } = {
  response: "I don't have a specific answer for that, but our team definitely can help. You can:\n\n• **Email us** at contact@axisxd.com\n• **Book a demo** for a live walkthrough\n• **Check the docs** at /docs for technical guides\n\nIs there anything else I can help with?",
  quickReplies: ['Book a demo', 'Product overview', 'See pricing', 'Contact support'],
};

function getBotResponse(input: string): { response: string; quickReplies?: string[]; shouldOpenConsultation?: boolean } {
  const match = KB.find((k) => k.patterns.some((p) => p.test(input)));
  if (match) {
    const shouldOpenConsultation = /book.?now/i.test(input);
    return { response: match.response, quickReplies: match.quickReplies, shouldOpenConsultation };
  }
  return FALLBACK;
}

const QUICK_REPLY_ACTIONS: Record<string, string> = {
  'Book a demo': 'I want to book a demo',
  'Book now': 'Book now',
  'See pricing': 'Tell me about pricing',
  'IFC Viewer': 'Tell me about the IFC Viewer',
  'Point Cloud': 'Tell me about Point Cloud',
  'Clash Detection': 'Tell me about Clash Detection',
  'Deviation analysis': 'Tell me about Deviation analysis',
  'Supported formats': 'What file formats are supported?',
  'Technical support': 'I need technical support',
  'Product overview': 'Give me a product overview',
  'API docs': 'Tell me about the API',
  'See integrations': 'What integrations are available?',
  'Enterprise pricing': 'Tell me about enterprise pricing',
  'Contact sales': 'I want to contact sales',
  'Contact support': 'I need to contact support',
  'Privacy policy': 'Tell me about privacy and security',
  'Construction monitoring': 'Tell me about Construction Monitoring',
  'Free trial': 'How do I start a free trial?',
};

function makeInitialMessage(): Message {
  return {
    id: '0',
    role: 'assistant',
    text: "Hi there! I'm the AxisXD assistant. I can help with product questions, pricing, demos, and technical support.\n\nWhat can I help you with?",
    timestamp: new Date(),
    quickReplies: ['Product overview', 'See pricing', 'Book a demo', 'Technical support'],
  };
}

interface TextPart {
  text: string;
  bold: boolean;
}

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './chat-widget.html',
  styleUrl: './chat-widget.scss',
  animations: [
    trigger('panelInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px) scale(0.95)' }),
        animate('220ms cubic-bezier(0.16,1,0.3,1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
      ]),
      transition(':leave', [animate('180ms ease-in', style({ opacity: 0, transform: 'translateY(20px) scale(0.95)' }))]),
    ]),
    trigger('tagInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(8px) scale(0.95)' }),
        animate('250ms cubic-bezier(0.16,1,0.3,1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
      ]),
      transition(':leave', [animate('180ms ease-in', style({ opacity: 0, transform: 'translateY(8px) scale(0.95)' }))]),
    ]),
  ],
})
export class ChatWidgetComponent implements OnInit, OnDestroy {
  @ViewChild('messagesEnd') messagesEndRef!: ElementRef<HTMLDivElement>;
  @ViewChild('chatInput') inputRef!: ElementRef<HTMLInputElement>;

  open = false;
  minimized = false;
  messages: Message[] = [makeInitialMessage()];
  input = '';
  typing = false;
  unread = 0;
  isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  showTag = false;
  tagDismissed = typeof localStorage !== 'undefined' && localStorage.getItem('axisxd_chat_tag_dismissed') === '1';

  readonly X = X;
  readonly Send = Send;
  readonly MessageCircle = MessageCircle;
  readonly ChevronRight = ChevronRight;
  readonly RotateCcw = RotateCcw;
  readonly Minimize2 = Minimize2;
  readonly typingDots = [0, 1, 2];

  private themeObserver: MutationObserver | null = null;
  private tagTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private router: Router,
    private consultation: ConsultationService,
  ) {}

  ngOnInit(): void {
    this.themeObserver = new MutationObserver(() => {
      this.isDark = document.documentElement.classList.contains('dark');
    });
    this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    if (!this.tagDismissed) {
      this.tagTimeout = setTimeout(() => (this.showTag = true), 5000);
    }
  }

  ngOnDestroy(): void {
    this.themeObserver?.disconnect();
    if (this.tagTimeout) clearTimeout(this.tagTimeout);
  }

  toggleOpen(): void {
    this.open = !this.open;
    this.minimized = false;
    this.showTag = false;
    if (this.open) {
      this.unread = 0;
      setTimeout(() => this.inputRef?.nativeElement?.focus(), 150);
    }
  }

  toggleMinimize(): void {
    this.minimized = !this.minimized;
  }

  closePanel(): void {
    this.open = false;
  }

  dismissTag(): void {
    this.showTag = false;
    this.tagDismissed = true;
    localStorage.setItem('axisxd_chat_tag_dismissed', '1');
  }

  renderText(text: string): TextPart[][] {
    return text.split('\n').map((line) =>
      line
        .split(/(\*\*[^*]+\*\*)/g)
        .filter((p) => p.length > 0)
        .map((part) =>
          part.startsWith('**') && part.endsWith('**')
            ? { text: part.slice(2, -2), bold: true }
            : { text: part, bold: false },
        ),
    );
  }

  formatTime(d: Date): string {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  async sendMessage(text: string): Promise<void> {
    if (!text.trim()) return;
    const resolvedText = QUICK_REPLY_ACTIONS[text] ?? text;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: resolvedText, timestamp: new Date() };
    this.messages = [...this.messages, userMsg];
    this.input = '';
    this.typing = true;
    this.scrollToEnd();

    await new Promise((r) => setTimeout(r, 700 + Math.random() * 500));

    const { response, quickReplies, shouldOpenConsultation } = getBotResponse(resolvedText);
    const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', text: response, quickReplies, timestamp: new Date() };

    this.typing = false;
    this.messages = [...this.messages, botMsg];
    this.scrollToEnd();

    if (!this.open || this.minimized) this.unread += 1;

    if (shouldOpenConsultation) {
      setTimeout(() => this.consultation.open(), 800);
    }

    if (/api.?doc/i.test(resolvedText)) setTimeout(() => this.router.navigateByUrl('/docs'), 1000);
    if (/see.?integrat/i.test(resolvedText)) setTimeout(() => this.router.navigateByUrl('/partners'), 1000);
    if (/contact.?support/i.test(resolvedText)) setTimeout(() => this.router.navigateByUrl('/contact'), 1000);
  }

  private scrollToEnd(): void {
    setTimeout(() => this.messagesEndRef?.nativeElement?.scrollIntoView({ behavior: 'smooth' }), 0);
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    if (this.input.trim()) this.sendMessage(this.input);
  }

  handleReset(): void {
    this.messages = [{ ...makeInitialMessage(), id: Date.now().toString(), timestamp: new Date() }];
    this.input = '';
    this.typing = false;
  }
}
