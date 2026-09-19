/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ViewerMode = 'ifc' | 'point-cloud' | 'panorama';

export type PointColorPalette = 'elevation' | 'spectral' | 'intensity' | 'rgb' | 'cyan-glow';

export interface PresetScene {
  id: string;
  name: string;
  location: string;
  description: string;
  ifcElementsCount: number;
  pointsCount: number;
  panoramasCount: number;
  thumbnail: string;
}

export interface IFCElement {
  id: string;
  name: string;
  category: 'Structural Column' | 'Foundation Slab' | 'HVAC Ducting' | 'Piping Connection' | 'Wall Partition' | 'Reinforcing Rebar';
  material: string;
  loadBearing: boolean;
  dimensions: string;
  volume: string;
  clashDetected: boolean;
  color: string;
}

export interface CoordinateIssue {
  id: string;
  title: string;
  category: 'Clash' | 'Mechanical' | 'Safety' | 'As-Built Deviation';
  severity: 'Critical' | 'Major' | 'Minor';
  status: 'Open' | 'In Progress' | 'Resolved';
  elementId1?: string;
  elementId2?: string;
  description: string;
}

export interface Hotspot360 {
  id: string;
  label: string;
  x: number; // percentage coordinate 0-100
  y: number; // percentage coordinate 0-100
  details: string;
  metric?: string;
}
