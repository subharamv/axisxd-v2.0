export interface CaseStudySection {
  id: string;
  heading: string;
  paragraphs: (string | string[])[];
  image?: string;
}

export interface ProjectInfo {
  projectName: string;
  location: string;
  completionDate: string;
  technologies: string[];
  services: string[];
  outcome: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface CaseStudyEntry {
  title: string;
  date: string;
  readTime: string;
  category: string;
  categoryColor: string;
  bannerImage: string;
  intro: string[];
  projectInfo: ProjectInfo;
  testimonial: Testimonial;
  sections: CaseStudySection[];
  summary: string;
}

export const CASE_STUDY_DATA: Record<string, CaseStudyEntry> = {
  'cs1': {
    title: 'Hudson Yards Complex: Digital Twin at Scale',
    date: '15 Mar 2025',
    readTime: '12 min read',
    category: 'BIM',
    categoryColor: 'indigo',
    bannerImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
    intro: [
      'AxisXD partnered with a global developer to deliver real-time construction monitoring across a 28-million-square-foot mixed-use project in Manhattan. The objective was to converge BIM, point clouds, and site imagery into a single digital twin for remote coordination and progress verification.',
      'This case study shows how immersive 3D workflows, multi-model clash detection, and automated milestone reporting reduced coordination friction while improving site-wide visibility for executive stakeholders.',
    ],
    projectInfo: {
      projectName: 'Hudson Yards Complex',
      location: 'New York City, USA',
      completionDate: 'Q4 2025',
      technologies: ['IFC Viewer', 'LiDAR Point Clouds', '360\u00b0 Panoramas', 'WebGL Streaming'],
      services: ['Progress Monitoring', 'Clash Detection', 'Deviation Analysis', 'Stakeholder Reporting'],
      outcome: 'Reduced coordination review time by 42% and ensured 98% of detected clashes were resolved before installation.',
    },
    testimonial: {
      quote: 'AxisXD gave our team a single source of truth for field progress and BIM coordination. The platform transformed weekly review meetings into action-oriented sessions with clear visual evidence.',
      author: 'Maya Patel',
      role: 'Head of Digital Delivery',
      company: 'Hudson Yards Development Group',
    },
    sections: [
      {
        id: 'technology-federation',
        heading: 'Federating Reality Capture with BIM',
        image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=900&q=80',
        paragraphs: [
          'The project combined IFC models from architecture, structure, and MEP disciplines with scheduled LiDAR scans and 360\u00b0 progress panoramas. AxisXD\u2019s browser-based viewer enabled stakeholders to review all data without installing desktop software.',
          [
            'IFC models were ingested with per-discipline version metadata and federated into a single coordinate-aligned digital twin.',
            'Weekly LiDAR scans were registered to the model and streamed as tiled point clouds for efficient review of as-built conditions.',
            '360\u00b0 panoramas were linked to spatial capture points so users could inspect exact field conditions behind the model.',
          ],
        ],
      },
      {
        id: 'clash-detection',
        heading: 'Web-Based Clash Detection Workflows',
        paragraphs: [
          'Clash detection was executed directly inside the case study viewer, allowing the project team to identify design and constructability conflicts early. The web workflow reduced reliance on desktop-only coordination tools while keeping progress visible to remote owners and contractors.',
          [
            'Structural vs MEP clashes were grouped by building zone and automatically assigned to discipline leads.',
            'False positives were suppressed through rule-based filters that excluded service penetrations under 20 mm clearance.',
            'Weekly reports surfaced only high-priority issues, reducing the volume of review items carried between coordination meetings.',
          ],
        ],
      },
      {
        id: 'timeline-inspection',
        heading: 'Timeline Inspection and Progress Validation',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=900&q=80',
        paragraphs: [
          'The digital twin timeline feature enabled the construction manager to compare model expectations against actual site progress from any week. This made it easy to validate completed work, identify delays, and create evidence-based status summaries for owners.',
          [
            'Completion snapshots were generated for every major milestone and tagged with contract schedule references.',
            'Deviation summaries were automatically calculated for finished slabs, core walls, and facade assemblies.',
            'Progress dashboards combined 3D model review with site imagery to create a compelling, audit-ready narrative.',
          ],
        ],
      },
    ],
    summary: 'The Hudson Yards digital twin implementation proved that large-scale construction projects can operate from a browser-first coordination environment. By combining federated BIM models, point clouds, and imagery with automated reporting, the project team reduced review cycles, supported faster decision-making, and maintained visibility across a complex build program.',
  },
  'cs2': {
    title: 'Scan-to-BIM: 45% Faster Project Delivery',
    date: '02 Mar 2025',
    readTime: '8 min read',
    category: 'POINT CLOUD',
    categoryColor: 'blue',
    bannerImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&q=80',
    intro: [
      'A UK contractor accelerated scan-to-BIM delivery by integrating automated point cloud processing with AxisXD\u2019s federated model environment. The project delivered client-ready BIM geometry in 6.5 weeks versus the previous 12-week baseline.',
      'This case study highlights the data pipeline, quality checks, and collaboration model that enabled a faster handover without compromising modeling standards.',
    ],
    projectInfo: {
      projectName: 'East London Retrofit',
      location: 'London, UK',
      completionDate: 'Q3 2025',
      technologies: ['Mobile SLAM', 'Cloud Processing', 'IfcOpenShell', 'WebGL Viewer'],
      services: ['Scan Registration', 'Automatic Classification', 'BIM Model Export', 'Quality Control'],
      outcome: 'Decreased modeling lead time by 45% and improved as-built validation confidence through automated QA checks.',
    },
    testimonial: {
      quote: 'The speed and accuracy of the scan-to-BIM workflow was transformative. We delivered a trusted BIM model in half the usual time without sacrificing QA.',
      author: 'James Morris',
      role: 'Lead Surveyor',
      company: 'UK Retrofit Solutions',
    },
    sections: [
      {
        id: 'automated-processing',
        heading: 'Automated Point Cloud Processing',
        paragraphs: [
          'The project used a cloud-native processing pipeline that automatically registered scans, removed noise, and classified key building elements. The result was a clean dataset ready for semi-automated BIM extraction.',
          [
            'Scan data was ingested from mobile SLAM and terrestrial scanners into a unified coordinate system.',
            'Machine learning classifiers separated walls, slabs, ceilings, and MEP runouts for downstream modeling.',
            'Automated QA checks flagged missing coverage and geometry anomalies before model export.',
          ],
        ],
      },
      {
        id: 'collaboration',
        heading: 'Collaboration Across Design and Survey Teams',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900&q=80',
        paragraphs: [
          'AxisXD provided a shared workspace where surveyors, BIM authors, and client stakeholders could review the same digital twin concurrently. This reduced rework from misinterpreted scan coverage and accelerated decisions on model acceptance.',
          [
            'Stakeholders accessed the project via browser links rather than downloading raw scan files.',
            'Annotations and quality comments were tracked by author and date within the viewer.',
            'Export packages were generated for Revit and Navisworks with the same version metadata as the source scans.',
          ],
        ],
      },
    ],
    summary: 'By coupling automated point cloud processing with a collaborative digital twin review environment, the project team shortened delivery cycles and produced a trusted as-built model with fewer manual handoffs. The workflow showed how scan-to-BIM can scale across retrofit projects without adding coordination overhead.',
  },
  'cs3': {
    title: 'Rights of Light Analysis: Urban Development Success',
    date: '18 Feb 2025',
    readTime: '10 min read',
    category: 'ROL',
    categoryColor: 'amber',
    bannerImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
    intro: [
      'A mid-rise residential development used AxisXD Rights of Light analysis to optimize massing and avoid costly redesigns. The project combined 3D city context with sun-path simulation to produce evidence-based design decisions.',
      'This case study shares the modeling approach, mitigation strategies, and stakeholder review process that delivered a stronger planning submission.',
    ],
    projectInfo: {
      projectName: 'Canary Wharf Residences',
      location: 'London, UK',
      completionDate: 'Q1 2026',
      technologies: ['ROL Simulation', 'City Context Mesh', 'Sun Path Analysis', '3D Viewer'],
      services: ['Sunlight Modeling', 'Design Feedback', 'Planning Support', 'Consultation Reporting'],
      outcome: 'Avoided a \u00a32.3M redesign by identifying the optimal facade orientation early and preserving neighbor daylight rights.',
    },
    testimonial: {
      quote: 'The Rights of Light workflow gave our planning team the confidence to recommend a better massing solution without delaying the application.',
      author: 'Amy Chen',
      role: 'Planning Director',
      company: 'Urban Growth Partners',
    },
    sections: [
      {
        id: 'context-modeling',
        heading: 'City Context and Sun Path Integration',
        paragraphs: [
          'The model imported surrounding buildings and public realm massing as a single contextual dataset. Sun position data was then sampled across the full year to compute sky factor values at adjacent windows.',
          [
            'Existing buildings were modelled from open municipal data and lidar-derived massing.',
            'Sun paths were computed at 5-minute intervals for key review dates.',
            'Results were visualized as color-coded sky factor maps and hourly shadow animations.',
          ],
        ],
      },
      {
        id: 'mitigation-strategy',
        heading: 'Design Mitigation and Review',
        paragraphs: [
          'The platform enabled rapid what-if analysis of setback, facade angling, and glazing strategies. Each option was re-simulated against the same baseline criteria so stakeholders could compare both daylight impact and floor area tradeoffs.',
          [
            'Upper-storey setbacks preserved the existing neighbor sky view while retaining maximum gross floor area.',
            'Angled facade surfaces redirected reflected light into key neighboring apertures.',
            'High-transmission glazing on affected elevations improved internal daylight without compromising privacy.',
          ],
        ],
      },
    ],
    summary: 'The Rights of Light case study demonstrates how an integrated digital twin workflow can convert complex daylight analysis into clear, executable design guidance. The result was a planning application backed by robust evidence and a reduced need for costly redesign iterations.',
  },
  'cs4': {
    title: 'Construction Site Reality Capture: 360\u00b0 Panorama vs LiDAR',
    date: '05 Feb 2025',
    readTime: '7 min read',
    category: 'MONITORING',
    categoryColor: 'blue',
    bannerImage: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=80',
    intro: [
      'A high-rise contractor used AxisXD to combine 360\u00b0 panorama capture and LiDAR scanning into a single monitoring workflow. The result was a 60% faster inspection cycle and clearer visual evidence for remote project stakeholders.',
      'This case study explains the strengths of each capture modality and how the digital twin platform made them easy to compare in one place.',
    ],
    projectInfo: {
      projectName: 'Skyline Tower Redevelopment',
      location: 'Toronto, Canada',
      completionDate: 'Q2 2026',
      technologies: ['360\u00b0 Capture', 'LiDAR Scanning', 'Timeline Comparison', 'Photo-Model Fusion'],
      services: ['Reality Capture', 'Progress Reporting', 'Inspection Workflows', 'Remote Collaboration'],
      outcome: 'Reduced on-site inspection time by 60% and provided stakeholders with trusted visual evidence for weekly progress reviews.',
    },
    testimonial: {
      quote: 'Having both panorama and LiDAR data in the same platform made field review simple. Our project team could validate completion and spot issues without a physical site visit.',
      author: 'Noah Singh',
      role: 'Construction Operations Manager',
      company: 'Toronto Redevelopment Co.',
    },
    sections: [
      {
        id: 'capture-strategy',
        heading: 'Capture Strategy for Mixed Reality Data',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80',
        paragraphs: [
          'The site used weekly 360\u00b0 panorama captures from fixed positions and monthly LiDAR scans for geometric verification. The platform aligned both datasets to the BIM model so progress could be reviewed visually and metrically.',
          [
            '360\u00b0 panoramas provided immersive visual context for finished finishes and temporary works.',
            'LiDAR scans delivered accurate geometry for slab and core wall verification.',
            'The platform linked panoramas to spatial capture points for immediate field reference.',
          ],
        ],
      },
      {
        id: 'remote-review',
        heading: 'Remote Review Workflows',
        paragraphs: [
          'Project stakeholders accessed the digital twin from anywhere, enabling weekly remote review meetings without travel. The browser-based experience kept the focus on evidence rather than document exchange.',
          [
            'Photo-based issue reports were created directly from panorama views.',
            'LiDAR-derived deviation summaries were used to validate structural completion percentages.',
            'Progress reports combined visual snapshots with BIM status markers for a single source of truth.',
          ],
        ],
      },
    ],
    summary: 'This case study highlights the power of combining 360\u00b0 panoramas and LiDAR in one digital twin workflow. Clients and project teams gained faster, more reliable progress insight while reducing on-site review time and improving decision confidence.',
  },
};

export const CASE_STUDY_LIST = Object.keys(CASE_STUDY_DATA);

export const TRENDING_CASE_STUDIES = [
  {
    id: 'cs1',
    title: 'Hudson Yards Complex: Digital Twin at Scale',
    category: 'BIM',
    categoryColor: 'indigo',
    date: '15 Mar 2025',
    readTime: '12 min read',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=60',
  },
  {
    id: 'cs2',
    title: 'Scan-to-BIM: 45% Faster Project Delivery',
    category: 'POINT CLOUD',
    categoryColor: 'blue',
    date: '02 Mar 2025',
    readTime: '8 min read',
    thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=60',
  },
  {
    id: 'cs3',
    title: 'Rights of Light Analysis: Urban Development Success',
    category: 'ROL',
    categoryColor: 'amber',
    date: '18 Feb 2025',
    readTime: '10 min read',
    thumbnail: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=60',
  },
];
