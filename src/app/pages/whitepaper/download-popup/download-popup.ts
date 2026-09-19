import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X, FileText, Download, CheckCircle } from 'lucide-angular';

export interface DownloadFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  marketingOptIn: boolean;
}

@Component({
  selector: 'app-download-popup',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './download-popup.html',
  styleUrl: './download-popup.scss',
})
export class DownloadPopupComponent {
  readonly X = X;
  readonly FileText = FileText;
  readonly Download = Download;
  readonly CheckCircle = CheckCircle;

  @Output() closed = new EventEmitter<void>();

  downloadSuccess = false;
  formData: DownloadFormData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    marketingOptIn: false,
  };
  formErrors: Record<string, string> = {};

  private successTimeout: ReturnType<typeof setTimeout> | null = null;

  private validateForm(): boolean {
    const errors: Record<string, string> = {};
    if (!this.formData.firstName.trim()) errors['firstName'] = 'First name is required';
    if (!this.formData.email.trim()) {
      errors['email'] = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email)) {
      errors['email'] = 'Please enter a valid email';
    }
    if (!this.formData.phone.trim()) {
      errors['phone'] = 'Phone number is required';
    }
    this.formErrors = errors;
    return Object.keys(errors).length === 0;
  }

  handleFormSubmit(e: Event): void {
    e.preventDefault();
    if (!this.validateForm()) return;
    this.downloadSuccess = true;
    this.successTimeout = setTimeout(() => {
      this.close();
      this.downloadSuccess = false;
      this.formData = { firstName: '', lastName: '', email: '', phone: '', marketingOptIn: false };
    }, 3000);
  }

  updateField(field: keyof DownloadFormData, value: string | boolean): void {
    (this.formData as any)[field] = value;
    if (this.formErrors[field]) {
      this.formErrors = { ...this.formErrors, [field]: '' };
    }
  }

  close(): void {
    if (this.successTimeout) {
      clearTimeout(this.successTimeout);
      this.successTimeout = null;
    }
    this.closed.emit();
    this.downloadSuccess = false;
  }
}
