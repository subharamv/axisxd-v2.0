import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { LucideAngularModule, ArrowLeft, ChevronDown, Search } from 'lucide-angular';
import gsap from 'gsap';
import { SeoService } from '../../../core/seo.service';

interface CountryCode {
  code: string;
  flag: string;
  name: string;
  iso: string;
}

const COUNTRY_CODES: CountryCode[] = [
  { code: '+1', flag: '🇺🇸', name: 'United States', iso: 'US' },
  { code: '+1', flag: '🇨🇦', name: 'Canada', iso: 'CA' },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom', iso: 'GB' },
  { code: '+91', flag: '🇮🇳', name: 'India', iso: 'IN' },
  { code: '+61', flag: '🇦🇺', name: 'Australia', iso: 'AU' },
  { code: '+971', flag: '🇦🇪', name: 'UAE', iso: 'AE' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia', iso: 'SA' },
  { code: '+974', flag: '🇶🇦', name: 'Qatar', iso: 'QA' },
  { code: '+65', flag: '🇸🇬', name: 'Singapore', iso: 'SG' },
  { code: '+60', flag: '🇲🇾', name: 'Malaysia', iso: 'MY' },
  { code: '+49', flag: '🇩🇪', name: 'Germany', iso: 'DE' },
  { code: '+33', flag: '🇫🇷', name: 'France', iso: 'FR' },
  { code: '+39', flag: '🇮🇹', name: 'Italy', iso: 'IT' },
  { code: '+34', flag: '🇪🇸', name: 'Spain', iso: 'ES' },
  { code: '+31', flag: '🇳🇱', name: 'Netherlands', iso: 'NL' },
  { code: '+41', flag: '🇨🇭', name: 'Switzerland', iso: 'CH' },
  { code: '+46', flag: '🇸🇪', name: 'Sweden', iso: 'SE' },
  { code: '+47', flag: '🇳🇴', name: 'Norway', iso: 'NO' },
  { code: '+45', flag: '🇩🇰', name: 'Denmark', iso: 'DK' },
  { code: '+81', flag: '🇯🇵', name: 'Japan', iso: 'JP' },
  { code: '+82', flag: '🇰🇷', name: 'South Korea', iso: 'KR' },
  { code: '+86', flag: '🇨🇳', name: 'China', iso: 'CN' },
  { code: '+55', flag: '🇧🇷', name: 'Brazil', iso: 'BR' },
  { code: '+52', flag: '🇲🇽', name: 'Mexico', iso: 'MX' },
  { code: '+92', flag: '🇵🇰', name: 'Pakistan', iso: 'PK' },
  { code: '+880', flag: '🇧🇩', name: 'Bangladesh', iso: 'BD' },
  { code: '+62', flag: '🇮🇩', name: 'Indonesia', iso: 'ID' },
  { code: '+63', flag: '🇵🇭', name: 'Philippines', iso: 'PH' },
  { code: '+66', flag: '🇹🇭', name: 'Thailand', iso: 'TH' },
  { code: '+84', flag: '🇻🇳', name: 'Vietnam', iso: 'VN' },
  { code: '+27', flag: '🇿🇦', name: 'South Africa', iso: 'ZA' },
  { code: '+234', flag: '🇳🇬', name: 'Nigeria', iso: 'NG' },
  { code: '+254', flag: '🇰🇪', name: 'Kenya', iso: 'KE' },
  { code: '+20', flag: '🇪🇬', name: 'Egypt', iso: 'EG' },
  { code: '+90', flag: '🇹🇷', name: 'Turkey', iso: 'TR' },
  { code: '+7', flag: '🇷🇺', name: 'Russia', iso: 'RU' },
  { code: '+48', flag: '🇵🇱', name: 'Poland', iso: 'PL' },
  { code: '+64', flag: '🇳🇿', name: 'New Zealand', iso: 'NZ' },
  { code: '+353', flag: '🇮🇪', name: 'Ireland', iso: 'IE' },
  { code: '+972', flag: '🇮🇱', name: 'Israel', iso: 'IL' },
  { code: '+961', flag: '🇱🇧', name: 'Lebanon', iso: 'LB' },
  { code: '+962', flag: '🇯🇴', name: 'Jordan', iso: 'JO' },
  { code: '+968', flag: '🇴🇲', name: 'Oman', iso: 'OM' },
  { code: '+973', flag: '🇧🇭', name: 'Bahrain', iso: 'BH' },
  { code: '+94', flag: '🇱🇰', name: 'Sri Lanka', iso: 'LK' },
  { code: '+977', flag: '🇳🇵', name: 'Nepal', iso: 'NP' },
];

const STEPS = [
  { title: 'Create your account', sub: 'Tell us a bit about yourself to get started.' },
  { title: 'Professional info', sub: 'Help us tailor the experience to your work.' },
  { title: 'Almost done!', sub: "One last thing and then you're in." },
];

const ROLES = [
  { value: 'bim-manager', label: 'BIM Manager / Coordinator' },
  { value: 'architect', label: 'Architect' },
  { value: 'engineer', label: 'Civil / Structural Engineer' },
  { value: 'project-manager', label: 'Project Manager' },
  { value: 'surveyor', label: 'Surveyor / Geospatial Specialist' },
  { value: 'developer', label: 'Software Developer / Tech Lead' },
  { value: 'executive', label: 'Executive / Director' },
  { value: 'other', label: 'Other' },
];

const TEAM_SIZES = [
  { value: '1', label: 'Just me' },
  { value: '2-10', label: '2–10 people' },
  { value: '11-50', label: '11–50 people' },
  { value: '51-200', label: '51–200 people' },
  { value: '201+', label: '201+ people' },
];

const FIND_US_OPTIONS = [
  { value: 'search', label: 'Search engine (Google, Bing)' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'conference', label: 'Conference / Event' },
  { value: 'colleague', label: 'Colleague referral' },
  { value: 'social', label: 'Social media' },
  { value: 'blog', label: 'Blog / Article' },
  { value: 'other', label: 'Other' },
];

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
  animations: [
    trigger('stepSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        animate('300ms cubic-bezier(0.16,1,0.3,1)', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':leave', [animate('150ms ease-in', style({ opacity: 0 }))]),
    ]),
  ],
})
export class SignupComponent implements OnInit, OnDestroy {
  @ViewChild('countryDrop') countryDropRef?: ElementRef<HTMLDivElement>;

  readonly ArrowLeft = ArrowLeft;
  readonly ChevronDown = ChevronDown;
  readonly Search = Search;
  readonly STEPS = STEPS;
  readonly roles = ROLES;
  readonly teamSizes = TEAM_SIZES;
  readonly findUsOptions = FIND_US_OPTIONS;
  readonly avatars = [
    { initials: 'AC', color: 'from-blue-500 to-indigo-600' },
    { initials: 'BE', color: 'from-emerald-500 to-teal-600' },
    { initials: 'CP', color: 'from-violet-500 to-purple-600' },
    { initials: 'DG', color: 'from-amber-500 to-orange-600' },
    { initials: '+', color: 'from-zinc-600 to-zinc-700' },
  ];

  step = 1;

  form = {
    fullName: '',
    email: '',
    password: '',
    company: '',
    role: '',
    teamSize: '',
    findUs: '',
    phone: '',
  };

  emailError = false;
  passwordError = false;

  selectedCountry: CountryCode = COUNTRY_CODES[0];
  showCountryDrop = false;
  countrySearch = '';

  constructor(
    private router: Router,
    private seo: SeoService,
  ) {
    this.seo.set({ title: 'Sign Up', description: 'Create a free AxisXD account to start building and visualizing digital twins.', canonicalPath: '/signup', noindex: true });
  }

  ngOnInit(): void {
    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((data) => {
        const match = COUNTRY_CODES.find((c) => c.iso === data.country_code);
        if (match) this.selectedCountry = match;
      })
      .catch(() => {});

    setTimeout(() => {
      gsap.fromTo('.signup-step-bar', { opacity: 0.25, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.12, ease: 'power2.out' });
    });
  }

  ngOnDestroy(): void {}

  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(e: MouseEvent): void {
    if (this.countryDropRef && !this.countryDropRef.nativeElement.contains(e.target as Node)) {
      this.showCountryDrop = false;
    }
  }

  get filteredCountries(): CountryCode[] {
    const q = this.countrySearch.toLowerCase();
    return COUNTRY_CODES.filter((c) => c.name.toLowerCase().includes(q) || c.code.includes(this.countrySearch));
  }

  onBack(): void {
    this.router.navigateByUrl('/');
  }

  clearEmailError(): void {
    this.emailError = false;
  }

  clearPasswordError(): void {
    this.passwordError = false;
  }

  nextStep(): void {
    if (this.step === 1) {
      let valid = true;
      if (!this.form.email.includes('@') || !this.form.email.includes('.')) {
        this.emailError = true;
        valid = false;
      } else {
        this.emailError = false;
      }
      if (this.form.password.length < 8) {
        this.passwordError = true;
        valid = false;
      } else {
        this.passwordError = false;
      }
      if (!valid) return;
    }
    if (this.step < 3) this.step += 1;
  }

  prevStep(): void {
    if (this.step > 1) this.step -= 1;
  }

  toggleCountryDrop(): void {
    this.showCountryDrop = !this.showCountryDrop;
    this.countrySearch = '';
  }

  selectCountry(c: CountryCode): void {
    this.selectedCountry = c;
    this.showCountryDrop = false;
    this.countrySearch = '';
  }

  handleSignup(): void {
    if (!this.form.fullName || !this.form.company || !this.form.role || !this.form.teamSize || !this.form.findUs) {
      alert('Please fill in all fields before submitting.');
      return;
    }
    this.form = { fullName: '', email: '', password: '', company: '', role: '', teamSize: '', findUs: '', phone: '' };
    this.step = 1;
    alert('Account created successfully! Welcome to AXISXD.');
    this.router.navigateByUrl('/login');
  }
}
