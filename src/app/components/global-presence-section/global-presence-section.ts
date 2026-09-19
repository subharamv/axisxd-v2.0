import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Quote } from 'lucide-angular';
import * as L from 'leaflet';

interface Location {
  lat: number;
  lng: number;
  count: number;
  label: string;
  region: string;
}

const LOCATIONS: Location[] = [
  { lat: 51.48, lng: -0.36, count: 147, label: 'London', region: 'Europe' },
  { lat: 40.68, lng: -74.16, count: 203, label: 'New York', region: 'North America' },
  { lat: 37.8, lng: -122.4, count: 89, label: 'San Francisco', region: 'North America' },
  { lat: 25.2, lng: 55.44, count: 165, label: 'Dubai', region: 'Asia' },
  { lat: 1.44, lng: 103.68, count: 78, label: 'Singapore', region: 'Asia' },
  { lat: -33.84, lng: 151.2, count: 62, label: 'Sydney', region: 'Oceania' },
  { lat: 19.08, lng: 73.08, count: 94, label: 'Mumbai', region: 'Asia' },
  { lat: 35.64, lng: 139.68, count: 118, label: 'Tokyo', region: 'Asia' },
  { lat: 52.56, lng: 13.32, count: 43, label: 'Berlin', region: 'Europe' },
  { lat: 43.92, lng: -79.56, count: 71, label: 'Toronto', region: 'North America' },
  { lat: -23.4, lng: -46.44, count: 29, label: 'S\u00e3o Paulo', region: 'South America' },
  { lat: -26.28, lng: 28.08, count: 22, label: 'Johannesburg', region: 'Africa' },
  { lat: -1.08, lng: 36.72, count: 18, label: 'Nairobi', region: 'Africa' },
  { lat: 29.88, lng: 30.96, count: 31, label: 'Cairo', region: 'Africa' },
  { lat: 48.96, lng: 2.16, count: 38, label: 'Paris', region: 'Europe' },
  { lat: 37.5665, lng: 126.978, count: 55, label: 'Seoul', region: 'Asia' },
  { lat: 19.4326, lng: -99.1332, count: 24, label: 'Mexico City', region: 'North America' },
];

const TESTIMONIALS = [
  {
    company: 'Skanska',
    text: 'AxisXD transformed how we manage on-site progress. Real-time BIM comparison reduced our rework rate by 34% within the first quarter of deployment.',
    name: 'James Holloway',
    title: 'Project Director, Infrastructure',
    avatar: 'JH',
  },
  {
    company: 'Mace Group',
    text: "Embedding point cloud scans into site reviews through AxisXD's platform is now the standard across every major project we deliver globally.",
    name: 'Priya Mehta',
    title: 'Digital Construction Lead',
    avatar: 'PM',
  },
  {
    company: 'AECOM',
    text: 'The deviation analysis tools justified adoption immediately. Our QA process is measurably faster and far more reliable than before.',
    name: 'Luca Bianchi',
    title: 'BIM Manager, Design & Engineering',
    avatar: 'LB',
  },
];

const STATS = [
  { label: 'PROJECTS VISUALIZED', value: '12,000+' },
  { label: 'SQUARE METRES SCANNED', value: '380M+' },
  { label: 'DELIVERY ACCURACY', value: '98%' },
];

@Component({
  selector: 'app-global-presence-section',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './global-presence-section.html',
  styleUrl: './global-presence-section.scss',
})
export class GlobalPresenceSectionComponent implements AfterViewInit, OnDestroy {
  readonly Quote = Quote;
  readonly testimonials = TESTIMONIALS;
  readonly showTestimonials = false;
  readonly stats = STATS;
  readonly regions = ['All regions', 'Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania'];
  activeRegion = 'All regions';
  selectedLocation = LOCATIONS[0];
  inView = false;
  zoom = 2;
  tilesLoading = true;
  tilesFailed = false;
  @ViewChild('sectionEl') sectionEl!: ElementRef<HTMLElement>;
  @ViewChild('mapContainer') mapContainerRef?: ElementRef<HTMLDivElement>;
  private map: L.Map | null = null;
  private tileLayer: L.TileLayer | null = null;
  private inViewObserver: IntersectionObserver | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private markers = new Map<string, L.Marker>();
  private reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  get visibleLocations(): Location[] {
    return LOCATIONS.filter(location => this.activeRegion === 'All regions' || location.region === this.activeRegion);
  }
  ngAfterViewInit(): void {
    this.initMap();
    this.inViewObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        this.inView = true;
        this.map?.invalidateSize();
        this.inViewObserver?.disconnect();
      }
    }, { threshold: 0.05 });
    this.inViewObserver.observe(this.sectionEl.nativeElement);
    this.resizeObserver = new ResizeObserver(() => this.map?.invalidateSize());
    if (this.mapContainerRef) this.resizeObserver.observe(this.mapContainerRef.nativeElement);
  }
  ngOnDestroy(): void {
    this.inViewObserver?.disconnect();
    this.resizeObserver?.disconnect();
    this.map?.remove();
    this.markers.clear();
  }
  selectRegion(region: string): void {
    this.activeRegion = region;
    const locations = this.visibleLocations;
    if (!locations.includes(this.selectedLocation)) this.selectedLocation = locations[0];
    this.markers.forEach((marker, label) => {
      if (locations.some(location => location.label === label)) marker.addTo(this.map!);
      else marker.remove();
    });
    this.updateSelection();
    this.fitLocations();
  }
  selectCity(label: string): void {
    const location = this.visibleLocations.find(item => item.label === label);
    if (!location) return;
    this.selectedLocation = location;
    this.updateSelection();
    this.map?.setView([location.lat, location.lng], 5, { animate: !this.reducedMotion.matches });
  }
  zoomMap(direction: number): void {
    this.map?.setZoom(this.zoom + direction, { animate: !this.reducedMotion.matches });
  }
  resetMap(): void { this.selectRegion('All regions'); }
  retryTiles(): void {
    this.tilesFailed = false;
    this.tilesLoading = true;
    this.tileLayer?.redraw();
  }
  private fitLocations(): void {
    this.map?.fitBounds(L.latLngBounds(this.visibleLocations.map(location => L.latLng(location.lat, location.lng))), {
      padding: [38, 38], maxZoom: this.activeRegion === 'All regions' ? 2 : 4,
      animate: !this.reducedMotion.matches,
    });
  }
  private updateSelection(): void {
    this.markers.forEach((marker, label) => {
      const selected = label === this.selectedLocation.label;
      marker.getElement()?.classList.toggle('gps-pin-selected', selected);
      marker.getElement()?.setAttribute('aria-pressed', String(selected));
      marker.setZIndexOffset(selected ? 1000 : 0);
    });
  }
  private initMap(): void {
    if (!this.mapContainerRef) return;
    const map = L.map(this.mapContainerRef.nativeElement, {
      center: [20, 15], zoom: 2, minZoom: 0, maxZoom: 8,
      zoomControl: false, attributionControl: true, scrollWheelZoom: false,
      dragging: true, touchZoom: true, keyboard: true, worldCopyJump: true,
      zoomAnimation: !this.reducedMotion.matches, fadeAnimation: !this.reducedMotion.matches,
      markerZoomAnimation: !this.reducedMotion.matches,
    });
    this.map = map;
    map.attributionControl.setPrefix(false);
    map.on('zoomend', () => { this.zoom = map.getZoom(); });
    this.tileLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      { attribution: 'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, DeLorme, NAVTEQ', maxZoom: 8 },
    );
    this.tileLayer.on('loading', () => { this.tilesLoading = true; });
    this.tileLayer.on('load', () => { this.tilesLoading = false; });
    this.tileLayer.on('tileerror', () => { this.tilesFailed = true; this.tilesLoading = false; });
    this.tileLayer.addTo(map);
    LOCATIONS.forEach(location => {
      const marker = L.marker([location.lat, location.lng], {
        icon: L.divIcon({ className: 'gps-pin', html: '<span class="gps-pin-core"></span>', iconSize: [32, 32], iconAnchor: [16, 16] }),
        title: location.label + ': ' + location.count + ' projects',
        alt: location.label + ': ' + location.count + ' projects', keyboard: true,
      }).addTo(map);
      marker.bindTooltip(location.label + ' · ' + location.count + ' projects', {
        direction: 'top', offset: [0, -12], className: 'custom-map-tooltip',
      });
      marker.on('click', () => this.selectCity(location.label));
      marker.on('add', () => this.updateSelection());
      this.markers.set(location.label, marker);
    });
    this.updateSelection();
    this.fitLocations();
  }
}