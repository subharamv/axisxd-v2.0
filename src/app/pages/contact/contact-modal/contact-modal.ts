import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X, Send, CheckCircle2, Sparkles, PhoneCall } from 'lucide-angular';
import { ConsultationService } from '../../../core/consultation.service';

interface Option {
  id: string;
  label: string;
}

const CATEGORY_OPTIONS: Option[] = [
  { id: 'viewers', label: 'Viewers' },
  { id: 'analysis', label: 'Analysis' },
  { id: 'solutions', label: 'Solutions' },
];

const DATA_OPTIONS_BY_CATEGORY: Record<string, Option[]> = {
  viewers: [
    { id: 'ifc', label: 'IFC / BIM CAD Models' },
    { id: 'pointcloud', label: '3D Laser LiDAR Scans' },
    { id: 'pano360', label: '360° Photogrammetry Panoramas' },
    { id: 'cad', label: 'CAD / DXF Drawings' },
    { id: 'mesh', label: '3D Mesh Models' },
    { id: 'digital-twin', label: 'Digital Twin Platform' },
  ],
  analysis: [
    { id: 'deviation', label: 'Deviation Analysis' },
    { id: 'rol', label: 'Rights of Light Assessment' },
    { id: 'clash', label: 'Clash Detection' },
    { id: 'monitoring', label: 'Construction Monitoring' },
  ],
  solutions: [
    { id: 'custom-integration', label: 'Custom API Integration' },
    { id: 'workflow', label: 'Automated Workflow Setup' },
    { id: 'training', label: 'Team Training & Onboarding' },
    { id: 'consulting', label: 'Digital Twin Consulting' },
  ],
};

@Component({
  selector: 'app-contact-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './contact-modal.html',
  styleUrl: './contact-modal.scss',
})
export class ContactModalComponent {
  readonly X = X;
  readonly Send = Send;
  readonly CheckCircle2 = CheckCircle2;
  readonly Sparkles = Sparkles;
  readonly PhoneCall = PhoneCall;
  readonly categoryOptions = CATEGORY_OPTIONS;

  formData = {
    name: '',
    email: '',
    company: '',
    assetProfile: 'commercial',
    dataCategory: 'viewers',
    dataTypes: [] as string[],
    message: '',
    newsletter: true,
  };

  isSubmitting = false;
  isSubmitted = false;

  constructor(public consultation: ConsultationService) {}

  get dataOptions(): Option[] {
    return DATA_OPTIONS_BY_CATEGORY[this.formData.dataCategory] || [];
  }

  selectCategory(id: string): void {
    this.formData.dataCategory = id;
    this.formData.dataTypes = [];
  }

  handleDataTypeToggle(id: string): void {
    this.formData.dataTypes = this.formData.dataTypes.includes(id)
      ? this.formData.dataTypes.filter((x) => x !== id)
      : [...this.formData.dataTypes, id];
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    // Use native HTML5 validation to require required fields (matching React behavior)
    const form = (event.target as HTMLFormElement);
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    this.isSubmitting = true;
    setTimeout(() => {
      this.isSubmitting = false;
      this.isSubmitted = true;
    }, 1500);
  }

  close(): void {
    this.consultation.close();
    this.isSubmitted = false;
    this.formData = { name: '', email: '', company: '', assetProfile: 'commercial', dataCategory: 'viewers', dataTypes: [], message: '', newsletter: true };
  }
}
