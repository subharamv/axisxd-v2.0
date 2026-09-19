import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ActiveSectionService {
  /**
   * Returns a signal tracking which of `sectionIds` (by element id) is currently
   * scrolled into view, and attaches the scroll listener. Caller must invoke the
   * returned `destroy()` in ngOnDestroy to remove the listener.
   */
  track(sectionIds: string[]): { active: WritableSignal<string>; destroy: () => void } {
    const active = signal(sectionIds[0]);

    const handleScroll = () => {
      const scrollY = window.scrollY + 130;
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) {
          current = id;
        }
      }
      active.set(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return { active, destroy: () => window.removeEventListener('scroll', handleScroll) };
  }
}
