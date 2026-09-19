import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../core/seo.service';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './not-found-page.html',
  styleUrl: './not-found-page.scss',
})
export class NotFoundPageComponent {
  constructor(seo: SeoService) {
    seo.set({ title: 'Page Not Found', description: 'The page you are looking for does not exist.', noindex: true });
  }
}
