import { Injectable, NgZone, OnDestroy } from '@angular/core';

/**
 * Wheel-damped page scrolling.
 *
 * Instead of jumping by the raw wheel delta, wheel input feeds a target scroll
 * position that the real window scroll eases toward each frame. Because it
 * drives the native scroll position (rather than transforming a wrapper the way
 * ScrollSmoother does), `position: fixed` UI, ScrollTrigger pins and anchor
 * links all keep working untouched.
 *
 * Tuned tight on purpose: a ~0.15s settle keeps the page visually locked to the
 * cursor/wheel instead of trailing behind it.
 */
@Injectable({ providedIn: 'root' })
export class SmoothScrollService implements OnDestroy {
  /** Fraction of the remaining distance covered per frame (at 60fps). */
  private static readonly EASE = 0.22;
  /** Below this many px we snap and stop the loop. */
  private static readonly EPSILON = 0.5;

  private enabled = false;
  private target = 0;
  private rafId = 0;
  private wheeling = false;

  private readonly onWheel = (e: WheelEvent) => {
    if (e.ctrlKey || e.defaultPrevented) return; // pinch-zoom
    if (this.isInnerScrollable(e.target as Element | null, e.deltaY)) return;

    e.preventDefault();

    if (!this.wheeling) {
      this.wheeling = true;
      this.target = window.scrollY;
    }
    this.target = this.clamp(this.target + this.normalizeDelta(e));
    this.start();
  };

  /** Any scroll we did not originate (keyboard, scrollbar, scrollTo, anchors). */
  private readonly onScroll = () => {
    if (!this.wheeling) this.target = window.scrollY;
  };

  private readonly onCancel = () => this.stop();

  constructor(private zone: NgZone) {}

  init(): void {
    if (this.enabled || typeof window === 'undefined') return;
    // Native momentum on touch already feels right, and users who asked for
    // reduced motion should not get extra easing.
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.enabled = true;
    this.target = window.scrollY;

    // Outside Angular: these fire on every frame of every scroll.
    this.zone.runOutsideAngular(() => {
      window.addEventListener('wheel', this.onWheel, { passive: false });
      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('touchstart', this.onCancel, { passive: true });
      window.addEventListener('keydown', this.onCancel);
      window.addEventListener('mousedown', this.onCancel);
    });
  }

  ngOnDestroy(): void {
    this.stop();
    window.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('touchstart', this.onCancel);
    window.removeEventListener('keydown', this.onCancel);
    window.removeEventListener('mousedown', this.onCancel);
    this.enabled = false;
  }

  private start(): void {
    if (this.rafId) return;
    this.zone.runOutsideAngular(() => {
      this.rafId = requestAnimationFrame(this.tick);
    });
  }

  private stop(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
    this.wheeling = false;
  }

  private readonly tick = () => {
    const current = window.scrollY;
    const delta = this.target - current;

    if (Math.abs(delta) < SmoothScrollService.EPSILON) {
      this.stop();
      return;
    }

    window.scrollTo(0, current + delta * SmoothScrollService.EASE);

    // The page refused to move (hit a boundary) — drop the leftover distance
    // so an over-scrolled target does not keep the loop alive.
    if (window.scrollY === current) {
      this.stop();
      return;
    }

    this.rafId = requestAnimationFrame(this.tick);
  };

  private normalizeDelta(e: WheelEvent): number {
    if (e.deltaMode === 1) return e.deltaY * 16; // lines
    if (e.deltaMode === 2) return e.deltaY * window.innerHeight; // pages
    return e.deltaY;
  }

  private clamp(value: number): number {
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    return Math.min(Math.max(value, 0), max);
  }

  /**
   * Walks up from the wheel target looking for a scrollable ancestor that can
   * still move in this direction (docs sidebar, chat log, carousels). If one
   * exists the wheel belongs to it, not to the page.
   */
  private isInnerScrollable(el: Element | null, deltaY: number): boolean {
    while (el && el !== document.body && el !== document.documentElement) {
      const style = getComputedStyle(el);
      const overflowY = style.overflowY;
      const scrolls = overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay';

      if (scrolls && el.scrollHeight > el.clientHeight + 1) {
        const atTop = el.scrollTop <= 0;
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
        if (!((deltaY < 0 && atTop) || (deltaY > 0 && atBottom))) return true;
      }

      el = el.parentElement;
    }
    return false;
  }
}
