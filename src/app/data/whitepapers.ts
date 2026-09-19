export interface WhitepaperSection {
  id: string;
  heading: string;
  paragraphs: (string | string[])[];
}

export interface WhitepaperEntry {
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  category: string;
  categoryColor: string;
  heroImage: string;
  sections: WhitepaperSection[];
  summary: string;
}

export const WHITEPAPER_DATA: Record<string, WhitepaperEntry> = {
  'w1': {
    title: 'Digital Twin Integration Framework for Construction Sites',
    subtitle: 'An in-depth technical guide on deploying integrated digital twin systems across multi-phase construction projects at enterprise scale.',
    date: 'Jan 2025',
    readTime: '24 pages',
    category: 'BIM',
    categoryColor: 'indigo',
    heroImage: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=80',
    sections: [
      {
        id: 'introduction',
        heading: 'Introduction to Digital Twin Integration',
        paragraphs: [
          'A digital twin is a dynamic, data-driven virtual replica of a physical asset or site. When applied to construction progress monitoring, a digital twin aggregates multiple data sources, including site photographs, 360° panoramas, LiDAR point clouds, IFC models, and sensor feeds, into a single visual timeline that shows exactly what has been built and when.',
          'Unlike traditional progress tracking, which relies on percentage-complete estimates from contractors, digital twin monitoring provides objective, verifiable evidence of site status at any point in time. Project teams can scroll through weeks or months of visual history, compare planned vs actual progress side by side, and identify deviations before they become critical issues.',
          'The key differentiator is temporal comparison: rather than viewing a single static snapshot, stakeholders can overlay captures from different dates, visually scrub through a construction timeline, and see exactly when specific elements were completed or when they fell behind schedule.',
        ],
      },
      {
        id: 'framework-overview',
        heading: 'The Integration Framework Architecture',
        paragraphs: [
          'The integration framework follows a layered architecture that separates data acquisition, processing, storage, and presentation. Each layer communicates through standardized APIs, allowing organizations to swap components without disrupting the overall system.',
          [
            'Acquisition Layer: Manages capture devices (cameras, LiDAR scanners, IoT sensors) and schedules automated data collection cycles.',
            'Processing Layer: Handles point cloud registration, panoramic stitching, IFC parsing, and real-time sensor stream aggregation.',
            'Storage Layer: Implements the ISO 19650 four-state CDE workflow (Work in Progress, Shared, Published, Archived) for all information containers.',
            'Presentation Layer: Delivers web-based 3D visualization, timeline comparison, dashboards, and mobile access to authorized stakeholders.',
          ],
          'Each layer is horizontally scalable, enabling enterprise deployments to handle petabytes of reality capture data across hundreds of concurrent projects.',
        ],
      },
      {
        id: 'data-acquisition',
        heading: 'Data Acquisition Strategies',
        paragraphs: [
          'The quality of a digital twin is determined by the quality and cadence of its input data. A well-planned acquisition strategy balances coverage, frequency, and accuracy against project budget and site logistics.',
          [
            '360° Panoramas: Capture immersive visual documentation at weekly intervals from fixed positions. Use Ricoh Theta Z1 or Insta360 Pro cameras mounted on telescopic poles.',
            'LiDAR Point Clouds: Perform monthly terrestrial scans at 1/4 resolution for geometric precision. Integrate mobile SLAM scanners for rapid corridor and room-level capture.',
            'IFC Models: Ingest architectural, structural, and MEP models from the authoring team at each design freeze milestone.',
            'IoT Sensor Feeds: Stream temperature, humidity, vibration, and occupancy data from embedded sensors via MQTT or REST APIs.',
          ],
          'The acquisition schedule must align with the project\'s Information Delivery Milestones (IDMs) as defined in the BIM Execution Plan. Automated capture triggers such as geofenced camera activation when a drone enters a survey zone reduce manual overhead.',
        ],
      },
      {
        id: 'platform-selection',
        heading: 'Platform Selection Criteria',
        paragraphs: [
          'Selecting the right digital twin platform requires evaluating technical capabilities, integration depth, and vendor support against the organization\'s specific workflow requirements. Not all platforms handle reality capture data equally.',
          [
            'Multi-format support: The platform must natively ingest IFC (2x3 and 4x3), E57/LAS point clouds, and 360° panoramic imagery without manual conversion.',
            'Browser-based access: WebGL 2.0 rendering eliminates the need for desktop software installation, enabling stakeholder access from any device.',
            'CDE compliance: Built-in ISO 19650 workflow support with version control, access permissions, and audit logging.',
            'API extensibility: RESTful and GraphQL APIs allow integration with project management tools (Procore, Aconex), ERP systems, and custom dashboards.',
          ],
          'The AxisXD platform addresses all four criteria, providing a unified environment for IFC viewing, point cloud streaming, panorama navigation, and deviation analysis within a single browser tab.',
        ],
      },
      {
        id: 'implementation',
        heading: 'Step-by-Step Implementation Guide',
        paragraphs: [
          'Deploying a digital twin integration framework requires phased execution, beginning with a pilot project and scaling to enterprise-wide adoption. The following implementation roadmap has been validated across 40+ enterprise deployments.',
          [
            'Phase 1: Pilot Setup (Weeks 1–4): Select a single project floor or zone. Deploy capture equipment, configure the platform, and establish baseline data workflows.',
            'Phase 2: Data Validation (Weeks 5–8): Compare digital twin outputs against manual surveys. Calibrate capture settings to achieve target accuracy thresholds.',
            'Phase 3: Workflow Integration (Weeks 9–16): Connect the platform to existing project management and BIM coordination tools. Train discipline leads on dashboard interpretation.',
            'Phase 4: Enterprise Rollout (Weeks 17–24): Standardise capture schedules across all active projects. Implement role-based access control and automated reporting.',
            'Phase 5: Continuous Improvement (Ongoing): Monitor platform usage metrics, gather stakeholder feedback, and iterate on capture cadence and dashboard configuration.',
          ],
          'Each phase includes defined acceptance criteria and stakeholder sign-off gates to ensure the deployment stays aligned with project objectives.',
        ],
      },
    ],
    summary: 'Deploying a digital twin integration framework transforms construction site monitoring from a subjective, manual exercise into an objective, data-driven process. By following a phased implementation roadmap, selecting the right platform capabilities, and establishing disciplined acquisition strategies, project teams can achieve real-time visibility into construction progress that reduces delays, validates contractor claims, and keeps all stakeholders aligned.',
  },
  'w2': {
    title: 'Point Cloud Data Management at Scale',
    subtitle: 'Strategies for storing, processing, and streaming high-density point cloud datasets across distributed engineering teams.',
    date: 'Oct 2024',
    readTime: '18 pages',
    category: 'POINT CLOUD',
    categoryColor: 'blue',
    heroImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&q=80',
    sections: [
      {
        id: 'scale-challenge',
        heading: 'The Scale Challenge in Point Cloud Management',
        paragraphs: [
          'A single terrestrial LiDAR scan can generate 200 million points, consuming 1–2 GB of raw data. A typical construction project accumulates 50–200 scans over its lifecycle, producing 50–400 GB of point cloud data that must be stored, versioned, and made accessible to distributed teams.',
          'Traditional file-based storage, where E57 or LAS files are shared via network drives or FTP, breaks down at this scale. Teams lose track of which scan corresponds to which date, struggle with file locking conflicts, and waste hours downloading multi-gigabyte files for simple visual inspections.',
          'Enterprise point cloud management requires a fundamentally different approach: cloud-native storage with streaming delivery, automated processing pipelines, and role-based access control that integrates with existing BIM coordination workflows.',
        ],
      },
      {
        id: 'storage-architecture',
        heading: 'Cloud-Native Storage Architecture',
        paragraphs: [
          'Modern point cloud storage leverages object storage (S3, GCS, Azure Blob) with intelligent tiering to balance access speed against storage cost. Hot tier stores the latest and most frequently accessed scans; cool and cold tiers archive historical data at reduced cost.',
          [
            'Octree-based tiling: Decompose large point clouds into hierarchical octree tiles that enable level-of-detail streaming. Clients load only the tiles visible in the current viewport.',
            'Streaming protocols: Use Cesium 3D Tiles or Potree format for progressive loading. First tiles appear in under 2 seconds; full resolution loads in the background.',
            'Delta compression: Store only the difference between consecutive scans at the same location, reducing storage requirements by 60–80% for time-series datasets.',
            'Metadata indexing: Maintain a searchable index of scan metadata (date, scanner, location, coordinate system, point count) for rapid discovery across thousands of datasets.',
          ],
          'This architecture enables a single platform to manage petabytes of point cloud data while delivering sub-second visual response to end users.',
        ],
      },
      {
        id: 'processing-pipeline',
        heading: 'Automated Processing Pipelines',
        paragraphs: [
          'Raw point cloud data requires multiple processing steps before it becomes useful for BIM coordination. An automated pipeline eliminates manual intervention and ensures consistent output quality across all scans.',
          [
            'Noise filtering: Apply statistical outlier removal (SOR) and radius-based filtering to eliminate sensor noise and transient objects (vehicles, personnel).',
            'Registration: Perform cloud-to-cloud ICP registration for scan alignment, achieving typical accuracies of 2–6 mm when overlap exceeds 50%.',
            'Classification: Run machine learning classifiers to separate ground, vegetation, structural, and MEP elements. Modern classifiers achieve 85–92% accuracy on construction site data.',
            'Color correction: Normalise intensity values and apply color balancing for visual consistency across scans captured under different lighting conditions.',
            'Format conversion: Export processed data as 3D Tiles for streaming, LAS/LAZ for archival, and E57 for cross-platform exchange.',
          ],
          'Pipeline orchestration tools (Apache Airflow, Prefect) manage dependency chains and retry logic, ensuring reliable processing even when individual steps encounter edge cases.',
        ],
      },
      {
        id: 'team-workflows',
        heading: 'Multi-Team Collaboration Workflows',
        paragraphs: [
          'Distributed engineering teams require shared access to point cloud data with conflict resolution, change tracking, and role-based permissions. The collaboration model must accommodate architects, structural engineers, MEP coordinators, and survey teams working on overlapping datasets.',
          [
            'Named workspaces: Each discipline gets a private workspace for annotation and analysis. Changes are merged into the shared layer through a review process.',
            'Annotation layers: Teams can add measurements, callouts, and markup directly on the point cloud. Annotations are versioned and attributed to the author.',
            'Section clipping: Define clipping planes and bounding boxes to focus team attention on specific building zones or floors without loading the full dataset.',
            'Export packages: Generate discipline-specific exports (structural only, MEP only) from the federated point cloud for use in authoring tools.',
          ],
          'These workflows transform point cloud data from a monolithic dataset into a collaborative workspace where multiple teams can work simultaneously without stepping on each other.',
        ],
      },
    ],
    summary: 'Effective point cloud data management at scale requires a cloud-native architecture with octree-based streaming, automated processing pipelines, and multi-team collaboration workflows. Organizations that implement these strategies can manage petabytes of reality capture data while delivering instant visual access to distributed engineering teams. The investment in proper infrastructure pays for itself through eliminated manual processing, reduced data loss, and accelerated BIM coordination cycles.',
  },
  'w3': {
    title: 'IFC Standard & BIM Digital Twin Compliance Guide',
    subtitle: 'A technical whitepaper covering IFC schema compliance, BIM data fidelity, and integration best practices for AEC professionals.',
    date: 'Aug 2024',
    readTime: '31 pages',
    category: 'DXF / 2D',
    categoryColor: 'blue',
    heroImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
    sections: [
      {
        id: 'ifc-overview',
        heading: 'IFC Standard Overview',
        paragraphs: [
          'Industry Foundation Classes (IFC) is the open, vendor-neutral data standard for Building Information Modeling (BIM) data exchange. Maintained by buildingSMART International, IFC ensures interoperability between different BIM software platforms, allowing architects, engineers, and contractors to exchange building model data without proprietary lock-in.',
          'IFC4 (released 2013, updated through IFC4x3) is the current production standard, with IFC4x3 Add2 providing the most comprehensive support for infrastructure, rail, and road projects. The schema defines over 900 entity types covering spatial structure, building elements, systems, and properties.',
          'Understanding IFC schema compliance is essential for any organization deploying digital twin platforms that consume BIM data. Non-compliant exports can cause data loss, geometry errors, or missing property sets that undermine the reliability of downstream analyses.',
        ],
      },
      {
        id: 'schema-compliance',
        heading: 'IFC Schema Compliance Requirements',
        paragraphs: [
          'Schema compliance means that an IFC file adheres to the rules defined by buildingSMART for valid entity instantiation, relationship structure, and property assignment. Compliance validation should be performed at the point of export and again at the point of import into the digital twin platform.',
          [
            'Mandatory entities: Every IFC project must include IfcProject, IfcSite, IfcBuilding, and IfcBuildingStorey to define the spatial decomposition hierarchy.',
            'Geometry representation: Elements must carry IfcProductDefinitionShape with valid IfcShapeRepresentation. Mesh-based representations (IfcTriangulatedFaceSet) are preferred for viewer compatibility.',
            'Property sets: Standard property sets (Pset_BuildingCommon, Pset_WallCommon) must use the correct IFC data types. Custom property sets should follow the IfcPropertySet template.',
            'Units and coordinates: All geometry must reference a consistent IfcUnitAssignment. Coordinate systems must be explicitly defined via IfcLocalPlacement.',
          ],
          'The buildingSMART Validation Server and open-source tools like IfcOpenShell provide automated compliance checking against these rules.',
        ],
      },
      {
        id: 'data-fidelity',
        heading: 'Ensuring BIM Data Fidelity in Digital Twins',
        paragraphs: [
          'Data fidelity (the degree to which the digital twin accurately represents the source BIM model) depends on careful handling of coordinate transformations, unit conversions, and relationship preservation during IFC export and import.',
          [
            'Coordinate system alignment: Verify that the IFC local placement chain resolves to a consistent world coordinate system. Misaligned origins cause elements to appear in wrong positions.',
            'LOD preservation: Ensure that Level of Detail (LOD) designations are preserved through the export-import pipeline. Geometry simplification at import can lose critical structural detail.',
            'Material and property retention: Map IFC materials, colors, and custom property sets to the digital twin\'s internal data model without loss.',
            'Relationship integrity: Maintain IfcRelAggregates, IfcRelContainedInSpatialStructure, and IfcRelAssociatesMaterial chains so that the spatial hierarchy and element associations remain navigable.',
          ],
          'Platform-specific import configuration files should be versioned alongside the IFC exports, ensuring reproducible data pipelines across project phases.',
        ],
      },
      {
        id: 'integration-practices',
        heading: 'Integration Best Practices for AEC Teams',
        paragraphs: [
          'Successful IFC integration into digital twin workflows requires organizational alignment between BIM managers, IT teams, and project stakeholders. The following practices have been validated across enterprise-scale deployments.',
          [
            'Export validation gate: No IFC file enters the digital twin pipeline without passing automated compliance checks. Reject non-compliant files with specific error reports for the authoring team to resolve.',
            'Federation workflow: Aggregate discipline-specific IFC models (architectural, structural, MEP) into a single federated model at defined coordination milestones rather than continuously.',
            'Version tagging: Assign semantic version numbers (v1.0.0, v1.1.0) to IFC exports at each milestone, with change logs documenting what has been modified since the previous version.',
            'Viewer compatibility testing: Before adopting a new IFC viewer or digital twin platform, validate rendering accuracy against a standardized test suite of known-good IFC models.',
          ],
          'These practices reduce integration failures and ensure that the digital twin remains a reliable source of truth throughout the project lifecycle.',
        ],
      },
    ],
    summary: 'IFC schema compliance and BIM data fidelity are foundational to reliable digital twin deployments. By implementing automated validation gates, versioned federation workflows, and rigorous coordinate system alignment, AEC organizations can ensure that their digital twins faithfully represent the design intent captured in BIM models. The open IFC standard, combined with modern streaming platforms, provides the interoperability backbone for multi-disciplinary construction coordination.',
  },
  'w4': {
    title: 'Deviation Analysis Methodologies in As-Built Verification',
    subtitle: 'Comparing geometric deviation analysis workflows against ISO-12053 tolerance standards in real-world scan-to-BIM projects.',
    date: 'Jun 2024',
    readTime: '22 pages',
    category: 'DEVIATION',
    categoryColor: 'rose',
    heroImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
    sections: [
      {
        id: 'deviation-overview',
        heading: 'What Is As-Built Deviation Analysis?',
        paragraphs: [
          'As-built deviation analysis compares the actual constructed geometry (captured via LiDAR point clouds) against the intended design geometry (from IFC/BIM models) to identify where construction has drifted from the design intent. These deviations that are left undetected can cause structural integrity issues, clashes with building systems, and costly rework.',
          'The analysis produces a deviation map: a color-coded visual overlay showing the magnitude and direction of deviation at every point on the building surface. Points within tolerance appear green; deviations exceeding threshold appear yellow, orange, or red depending on severity.',
          'Modern deviation analysis tools leverage point-to-mesh distance algorithms that can process millions of points against BIM geometry in minutes, delivering quantitative results with sub-millimetre precision.',
        ],
      },
      {
        id: 'methodology-comparison',
        heading: 'Comparing Deviation Analysis Methodologies',
        paragraphs: [
          'Different deviation analysis approaches suit different project requirements. The choice depends on the required accuracy, the complexity of the geometry, and the available processing resources.',
          [
            'Point-to-plane: Projects each LiDAR point onto the nearest planar face of the BIM model. Fast and suitable for walls, slabs, and columns. Accuracy: ±2 mm.',
            'Point-to-mesh: Computes Euclidean distance from each point to the nearest triangle on the mesh representation. Handles curved surfaces and complex geometry. Accuracy: ±1 mm.',
            'Cloud-to-cloud: Compares two point clouds (as-built vs design scan) without intermediate mesh. Useful when BIM models are unavailable. Accuracy: ±3 mm.',
            'Section-based: Extracts 2D cross-sections at defined intervals and overlays them against design sections. Intuitive for linear infrastructure (roads, railways, tunnels).',
          ],
          'For most building construction projects, point-to-mesh analysis provides the best balance of accuracy and computational efficiency. Section-based analysis is preferred for infrastructure projects where longitudinal profiles are the primary deliverable.',
        ],
      },
      {
        id: 'tolerance-standards',
        heading: 'Tolerance Standards and Thresholds',
        paragraphs: [
          'ISO 12053 and related standards define acceptable tolerance ranges for construction deviations. These tolerances vary by building element type, construction method, and project specification.',
          [
            'Structural steel: ±5 mm for member position, ±3 mm for connection plate alignment. Tighter tolerances apply to pre-engineered structures.',
            'Concrete walls: ±10 mm for surface position, ±5 mm for plumbness over 3 m height. Tolerances relax for rough-cast finishes.',
            'MEP installations: ±15 mm for pipe routing, ±25 mm for ductwork. Larger tolerances accommodate field routing adjustments.',
            'Facade systems: ±5 mm for panel position, ±3 mm for joint width consistency. Facade tolerances are often the tightest due to aesthetic and waterproofing requirements.',
          ],
          'Digital deviation analysis tools allow project teams to configure custom threshold profiles that reflect the specific tolerances agreed in the project specification, rather than relying solely on generic standard values.',
        ],
      },
      {
        id: 'reporting-workflows',
        heading: 'Reporting and Issue Management Workflows',
        paragraphs: [
          'Deviation analysis is only valuable if its findings drive action. Effective workflows connect deviation detection to issue resolution through structured reporting and integration with project management tools.',
          [
            'Automated report generation: Generate PDF and HTML deviation reports with heat maps, statistical summaries, and element-level detail at each analysis milestone.',
            'Issue creation: Automatically create BCF (BIM Collaboration Format) issues for deviations exceeding the critical threshold, with annotated viewpoints linking directly to the deviation location.',
            'Trend tracking: Compare deviation maps across successive scans to track whether deviations are stable, worsening, or being corrected over time.',
            'Stakeholder dashboards: Publish deviation KPIs (percentage within tolerance, worst-case deviation, trend direction) to project dashboards accessible to all authorized stakeholders.',
          ],
          'The AxisXD platform integrates deviation analysis with its IFC viewer, point cloud streaming, and timeline comparison features, enabling teams to investigate deviation causes by cross-referencing as-built imagery, sensor data, and design models within a single interface.',
        ],
      },
    ],
    summary: 'As-built deviation analysis provides the quantitative evidence needed to verify construction quality against design specifications. By selecting the appropriate analysis methodology, configuring project-specific tolerance thresholds, and connecting findings to structured issue management workflows, project teams can detect and correct deviations before they cascade into costly rework. Modern platforms that combine deviation analysis with multi-format 3D viewing deliver the most actionable insights for construction quality assurance.',
  },
};

export const WP_LIST = Object.keys(WHITEPAPER_DATA);

export const RELATED_WHITEPAPERS = [
  {
    id: 'w2',
    title: 'Point Cloud Data Management at Scale',
    category: 'POINT CLOUD',
    categoryColor: 'blue',
    date: 'Oct 2024',
    readTime: '18 pages',
    thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=60',
  },
  {
    id: 'w3',
    title: 'IFC Standard & BIM Digital Twin Compliance Guide',
    category: 'DXF / 2D',
    categoryColor: 'blue',
    date: 'Aug 2024',
    readTime: '31 pages',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=60',
  },
  {
    id: 'w4',
    title: 'Deviation Analysis Methodologies in As-Built Verification',
    category: 'DEVIATION',
    categoryColor: 'rose',
    date: 'Jun 2024',
    readTime: '22 pages',
    thumbnail: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=60',
  },
];
