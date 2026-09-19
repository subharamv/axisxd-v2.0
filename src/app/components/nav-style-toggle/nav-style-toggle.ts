import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LayoutGrid, Sparkles } from 'lucide-angular';

export type NavStyle = 'card' | 'glass';

@Component({
  selector: 'app-nav-style-toggle',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './nav-style-toggle.html',
  styleUrl: './nav-style-toggle.scss',
})
export class NavStyleToggleComponent {
  @Input() navStyle: NavStyle = 'card';
  @Output() toggle = new EventEmitter<void>();

  readonly LayoutGrid = LayoutGrid;
  readonly Sparkles = Sparkles;

  onToggle(target: NavStyle): void {
    if (this.navStyle !== target) this.toggle.emit();
  }
}
