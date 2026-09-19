export interface WebinarListItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: string;
  status: 'upcoming' | 'on-demand';
  date: string;
  time: string;
  duration: string;
  speakers: string[];
  registrants: string;
  thumbnail: string;
  featured?: boolean;
}

export const WEBINARS: WebinarListItem[] = [
  {
    id: 'wb1',
    title: 'Digital Twin Deployment: From Scan to Insight in 48 Hours',
    excerpt: 'Learn how leading AEC firms compress their reality capture pipeline from weeks to days using automated workflows and cloud-native digital twin platforms.',
    category: 'DIGITAL TWIN',
    categoryColor: 'blue',
    status: 'upcoming',
    date: '15 Jul 2025',
    time: '2:00 PM EST',
    duration: '60 min',
    speakers: ['Sarah Chen', 'Marcus Rivera'],
    registrants: '1,240',
    thumbnail: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=80',
    featured: true,
  },
  {
    id: 'wb3',
    title: 'LiDAR at Scale: Managing Petabytes of Point Cloud Data',
    excerpt: 'Enterprise strategies for storing, processing, and streaming massive point cloud datasets across global engineering teams.',
    category: 'POINT CLOUD',
    categoryColor: 'blue',
    status: 'on-demand',
    date: '12 Jun 2025',
    time: '3:00 PM EST',
    duration: '55 min',
    speakers: ['David Park', 'Rachel Kim'],
    registrants: '2,100',
    thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80',
  },
  {
    id: 'wb2',
    title: 'IFC 4x3 and the Future of Open BIM Interoperability',
    excerpt: 'Deep dive into the latest IFC schema updates, compliance requirements, and how open standards are reshaping multi-disciplinary coordination.',
    category: 'BIM',
    categoryColor: 'indigo',
    status: 'upcoming',
    date: '22 Aug 2025',
    time: '11:00 AM EST',
    duration: '45 min',
    speakers: ['Dr. Elena Vasquez', 'James Whitfield'],
    registrants: '890',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
  },
  {
    id: 'wb4',
    title: 'Rights of Light: Digital Simulation for Urban Development',
    excerpt: 'How digital twin-powered sunlight analysis is transforming planning approvals and neighbor dispute resolution in dense urban environments.',
    category: 'ROL',
    categoryColor: 'amber',
    status: 'upcoming',
    date: '05 Sep 2025',
    time: '1:00 PM EST',
    duration: '50 min',
    speakers: ['Emma Lawson', 'Sarah Chen'],
    registrants: '670',
    thumbnail: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80',
  },
  {
    id: 'wb5',
    title: 'Construction Progress Monitoring with AI-Powered Analytics',
    excerpt: 'Explore how computer vision and digital twin timelines automate progress tracking and detect schedule deviations in real time.',
    category: 'MONITORING',
    categoryColor: 'blue',
    status: 'on-demand',
    date: '20 May 2025',
    time: '2:00 PM EST',
    duration: '50 min',
    speakers: ['Marcus Rivera', 'Dr. Anil Patel'],
    registrants: '3,400',
    thumbnail: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&q=80',
  },
];

export const CATEGORY_STYLES: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
  indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
};

export interface AgendaItem {
  time: string;
  title: string;
  speaker?: string;
  description?: string;
}

export interface WebinarSpeaker {
  name: string;
  role: string;
  company: string;
  avatar: string;
}

export interface WebinarSection {
  id: string;
  heading: string;
  paragraphs: (string | string[])[];
}

export interface WebinarEntry {
  title: string;
  subtitle: string;
  date: string;
  time: string;
  duration: string;
  status: 'upcoming' | 'on-demand' | 'live';
  category: string;
  categoryColor: string;
  heroImage: string;
  speakers: WebinarSpeaker[];
  agenda: AgendaItem[];
  sections: WebinarSection[];
  summary: string;
  registrants?: string;
}

export const WEBINAR_DATA: Record<string, WebinarEntry> = {
  'wb1': {
    title: 'Digital Twin Deployment: From Scan to Insight in 48 Hours',
    subtitle: 'Learn how leading AEC firms compress their reality capture pipeline from weeks to days using automated workflows and cloud-native digital twin platforms.',
    date: '15 Jul 2025',
    time: '2:00 PM EST',
    duration: '60 min',
    status: 'upcoming',
    category: 'DIGITAL TWIN',
    categoryColor: 'blue',
    heroImage: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=80',
    registrants: '1,240+',
    speakers: [
      {
        name: 'Sarah Chen',
        role: 'Head of Digital Engineering',
        company: 'AxisXD',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
      },
      {
        name: 'Marcus Rivera',
        role: 'BIM Director',
        company: 'Turner Construction',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
      },
    ],
    agenda: [
      { time: '2:00 PM', title: 'Welcome & Industry Landscape', speaker: 'Sarah Chen', description: 'Overview of digital twin adoption trends in AEC and the business case for rapid deployment.' },
      { time: '2:15 PM', title: 'The 48-Hour Pipeline', description: 'Step-by-step walkthrough of scan-to-twin automation using AxisXD\'s integrated workflow.' },
      { time: '2:40 PM', title: 'Live Demo: Real Project Walkthrough', speaker: 'Marcus Rivera', description: 'A live demonstration using a real construction site from LiDAR capture to actionable dashboard in real time.' },
      { time: '3:10 PM', title: 'Q&A Session', description: 'Open floor for audience questions with both speakers.' },
      { time: '3:20 PM', title: 'Wrap-Up & Next Steps', description: 'Resources, trial access, and how to start your own 48-hour deployment.' },
    ],
    sections: [
      {
        id: 'overview',
        heading: 'What You\'ll Learn',
        paragraphs: [
          'This webinar is designed for AEC professionals who want to accelerate their digital twin adoption without the months-long implementation timelines that have historically plagued the industry.',
          [
            'How to compress a full digital twin deployment from 3 months to 48 hours using automated processing pipelines.',
            'The role of cloud-native architecture in enabling real-time collaboration across distributed project teams.',
            'Best practices for LiDAR scan scheduling, registration, and classification that feed directly into BIM workflows.',
            'How browser-based 3D viewers eliminate the need for desktop software and enable stakeholder access from any device.',
          ],
          'Whether you\'re a BIM manager evaluating platform options, a project director looking to reduce site visits, or an IT lead tasked with deploying reality capture infrastructure, this session provides actionable insights you can apply immediately.',
        ],
      },
      {
        id: 'pipeline',
        heading: 'The 48-Hour Pipeline Explained',
        paragraphs: [
          'Traditional digital twin deployments require weeks of custom scripting, manual data processing, and IT infrastructure setup. The 48-hour pipeline eliminates these bottlenecks through three key innovations.',
          [
            'Automated ingestion: LiDAR scans, 360° panoramas, and IFC models are automatically processed upon upload, with no manual intervention required for standard formats.',
            'Zero-config CDE: The platform implements ISO 19650 information management workflows out of the box, including version control, access permissions, and audit logging.',
            'Streaming delivery: Octree-based 3D Tiles enable sub-second visual response, so stakeholders can begin exploring the digital twin within minutes of the first scan upload.',
          ],
          'The pipeline has been validated across 40+ enterprise deployments, with an average time-to-value of 36 hours from first scan to stakeholder-ready dashboard.',
        ],
      },
      {
        id: 'case-study',
        heading: 'Case Study: Hudson Yards Phase III',
        paragraphs: [
          'Turner Construction deployed the AxisXD platform for progress monitoring on a 2.8 million sqft mixed-use development. The project team needed real-time visibility into construction progress across 47 floors without the traditional site walk schedule.',
          [
            'Capture cadence: Weekly 360° panoramas from 12 fixed positions, monthly LiDAR scans of active floors.',
            'Processing time: From scan completion to dashboard-ready visualization: under 2 hours average.',
            'Stakeholder adoption: 89% of project team members accessed the digital twin at least once per week within the first month.',
            'Outcome: 34% reduction in routine site visits, early detection of 12 coordination issues that would have cost $1.2M in rework.',
          ],
          'This case study demonstrates that the 48-hour pipeline is not a theoretical capability but a proven workflow that delivers measurable ROI from day one.',
        ],
      },
    ],
    summary: 'Digital twin deployment no longer needs to be a months-long, budget-consuming initiative. With automated processing pipelines, cloud-native architecture, and zero-config information management, AEC teams can go from first scan to actionable insight in 48 hours. This webinar provides the playbook for making it happen.',
  },
  'wb2': {
    title: 'IFC 4x3 and the Future of Open BIM Interoperability',
    subtitle: 'Deep dive into the latest IFC schema updates, compliance requirements, and how open standards are reshaping multi-disciplinary coordination.',
    date: '22 Aug 2025',
    time: '11:00 AM EST',
    duration: '45 min',
    status: 'upcoming',
    category: 'BIM',
    categoryColor: 'indigo',
    heroImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
    registrants: '890+',
    speakers: [
      {
        name: 'Dr. Elena Vasquez',
        role: 'Chief Standards Officer',
        company: 'buildingSMART International',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
      },
      {
        name: 'James Whitfield',
        role: 'BIM Compliance Lead',
        company: 'AxisXD',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
      },
    ],
    agenda: [
      { time: '11:00 AM', title: 'IFC Schema Evolution', speaker: 'Dr. Elena Vasquez', description: 'From IFC2x3 to IFC4x3 Add2: what changed and why it matters for infrastructure projects.' },
      { time: '11:15 AM', title: 'Compliance in Practice', speaker: 'James Whitfield', description: 'Real-world validation workflows and common compliance pitfalls.' },
      { time: '11:35 AM', title: 'Platform Integration Demo', description: 'How AxisXD handles IFC4x3 imports with full schema fidelity.' },
      { time: '11:50 AM', title: 'Q&A and Closing', description: 'Audience questions and upcoming standards roadmap.' },
    ],
    sections: [
      {
        id: 'ifc-evolution',
        heading: 'The Evolution of IFC Standards',
        paragraphs: [
          'IFC has been the backbone of open BIM interoperability since buildingSMART International first published the standard in 1996. Three decades later, IFC4x3 represents the most significant leap in the schema\'s history, extending BIM data exchange beyond buildings into infrastructure, rail, and road projects.',
          [
            'IFC2x3: The legacy standard that established the core spatial decomposition and building element hierarchy.',
            'IFC4: Introduced mesh-based geometry, property set templates, and alignment-based infrastructure support.',
            'IFC4x3: Adds native support for railways, roads, bridges, and ports with dedicated entity types and classification mappings.',
            'IFC4x3 Add2: The current production release with bug fixes and expanded property set definitions for MEP systems.',
          ],
          'Understanding these evolution stages is essential for organizations that maintain multi-version IFC pipelines or need to support legacy project data alongside modern schemas.',
        ],
      },
      {
        id: 'compliance-practice',
        heading: 'Compliance Validation in Practice',
        paragraphs: [
          'Schema compliance is not binary: it exists on a spectrum from basic geometric validity to full semantic richness. This session explores a tiered compliance framework that helps teams prioritise validation efforts.',
          [
            'Tier 1: Geometric validity: All elements carry valid IfcShapeRepresentation with consistent coordinate systems.',
            'Tier 2: Spatial hierarchy: Proper IfcProject > IfcSite > IfcBuilding > IfcBuildingStorey decomposition chain.',
            'Tier 3: Property completeness: Standard property sets (Pset_*) assigned with correct data types and units.',
            'Tier 4: Semantic richness: Classification codes, material associations, and system relationships fully populated.',
          ],
          'The AxisXD validation engine checks all four tiers automatically upon IFC import, generating a compliance score and detailed issue report that guides authoring teams toward full compliance.',
        ],
      },
    ],
    summary: 'IFC4x3 marks a transformative step for open BIM interoperability, extending beyond buildings into infrastructure. By implementing tiered compliance validation and staying current with schema evolution, AEC organizations can ensure their digital twins maintain data fidelity across multi-disciplinary, multi-version workflows.',
  },
  'wb3': {
    title: 'LiDAR at Scale: Managing Petabytes of Point Cloud Data',
    subtitle: 'Enterprise strategies for storing, processing, and streaming massive point cloud datasets across global engineering teams.',
    date: '12 Jun 2025',
    time: '3:00 PM EST',
    duration: '55 min',
    status: 'on-demand',
    category: 'POINT CLOUD',
    categoryColor: 'blue',
    heroImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&q=80',
    registrants: '2,100+',
    speakers: [
      {
        name: 'David Park',
        role: 'VP of Engineering',
        company: 'AxisXD',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
      },
      {
        name: 'Rachel Kim',
        role: 'Geospatial Solutions Architect',
        company: 'Leica Geosystems',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80',
      },
    ],
    agenda: [
      { time: '3:00 PM', title: 'The Scale Challenge', speaker: 'David Park', description: 'Why traditional file-based point cloud storage breaks down at enterprise scale.' },
      { time: '3:15 PM', title: 'Cloud-Native Architecture', description: 'Octree streaming, delta compression, and tiered storage strategies.' },
      { time: '3:35 PM', title: 'Hardware & Scanner Integration', speaker: 'Rachel Kim', description: 'Best practices for scanner selection, capture scheduling, and automated processing.' },
      { time: '3:50 PM', title: 'Enterprise Deployment Patterns', description: 'Lessons learned from 40+ enterprise deployments managing 500TB+ of point cloud data.' },
      { time: '4:00 PM', title: 'Q&A', description: 'Open discussion with audience.' },
    ],
    sections: [
      {
        id: 'scale-problem',
        heading: 'The Enterprise Scale Problem',
        paragraphs: [
          'A single terrestrial LiDAR scan generates approximately 200 million points and 1-2 GB of raw data. A typical large construction project accumulates 50-200 scans over its lifecycle, producing 50-400 GB of data per project. For organizations managing dozens of concurrent projects, the total data volume quickly reaches terabyte scale.',
          [
            'Storage growth: Point cloud data volumes double every 18 months as scanner resolution increases and capture cadence accelerates.',
            'Processing bottleneck: Manual registration and classification of a single scan takes 2-4 hours without automation.',
            'Access latency: Downloading a 2 GB E57 file over a standard connection takes 10+ minutes, making interactive review impractical.',
            'Version sprawl: Weekly scans over a 12-month project create 52 versions per scan position, each requiring storage and metadata management.',
          ],
          'These challenges are not theoretical: they are the daily reality for geospatial teams at enterprise AEC firms. Solving them requires a fundamentally different approach to data management.',
        ],
      },
      {
        id: 'streaming-architecture',
        heading: 'Octree Streaming and Progressive Loading',
        paragraphs: [
          'The key innovation that makes petabyte-scale point cloud management practical is octree-based streaming. Rather than loading an entire point cloud into memory, the data is hierarchically partitioned into tiles that are loaded on demand based on the viewer\'s viewport and zoom level.',
          [
            'LOD hierarchy: The octree partitions space into progressively smaller cubes, with each level containing 8x more points at 2x finer resolution.',
            'Viewport culling: Only tiles visible in the current camera frustum are loaded, reducing initial load to 50-200 MB regardless of total dataset size.',
            'Progressive refinement: Low-resolution representation appears in under 2 seconds; full resolution streams in the background over 10-30 seconds.',
            'Client-side caching: WebGL-rendered tiles are cached in GPU memory for instant re-rendering during navigation.',
          ],
          'AxisXD\'s streaming engine achieves 30+ FPS on mid-range hardware with point clouds exceeding 1 billion points, making interactive exploration of massive datasets a practical reality.',
        ],
      },
    ],
    summary: 'Managing point cloud data at enterprise scale requires cloud-native architecture with octree-based streaming, automated processing pipelines, and intelligent tiered storage. Organizations that invest in these capabilities can transform point cloud data from a storage burden into a collaborative asset that accelerates BIM coordination and construction monitoring.',
  },
  'wb4': {
    title: 'Rights of Light: Digital Simulation for Urban Development',
    subtitle: 'How digital twin-powered sunlight analysis is transforming planning approvals and neighbor dispute resolution in dense urban environments.',
    date: '05 Sep 2025',
    time: '1:00 PM EST',
    duration: '50 min',
    status: 'upcoming',
    category: 'ROL',
    categoryColor: 'amber',
    heroImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
    registrants: '670+',
    speakers: [
      {
        name: 'Emma Lawson',
        role: 'Urban Planning Specialist',
        company: 'Arup',
        avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80',
      },
      {
        name: 'Sarah Chen',
        role: 'Head of Digital Engineering',
        company: 'AxisXD',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
      },
    ],
    agenda: [
      { time: '1:00 PM', title: 'The ROL Landscape', speaker: 'Emma Lawson', description: 'Legal frameworks, planning requirements, and the growing complexity of daylight rights in urban development.' },
      { time: '1:20 PM', title: 'Digital Twin Approach', speaker: 'Sarah Chen', description: 'How 3D city models and ray tracing simulations replace manual sun-path diagrams.' },
      { time: '1:40 PM', title: 'Live Demo', description: 'Real-time ROL simulation using AxisXD\'s digital twin platform.' },
      { time: '1:55 PM', title: 'Q&A and Wrap-Up', description: 'Audience questions and practical next steps.' },
    ],
    sections: [
      {
        id: 'rol-landscape',
        heading: 'Understanding Rights of Light',
        paragraphs: [
          'Rights of light is a legal principle that grants property owners the right to receive sufficient daylight through defined apertures. In many jurisdictions, 20 years of uninterrupted daylight access creates a prescriptive right that cannot be easily overridden by new development.',
          [
            'The Prescription Act 1832 (UK) and Rights of Light Act 1959 established the legal foundation for daylight rights.',
            'Modern planning authorities increasingly require quantitative daylight impact assessments as part of planning applications.',
            'The standard test evaluates whether a proposed development reduces the sky factor below 0.8% at any neighboring window (the Waldram criterion).',
            'Digital twin simulations provide the temporal granularity needed to demonstrate compliance across all 365 days of the year.',
          ],
          'The complexity of ROL analysis in dense urban environments has made manual sun-path diagrams insufficient. Modern developments require simulation tools that can model hundreds of neighboring windows across multiple building facades simultaneously.',
        ],
      },
      {
        id: 'digital-simulation',
        heading: 'Digital Twin-Powered ROL Simulation',
        paragraphs: [
          'Digital twin technology transforms ROL analysis from a reactive legal exercise into a proactive design tool. By combining accurate 3D city models with real sun-path data, project teams can evaluate daylight impact during the earliest design stages.',
          [
            'City context modeling: Import surrounding buildings from municipal open data as 3D massing models with accurate facade geometry.',
            'Solar database integration: Connect to ephemeris data for the specific latitude, computing sun position at 5-minute intervals across all 365 days.',
            'Ray tracing engine: Compute sky factor values at each neighboring window using Monte Carlo ray tracing with 100,000+ rays per aperture.',
            'Mitigation analysis: Test building setback variations, facade angling, and glazing specifications in hours rather than weeks.',
          ],
          'Each simulation variant is automatically re-evaluated against the same baseline criteria, producing a ranked comparison of ROL impact reduction versus floor area loss.',
        ],
      },
    ],
    summary: 'Digital twin technology elevates rights of light analysis from a reactive legal exercise into a proactive design tool. By simulating sunlight access across every day of the year with ray-traced precision, project teams can identify potential conflicts early, explore mitigation options interactively, and submit planning applications with robust, defensible evidence.',
  },
  'wb5': {
    title: 'Construction Progress Monitoring with AI-Powered Analytics',
    subtitle: 'Explore how computer vision and digital twin timelines automate progress tracking and detect schedule deviations in real time.',
    date: '20 May 2025',
    time: '2:00 PM EST',
    duration: '50 min',
    status: 'on-demand',
    category: 'MONITORING',
    categoryColor: 'blue',
    heroImage: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200&q=80',
    registrants: '3,400+',
    speakers: [
      {
        name: 'Marcus Rivera',
        role: 'BIM Director',
        company: 'Turner Construction',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
      },
      {
        name: 'Dr. Anil Patel',
        role: 'AI Research Lead',
        company: 'AxisXD',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80',
      },
    ],
    agenda: [
      { time: '2:00 PM', title: 'The Monitoring Gap', speaker: 'Marcus Rivera', description: 'Why traditional progress tracking fails and the cost of schedule blindness.' },
      { time: '2:15 PM', title: 'AI-Powered Detection', speaker: 'Dr. Anil Patel', description: 'Computer vision techniques for automated element recognition and progress quantification.' },
      { time: '2:35 PM', title: 'Timeline Comparison Demo', description: 'Live walkthrough of digital twin timeline scrubbing and deviation alerts.' },
      { time: '2:50 PM', title: 'ROI and Adoption', description: 'Measuring the business impact of automated monitoring and getting stakeholder buy-in.' },
      { time: '3:00 PM', title: 'Q&A', description: 'Open discussion.' },
    ],
    sections: [
      {
        id: 'monitoring-gap',
        heading: 'The Construction Monitoring Gap',
        paragraphs: [
          'The construction industry loses an estimated $1.6 trillion annually to project delays and rework. A significant portion of these losses stems from a fundamental information gap: project teams lack timely, objective visibility into what has actually been built versus what was planned.',
          [
            'Manual site walks are subjective, infrequent, and provide no historical comparison.',
            'Contractor progress reports are self-assessed and often lack photographic evidence.',
            'Schedule updates lag reality by 2-4 weeks in most projects.',
            'Disputes over claimed versus actual progress consume significant management overhead.',
          ],
          'Digital twin monitoring addresses this gap by providing objective, time-stamped visual evidence of construction progress that can be compared against the BIM model and project schedule in real time.',
        ],
      },
      {
        id: 'ai-detection',
        heading: 'AI-Powered Progress Detection',
        paragraphs: [
          'Computer vision algorithms trained on construction site imagery can automatically identify building elements, measure completion percentages, and detect deviations from the planned schedule without manual intervention.',
          [
            'Element recognition: CNN-based classifiers identify walls, slabs, columns, MEP installations, and facade elements from site photographs and 360° panoramas.',
            'Completion quantification: Semantic segmentation algorithms measure the percentage of each element that has been built, compared against the BIM model.',
            'Deviation alerts: Automated comparison between captured progress and scheduled milestones triggers alerts when actual progress falls behind plan.',
            'Trend analysis: Historical data enables predictive analytics that forecast completion dates based on observed progress rates.',
          ],
          'The AxisXD monitoring platform combines these AI capabilities with digital twin timeline comparison, giving project teams both automated detection and intuitive visual verification in a single interface.',
        ],
      },
    ],
    summary: 'AI-powered construction monitoring transforms progress tracking from a subjective, manual exercise into an objective, automated process. By combining computer vision with digital twin timelines, project teams can detect schedule deviations in real time, validate contractor claims with photographic evidence, and maintain stakeholder alignment throughout the project lifecycle.',
  },
};

export const WB_LIST = Object.keys(WEBINAR_DATA);

export interface RelatedWebinar {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  date: string;
  status: 'upcoming' | 'on-demand';
  thumbnail: string;
}

export const RELATED_WEBINARS: RelatedWebinar[] = [
  {
    id: 'wb2',
    title: 'IFC 4x3 and the Future of Open BIM Interoperability',
    category: 'BIM',
    categoryColor: 'indigo',
    date: '22 Aug 2025',
    status: 'upcoming',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=60',
  },
  {
    id: 'wb3',
    title: 'LiDAR at Scale: Managing Petabytes of Point Cloud Data',
    category: 'POINT CLOUD',
    categoryColor: 'blue',
    date: '12 Jun 2025',
    status: 'on-demand',
    thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=60',
  },
  {
    id: 'wb5',
    title: 'Construction Progress Monitoring with AI-Powered Analytics',
    category: 'MONITORING',
    categoryColor: 'blue',
    date: '20 May 2025',
    status: 'on-demand',
    thumbnail: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&q=60',
  },
];

export const STATUS_STYLES: Record<string, string> = {
  upcoming: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
  'on-demand': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
  live: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
};
