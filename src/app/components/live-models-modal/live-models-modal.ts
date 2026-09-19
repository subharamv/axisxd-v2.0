import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ArrowUpRight, Sparkles, X } from 'lucide-angular';
import { LiveModelsService } from '../../core/live-models.service';

interface LiveModel {
  title: string;
  tag: string;
  image: string;
  url: string;
  blurb: string;
}

/** Mirrors the first three entries of VIEWERS in viewer-section.ts — the ones with live demos. */
const LIVE_MODELS: LiveModel[] = [
  {
    title: 'IFC Viewer',
    tag: 'BIM / IFC',
    image: 'assets/images/viewers/ifc_viewer.png',
    url: 'https://realityxd.axisxd.com/',
    blurb: 'Explore BIM geometry and object properties with full spatial context.',
  },
  {
    title: 'Point Cloud Viewer',
    tag: 'LIDAR / SCAN',
    image: 'assets/images/viewers/point_cloud_viewer.png',
    url: 'https://voxelxd.axisxd.com/',
    blurb: 'Navigate high-density laser scan and LiDAR captures of as-built reality.',
  },
  {
    title: 'Panorama Viewer',
    tag: '360° / PANO',
    image: 'assets/images/viewers/Pano_Viewer.png',
    url: 'https://xplorexd.axisxd.com/',
    blurb: 'Step through registered 360° site capture, floor by floor.',
  },
];

@Component({
  selector: 'app-live-models-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './live-models-modal.html',
  styleUrl: './live-models-modal.scss',
})
export class LiveModelsModalComponent {
  readonly ArrowUpRight = ArrowUpRight;
  readonly Sparkles = Sparkles;
  readonly X = X;
  readonly models = LIVE_MODELS;

  constructor(public liveModels: LiveModelsService) {}

  close(): void {
    this.liveModels.close();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.liveModels.isOpen()) this.close();
  }
}
