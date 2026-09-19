import { Injectable, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type FontKey =
  | 'syne'
  | 'manrope'
  | 'ibm-plex-sans'
  | 'inter'
  | 'plus-jakarta-sans'
  | 'satoshi'
  | 'fira-sans';

export interface FontOption {
  key: FontKey;
  /** Shown in the dropdown. */
  label: string;
  /** One-line note under the label. */
  note: string;
  /** Rendered in the option's own face so the list previews itself. */
  stack: string;
}

export const FONT_OPTIONS: readonly FontOption[] = [
  {
    key: 'syne',
    label: 'Syne',
    note: 'Current — geometric, high character',
    stack: "'Syne', sans-serif",
  },
  {
    key: 'manrope',
    label: 'Manrope',
    note: 'Rounded geometric, softer rhythm',
    stack: "'Manrope', sans-serif",
  },
  {
    key: 'ibm-plex-sans',
    label: 'IBM Plex Sans',
    note: 'Neutral, engineered, strong at small sizes',
    stack: "'IBM Plex Sans', sans-serif",
  },
  {
    key: 'inter',
    label: 'Inter',
    note: 'UI workhorse, widest weight range',
    stack: "'Inter', sans-serif",
  },
  {
    key: 'plus-jakarta-sans',
    label: 'Plus Jakarta Sans',
    note: 'Friendly geometric, slight warmth',
    stack: "'Plus Jakarta Sans', sans-serif",
  },
  {
    key: 'satoshi',
    label: 'Satoshi',
    note: 'Fontshare — tight, modern grotesque',
    stack: "'Satoshi', sans-serif",
  },
  {
    key: 'fira-sans',
    label: 'Fira Sans',
    note: 'Humanist, open apertures, technical feel',
    stack: "'Fira Sans', sans-serif",
  },
] as const;

const STORAGE_KEY = 'axisxd-font-preview';
const DEFAULT_FONT: FontKey = 'syne';

/**
 * Temporary type-testing switch. Sets `data-font` on <html>, which redefines
 * the `--font-sans` custom property that every sans rule now resolves through.
 * Remove this service, its component and the `[data-font]` blocks in
 * styles.scss once a face has been chosen.
 */
@Injectable({ providedIn: 'root' })
export class FontSwitcherService {
  private readonly document = inject(DOCUMENT);
  readonly options = FONT_OPTIONS;
  readonly current = signal<FontKey>(DEFAULT_FONT);

  constructor() {
    this.apply(this.read(), false);
  }

  get currentOption(): FontOption {
    return FONT_OPTIONS.find((f) => f.key === this.current()) ?? FONT_OPTIONS[0];
  }

  set(key: FontKey): void {
    this.apply(key, true);
  }

  private apply(key: FontKey, persist: boolean): void {
    const valid = FONT_OPTIONS.some((f) => f.key === key) ? key : DEFAULT_FONT;
    this.current.set(valid);
    // Syne is the baseline, so it carries no attribute at all and the site
    // renders from the :root defaults exactly as it did before this existed.
    if (valid === DEFAULT_FONT) {
      this.document.documentElement.removeAttribute('data-font');
    } else {
      this.document.documentElement.setAttribute('data-font', valid);
    }
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, valid);
      } catch {
        // Private mode or blocked storage: the choice just won't survive a reload.
      }
    }
  }

  private read(): FontKey {
    try {
      return (localStorage.getItem(STORAGE_KEY) as FontKey | null) ?? DEFAULT_FONT;
    } catch {
      return DEFAULT_FONT;
    }
  }
}
