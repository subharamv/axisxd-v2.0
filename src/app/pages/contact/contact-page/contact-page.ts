import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Phone, MapPin, Mail, Send, Facebook, Linkedin, Instagram, Youtube, Sparkles } from 'lucide-angular';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as L from 'leaflet';
import { SeoService } from '../../../core/seo.service';
import { ConsultationService } from '../../../core/consultation.service';

gsap.registerPlugin(ScrollTrigger);

const INFO_ITEMS = [
  { id: 'phone', icon: Phone, label: 'Contact Us', value: '(319) 683-2735', href: 'tel:+13196832735', accent: 'blue' },
  { id: 'location', icon: MapPin, label: 'Location', value: 'United States Of America', href: null as string | null, accent: 'indigo' },
  { id: 'email', icon: Mail, label: 'Email', value: 'contact@axisxd.com', href: 'mailto:contact@axisxd.com', accent: 'blue' },
];

const SOCIAL_LINKS = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

const STAT_BADGES = [
  { dot: 'bg-emerald-400', text: 'Response < 24h' },
  { dot: 'bg-blue-400', text: 'ISO 19650 Support' },
  { dot: 'bg-indigo-400', text: 'Global Coverage' },
];

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.scss',
})
export class ContactPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('orb1') orb1Ref?: ElementRef<HTMLDivElement>;
  @ViewChild('orb2') orb2Ref?: ElementRef<HTMLDivElement>;
  @ViewChild('mapContainer') mapContainerRef?: ElementRef<HTMLDivElement>;

  readonly Mail = Mail;
  readonly Send = Send;
  readonly Sparkles = Sparkles;
  readonly infoItems = INFO_ITEMS;
  readonly socialLinks = SOCIAL_LINKS;
  readonly statBadges = STAT_BADGES;

  private map: L.Map | null = null;
  private gsapCtx: gsap.Context | null = null;
  private destroyed = false;

  constructor(
    private seo: SeoService,
    public consultation: ConsultationService,
    private hostEl: ElementRef<HTMLElement>,
  ) {
    this.seo.set({ title: 'Contact', description: 'Get in touch with the AxisXD team for sales inquiries, support, or partnership opportunities.', canonicalPath: '/contact' });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.gsapCtx = gsap.context(() => {
      if (this.orb1Ref) gsap.to(this.orb1Ref.nativeElement, { y: -22, duration: 5.5, ease: 'sine.inOut', repeat: -1, yoyo: true });
      if (this.orb2Ref) gsap.to(this.orb2Ref.nativeElement, { y: 16, duration: 7, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1.8 });

      gsap.from('.contact-form-box', {
        scrollTrigger: { trigger: '.contact-form-box', start: 'top 85%', once: true },
        opacity: 0,
        x: 60,
        duration: 0.9,
        ease: 'power3.out',
      });

      gsap.from('.contact-left-heading', {
        scrollTrigger: { trigger: '.contact-left-heading', start: 'top 85%', once: true },
        opacity: 0,
        x: -40,
        duration: 0.8,
        ease: 'power3.out',
      });
    });

    this.scheduleScrollTriggerRefresh();
    this.initMap();
  }

  /**
   * ScrollTrigger caches each trigger's start position when it is created. On
   * client-side (soft) navigation the animations are created in
   * ngAfterViewInit — before images, custom fonts, and the final layout have
   * settled — so cached positions can be stale and the entrance tweens
   * (opacity 0 → 1) may never fire, leaving the "We're Here To Connect And
   * Assist You" heading and the contact form invisible until a hard refresh.
   * Re-running ScrollTrigger.refresh() once the layout is stable makes these
   * sections animate in on both hard loads and soft navigations. (Same fix as
   * the viewer product page.) Code-only — no visual or design changes.
   */
  private scheduleScrollTriggerRefresh(): void {
    // Deferred callbacks may outlive the component — no-op after teardown.
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
    this.gsapCtx?.revert();
    ScrollTrigger.getAll().forEach((t) => t.kill());
    this.map?.remove();
  }

  openConsultation(): void {
    this.consultation.open();
  }

  private initMap(): void {
    if (!this.mapContainerRef) return;
    if (!document.getElementById('axis-map-style')) {
      const style = document.createElement('style');
      style.id = 'axis-map-style';
      style.textContent = `
        .axis-map-dot{background:#3b82f6;border:3px solid #1e3a5f;border-radius:50%;
          box-shadow:0 2px 12px rgba(0,0,0,.8),0 0 20px rgba(59,130,246,.6);animation:axisMapPulse 1.7s ease-out infinite;}
        @keyframes axisMapPulse{
          0%{box-shadow:0 2px 12px rgba(0,0,0,.8),0 0 0 0 rgba(59,130,246,.9),0 0 20px rgba(59,130,246,.6);}
          70%{box-shadow:0 2px 12px rgba(0,0,0,.8),0 0 0 22px rgba(59,130,246,0),0 0 20px rgba(59,130,246,.3);}
          100%{box-shadow:0 2px 12px rgba(0,0,0,.8),0 0 0 0 rgba(59,130,246,0),0 0 20px rgba(59,130,246,.3);}
        }
        .leaflet-control-container{display:none;}
      `;
      document.head.appendChild(style);
    }

    const map = L.map(this.mapContainerRef.nativeElement, {
      center: [39.9672, -100.7715],
      zoom: 5,
      minZoom: 3,
      maxZoom: 18,
      scrollWheelZoom: false,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { tileSize: 512, zoomOffset: -1 } as L.TileLayerOptions).addTo(map);

    L.marker([39.9672, -100.7715], {
      icon: L.divIcon({ className: 'axis-map-dot', iconSize: [22, 22], iconAnchor: [11, 11] }),
    }).addTo(map);

    this.map = map;
  }
}
