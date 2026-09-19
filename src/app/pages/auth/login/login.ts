import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { LucideAngularModule, ArrowLeft, Mail, CheckCircle2 } from 'lucide-angular';
import { SeoService } from '../../../core/seo.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  animations: [
    trigger('viewSwitch', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        animate('400ms cubic-bezier(0.16,1,0.3,1)', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':leave', [animate('250ms ease-in', style({ opacity: 0, transform: 'translateX(-30px)' }))]),
    ]),
    trigger('fadeScale', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms cubic-bezier(0.16,1,0.3,1)', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))]),
    ]),
    trigger('fieldError', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-4px)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-4px)' }))]),
    ]),
  ],
})
export class LoginComponent {
  readonly ArrowLeft = ArrowLeft;
  readonly Mail = Mail;
  readonly CheckCircle2 = CheckCircle2;

  readonly avatars = [
    { initials: 'AC', color: 'from-blue-500 to-indigo-600' },
    { initials: 'BE', color: 'from-emerald-500 to-teal-600' },
    { initials: 'CP', color: 'from-violet-500 to-purple-600' },
    { initials: 'DG', color: 'from-amber-500 to-orange-600' },
    { initials: '+', color: 'from-zinc-600 to-zinc-700' },
  ];

  email = '';
  password = '';
  emailError = false;
  passwordError = false;

  forgotMode = false;
  resetEmail = '';
  resetEmailError = false;
  resetSent = false;

  emailShake = false;
  passwordShake = false;
  resetEmailShake = false;

  constructor(
    private router: Router,
    private seo: SeoService,
  ) {
    this.seo.set({ title: 'Login', description: 'Sign in to your AxisXD account to access your digital twin projects and dashboard.', canonicalPath: '/login', noindex: true });
  }

  onBack(): void {
    this.router.navigateByUrl('/');
  }

  private triggerShake(field: 'email' | 'password' | 'resetEmail'): void {
    const key = `${field}Shake` as 'emailShake' | 'passwordShake' | 'resetEmailShake';
    this[key] = false;
    setTimeout(() => (this[key] = true), 0);
    setTimeout(() => (this[key] = false), 350);
  }

  clearEmailError(): void {
    this.emailError = false;
  }

  clearPasswordError(): void {
    this.passwordError = false;
  }

  clearResetEmailError(): void {
    this.resetEmailError = false;
  }

  handleForgotSubmit(e: Event): void {
    e.preventDefault();
    if (!this.resetEmail.includes('@') || !this.resetEmail.includes('.')) {
      this.resetEmailError = true;
      this.triggerShake('resetEmail');
      return;
    }
    this.resetEmailError = false;
    this.resetSent = true;
  }

  handleBackToLogin(): void {
    this.forgotMode = false;
    this.resetEmail = '';
    this.resetEmailError = false;
    this.resetSent = false;
  }

  handleSocialLogin(provider: string): void {
    alert(`Signing in with ${provider}...`);
  }

  handleSubmit(e: Event): void {
    e.preventDefault();
    let valid = true;

    if (!this.email.includes('@') || !this.email.includes('.')) {
      this.emailError = true;
      this.triggerShake('email');
      valid = false;
    } else {
      this.emailError = false;
    }

    if (this.password.length < 8) {
      this.passwordError = true;
      this.triggerShake('password');
      valid = false;
    } else {
      this.passwordError = false;
    }

    if (valid) {
      this.email = '';
      this.password = '';
      alert('Welcome back! Dashboard coming soon.');
    }
  }
}
