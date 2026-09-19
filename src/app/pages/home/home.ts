import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroSectionComponent } from '../../components/hero-section/hero-section';
import { ToolsDockComponent } from '../../components/tools-dock/tools-dock';
import { WorkflowSectionComponent } from '../../components/workflow-section/workflow-section';
import { ViewerSectionComponent } from '../../components/viewer-section/viewer-section';
import { AnalyzersDemoSectionComponent } from '../../components/analyzers-demo-section/analyzers-demo-section';
import { FormatsSectionComponent } from '../../components/formats-section/formats-section';
import { BentoShowcaseComponent } from '../../components/bento-showcase/bento-showcase';
import { GlobalPresenceSectionComponent } from '../../components/global-presence-section/global-presence-section';
import { CalibrationMetricsComponent } from '../../components/calibration-metrics/calibration-metrics';
import { PricingSectionComponent } from '../../components/pricing-section/pricing-section';
import { FaqSectionComponent } from '../../components/faq-section/faq-section';
import { SeoService } from '../../core/seo.service';

const HOME_TITLE = 'Digital Twin Platform for BIM, CAD & Point Clouds';
const HOME_DESC =
  'View and analyse IFC, BIM, point cloud, CAD and 360° panorama data in one browser-based digital twin platform — with clash detection and deviation analysis.';

/**
 * Product schema for the homepage. Prices mirror the plans rendered by
 * PricingSectionComponent — keep the two in step, mismatched Offer prices are
 * a structured-data violation.
 */
const SOFTWARE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AxisXD',
  url: 'https://axisxd.com',
  applicationCategory: 'DesignApplication',
  applicationSubCategory: 'BIM & Digital Twin Visualisation',
  operatingSystem: 'Web browser',
  description: HOME_DESC,
  image: 'https://axisxd.com/assets/images/og/axisxd-og-card.png',
  softwareRequirements: 'Modern web browser with WebGL 2.0. No plugin or desktop install.',
  featureList: [
    'IFC and federated BIM model viewer',
    'Point cloud streaming (E57, LAS/LAZ, RCP/RCS, PTS, PTX, XYZ)',
    'DWG/DXF CAD viewer',
    'Mesh viewer (OBJ, FBX, glTF/GLB, PLY, STL)',
    '360° panoramic reality capture viewer',
    'Deviation analysis against the design model',
    'Clash detection with BCF export',
    'Rights of light analysis',
    'Construction progress monitoring',
    'REST API and SDK',
  ],
  publisher: { '@type': 'Organization', name: 'AxisXD', url: 'https://axisxd.com' },
  offers: [
    {
      '@type': 'Offer',
      name: 'Pilot Sandbox',
      price: '0',
      priceCurrency: 'USD',
      description:
        'Full access to all viewers and analysis tools with usage limits. Great for evaluation and small projects.',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: 'Professional',
      price: '199',
      priceCurrency: 'USD',
      description: 'Unlimited uploads, team sharing, and priority support for growing AEC teams.',
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '199',
        priceCurrency: 'USD',
        unitText: 'seat per month',
      },
    },
    {
      '@type': 'Offer',
      name: 'Enterprise',
      priceCurrency: 'USD',
      description:
        'SSO, dedicated support, and SLA guarantees for large organisations with fully cloud-based access.',
      availability: 'https://schema.org/InStock',
    },
  ],
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroSectionComponent,
    ToolsDockComponent,
    WorkflowSectionComponent,
    ViewerSectionComponent,
    AnalyzersDemoSectionComponent,
    FormatsSectionComponent,
    BentoShowcaseComponent,
    GlobalPresenceSectionComponent,
    CalibrationMetricsComponent,
    PricingSectionComponent,
    FaqSectionComponent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.set({
      title: HOME_TITLE,
      description: HOME_DESC,
      canonicalPath: '/',
    });
    this.seo.setStructuredData('ld-software-application', SOFTWARE_JSON_LD);
  }

  ngOnDestroy(): void {
    // Product schema is homepage-only; drop it when routing away.
    this.seo.removeStructuredData('ld-software-application');
  }
}
