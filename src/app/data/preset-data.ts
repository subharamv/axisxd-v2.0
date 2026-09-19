/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PresetScene, IFCElement, CoordinateIssue, Hotspot360 } from '../models/types';

export const PRESETS: PresetScene[] = [
  {
    id: 'skyscraper-core',
    name: 'Skyscraper Structural Core',
    location: 'Hudson Yards, NYC - Floor 34',
    description: 'High-rise core columns, structural steel framework, and integrated shear wall layout with laser-scanned floor grids.',
    ifcElementsCount: 142,
    pointsCount: 3800,
    panoramasCount: 4,
    thumbnail: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'refinery-station',
    name: 'Industrial Refinery Piping',
    location: 'Houston Petrochemical Hub',
    description: 'Highly congested pipelines, heat exchangers, and complex HVAC extraction runs with thermo-intensity lidar profiles.',
    ifcElementsCount: 228,
    pointsCount: 5200,
    panoramasCount: 6,
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'concrete-viaduct',
    name: 'Pre-Cast Highway Viaduct',
    location: 'Bavarian Alps Corridor',
    description: 'Heavy segmental prestressed girder columns, abutments, and bridge deck terrain lidar profiling mesh.',
    ifcElementsCount: 94,
    pointsCount: 2900,
    panoramasCount: 3,
    thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'subway-segment',
    name: 'Subway Station Tunnel Access',
    location: 'Tokyo Transit Tunnel Ring',
    description: 'Circular steel and pre-cast tunnel liner segments, overhead traction guides, and lidar point profiles.',
    ifcElementsCount: 110,
    pointsCount: 4100,
    panoramasCount: 5,
    thumbnail: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&q=80&w=600'
  }
];

export const MOCK_IFC_ELEMENTSByPreset: Record<string, IFCElement[]> = {
  'skyscraper-core': [
    {
      id: 'COL-C1-34F',
      name: 'Structural Core Column C1',
      category: 'Structural Column',
      material: 'S460 High-Strength Joint Structural Steel',
      loadBearing: true,
      dimensions: '900mm Dia x 4500mm H',
      volume: '2.86 m³',
      clashDetected: false,
      color: '#3b82f6' // Blue
    },
    {
      id: 'COL-C2-34F',
      name: 'Supporting Core Column C2',
      category: 'Structural Column',
      material: 'S460 Structural Steel & C60 Concrete Infill',
      loadBearing: true,
      dimensions: '900mm Dia x 4500mm H',
      volume: '2.86 m³',
      clashDetected: true,
      color: '#ef4444' // Red (Clash!)
    },
    {
      id: 'SLAB-F34-SE',
      name: 'Cantilever Slab Section SE-34',
      category: 'Foundation Slab',
      material: 'Post-Tensioned Concrete C40',
      loadBearing: true,
      dimensions: '14200mm x 8500mm x 320mm',
      volume: '38.62 m³',
      clashDetected: false,
      color: '#a1a1aa' // Gray
    },
    {
      id: 'DUCT-MAIN-A4',
      name: 'Primary HVAC Exhaust Return',
      category: 'HVAC Ducting',
      material: 'Standard Galvanized Steel Sheet G90',
      loadBearing: false,
      dimensions: '1400mm x 700mm x 9200mm',
      volume: '8.91 m³',
      clashDetected: true,
      color: '#eab308' // Yellow
    },
    {
      id: 'WALL-CORE-INT',
      name: 'Shear Wall Partition Wall S8',
      category: 'Wall Partition',
      material: 'Cast-In-Situ Double-Reinforced Concrete',
      loadBearing: true,
      dimensions: '4200mm x 300mm x 4500mm',
      volume: '5.67 m³',
      clashDetected: false,
      color: '#10b981' // Green
    }
  ],
  'refinery-station': [
    {
      id: 'PIPE-HP-STEAM-12',
      name: 'High Pressure Steam Loop Pipe HP-12',
      category: 'Piping Connection',
      material: 'ASTM A106 Grade B Carbon Steel (S80)',
      loadBearing: false,
      dimensions: '400mm Nominal Dia x 15600mm L',
      volume: '1.96 m³',
      clashDetected: true,
      color: '#ef4444' // Red (Clash!)
    },
    {
      id: 'PIPE-BYPASS-04',
      name: 'Emergency Flushing Bypass Line',
      category: 'Piping Connection',
      material: 'SUS316L Austenitic Stainless Steel',
      loadBearing: false,
      dimensions: '200mm Nominal Dia x 9400mm L',
      volume: '0.29 m³',
      clashDetected: false,
      color: '#06b6d4' // Cyan
    },
    {
      id: 'PEDESTAL-SUP-V1',
      name: 'Vessel Base Supporting Pedestal V1',
      category: 'Structural Column',
      material: 'Mass Cast Portland Concrete C35',
      loadBearing: true,
      dimensions: '1500mm x 1500mm x 1800mm',
      volume: '4.05 m³',
      clashDetected: false,
      color: '#71717a' // Charcoal
    },
    {
      id: 'DUCT-VENT-REF',
      name: 'Auxiliary Exhaust Vent Extractor',
      category: 'HVAC Ducting',
      material: 'Corrosion Resistant Monel 400 Core',
      loadBearing: false,
      dimensions: '800mm Dia x 5400mm',
      volume: '2.71 m³',
      clashDetected: false,
      color: '#8b5cf6' // Purple
    }
  ],
  'concrete-viaduct': [
    {
      id: 'PIER-03-COLUMN',
      name: 'Main Pre-Cast Pier Column P3',
      category: 'Structural Column',
      material: 'Ultra-High Performance Concrete (UHPC) C120',
      loadBearing: true,
      dimensions: '2200mm Hexagon x 11200mm',
      volume: '42.57 m³',
      clashDetected: false,
      color: '#71717a'
    },
    {
      id: 'GIRDER-SEG-04',
      name: 'Spanning Pre-Stressed Box Girder Seg4',
      category: 'Foundation Slab',
      material: 'High-Strength Strand-Reinforced Concrete C80',
      loadBearing: true,
      dimensions: '3500mm x 2400mm x 18000mm',
      volume: '151.2 m³',
      clashDetected: false,
      color: '#3b82f6'
    },
    {
      id: 'STAY-ANCHOR-09',
      name: 'Tension Cable Anchor Plate Assembly',
      category: 'Reinforcing Rebar',
      material: 'Epoxy-Coated High Tensile Steel Strands',
      loadBearing: true,
      dimensions: '450mm Dia x 12000mm L',
      volume: '1.91 m³',
      clashDetected: true,
      color: '#eab308' // Yellow (Clash with overhead frame!)
    }
  ],
  'subway-segment': [
    {
      id: 'LINER-RING-82',
      name: 'Tunnel Liner Protective Arch Ring 82',
      category: 'Wall Partition',
      material: 'Heavy Fiber-Reinforced Concrete Lining Segment',
      loadBearing: true,
      dimensions: '1400mm W x 400mm T x 5800mm Inside R',
      volume: '5.20 m³',
      clashDetected: false,
      color: '#3f3f46'
    },
    {
      id: 'BRACKET-VOLT-82',
      name: 'High-Voltage Cable Anchor Hangar Bracket',
      category: 'Structural Column',
      material: 'Hot-Dip Galvanized Marine-Grade Steel S355',
      loadBearing: true,
      dimensions: '200mm x 200mm x 1100mm',
      volume: '0.04 m³',
      clashDetected: true,
      color: '#ef4444' // Red
    },
    {
      id: 'CONDUIT-TRAY-MAIN',
      name: 'Primary Safe-Zone Cable Routing Tray',
      category: 'HVAC Ducting',
      material: 'GRP Fire-Retardant Heavy-Duty Ladder Tray',
      loadBearing: false,
      dimensions: '500mm x 150mm x 12000mm',
      volume: '0.90 m³',
      clashDetected: false,
      color: '#22c55e'
    }
  ]
};

export const MOCK_COORDINATE_ISSUESByPreset: Record<string, CoordinateIssue[]> = {
  'skyscraper-core': [
    {
      id: 'ISSUE-SKY-01',
      title: 'Primary Core Column C2 vs HVAC Exhaust Duct',
      category: 'Clash',
      severity: 'Critical',
      status: 'Open',
      elementId1: 'COL-C2-34F',
      elementId2: 'DUCT-MAIN-A4',
      description: 'The main HVAC supply return duct is detailed running directly through the rebar envelope of Pillar Column C2. Modifying layout by shifting conduit routing up 400mm.'
    },
    {
      id: 'ISSUE-SKY-02',
      title: 'Cantilever Slab Pin Location Error (>25mm)',
      category: 'As-Built Deviation',
      severity: 'Major',
      status: 'In Progress',
      elementId1: 'SLAB-F34-SE',
      description: 'Scan alignment reveals structural slab edge anchor pins are shifted +31mm outward past standard architectural constraints. Anchor brackets need custom shims.'
    }
  ],
  'refinery-station': [
    {
      id: 'ISSUE-REF-01',
      title: 'Steam Line HP-12 Walkway Clearance Clash',
      category: 'Clash',
      severity: 'Critical',
      status: 'Open',
      elementId1: 'PIPE-HP-STEAM-12',
      elementId2: 'PEDESTAL-SUP-V1',
      description: 'The high-temperature heavy steam loop conflicts directly with proposed structural walkway support beams at Station Z-offset. Requires bypass insulation shield.'
    }
  ],
  'concrete-viaduct': [
    {
      id: 'ISSUE-VIA-01',
      title: 'Tether Anchor Sleeve Twist angle deviation',
      category: 'As-Built Deviation',
      severity: 'Major',
      status: 'In Progress',
      elementId1: 'STAY-ANCHOR-09',
      description: 'Laser lidar point cloud analysis shows anchor sleeve twist angle deviating 2.4 degrees from civil engineering plans. Retuning cable tension is required.'
    }
  ],
  'subway-segment': [
    {
      id: 'ISSUE-SUB-01',
      title: 'Arch Ring 82 fast mounting clash',
      category: 'Clash',
      severity: 'Critical',
      status: 'In Progress',
      elementId1: 'BRACKET-VOLT-82',
      elementId2: 'LINER-RING-82',
      description: 'High-voltage anchor hangar bracket pre-drilled anchors collide with rebar joints in pre-cast Segment 82. Relocate drill coordinates 70mm clock-wise.'
    }
  ]
};

// Aliases for compatibility with other workspace modules
export const MOCK_COORDINATE_ISSUES = MOCK_COORDINATE_ISSUESByPreset;

export const MOCK_HOTSPOTSByPreset: Record<string, Hotspot360[]> = {
  'skyscraper-core': [
    {
      id: 'hs-sky-1',
      label: 'Concrete Core Connection S8',
      x: 32,
      y: 48,
      details: 'Inspect post-tensioned cable tension bolts and load cell meters here.',
      metric: 'Stress Rating: 385 MPa'
    },
    {
      id: 'hs-sky-2',
      label: 'Clash Corridor: Column C2',
      x: 74,
      y: 36,
      details: 'Active coordinate overlay shows 120mm spatial intersection of galvanized metal ducts.',
      metric: 'Conflict Margin: Overlap'
    },
    {
      id: 'hs-sky-3',
      label: 'Faro Lidar Station #34-East',
      x: 50,
      y: 82,
      details: 'Primary survey target setup center point. Elevation datum zero.',
      metric: 'Global GCP Map Anchor'
    }
  ],
  'refinery-station': [
    {
      id: 'hs-ref-1',
      label: 'Thermal Steam Inlet Hub',
      x: 28,
      y: 35,
      details: 'Lidar scanner capture point for pipe corrosion monitoring and hot-clash detection.',
      metric: 'Temp: 160°C nominal'
    },
    {
      id: 'hs-ref-2',
      label: 'Pump Skid Core Concrete Anchor',
      x: 68,
      y: 65,
      details: 'Anchor block level checking interface; Lidar to BIM alignment check.',
      metric: 'Precision Rating: 3mm'
    }
  ],
  'concrete-viaduct': [
    {
      id: 'hs-via-1',
      label: 'Pier P3 Cable Anchorage System',
      x: 45,
      y: 28,
      details: 'Verify post-tensioning wedges are fully locked before highway girder deployment.',
      metric: 'Target Tension: 780 kN'
    },
    {
      id: 'hs-via-2',
      label: 'Expansion Slide Plat Bed',
      x: 82,
      y: 56,
      details: 'Lidar scans confirm clearance is with concrete joint standards and temperature rules.',
      metric: 'Clearance Gap: 44.5mm'
    }
  ],
  'subway-segment': [
    {
      id: 'hs-sub-1',
      label: 'Water Isolation Joint 82A',
      x: 46,
      y: 62,
      details: 'Silicon moisture seal status and structural compression monitoring zone.',
      metric: 'Radial Shift: < 1.2mm'
    },
    {
      id: 'hs-sub-2',
      label: 'Main Transit Power Conduit Conduit Hanger',
      x: 64,
      y: 22,
      details: 'Structural weld checks and overhead load capacity measurements.',
      metric: 'Status: Approved'
    }
  ]
};

// Aliases for compatibility with other workspace modules
export const MOCK_HOTSPOTS = MOCK_HOTSPOTSByPreset;
