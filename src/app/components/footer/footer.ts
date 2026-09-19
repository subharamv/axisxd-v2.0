import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Mail,
  MapPin,
  Phone,
  Facebook,
  Linkedin,
  Instagram,
  Youtube,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-angular';
import { ConsultationService } from '../../core/consultation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class FooterComponent implements OnInit, OnDestroy {
  email = '';
  subscribed = false;
  isDark = true;

  readonly Mail = Mail;
  readonly MapPin = MapPin;
  readonly Phone = Phone;
  readonly Facebook = Facebook;
  readonly Linkedin = Linkedin;
  readonly Instagram = Instagram;
  readonly Youtube = Youtube;
  readonly CheckCircle2 = CheckCircle2;
  readonly ShieldCheck = ShieldCheck;

  readonly viewerLinks = [
    { label: 'IFC Viewer', path: '/viewer/ifc' },
    { label: 'Point Cloud', path: '/viewer/point-cloud' },
    { label: 'Pano 360°', path: '/viewer/pano' },
    { label: 'CAD/DXF Viewer', path: '/viewer/cad' },
    { label: '3D Mesh Viewer', path: '/viewer/mesh' },
  ];

  readonly analysisLinks = [
    { label: 'Deviation Analyzer', path: '/analysis/deviation' },
    { label: 'Rights of Light', path: '/analysis/rol' },
    { label: 'Construction Monitor', path: '/analysis/monitoring' },
    { label: 'BIM Clash Detection', path: '/analysis/clash' },
  ];

  readonly supportLabels = ['Help Center', 'Community', 'System Status', 'Security', 'Privacy Policy'];

  readonly gdprStars = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const r = 16;
    return { x: 24 + r * Math.cos(angle), y: 24 + r * Math.sin(angle) };
  });

  private themeObserver: MutationObserver | null = null;
  private subscribeTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private router: Router,
    public consultation: ConsultationService,
  ) {}

  ngOnInit(): void {
    this.isDark = document.documentElement.classList.contains('dark');
    this.themeObserver = new MutationObserver(() => {
      this.isDark = document.documentElement.classList.contains('dark');
    });
    this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }

  ngOnDestroy(): void {
    this.themeObserver?.disconnect();
    if (this.subscribeTimeout) clearTimeout(this.subscribeTimeout);
  }

  navigate(path: string): void {
    this.router.navigateByUrl(path);
  }

  scrollToPricing(): void {
    this.router.navigateByUrl('/').then(() => {
      setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
  }

  openConsultation(): void {
    this.consultation.open();
  }

  handleSubscribe(event: Event): void {
    event.preventDefault();
    if (this.email.trim()) {
      this.subscribed = true;
      this.subscribeTimeout = setTimeout(() => {
        this.email = '';
      }, 3000);
    }
  }
}
