import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login').then((m) => m.LoginComponent),
    data: { hideFooter: true },
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/auth/signup/signup').then((m) => m.SignupComponent),
    data: { hideFooter: true },
  },
  {
    path: 'resources',
    loadComponent: () => import('./pages/resources/resources-section/resources-section').then((m) => m.ResourcesSectionComponent),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact-page/contact-page').then((m) => m.ContactPageComponent),
  },
  {
    path: 'webinars',
    loadComponent: () => import('./pages/webinars/webinars-section/webinars-section').then((m) => m.WebinarsSectionComponent),
  },
  {
    path: 'webinar/:id',
    loadComponent: () => import('./pages/webinars/webinar-detail-page/webinar-detail-page').then((m) => m.WebinarDetailPageComponent),
  },
  {
    path: 'blog/:id',
    loadComponent: () => import('./pages/blog/blog-detail-page/blog-detail-page').then((m) => m.BlogDetailPageComponent),
  },
  {
    path: 'whitepaper/:id',
    loadComponent: () => import('./pages/whitepaper/whitepaper-detail-page/whitepaper-detail-page').then((m) => m.WhitepaperDetailPageComponent),
  },
  {
    path: 'case-study/:id',
    loadComponent: () => import('./pages/case-study/case-study-detail-page/case-study-detail-page').then((m) => m.CaseStudyDetailPageComponent),
  },
  {
    path: 'viewer/ifc',
    loadComponent: () => import('./pages/viewer/ifc-viewer-page/ifc-viewer-page').then((m) => m.IfcViewerPageComponent),
  },
  {
    path: 'viewer/point-cloud',
    loadComponent: () => import('./pages/viewer/point-cloud-page/point-cloud-page').then((m) => m.PointCloudPageComponent),
  },
  {
    path: 'viewer/pano',
    loadComponent: () => import('./pages/viewer/pano-page/pano-page').then((m) => m.PanoPageComponent),
  },
  {
    path: 'viewer/cad',
    loadComponent: () => import('./pages/viewer/cad-page/cad-page').then((m) => m.CadPageComponent),
  },
  {
    path: 'viewer/mesh',
    loadComponent: () => import('./pages/viewer/mesh-page/mesh-page').then((m) => m.MeshPageComponent),
  },
  {
    path: 'viewer/digital-twin',
    loadComponent: () => import('./pages/viewer/digital-twin-page/digital-twin-page').then((m) => m.DigitalTwinPageComponent),
  },
  {
    path: 'analysis/deviation',
    loadComponent: () => import('./pages/analysis/deviation-page/deviation-page').then((m) => m.DeviationPageComponent),
  },
  {
    path: 'analysis/rol',
    loadComponent: () => import('./pages/analysis/rol-page/rol-page').then((m) => m.RolPageComponent),
  },
  {
    path: 'analysis/monitoring',
    loadComponent: () => import('./pages/analysis/monitoring-page/monitoring-page').then((m) => m.MonitoringPageComponent),
  },
  {
    path: 'analysis/clash',
    loadComponent: () => import('./pages/analysis/clash-page/clash-page').then((m) => m.ClashPageComponent),
  },
  {
    path: 'docs',
    loadComponent: () => import('./pages/docs/documentation-page/documentation-page').then((m) => m.DocumentationPageComponent),
    data: { hideFooter: true },
  },
  {
    path: 'faq',
    loadComponent: () => import('./pages/faq/faq-page/faq-page').then((m) => m.FaqPageComponent),
    data: { hideFooter: true },
  },
  {
    path: 'glossary',
    loadComponent: () => import('./pages/glossary/glossary-page/glossary-page').then((m) => m.GlossaryPageComponent),
    data: { hideFooter: true },
  },
  {
    path: 'partners',
    loadComponent: () => import('./pages/partners/partners-page/partners-page').then((m) => m.PartnersPageComponent),
  },
  {
    path: 'careers',
    loadComponent: () => import('./pages/careers/careers-page/careers-page').then((m) => m.CareersPageComponent),
  },
  {
    path: 'sitemap',
    loadComponent: () => import('./pages/sitemap/sitemap-page/sitemap-page').then((m) => m.SitemapPageComponent),
    data: { hideFooter: true },
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found-page/not-found-page').then((m) => m.NotFoundPageComponent),
    data: { hideFooter: true },
  },
];
