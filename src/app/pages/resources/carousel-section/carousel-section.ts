import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';
import type { LucideIconData } from '../../../core/lucide-icon.type';

import type { Resource } from '../../../data/resources';
import { ResourceCardComponent } from '../resource-card/resource-card';

@Component({
  selector: 'app-carousel-section',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ResourceCardComponent],
  templateUrl: './carousel-section.html',
  styleUrl: './carousel-section.scss',
})
export class CarouselSectionComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) resources: Resource[] = [];
  @Input({ required: true }) icon!: LucideIconData;
  @Input({ required: true }) accentColor!: string;

  @Output() readBlog = new EventEmitter<string>();
  @Output() readWhitepaper = new EventEmitter<string>();
  @Output() readCaseStudy = new EventEmitter<string>();

  @ViewChild('scrollEl') scrollElRef?: ElementRef<HTMLDivElement>;

  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  canScrollLeft = false;
  canScrollRight = false;

  private resizeHandler = () => this.updateScrollButtons();

  ngAfterViewInit(): void {
    this.updateScrollButtons();
    this.scrollElRef?.nativeElement.addEventListener('scroll', this.resizeHandler, { passive: true });
    window.addEventListener('resize', this.resizeHandler);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resources']) {
      // Wait a tick for the DOM to reflect the new resource list before recalculating.
      setTimeout(() => this.updateScrollButtons());
    }
  }

  ngOnDestroy(): void {
    this.scrollElRef?.nativeElement.removeEventListener('scroll', this.resizeHandler);
    window.removeEventListener('resize', this.resizeHandler);
  }

  updateScrollButtons(): void {
    const el = this.scrollElRef?.nativeElement;
    if (!el) return;
    this.canScrollLeft = el.scrollLeft > 4;
    this.canScrollRight = el.scrollLeft < el.scrollWidth - el.clientWidth - 4;
  }

  scroll(dir: 'left' | 'right'): void {
    const el = this.scrollElRef?.nativeElement;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  }
}
