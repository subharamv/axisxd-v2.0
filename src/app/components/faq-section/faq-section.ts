import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SeoService } from '../../core/seo.service';

gsap.registerPlugin(ScrollTrigger);

interface Faq {
  q: string;
  a: string;
}

const FAQS: Faq[] = [
  {
    q: 'Which file formats can I upload?',
    a: 'IFC (2x3, 4 and 4x3), Revit, Navisworks NWD/NWC, DWG and DXF, ReCap RCP/RCS, E57, LAS/LAZ, PTS, PTX, XYZ, plus OBJ, FBX, glTF/GLB, PLY and STL. Files are read natively, so geometry and metadata survive the trip.',
  },
  {
    q: 'Do I need to convert or export my models first?',
    a: 'No. Upload the authoring file as it is and AxisXD handles tiling and indexing for you. Federated models keep their structure, so you can isolate a discipline or a level straight after processing.',
  },
  {
    q: 'How large a project can the viewer handle?',
    a: 'Point clouds in the billions of points and multi-gigabyte federated BIM models stream in the browser without a plugin. Data is streamed by level of detail, so only what is in view is fetched.',
  },
  {
    q: 'Can I compare a scan against the design model?',
    a: 'Yes. The Deviation Analyzer aligns reality capture against the BIM model and produces colour-coded deviation maps and tolerance reports, and clash detection runs across the federated model with BCF export.',
  },
  {
    q: 'Where is my data stored, and who can see it?',
    a: 'Projects are private to your organisation with role-based access per project. We offer regional hosting and, on enterprise plans, dedicated or on-premise infrastructure.',
  },
  {
    q: 'Does it integrate with the tools we already run?',
    a: 'There is a REST API and SDK for pulling models, issues and analysis results into your own dashboards, and IoT and SCADA feeds can be bound to elements for live monitoring.',
  },
];

@Component({
  selector: 'app-faq-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './faq-section.html',
  styleUrl: './faq-section.scss',
})
export class FaqSectionComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly faqs = FAQS;
  openIndex = 0;

  @ViewChild('sectionEl') sectionEl!: ElementRef<HTMLElement>;

  private ctx?: gsap.Context;
  private readonly seo = inject(SeoService);

  /**
   * FAQPage schema is emitted from the component rather than index.html so it
   * only ever accompanies a page that actually renders these questions.
   * Answers are collapsed behind an accordion, which Google explicitly allows
   * for FAQ rich results as long as the text is present in the DOM.
   */
  ngOnInit(): void {
    this.seo.setStructuredData('ld-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  toggle(i: number): void {
    this.openIndex = this.openIndex === i ? -1 : i;
  }

  ngAfterViewInit(): void {
    this.ctx = gsap.context(() => {
      gsap.from('.faq-head', {
        scrollTrigger: { trigger: '.faq-head', start: 'top 85%', once: true },
        opacity: 0,
        y: 32,
        duration: 0.8,
        ease: 'power3.out',
      });
      gsap.from('.faq-art', {
        scrollTrigger: { trigger: '.faq-art', start: 'top 85%', once: true },
        opacity: 0,
        x: -40,
        duration: 0.9,
        ease: 'power3.out',
      });
      gsap.from('.faq-row', {
        scrollTrigger: { trigger: '.faq-list', start: 'top 85%', once: true },
        opacity: 0,
        y: 18,
        duration: 0.6,
        stagger: 0.07,
        ease: 'power3.out',
      });
    }, this.sectionEl.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
    this.seo.removeStructuredData('ld-faq');
  }
}
