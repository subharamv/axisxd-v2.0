import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardNavComponent, CardNavItem } from '../card-nav/card-nav';
import { NavStyleToggleComponent } from '../nav-style-toggle/nav-style-toggle';
import { FontSwitcherComponent } from '../font-switcher/font-switcher';
import { ConsultationService } from '../../core/consultation.service';

type ViewerTarget = 'ifc-viewer' | 'point-cloud' | 'pano' | 'cad' | 'mesh' | 'deviation' | 'rol' | 'monitoring' | 'clash' | 'digital-twin' | 'facility-monitoring';

const VIEWER_ROUTES: Record<ViewerTarget, string> = {
  'ifc-viewer': '/viewer/ifc',
  'point-cloud': '/viewer/point-cloud',
  pano: '/viewer/pano',
  cad: '/viewer/cad',
  mesh: '/viewer/mesh',
  'digital-twin': '/viewer/digital-twin',
  deviation: '/analysis/deviation',
  rol: '/analysis/rol',
  monitoring: '/analysis/monitoring',
  clash: '/analysis/clash',
  'facility-monitoring': '/',
};

@Component({
  selector: 'app-card-navbar',
  standalone: true,
  imports: [CommonModule, CardNavComponent, NavStyleToggleComponent, FontSwitcherComponent],
  templateUrl: './card-navbar.html',
  styleUrl: './card-navbar.scss',
})
export class CardNavbarComponent implements OnInit, OnDestroy {
  @Output() switchStyle = new EventEmitter<void>();

  isDark = typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : true;
  private themeObserver: MutationObserver | null = null;
  private _items: CardNavItem[] = this.buildItems();

  constructor(
    private router: Router,
    public consultation: ConsultationService,
  ) { }

  ngOnInit(): void {
    this.themeObserver = new MutationObserver(() => {
      this.isDark = document.documentElement.classList.contains('dark');
      this._items = this.buildItems();
    });
    this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }

  ngOnDestroy(): void {
    this.themeObserver?.disconnect();
  }

  get items(): CardNavItem[] {
    return this._items;
  }

  private buildItems(): CardNavItem[] {
    const isDark = this.isDark;
    return [
      {
        label: 'Products',
        bgColor: isDark ? 'rgba(18, 18, 22, 0.98)' : 'rgba(244, 244, 245, 0.98)',
        textColor: isDark ? '#ffffff' : '#09090b',
        megaMenu: true,
        links: [
          {
            label: 'IFC Viewer',
            description: 'Interactive 3D IFC model with layer isolation.',
            image: 'assets/images/viewers/ifc_viewer.png',
            href: '#ifc-viewer',
            ariaLabel: 'Open IFC BIM Viewer product page',
            onClick: () => this.navigateViewer('ifc-viewer'),
          },
          {
            label: 'Point Cloud LiDAR',
            description: '42M+ LiDAR points streamed in real time.',
            image: 'assets/images/viewers/point_cloud_viewer.png',
            href: '#point-cloud',
            ariaLabel: 'Open Point Cloud LiDAR Viewer product page',
            onClick: () => this.navigateViewer('point-cloud'),
          },
          {
            label: 'Pano 360° Viewer',
            description: '360° site walkthroughs with hotspot navigation.',
            image: 'assets/images/viewers/Pano_Viewer.png',
            href: '#pano',
            ariaLabel: 'Open 360° Panorama Viewer product page',
            onClick: () => this.navigateViewer('pano'),
          },
          {
            label: 'CAD/DXF Viewer',
            description: '2D drawing viewer with layers & annotations.',
            image: 'assets/images/viewers/Dxf_Viewer.png',
            href: '#cad',
            ariaLabel: 'Open CAD/DXF Viewer product page',
            onClick: () => this.navigateViewer('cad'),
          },
          {
            label: '3D Mesh Viewer',
            description: 'OBJ, FBX & glTF mesh rendering with surface inspection.',
            image: 'assets/images/viewers/Mesh_viewer.png',
            href: '#mesh',
            ariaLabel: 'Open 3D Mesh Viewer product page',
            onClick: () => this.navigateViewer('mesh'),
          },
        ],
      },
      {
        label: 'Analysis',
        bgColor: isDark ? 'rgba(20, 12, 6, 0.98)' : 'rgba(255, 247, 237, 0.98)',
        textColor: isDark ? '#fb923c' : '#9a3412',
        links: [
          {
            label: 'Deviation Analyzer',
            description: 'Compare as-built vs design with precision heatmaps.',
            image: 'assets/images/analysis/deviation_analyzer.png',
            ctaLabel: 'Launch Analyzer',
            href: '#deviation',
            ariaLabel: 'Open Deviation Analyzer product page',
            onClick: () => this.navigateViewer('deviation'),
          },
          {
            label: 'Rights of Light',
            description: 'Simulate daylight impact for planning compliance.',
            image: 'assets/images/analysis/rights_of_light.png',
            ctaLabel: 'Check ROL',
            href: '#rol',
            ariaLabel: 'Open Rights of Light product page',
            onClick: () => this.navigateViewer('rol'),
          },
          {
            label: 'Construction Monitoring',
            description: 'Track site progress against BIM milestones.',
            image: 'assets/images/analysis/construction_monitoring.png',
            ctaLabel: 'Check Monitoring',
            href: '#monitoring',
            ariaLabel: 'Open Construction Monitoring product page',
            onClick: () => this.navigateViewer('monitoring'),
          },
          {
            label: 'BIM Clash Detection',
            description: 'Detect and resolve model conflicts pre-build.',
            image: 'assets/images/analysis/clash_detection.png',
            ctaLabel: 'Identify Clash',
            href: '#clash',
            ariaLabel: 'Open BIM Clash Detection page',
            onClick: () => this.navigateViewer('clash'),
          },
        ],
      },
      {
        label: 'Solutions',
        bgColor: isDark ? 'rgba(6, 69, 251, 0.96)' : 'rgba(6, 69, 251, 0.08)',
        textColor: isDark ? '#ffffff' : '#1e40af',
        cardClassName: 'nav-card-blue',
        links: [
          {
            label: 'Digital Twin Platform',
            href: '#digital-twin',
            ariaLabel: 'Digital Twin platform overview',
            onClick: () => this.navigateViewer('digital-twin'),
          },
          {
            label: 'Facility Monitoring',
            href: '#facility-monitoring',
            ariaLabel: 'Open Facility Monitoring product page',
            onClick: () => this.navigateViewer('facility-monitoring'),
          },
          {
            label: 'Initiate Audit Proposal',
            href: '#pricing',
            ariaLabel: 'Contact civil expert team',
            onClick: () => this.openConsultation(),
          },
        ],
      },
      {
        label: 'Resources',
        bgColor: isDark ? 'rgba(18, 18, 22, 0.98)' : 'rgba(244, 244, 245, 0.98)',
        textColor: isDark ? '#ffffff' : '#09090b',
        links: [
          {
            label: 'Blogs & Articles',
            href: '#resources',
            ariaLabel: 'Browse all blog articles',
            onClick: () => this.navigateResources(),
          },
          {
            label: 'Whitepapers',
            href: '#resources',
            ariaLabel: 'Download technical whitepapers',
            onClick: () => this.navigateResources(),
          },
          {
            label: 'Case Studies',
            href: '#resources',
            ariaLabel: 'Read client case studies',
            onClick: () => this.navigateResources(),
          },
          {
            label: 'Documentation',
            href: '#docs',
            ariaLabel: 'Go to documentation',
            onClick: () => this.navigateDocs(),
          },
        ],
      },
      {
        label: 'Connect',
        bgColor: isDark ? 'rgba(18, 18, 22, 0.98)' : 'rgba(244, 244, 245, 0.98)',
        textColor: isDark ? '#ffffff' : '#09090b',
        footerKind: 'connect',
        links: [
          {
            label: 'Contact Us',
            href: '#contact',
            ariaLabel: 'Go to contact page',
            onClick: () => this.navigateContact(),
          },
          {
            label: 'Careers',
            href: '/careers',
            ariaLabel: "See AxisXD's open roles",
            onClick: () => this.navigateCareers(),
          },
          {
            label: 'Partners',
            href: '/partners',
            ariaLabel: 'Partner with AxisXD',
            onClick: () => this.navigatePartners(),
          },
          {
            label: 'Help Center',
            href: '#docs',
            ariaLabel: 'Go to help center',
            onClick: () => this.navigateDocs(),
          },
        ],
      },
      {
        label: 'Follow Us',
        bgColor: isDark ? 'rgba(18, 18, 22, 0.98)' : 'rgba(244, 244, 245, 0.98)',
        textColor: isDark ? '#ffffff' : '#09090b',
        footerStrip: true,
        footerKind: 'follow-us',
        links: [],
      },
    ];
  }

  private navigateViewer(target: ViewerTarget): void {
    this.router.navigateByUrl(VIEWER_ROUTES[target]);
  }

  navigateHome(): void {
    this.router.navigateByUrl('/');
  }

  navigateResources(): void {
    this.router.navigateByUrl('/resources');
  }

  navigateContact(): void {
    this.router.navigateByUrl('/contact');
  }

  // navigateLogin(): void {
  //   this.router.navigateByUrl('/login');
  // }
  // navigateLogin(): void {
  //   window.location.href = 'https://cportal.axisxd.com/login';
  // }

  navigateLogin(): void {
  window.open('https://cportal.axisxd.com/login', '_blank', 'noopener,noreferrer');
}

  navigateDocs(): void {
    this.router.navigateByUrl('/docs');
  }

  navigateWebinars(): void {
    this.router.navigateByUrl('/webinars');
  }

  navigatePartners(): void {
    this.router.navigateByUrl('/partners');
  }

  navigateCareers(): void {
    this.router.navigateByUrl('/careers');
  }

  navigateFaq(): void {
    this.router.navigateByUrl('/faq');
  }

  openConsultation(): void {
    this.consultation.open();
  }


}
