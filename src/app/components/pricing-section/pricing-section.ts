import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Check, Sparkles, Building2 } from 'lucide-angular';
import { ConsultationService } from '../../core/consultation.service';

interface Plan {
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  action: string;
  popular: boolean;
  isFree: boolean;
}

const PLANS: Plan[] = [
  {
    name: 'Pilot Sandbox',
    price: '$0',
    period: 'free forever',
    desc: 'Full access to all viewers and analysis tools with usage limits. Great for evaluation and small projects.',
    features: ['All viewers & analysis tools', 'Single user session', 'Shareable project links', 'Community support'],
    action: 'Start for Free',
    popular: false,
    isFree: true,
  },
  {
    name: 'Professional',
    price: '$199',
    period: 'per seat / month',
    desc: 'Unlimited uploads, team sharing, and priority support for growing AEC teams.',
    features: [
      'Unlimited IFC/BIM uploads',
      'Team sharing & collaboration',
      'Priority email & chat support',
      'API access',
      'Custom deviation tolerances',
      'Export PDF/XLS/BCF reports',
    ],
    action: 'Get Started',
    popular: true,
    isFree: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'tailored pricing',
    desc: 'SSO, dedicated support, and SLA guarantees for large organisations with fully cloud-based access.',
    features: [
      'Everything in Professional',
      'SSO / SAML integration',
      'Dedicated account manager',
      'SLA with uptime guarantee',
      'RBAC & audit logs',
      'Custom integrations & API',
    ],
    action: 'Contact Sales',
    popular: false,
    isFree: false,
  },
];

@Component({
  selector: 'app-pricing-section',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './pricing-section.html',
  styleUrl: './pricing-section.scss',
})
export class PricingSectionComponent {
  readonly Check = Check;
  readonly Sparkles = Sparkles;
  readonly Building2 = Building2;
  readonly plans = PLANS;
  readonly portalLoginUrl = 'https://cportal.axisxd.com/login';

  constructor(public consultation: ConsultationService) {}
}
