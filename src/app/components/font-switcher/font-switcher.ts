import {
  Component,
  ElementRef,
  HostListener,
  Input,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronDown, Check, Type } from 'lucide-angular';
import { FontKey, FontSwitcherService } from '../../core/font-switcher.service';

/**
 * TEMPORARY type-testing control that sits beside the Connect dropdown.
 * Mirrors the navbar's dropdown chrome so it reads as part of the header
 * rather than a debug affordance. Remove together with FontSwitcherService
 * and the [data-font] rules in styles.scss once a face is chosen.
 */
@Component({
  selector: 'app-font-switcher',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './font-switcher.html',
  styleUrl: './font-switcher.scss',
})
export class FontSwitcherComponent {
  readonly ChevronDown = ChevronDown;
  readonly Check = Check;
  readonly Type = Type;

  private readonly host = inject(ElementRef<HTMLElement>);
  readonly fonts = inject(FontSwitcherService);

  /**
   * Inline mode drops the trigger and renders the options as a flat list.
   * The mobile panel scrolls (overflow-y-auto), which would clip the
   * absolutely positioned menu, so the header passes this there.
   */
  @Input() inline = false;

  open = false;

  /** Matches the navbar's light/dark switch, which keys off .dark on <html>. */
  get isDark(): boolean {
    return document.documentElement.classList.contains('dark');
  }

  toggle(): void {
    this.open = !this.open;
  }

  select(key: FontKey): void {
    this.fonts.set(key);
    this.open = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.open && !this.host.nativeElement.contains(event.target as Node)) {
      this.open = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.open = false;
  }
}
