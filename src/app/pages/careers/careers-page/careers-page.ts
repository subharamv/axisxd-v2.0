import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import {
  LucideAngularModule,
  ArrowLeft,
  ArrowUpRight,
  Search,
  Sparkles,
  Target,
  Zap,
  Globe,
  Users,
  Layers,
  MessageSquare,
  GraduationCap,
  HeartPulse,
  Laptop,
  CalendarClock,
  Mail,
  MapPin,
  Briefcase,
  Clock,
} from 'lucide-angular';
import { SeoService } from '../../../core/seo.service';

interface Role {
  title: string;
  department: string;
  location: string;
  type: string;
  blurb: string;
}

interface Value {
  icon: any;
  title: string;
  desc: string;
}

interface Benefit {
  icon: any;
  title: string;
  desc: string;
}

const VALUES: Value[] = [
  {
    icon: Target,
    title: 'Ownership Over Tickets',
    desc: 'We hire people we trust to own outcomes end to end, not just close out assigned tickets.',
  },
  {
    icon: Zap,
    title: 'Ship in the Browser',
    desc: 'No installs, no plugins, no desktop builds. If it doesn’t run in a tab, it doesn’t ship.',
  },
  {
    icon: Globe,
    title: 'Remote-First, Async by Default',
    desc: 'Work from wherever you do your best work. We optimize for output, not hours spent online.',
  },
  {
    icon: Users,
    title: 'Customer-Obsessed',
    desc: 'We build alongside the AEC teams who run AxisXD in production, not in isolation from them.',
  },
  {
    icon: Layers,
    title: 'Small Team, Wide Surface Area',
    desc: 'Every hire meaningfully changes what we ship next — there’s nowhere to hide and nowhere to get lost.',
  },
  {
    icon: MessageSquare,
    title: 'Direct Feedback',
    desc: 'We say the hard thing early and kindly, in writing, so everyone can act on it.',
  },
];

const BENEFITS: Benefit[] = [
  { icon: GraduationCap, title: 'Learning stipend', desc: 'A budget for courses, books, and conferences that make you better at your craft.' },
  { icon: HeartPulse, title: 'Health coverage', desc: 'Contribution toward medical coverage for you and your dependents.' },
  { icon: CalendarClock, title: 'Flexible PTO', desc: 'Take the time you need to rest and come back sharp — we trust you to manage it.' },
  { icon: Laptop, title: 'Your setup, your choice', desc: 'Latest-gen hardware and the peripherals you actually want to work with.' },
  { icon: Globe, title: 'Remote-first', desc: 'Work from home, a co-working space, or wherever you’re most productive.' },
  { icon: Sparkles, title: 'Equity', desc: 'Meaningful ownership in the company you’re helping build, from an early stage.' },
];

const ROLES: Role[] = [
  {
    title: 'Senior WebGL / 3D Graphics Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    blurb: 'Own rendering performance across our IFC, point cloud, and panorama viewers — octree LOD, Draco-compressed geometry, and large-scene streaming in the browser.',
  },
  {
    title: 'Full-Stack Engineer (Angular / Node)',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    blurb: 'Build the product surface around our viewers: project workspaces, sharing, permissions, and the APIs that tie IFC, LiDAR, and pano data together.',
  },
  {
    title: 'DevOps / Platform Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    blurb: 'Run the infrastructure behind multiple browser-based 3D viewers at scale — CDN delivery of large model assets, uptime, and deploy pipelines.',
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    blurb: 'Design the workflows AEC teams use every day to review models, compare scans, and walk through 360° site capture — dense data made legible.',
  },
  {
    title: 'Solutions Engineer',
    department: 'Customer Success',
    location: 'Remote',
    type: 'Full-time',
    blurb: 'Sit between our engineering team and customer project teams — onboarding, scoping integrations, and troubleshooting real BIM and scan data.',
  },
  {
    title: 'Account Executive, Enterprise',
    department: 'Sales',
    location: 'Remote',
    type: 'Full-time',
    blurb: 'Own the full sales cycle for enterprise AEC accounts, from first demo through SSO and RBAC rollout.',
  },
  {
    title: 'BIM / AEC Domain Specialist',
    department: 'Product',
    location: 'Remote',
    type: 'Full-time',
    blurb: 'Ground our roadmap in how architecture, engineering, and construction teams actually work — IFC standards, coordination workflows, and field practice.',
  },
  {
    title: 'Technical Writer',
    department: 'Product',
    location: 'Remote',
    type: 'Contract',
    blurb: 'Write the docs, release notes, and in-app guidance that help teams get from upload to insight without a support ticket.',
  },
];

const HIRING_STEPS = [
  { num: '01', title: 'Apply', desc: 'Send your resume and a note on what you’d want to work on.' },
  { num: '02', title: 'Intro Call', desc: 'A 30-minute conversation about the role, the team, and what you’re looking for.' },
  { num: '03', title: 'Team Interview', desc: 'Meet the people you’d work with directly — real problems, real context.' },
  { num: '04', title: 'Offer', desc: 'We move fast once we know it’s a fit, on both sides.' },
];

@Component({
  selector: 'app-careers-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './careers-page.html',
  styleUrl: './careers-page.scss',
  animations: [
    trigger('cardsStagger', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(16px)' }),
            stagger(40, animate('350ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))),
          ],
          { optional: true },
        ),
      ]),
    ]),
  ],
})
export class CareersPageComponent {
  readonly ArrowLeft = ArrowLeft;
  readonly ArrowUpRight = ArrowUpRight;
  readonly Search = Search;
  readonly Sparkles = Sparkles;
  readonly Mail = Mail;
  readonly MapPin = MapPin;
  readonly Briefcase = Briefcase;
  readonly Clock = Clock;

  readonly values = VALUES;
  readonly benefits = BENEFITS;
  readonly hiringSteps = HIRING_STEPS;
  readonly contactEmail = 'contact@axisxd.com';

  private readonly roles = ROLES;
  readonly departments = ['All', ...Array.from(new Set(ROLES.map((r) => r.department)))];

  activeDepartment = 'All';
  search = '';

  constructor(private seo: SeoService) {
    this.seo.set({
      title: 'Careers',
      description: `Join AxisXD and help build the browser-native digital twin platform for AEC teams. ${ROLES.length} open roles, remote-first.`,
      canonicalPath: '/careers',
    });
  }

  get filtered(): Role[] {
    const q = this.search.toLowerCase();
    return this.roles.filter((r) => {
      const matchesDept = this.activeDepartment === 'All' || r.department === this.activeDepartment;
      const matchesSearch =
        !q || r.title.toLowerCase().includes(q) || r.department.toLowerCase().includes(q) || r.blurb.toLowerCase().includes(q);
      return matchesDept && matchesSearch;
    });
  }

  get openRolesCount(): number {
    return this.roles.length;
  }

  get departmentCount(): number {
    return this.departments.length - 1;
  }

  setDepartment(dept: string): void {
    this.activeDepartment = dept;
  }

  applyMailto(role: Role): string {
    const subject = encodeURIComponent(`Application: ${role.title}`);
    const body = encodeURIComponent(`Hi AxisXD team,\n\nI'd like to apply for the ${role.title} role.\n\n`);
    return `mailto:${this.contactEmail}?subject=${subject}&body=${body}`;
  }

  get generalMailto(): string {
    const subject = encodeURIComponent('General Application');
    return `mailto:${this.contactEmail}?subject=${subject}`;
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
