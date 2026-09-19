export interface BlogSection {
  id: string;
  heading: string;
  paragraphs: (string | string[])[];
  image?: string;
}

export interface BlogEntry {
  title: string;
  date: string;
  readTime: string;
  category: string;
  categoryColor: string;
  bannerImage: string;
  intro: string[];
  sections: BlogSection[];
  summary: string;
}

export const TRENDING_ENTRIES = ['b1', 'b5', 'b3'];

export const BLOG_DATA: Record<string, BlogEntry> = {
  'b1': {
    title: 'IFC Viewers You Should Try Today',
    date: '12 Feb 2025',
    readTime: '5 min read',
    category: 'DXF / 2D',
    categoryColor: 'blue',
    bannerImage: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=80',
    intro: [
      'The Industry Foundation Classes (IFC) format has become the universal language of BIM interoperability, yet finding a viewer that balances performance, feature depth, and cross-platform support remains a challenge. With the rapid evolution of WebAssembly and WebGL, browser-based IFC viewers now rival their desktop counterparts in capability.',
      'This guide evaluates the top IFC viewer tools available in 2025, with a focus on free and open-source options that integrate seamlessly into digital twin and BIM workflows.',
    ],
    sections: [
      {
        id: 'open-source-contenders',
        heading: 'Open-Source Contenders',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80',
        paragraphs: [
          'The open-source ecosystem for IFC viewing has matured significantly. BIMsurfer, powered by Three.js, offers lightweight WebGL rendering suitable for quick model inspection. Its plugin architecture allows custom extensions for clash detection and quantity takeoffs, though the documentation remains sparse for advanced use cases.',
          'IfcOpenShell serves as the backbone for many Python-based IFC pipelines, offering robust IFC2X3 and IFC4 support. Its viewer component, IfcClash, provides basic navigation and element selection. The real strength lies in the Python API for automated model analysis and validation workflows.',
          [
            'BIMsurfer: Best for lightweight WebGL embedding in dashboards and web apps.',
            'IfcOpenShell + IfcClash: Ideal for Python-centric BIM automation pipelines.',
            'That Open Company Platform: Full-stack IFC collaboration suite with built-in viewer.',
          ],
        ],
      },
      {
        id: 'commercial-solutions',
        heading: 'Commercial Solutions Worth the Investment',
        paragraphs: [
          'For enterprise teams requiring certified IFC export validation and advanced measurement tools, commercial viewers offer significant advantages. Solibri Office remains the gold standard for IFC model checking, offering rule-based validation against over 1,000 pre-configured checks. Its viewer supports section planes, clash detection, and automated reporting out of the box.',
          'Trimble Connect provides a cloud-based viewing experience with tight integration to Tekla Structures. Its IFC viewer supports large model streaming via level-of-detail optimization, making it suitable for projects exceeding 500 MB. Real-time collaboration features allow distributed teams to mark up models simultaneously.',
          'The AxisXD IFC Viewer offers a free, browser-based alternative that loads IFC files directly without installation, supports multi-model overlay, and integrates with point cloud and panorama data for a complete digital twin experience.',
        ],
      },
      {
        id: 'browser-performance',
        heading: 'Browser-Based Performance Benchmarks',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80',
        paragraphs: [
          'Modern IFC viewers leverage WebGL 2.0 and WebAssembly to achieve desktop-class rendering performance. In benchmark testing across a 150 MB IFC model with 2.3 million elements, browser-based viewers achieved 30+ FPS on mid-range hardware, with full model load times under 12 seconds via progressive streaming.',
          'IndexedDB caching reduces repeat load times by up to 80%, and Web Workers enable background parsing of IFC-SPF files without blocking the UI thread. The key limitation remains memory: browsers cap tab memory at approximately 4 GB on 64-bit systems, which can constrain models exceeding 500 MB.',
        ],
      },
    ],
    summary: 'Whether you choose open-source tools for maximum flexibility or commercial solutions for certified workflows, the IFC viewer landscape in 2025 offers powerful options at every price point. The trend toward browser-based, WebGPU-accelerated viewers suggests that installation-free IFC inspection will soon become the norm across the AEC industry.',
  },
  'b2': {
    title: 'Point Cloud Processing for Scan-to-BIM Workflows',
    date: '28 Jan 2025',
    readTime: '8 min read',
    category: 'POINT CLOUD',
    categoryColor: 'blue',
    bannerImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&q=80',
    intro: [
      'High-density LiDAR scanning has revolutionized how existing conditions are captured for renovation, retrofit, and digital twin projects. A single scan can generate millions of points per second, producing datasets that capture every beam, pipe, and surface with millimetre precision.',
      'Translating these dense point clouds into intelligent BIM geometry through the scan-to-BIM pipeline requires careful processing, registration, classification, and modeling. This article walks through the end-to-end workflow using modern tools and best practices.',
    ],
    sections: [
      {
        id: 'acquisition-planning',
        heading: 'Acquisition Planning for Scan Quality',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=900&q=80',
        paragraphs: [
          'The quality of a scan-to-BIM outcome is determined long before any modeling begins. Proper acquisition planning ensures adequate point density, overlap, and coverage across all target surfaces. Key parameters include scanner resolution, scan spacing, and target placement for registration.',
          [
            'Scanner resolution: Set to 1/4 or 1/8 for typical architectural capture, producing 6-12 mm point spacing at 10 m range.',
            'Scan spacing: Maintain 60-70% overlap between adjacent scans for robust cloud-to-cloud registration.',
            'Target density: Place spherical or checkerboard targets every 15-20 m in complex environments.',
            'Color capture: Integrated HDR cameras add visual context that accelerates later classification and modeling.',
          ],
        ],
      },
      {
        id: 'registration-classification',
        heading: 'Registration and Classification',
        paragraphs: [
          'Raw scan data must be registered into a unified coordinate system before meaningful extraction can begin. Cloud-to-cloud registration using iterative closest point (ICP) algorithms achieves typical accuracies of 2-6 mm when scan overlap exceeds 50%. Target-based registration delivers sub-millimetre accuracy for projects demanding the highest fidelity.',
          'Classification separates the unified point cloud into semantic categories: ground, vegetation, buildings, structural elements, MEP systems, and noise. Machine learning classifiers trained on labeled datasets achieve 85-92% accuracy on typical construction site scans, dramatically reducing manual cleanup time.',
        ],
      },
      {
        id: 'bim-modeling',
        heading: 'From Points to Parametric BIM Objects',
        image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=900&q=80',
        paragraphs: [
          'The final and most labor-intensive stage is modeling intelligent BIM elements from the classified point cloud. Modern tools like EdgeWise, ClearEdge3D, and Revit\'s point cloud engine provide semi-automated extraction of planar walls, cylindrical pipes, and structural steel sections.',
          [
            'Walls and slabs: Automatic planar extraction with thickness detection, typically recovering 90% of major structural surfaces.',
            'Pipes and conduits: Cylinder fitting algorithms for MEP runs, with diameter and routing extracted automatically.',
            'Structural steel: I-beam, channel, and angle profile matching against standard section libraries.',
            'Ceiling grids: Pattern detection for suspended ceiling systems including tiles and lighting layouts.',
          ],
          'Despite automation advances, skilled modelers remain essential for interpreting noisy data, resolving occluded areas, and verifying extracted geometry against site observations. A typical 10,000 m² commercial floor requires 40-60 hours of modeling effort after scan processing.',
        ],
      },
    ],
    summary: 'Point cloud processing for scan-to-BIM has matured from a niche specialty into a standard construction workflow. With modern acquisition planning, automated classification, and semi-automated modeling tools, project teams can achieve BIM models with 95%+ geometric accuracy at a fraction of the cost of manual survey methods. The key to success remains disciplined acquisition planning and skilled modeling oversight.',
  },
  'b3': {
    title: 'Rights of Light Analysis: A Digital Twin Approach',
    date: '15 Jan 2025',
    readTime: '6 min read',
    category: 'ROL',
    categoryColor: 'amber',
    bannerImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
    intro: [
      'Rights of light (ROL) analysis is a critical consideration in urban development, determining how proposed buildings will affect daylight access for neighboring properties. Traditional ROL assessments rely on manual sun-path diagrams and simplified 2D shadow projections, which can miss complex interactions in dense city environments.',
      'Digital twin platforms offer a transformative alternative: combining accurate 3D city models, real sun-path data, and temporal simulation to produce comprehensive daylight and shadow impact assessments that satisfy both planning requirements and legal due diligence.',
    ],
    sections: [
      {
        id: 'legal-context',
        heading: 'The Legal Framework for Rights of Light',
        paragraphs: [
          'In many jurisdictions, neighbors are entitled to receive sufficient daylight through defined apertures (windows, skylights). The Prescription Act 1832 (UK) and the Rights of Light Act 1959 established the principle that 20 years of uninterrupted daylight access creates a legal right. Similar frameworks exist across Europe, North America, and Asia-Pacific markets.',
          'Modern ROL assessments must demonstrate compliance with both statutory minima and local planning policies. The standard test evaluates whether a proposed development reduces daylight below 0.8% of the sky factor (the Waldram criterion) at any neighboring window. Digital twin simulations provide the granular temporal analysis needed to prove compliance rigorously.',
        ],
      },
      {
        id: 'simulation-methodology',
        heading: 'Simulation Methodology with Digital Twins',
        image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=80',
        paragraphs: [
          'Digital twin-based ROL simulation follows a structured methodology that begins with importing the existing city context as a 3D mesh or IFC model. LiDAR-derived building footprints provide accurate massing, while photogrammetry captures facade details that affect light reflection and diffusion.',
          [
            'Context modeling: Import surrounding buildings from Ordnance Survey or municipal open data as 3D massing models.',
            'Solar database: Connect to ephemeris data for the specific latitude, computing sun position at 5-minute intervals across all 365 days.',
            'Ray tracing: Compute sky factor values at each neighboring window using Monte Carlo ray tracing with 100,000+ rays per aperture.',
            'Shadow animation: Generate time-lapse shadow casting across the full year to visualize seasonal variation.',
          ],
          'Results are presented as color-coded sky factor maps, annual sunlight exposure profiles, and compliance matrices against local planning thresholds.',
        ],
      },
      {
        id: 'mitigation-strategies',
        heading: 'Mitigation Strategies for ROL Conflicts',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80',
        paragraphs: [
          'When simulation reveals potential ROL infringements, digital twin tools enable rapid what-if analysis of mitigation strategies. Design teams can test multiple building massing variations, facade treatments, and orientation changes within hours rather than weeks.',
          [
            'Building setback: Increase upper-storey setbacks to preserve sky visibility for neighbors.',
            'Facade angling: Tilt or facet building surfaces to redirect reflected light downward into neighboring apertures.',
            'Glazing specification: Use high-transmission glass on affected elevations to maximize internal daylight penetration.',
            'Roof profile: Step back upper floors in a terraced configuration, a proven strategy for reducing overshadowing.',
          ],
          'Each mitigation option is automatically re-simulated against the same baseline criteria, producing a ranked comparison of ROL impact reduction versus floor area loss, enabling informed cost-benefit decisions.',
        ],
      },
    ],
    summary: 'Digital twin technology elevates rights of light analysis from a reactive legal exercise into a proactive design tool. By simulating sunlight access across every day of the year with raytraced precision, project teams can identify potential conflicts early, explore mitigation options interactively, and submit planning applications with robust, defensible evidence. The result is faster approvals, fewer neighbor objections, and better urban outcomes.',
  },
  'b4': {
    title: 'Clash Detection Best Practices in Modern BIM',
    date: '03 Jan 2025',
    readTime: '7 min read',
    category: 'BIM',
    categoryColor: 'indigo',
    bannerImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
    intro: [
      'Clash detection is the single most valuable quality assurance process in BIM-coordinated projects. Identifying and resolving conflicts between architectural, structural, and MEP elements before they reach the construction site saves millions in rework, delays, and material waste.',
      'Modern BIM platforms aggregate federated models from multiple disciplines, then run automated clash detection algorithms that flag hard clashes (geometric intersection), soft clashes (insufficient clearance), and workflow clashes (sequencing conflicts). This article distils proven best practices from enterprise BIM deployments.',
    ],
    sections: [
      {
        id: 'clash-types-matrix',
        heading: 'Understanding the Clash Type Matrix',
        paragraphs: [
          'Effective clash detection begins with defining which types of clashes matter at each project stage. Not all intersections require resolution; some represent intentional penetrations or constructability allowances. A clash matrix codifies these rules discipline by discipline.',
          [
            'Hard clash: Geometric intersection between two solid elements. Example: a duct passing through a steel beam.',
            'Soft clash: Insufficient clearance for access, insulation, or maintenance. Example: 50 mm clearance between pipe and structural slab when 150 mm is required.',
            'Workflow clash: Temporal sequencing issues. Example: a wall scheduled to be built before its reinforcing steel is installed.',
            'Duplicate clash: Two model elements occupying the same space representing the same physical object.',
          ],
          'The matrix assigns severity levels (critical, major, minor, advisory) and resolution deadlines linked to project milestones. Critical clashes must be resolved before design freeze; minor clashes may carry forward to the shop drawing phase.',
        ],
      },
      {
        id: 'automated-workflows',
        heading: 'Automated Detection Workflows',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80',
        paragraphs: [
          'Federated model platforms such as Navisworks, Solibri, and Revit Model Review support batch clash detection across thousands of element pairs. The key to efficient processing is setting appropriate tolerances: structural-to-structural clashes typically use 25 mm tolerance, while MEP-to-structural tolerances range from 50-150 mm depending on pipe diameter.',
          'AxisXD\'s multi-model viewer extends this capability to the web, enabling browser-based clash detection across IFC models without dedicated desktop software. Federated model upload supports real-time clash grouping by floor, zone, and trade, with automated issue creation in connected project management tools.',
          'Rules-based filtering eliminates false positives automatically. For example, clashes involving electrical conduits smaller than 20 mm diameter can be suppressed as non-critical, while any clash involving fire protection sprinkler mains is automatically escalated.',
        ],
      },
      {
        id: 'collaboration-cycle',
        heading: 'The Clash Resolution Collaboration Cycle',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80',
        paragraphs: [
          'Detection is only the beginning: the real value comes from structured resolution. Best-practice organizations follow a weekly clash review cycle that aligns with the design team\'s regular coordination meetings.',
          [
            'Monday: Automated clash detection runs overnight on the latest federated model.',
            'Tuesday: Clash coordinator reviews results, assigns to discipline leads, and sets priority.',
            'Wednesday: Discipline leads resolve clashes or document acceptance with annotations.',
            'Thursday: Resolved clashes are verified against updated individual models.',
            'Friday: Weekly clash report generated with trend analysis (new vs. closed vs. carryover).',
          ],
          'This cadence keeps clash counts manageable and prevents the common problem of thousands of unchecked clashes accumulating as the design progresses. Projects following this cycle typically maintain fewer than 200 open clashes per discipline.',
        ],
      },
    ],
    summary: 'Clash detection is not a one-time event but an ongoing design quality process. By establishing a clear clash type matrix, leveraging automated web-based detection tools, and maintaining a structured weekly resolution cycle, project teams can deliver coordinated BIM models that translate directly to conflict-free construction. The investment in process discipline pays for itself many times over in reduced RFIs, change orders, and site delays.',
  },
  'b5': {
    title: '360° Photogrammetry vs LiDAR: Which to Choose?',
    date: '20 Dec 2024',
    readTime: '5 min read',
    category: 'PANO',
    categoryColor: 'blue',
    bannerImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
    intro: [
      'Reality capture teams face a fundamental choice between two technologies: 360° photogrammetry and LiDAR scanning. Each approach has passionate advocates, and the optimal choice depends on project requirements for accuracy, speed, cost, and deliverable type.',
      'This comparison draws on real-world benchmarks from construction sites, heritage documentation, and infrastructure projects to help teams make informed technology decisions based on quantitative performance data rather than vendor marketing claims.',
    ],
    sections: [
      {
        id: 'accuracy-comparison',
        heading: 'Accuracy and Point Density Comparison',
        image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=900&q=80',
        paragraphs: [
          'LiDAR scanning delivers intrinsic range accuracy of 1-3 mm at distances up to 130 m, with point densities exceeding 1 million points per second. The raw data requires minimal post-processing; scan registration produces a metrically accurate point cloud directly, with accumulated error typically below 6 mm on a 10-scan registration chain.',
          'Photogrammetry, by contrast, derives 3D geometry from 2D image overlaps using Structure from Motion (SfM) algorithms. Accuracy depends on image resolution, overlap percentage, and ground control point (GCP) density. With proper GCP coverage, photogrammetry achieves 5-15 mm accuracy, which is suitable for many applications but insufficient for high-precision structural analysis.',
          [
            'LiDAR accuracy: 1-3 mm range, 6 mm registration error (typical construction site).',
            'Photogrammetry accuracy: 5-15 mm with GCPs, 20-50 mm without GCPs.',
            'Resolution: LiDAR captures every visible surface; photogrammetry captures only textured regions.',
          ],
        ],
      },
      {
        id: 'workflow-speed',
        heading: 'Workflow Speed and Cost Comparison',
        paragraphs: [
          'On-site capture speed favours photogrammetry when using modern 360° cameras. A single Ricoh Theta Z1 or Insta360 Pro 2 can capture a full floor plate in 15-20 minutes, compared to 45-60 minutes for a terrestrial LiDAR scanner covering equivalent resolution. However, post-processing time flips the equation: photogrammetry requires 2-4 hours of processing per scan location, while LiDAR data is ready for use within minutes of completing registration.',
          [
            'Photogrammetry capture: 15-20 min per floor (360° camera), 60-90 min (DSLR with GCPs).',
            'LiDAR capture: 45-60 min per floor (terrestrial scanner), 10-15 min (mobile SLAM scanner).',
            'Photogrammetry processing: 2-4 hours per scan location (cloud SfM processing).',
            'LiDAR processing: 5-15 minutes per scan (automated registration).',
          ],
        ],
      },
      {
        id: 'use-case-guidance',
        heading: 'When to Choose Each Technology',
        image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=80',
        paragraphs: [
          'The decision matrix centers on the project\'s primary deliverable and tolerance requirements.',
          [
            'Choose LiDAR when: millimetre accuracy is required (structural analysis, prefabrication QA), the environment has poor texture (bare concrete, glass facades), or the deliverable is a dense point cloud for BIM modeling.',
            'Choose 360° Photogrammetry when: rapid visual documentation is the goal, color/texture information is critical (heritage recording, marketing visualizations), or budget constraints limit equipment investment.',
            'Choose both when: the project demands full-spectrum documentation, using LiDAR for geometric precision, photogrammetry for colorised, immersive panoramas that can be linked into a virtual tour experience.',
          ],
          'The AxisXD platform natively supports both data types, enabling teams to upload LiDAR scans as point clouds and 360° panoramas as navigable bubble tours within the same digital twin environment.',
        ],
      },
    ],
    summary: 'The choice between 360° photogrammetry and LiDAR is not a binary decision but a spectrum. High-precision structural applications demand LiDAR\'s intrinsic accuracy, while visual documentation and immersive virtual tours benefit from photogrammetry\'s rich color and rapid on-site capture. Forward-thinking teams invest in both capabilities, deploying the right tool for each project phase and integrating all data within a unified digital twin platform.',
  },
  'b6': {
    title: 'ISO 19650 Compliance with Digital Twin Platforms',
    date: '05 Dec 2024',
    readTime: '9 min read',
    category: 'BIM',
    categoryColor: 'indigo',
    bannerImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
    intro: [
      'ISO 19650 has emerged as the global standard for BIM information management, providing a framework for organising, structuring, and exchanging information throughout the asset lifecycle. Compliance is increasingly mandated by public-sector clients across the UK, Europe, and Asia-Pacific.',
      'Digital twin platforms present both an opportunity and a challenge for ISO 19650 compliance. Their ability to aggregate heterogeneous data into a unified environment aligns naturally with the standard\'s Common Data Environment (CDE) concept, but the dynamic, real-time nature of digital twins introduces novel considerations for information versioning, approval workflows, and long-term archival.',
    ],
    sections: [
      {
        id: 'iso-19650-overview',
        heading: 'ISO 19650: Key Requirements',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80',
        paragraphs: [
          'ISO 19650 is organized across four parts: Part 1 covers concepts and principles, Part 2 specifies the delivery phase, Part 3 addresses the operational phase, and Part 5 deals with security-minded information management. The core requirements that affect digital twin platforms include:',
          [
            'Common Data Environment (CDE): A single source of truth for all project information, with defined states: Work in Progress, Shared, Published, and Archived.',
            'Information container metadata: Every container (file, model, document) must carry standardized metadata per ISO 19650-2 clause 5.4.2, including status, revision, suitability, and classification.',
            'Information standard: A project-specific standard defining naming conventions, layer naming, attribute sets, and level of detail (LOD) requirements.',
            'Delivery milestone exchange: Defined information exchanges at each project milestone, with formal authorization and sign-off procedures.',
          ],
        ],
      },
      {
        id: 'digital-twin-alignment',
        heading: 'Aligning Digital Twins with the CDE Framework',
        paragraphs: [
          'Digital twin platforms that function as CDEs must implement the four-state information workflow defined in ISO 19650. Each data container (whether an IFC model, point cloud, panorama, or sensor feed) transitions through Work in Progress (authoring), Shared (review), Published (authorized), and Archived (superseded) states.',
          'Version control becomes more nuanced in the digital twin context. A point cloud uploaded weekly as part of construction monitoring represents a new version of the same information container, requiring clear version numbering and a complete audit trail. The platform must preserve all previous versions for legal and contractual reference while presenting only the current authorized version by default.',
          'AxisXD\'s digital twin platform implements this four-state workflow natively, with automated version tracking, role-based access control, and full audit logging. Each upload generates immutable metadata records compliant with ISO 19650-2 clause 5.6.',
        ],
      },
      {
        id: 'metadata-standards',
        heading: 'Implementing Metadata Standards',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80',
        paragraphs: [
          'ISO 19650 mandates a standardized metadata schema for all information containers. The minimum required fields include:',
          [
            'Container ID: Globally unique identifier (GUID or UUID) assigned at creation.',
            'Status: One of: Work in Progress, Shared, Published, Archived.',
            'Revision: Numeric or alphanumeric version identifier (P01.1, P02.0, etc.).',
            'Suitability: Purpose for which the container is suitable (coordination, review, approval, construction).',
            'Classification: Uniclass 2015, OmniClass, or other project-agreed classification system.',
            'Originator: Organization that created the container.',
            'Volume: Physical location reference (zone, floor, area).',
          ],
          'Digital twin platforms automate metadata assignment through upload profiles and template policies, ensuring every container is compliant without manual data entry. Bulk metadata editing and cross-container consistency checks further reduce administrative overhead.',
        ],
      },
      {
        id: 'archival-strategy',
        heading: 'Long-Term Archival and Handover',
        paragraphs: [
          'The final phase of ISO 19650-2 compliance is the Project Close-Out, where all published information is transferred to the asset owner in a structured, accessible format. Digital twin platforms must support export of the complete information model including individual files and the full relational database of containers, metadata, and approvals.',
          'Standards-based export formats including IFC 4x3, BCF (BIM Collaboration Format), and COBie (Construction Operations Building Information Exchange) ensure that the archived digital twin remains readable by future systems. PDF/A compliance for documentary evidence provides an additional long-term preservation layer.',
          'Practical considerations include agreeing the level of detail retained in the archive; raw point clouds are typically too large for indefinite storage, so derived BIM models and key visual milestones are archived instead, with raw data retention periods specified in the project Information Protocol.',
        ],
      },
    ],
    summary: 'ISO 19650 compliance should not be viewed as a burden but as a framework that delivers better project outcomes through disciplined information management. Digital twin platforms that implement the CDE four-state workflow, enforce standardized metadata, and support structured archival provide a natural foundation for compliance. As more public-sector clients mandate ISO 19650, platforms that embed these capabilities natively will have a decisive advantage in competitive tenders.',
  },
  'construction-monitoring': {
    title: 'Construction Progress Monitoring: The Digital Twin Advantage for Modern Sites',
    date: '14 Apr 2025',
    readTime: '9 min read',
    category: 'MONITORING',
    categoryColor: 'blue',
    bannerImage: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200&q=80',
    intro: [
      'Construction progress monitoring has historically relied on manual site walks, clipboard checklists, and subjective contractor reports. A modern digital twin platform changes this entirely, replacing guesswork with precise visual evidence and automated status tracking.',
      'With the rise of reality capture technologies and cloud-based BIM platforms, project teams can now track construction progress remotely, compare as-built conditions against design models, and generate automated status reports in minutes rather than days.',
    ],
    sections: [
      {
        id: 'what-is-digital-twin',
        heading: 'What Is Digital Twin Construction Monitoring?',
        image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=80',
        paragraphs: [
          'A digital twin is a dynamic, data-driven virtual replica of a physical asset or site. When applied to construction progress monitoring, a digital twin aggregates multiple data sources, including site photographs, 360\u00b0 panoramas, LiDAR point clouds, IFC models, and sensor feeds, into a single visual timeline that shows exactly what has been built and when.',
          'Unlike traditional progress tracking, which relies on percentage-complete estimates from contractors, digital twin monitoring provides objective, verifiable evidence of site status at any point in time. Project teams can scroll through weeks or months of visual history, compare planned vs actual progress side by side, and identify deviations before they become critical issues.',
          'The key differentiator is temporal comparison: rather than viewing a single static snapshot, stakeholders can overlay captures from different dates, visually scrub through a construction timeline, and see exactly when specific elements were completed or when they fell behind schedule.',
        ],
      },
      {
        id: 'key-features',
        heading: 'Key Features of a Digital Twin Monitoring Platform',
        paragraphs: [
          [
            'Visual Progress Tracking: Capture and compare site photographs across time to visualize construction progress between any two dates.',
            'Timeline Comparison: Overlay progress photos, point cloud scans, and BIM models on a unified timeline for phase-by-phase review.',
            'Status Dashboards: Monitor project health with automated KPIs, including percentage complete, schedule variance, and milestone achievement rates.',
            'Reality Capture Integration: Seamlessly ingest LiDAR scans (E57, LAS), 360\u00b0 panoramas, and standard photographs alongside IFC BIM models.',
            'Change Detection Alerts: Receive automated notifications when visual analysis or sensor data detects deviations from the planned construction schedule.',
          ],
        ],
      },
      {
        id: 'business-case',
        heading: 'The Business Case: Why Digital Twin Monitoring Matters',
        image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=900&q=80',
        paragraphs: [
          'The construction industry loses billions annually to schedule delays, rework, and disputes over claimed vs actual progress. Digital twin monitoring addresses these challenges directly.',
          [
            'Reduce Site Visit Frequency by 60%: Remote visual access eliminates many routine inspections.',
            'Detect Schedule Drift Early: Automated timeline comparisons highlight discrepancies at the earliest stage.',
            'Enable Remote Stakeholder Reviews: Owners and investors review progress via secure web dashboards.',
            'Generate Time-Lapse Documentation: Automatic compilation of site photographs creates compelling progress evidence.',
            'Validate Contractor Claims: Photographic and scan records provide objective evidence to validate progress reports.',
            'Support Delay Claim Analysis: Time-stamped visual records create an auditable chain of evidence.',
          ],
        ],
      },
      {
        id: 'implementation',
        heading: 'How to Implement Construction Progress Monitoring',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=900&q=80',
        paragraphs: [
          [
            'Define Capture Points and Cadence: Identify fixed locations for regular photographs or panoramas.',
            'Establish Baseline Data: Upload the latest IFC BIM model and pre-construction LiDAR scans as reference.',
            'Deploy Capture Tools: Equip teams with 360\u00b0 cameras, DSLRs, and LiDAR scanners as needed.',
            'Configure Status Dashboards: Define KPIs, milestone gates, and tolerance thresholds.',
            'Train and Onboard Teams: Ensure all stakeholders understand how to use the monitoring dashboard.',
            'Review and Iterate: Conduct weekly progress reviews using the digital twin platform.',
          ],
        ],
      },
    ],
    summary: 'Construction progress monitoring powered by digital twins represents a paradigm shift in how project teams understand and control site delivery. By replacing subjective percentage estimates with objective visual evidence, teams can detect delays earlier, validate contractor progress, and keep stakeholders aligned throughout the project lifecycle. The technology is available, affordable, and proven; the question is not whether to adopt it, but how quickly you can start.',
  },
};

export const BLOG_LIST = Object.keys(BLOG_DATA);

export const TRENDING = [
  {
    id: 'construction-monitoring',
    title: 'Construction Progress Monitoring: The Digital Twin Advantage',
    category: 'MONITORING',
    categoryColor: 'blue',
    date: '14 Apr 2025',
    readTime: '9 min read',
    thumbnail: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&q=60',
  },
  {
    id: 'b2',
    title: 'Point Cloud Processing for Scan-to-BIM Workflows',
    category: 'POINT CLOUD',
    categoryColor: 'blue',
    date: '28 Jan 2025',
    readTime: '8 min read',
    thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=60',
  },
  {
    id: 'b6',
    title: 'ISO 19650 Compliance with Digital Twin Platforms',
    category: 'BIM',
    categoryColor: 'indigo',
    date: '05 Dec 2024',
    readTime: '9 min read',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=60',
  },
];
