import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

const SITE_NAME = 'AxisXD';
const SITE_URL = 'https://www.axisxd.com';
const TWITTER_HANDLE = '@axissxd';
const DEFAULT_DESC = 'View and analyse IFC, BIM, point cloud, CAD and 360° panorama data in one browser-based digital twin platform — with clash detection and deviation analysis.';
// 1200x630 social card. Must stay an absolute URL: Facebook, LinkedIn, X and
// Slack all reject relative og:image paths.
const DEFAULT_OG_IMAGE = '/assets/images/og/axisxd-og-card.png';
const DEFAULT_OG_IMAGE_ALT = 'AxisXD — unified digital twin platform for BIM, point cloud, CAD and 360° reality capture data.';

export interface SeoOptions {
  title?: string;
  description?: string;
  ogImage?: string;
  ogImageAlt?: string;
  /** 'website' for landing pages, 'article' for blog/whitepaper/case-study detail pages. */
  ogType?: string;
  canonicalPath?: string;
  noindex?: boolean;
}

const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AxisXD',
  url: SITE_URL,
  logo: `${SITE_URL}/assets/images/logos/logo.png`,
  sameAs: [
    'https://x.com/axissxd',
    'https://www.linkedin.com/company/108461955/',
    'https://facebook.com/axisxd',
    'https://instagram.com/axisxd',
    'https://youtube.com/@axisxd',
    'https://www.reddit.com/user/GasPlastic3360/',
    'https://www.pinterest.com/axisxd1/',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-319-683-2735',
    contactType: 'sales',
    email: 'contact@axisxd.com',
  },
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  set(options: SeoOptions): void {
    const pageTitle = options.title ? `${options.title} | ${SITE_NAME}` : `${SITE_NAME} | Unified Digital Twin Platform`;
    const desc = options.description || DEFAULT_DESC;
    const image = this.absolute(options.ogImage || DEFAULT_OG_IMAGE);
    const imageAlt = options.ogImageAlt || DEFAULT_OG_IMAGE_ALT;
    const canonical = options.canonicalPath ? `${SITE_URL}${options.canonicalPath}` : undefined;
    const url = canonical || SITE_URL;

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: desc });

    // Always write the tag rather than removing it on the indexable path, so a
    // noindex left over from a previous route is actually cleared.
    this.meta.updateTag({
      name: 'robots',
      content: options.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1',
    });

    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: desc });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:image:alt', content: imageAlt });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: options.ogType || 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:locale', content: 'en_US' });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:site', content: TWITTER_HANDLE });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: desc });
    this.meta.updateTag({ name: 'twitter:image', content: image });
    this.meta.updateTag({ name: 'twitter:image:alt', content: imageAlt });

    this.setLinkTag('canonical', canonical);
    this.setAlternateLinks(url);
    this.setJsonLd('ld-organization', ORGANIZATION_JSON_LD);

    if (options.canonicalPath) {
      this.setJsonLd('ld-breadcrumb', {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          ...(options.canonicalPath !== '/'
            ? [{
                '@type': 'ListItem',
                position: 2,
                name: options.title || 'Page',
                item: `${SITE_URL}${options.canonicalPath}`,
              }]
            : []),
        ],
      });
    } else {
      this.removeElement('ld-breadcrumb');
    }
  }

  /**
   * Publish a page-scoped JSON-LD graph (FAQPage, SoftwareApplication, ...).
   * Keyed by id so re-running on the same route replaces rather than appends,
   * and so navigating away can drop it via {@link removeStructuredData}.
   */
  setStructuredData(id: string, data: unknown): void {
    this.setJsonLd(id, data);
  }

  removeStructuredData(id: string): void {
    this.removeElement(id);
  }

  private absolute(path: string): string {
    return /^https?:\/\//i.test(path) ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  }

  private setLinkTag(rel: string, href: string | undefined): void {
    let el = this.document.head.querySelector<HTMLLinkElement>(`link[rel='${rel}']`);
    if (!href) {
      if (el) el.remove();
      return;
    }
    if (!el) {
      el = this.document.createElement('link');
      el.setAttribute('rel', rel);
      this.document.head.appendChild(el);
    }
    el.setAttribute('href', href);
  }

  private setAlternateLinks(url: string): void {
    this.document.head.querySelectorAll("link[rel='alternate']").forEach((el) => el.remove());
    (['en', 'x-default'] as const).forEach((hrefLang) => {
      const el = this.document.createElement('link');
      el.setAttribute('rel', 'alternate');
      el.setAttribute('href', url);
      el.setAttribute('hreflang', hrefLang);
      this.document.head.appendChild(el);
    });
  }

  private setJsonLd(id: string, data: unknown): void {
    this.removeElement(id);
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify(data);
    this.document.head.appendChild(script);
  }

  private removeElement(id: string): void {
    this.document.getElementById(id)?.remove();
  }
}
