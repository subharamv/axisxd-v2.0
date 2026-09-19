import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Moon, Sun } from 'lucide-angular';

export type TransitionVariant = 'circle' | 'square' | 'triangle' | 'diamond' | 'hexagon' | 'rectangle' | 'star';

function polygonCollapsed(cx: number, cy: number, vertexCount: number): string {
  const pairs = Array.from({ length: vertexCount }, () => `${cx}px ${cy}px`).join(', ');
  return `polygon(${pairs})`;
}

function getThemeTransitionClipPaths(
  variant: TransitionVariant,
  cx: number,
  cy: number,
  maxRadius: number,
  viewportWidth: number,
  viewportHeight: number,
): [string, string] {
  switch (variant) {
    case 'circle':
      return [`circle(0px at ${cx}px ${cy}px)`, `circle(${maxRadius}px at ${cx}px ${cy}px)`];
    case 'square': {
      const halfW = Math.max(cx, viewportWidth - cx);
      const halfH = Math.max(cy, viewportHeight - cy);
      const halfSide = Math.max(halfW, halfH) * 1.05;
      const end = [
        `${cx - halfSide}px ${cy - halfSide}px`,
        `${cx + halfSide}px ${cy - halfSide}px`,
        `${cx + halfSide}px ${cy + halfSide}px`,
        `${cx - halfSide}px ${cy + halfSide}px`,
      ].join(', ');
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
    }
    case 'triangle': {
      const scale = maxRadius * 2.2;
      const dx = (Math.sqrt(3) / 2) * scale;
      const verts = [`${cx}px ${cy - scale}px`, `${cx + dx}px ${cy + 0.5 * scale}px`, `${cx - dx}px ${cy + 0.5 * scale}px`].join(', ');
      return [polygonCollapsed(cx, cy, 3), `polygon(${verts})`];
    }
    case 'diamond': {
      const R = maxRadius * Math.SQRT2;
      const end = [`${cx}px ${cy - R}px`, `${cx + R}px ${cy}px`, `${cx}px ${cy + R}px`, `${cx - R}px ${cy}px`].join(', ');
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
    }
    case 'hexagon': {
      const R = maxRadius * Math.SQRT2;
      const verts: string[] = [];
      for (let i = 0; i < 6; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 3;
        verts.push(`${cx + R * Math.cos(a)}px ${cy + R * Math.sin(a)}px`);
      }
      return [polygonCollapsed(cx, cy, 6), `polygon(${verts.join(', ')})`];
    }
    case 'rectangle': {
      const halfW = Math.max(cx, viewportWidth - cx);
      const halfH = Math.max(cy, viewportHeight - cy);
      const end = [
        `${cx - halfW}px ${cy - halfH}px`,
        `${cx + halfW}px ${cy - halfH}px`,
        `${cx + halfW}px ${cy + halfH}px`,
        `${cx - halfW}px ${cy + halfH}px`,
      ].join(', ');
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
    }
    case 'star': {
      const R = maxRadius * Math.SQRT2 * 1.03;
      const innerRatio = 0.42;
      const starPolygon = (radius: number) => {
        const verts: string[] = [];
        for (let i = 0; i < 5; i++) {
          const outerA = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
          verts.push(`${cx + radius * Math.cos(outerA)}px ${cy + radius * Math.sin(outerA)}px`);
          const innerA = outerA + Math.PI / 5;
          verts.push(`${cx + radius * innerRatio * Math.cos(innerA)}px ${cy + radius * innerRatio * Math.sin(innerA)}px`);
        }
        return `polygon(${verts.join(', ')})`;
      };
      const startR = Math.max(2, R * 0.025);
      return [starPolygon(startR), starPolygon(R)];
    }
    default:
      return [`circle(0px at ${cx}px ${cy}px)`, `circle(${maxRadius}px at ${cx}px ${cy}px)`];
  }
}

@Component({
  selector: 'app-animated-theme-toggler',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './animated-theme-toggler.html',
  styleUrl: './animated-theme-toggler.scss',
})
export class AnimatedThemeTogglerComponent implements OnInit, OnDestroy {
  @Input() duration = 1000;
  @Input() variant: TransitionVariant = 'circle';
  @Input() fromCenter = false;

  @ViewChild('btn') btnRef!: ElementRef<HTMLButtonElement>;

  isDark = true;
  private observer: MutationObserver | null = null;

  readonly Sun = Sun;
  readonly Moon = Moon;

  ngOnInit(): void {
    this.isDark = document.documentElement.classList.contains('dark');
    this.observer = new MutationObserver(() => {
      this.isDark = document.documentElement.classList.contains('dark');
    });
    this.observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  toggleTheme(): void {
    const button = this.btnRef?.nativeElement;
    if (!button) return;

    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;

    let x: number;
    let y: number;
    if (this.fromCenter) {
      x = viewportWidth / 2;
      y = viewportHeight / 2;
    } else {
      const { top, left, width, height } = button.getBoundingClientRect();
      x = left + width / 2;
      y = top + height / 2;
    }

    const maxRadius = Math.hypot(Math.max(x, viewportWidth - x), Math.max(y, viewportHeight - y));

    const applyTheme = () => {
      const currentlyDark = document.documentElement.classList.contains('dark');
      const newTheme = !currentlyDark;
      this.isDark = newTheme;
      document.documentElement.classList.toggle('dark', newTheme);
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    };

    const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished?: Promise<void>; ready?: Promise<void> } };

    if (typeof doc.startViewTransition !== 'function') {
      applyTheme();
      return;
    }

    const clipPath = getThemeTransitionClipPaths(this.variant, x, y, maxRadius, viewportWidth, viewportHeight);

    const root = document.documentElement;
    root.dataset['magicuiThemeVt'] = 'active';
    root.style.setProperty('--magicui-theme-toggle-vt-duration', `${this.duration}ms`);
    root.style.setProperty('--magicui-theme-vt-clip-from', clipPath[0]);
    const cleanup = () => {
      delete root.dataset['magicuiThemeVt'];
      root.style.removeProperty('--magicui-theme-toggle-vt-duration');
      root.style.removeProperty('--magicui-theme-vt-clip-from');
    };

    const transition = doc.startViewTransition(applyTheme);
    if (transition?.finished && typeof transition.finished.finally === 'function') {
      transition.finished.finally(cleanup);
    } else {
      cleanup();
    }

    const ready = transition?.ready;
    if (ready && typeof ready.then === 'function') {
      ready.then(() => {
        document.documentElement.animate(
          { clipPath },
          {
            duration: this.duration,
            easing: this.variant === 'star' ? 'linear' : 'cubic-bezier(0.16, 1, 0.3, 1)',
            fill: 'forwards',
            pseudoElement: '::view-transition-new(root)',
          } as unknown as KeyframeAnimationOptions,
        );
      });
    }
  }
}
