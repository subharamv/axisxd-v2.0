import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-calibration-metrics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calibration-metrics.html',
  styleUrl: './calibration-metrics.scss',
})
export class CalibrationMetricsComponent implements AfterViewInit, OnDestroy {
  readonly certBadges: [string, string][] = [
    ['EN', 'cm-badge--en'],
    ['BM', 'cm-badge--bm'],
    ['LD', 'cm-badge--ld'],
  ];

  @ViewChild('sectionEl') sectionEl!: ElementRef<HTMLElement>;
  @ViewChild('c1') c1!: ElementRef<HTMLSpanElement>;
  @ViewChild('c2') c2!: ElementRef<HTMLSpanElement>;
  @ViewChild('c3') c3!: ElementRef<HTMLSpanElement>;

  private ctx?: gsap.Context;
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {
      const counters: { el: HTMLElement; to: number; fmt: (n: number) => string }[] = [
        { el: this.c1.nativeElement, to: 5000, fmt: (n) => `${Math.round(n).toLocaleString()}+` },
        { el: this.c2.nativeElement, to: 30, fmt: (n) => `${Math.round(n)}+` },
        { el: this.c3.nativeElement, to: 230, fmt: (n) => `${Math.round(n)} Million` },
      ];

      counters.forEach(({ el, to, fmt }) => {
        if (!el) return;
        const obj = { val: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () => {
            gsap.to(obj, {
              val: to,
              duration: 1.8,
              ease: 'power2.out',
              onUpdate() {
                el.textContent = fmt(obj.val);
              },
            });
          },
        });
      });
    }, this.sectionEl.nativeElement);

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('cm-in-view');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    this.sectionEl.nativeElement.querySelectorAll('.cm-fade').forEach((el) => this.observer?.observe(el));
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
    this.observer?.disconnect();
  }
}
