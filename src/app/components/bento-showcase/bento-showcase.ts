import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Box, Sliders, Zap, AlertOctagon } from 'lucide-angular';
import { ConsultationService } from '../../core/consultation.service';

@Component({
  selector: 'app-bento-showcase',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './bento-showcase.html',
  styleUrl: './bento-showcase.scss',
})
export class BentoShowcaseComponent {
  readonly Box = Box;
  readonly Sliders = Sliders;
  readonly Zap = Zap;
  readonly AlertOctagon = AlertOctagon;

  readonly tools = [
    { name: 'Distance / Height', kind: 'LINEAR' },
    { name: 'Angle / Azimuth', kind: 'ANGULAR' },
    { name: 'Area / Volume', kind: 'SPATIAL' },
    { name: 'Profile / Clip', kind: 'SECTION' },
  ];

  constructor(public consultation: ConsultationService) {}
}
