import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  LucideAngularModule,
  Video,
  Calendar,
  Clock,
  Users,
  Search,
  Play,
  Sparkles,
} from 'lucide-angular';
import type { LucideIconData } from '../../../core/lucide-icon.type';

import { WEBINARS, CATEGORY_STYLES, WebinarListItem } from '../../../data/webinars';
import { SeoService } from '../../../core/seo.service';

type Tab = 'all' | 'upcoming' | 'on-demand';

@Component({
  selector: 'app-webinars-section',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './webinars-section.html',
  styleUrl: './webinars-section.scss',
})
export class WebinarsSectionComponent implements OnInit {
  readonly Video = Video;
  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly Users = Users;
  readonly Search = Search;
  readonly Play = Play;
  readonly Sparkles = Sparkles;

  readonly WEBINARS = WEBINARS;
  readonly CATEGORY_STYLES = CATEGORY_STYLES;

  readonly TABS: { id: Tab; label: string; icon: LucideIconData }[] = [
    { id: 'all', label: 'All Webinars', icon: Sparkles },
    { id: 'upcoming', label: 'Upcoming', icon: Calendar },
    { id: 'on-demand', label: 'On Demand', icon: Play },
  ];

  activeTab: Tab = 'all';
  searchQuery = '';

  constructor(
    private readonly router: Router,
    private readonly seo: SeoService,
  ) {}

  ngOnInit(): void {
    this.seo.set({
      title: 'Webinars',
      description: 'Watch AxisXD webinars on digital twin, BIM, LiDAR, and construction technology.',
      canonicalPath: '/webinars',
    });
  }

  get upcoming(): WebinarListItem[] {
    return this.WEBINARS.filter((w) => w.status === 'upcoming');
  }

  get onDemand(): WebinarListItem[] {
    return this.WEBINARS.filter((w) => w.status === 'on-demand');
  }

  get filtered(): WebinarListItem[] {
    const q = this.searchQuery.toLowerCase();
    return this.WEBINARS.filter((w) => {
      const matchesTab = this.activeTab === 'all' || w.status === this.activeTab;
      const matchesSearch =
        !q ||
        w.title.toLowerCase().includes(q) ||
        w.excerpt.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }

  get featured(): WebinarListItem | undefined {
    const filtered = this.filtered;
    return filtered.find((w) => w.featured) || filtered[0];
  }

  get filteredUpcoming(): WebinarListItem[] {
    return this.filtered.filter((w) => w.status === 'upcoming');
  }

  get filteredOnDemand(): WebinarListItem[] {
    return this.filtered.filter((w) => w.status === 'on-demand');
  }

  showSection(type: Tab): boolean {
    return this.activeTab === 'all' || this.activeTab === type;
  }

  setActiveTab(tab: Tab): void {
    this.activeTab = tab;
  }

  clearSearch(): void {
    this.searchQuery = '';
  }

  tabCount(tab: Tab): number {
    return tab === 'all' ? this.WEBINARS.length : tab === 'upcoming' ? this.upcoming.length : this.onDemand.length;
  }

  navigateWebinar(id: string): void {
    this.router.navigate(['/webinar', id]);
  }
}
