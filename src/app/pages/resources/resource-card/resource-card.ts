import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  FileText,
  BookOpen,
  Award,
  ArrowUpRight,
  Mail,
  BookMarked,
  Sparkles,
  Clock,
} from 'lucide-angular';
import type { LucideIconData } from '../../../core/lucide-icon.type';

import type { Tab, Resource } from '../../../data/resources';
import { GRADIENT_BG, CATEGORY_STYLES } from '../../../data/resources';

type CardVariant = 'default' | 'compact' | 'featured';

const TYPE_ICON: Record<Tab, LucideIconData> = {
  all: Sparkles,
  blogs: BookOpen,
  'case-studies': Award,
  whitepapers: FileText,
  newsletter: Mail,
  ebooks: BookMarked,
};

const TYPE_ACTION: Record<Tab, string> = {
  all: 'View',
  blogs: 'Read Article',
  'case-studies': 'Read Case Study',
  whitepapers: 'Download Whitepaper',
  newsletter: 'Open Newsletter',
  ebooks: 'Read Ebook',
};

@Component({
  selector: 'app-resource-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './resource-card.html',
  styleUrl: './resource-card.scss',
})
export class ResourceCardComponent {
  @Input({ required: true }) resource!: Resource;
  @Input() variant: CardVariant = 'default';

  @Output() readBlog = new EventEmitter<string>();
  @Output() readWhitepaper = new EventEmitter<string>();
  @Output() readCaseStudy = new EventEmitter<string>();

  readonly ArrowUpRight = ArrowUpRight;
  readonly Clock = Clock;

  readonly CATEGORY_STYLES = CATEGORY_STYLES;
  readonly GRADIENT_BG = GRADIENT_BG;

  get typeIcon(): LucideIconData {
    return TYPE_ICON[this.resource.type] || Sparkles;
  }

  get actionLabel(): string {
    return TYPE_ACTION[this.resource.type] || 'View';
  }

  get categoryStyle(): string {
    return this.CATEGORY_STYLES[this.resource.categoryColor ?? 'blue'] || 'bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-white/40';
  }

  get gradientBg(): string {
    return this.GRADIENT_BG[this.resource.categoryColor ?? 'blue'] ?? 'bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-700';
  }

  handleClick(): void {
    if (this.resource.type === 'blogs') {
      this.readBlog.emit(this.resource.id);
    } else if (this.resource.type === 'whitepapers') {
      this.readWhitepaper.emit(this.resource.id);
    } else if (this.resource.type === 'case-studies') {
      this.readCaseStudy.emit(this.resource.id);
    }
    // NOTE: the original React ResourceCard also fell back to `window.open(resource.link, ...)`
    // for resources without a dedicated handler. The ported `Resource` data model has no `link`
    // field (newsletter/ebooks resources never carried one in practice), so that branch is
    // intentionally omitted here — behavior is unchanged for all real data.
  }
}
