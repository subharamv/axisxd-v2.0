import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface FormatItem {
  ext: string;
  kind: string;
  /** Route to the viewer that opens this family of files. */
  href: string;
}

/** Four columns; neighbouring columns scroll in opposite directions. */
const COLUMNS: FormatItem[][] = [
  [
    { ext: 'IFC', kind: 'BIM', href: '/viewer/ifc' },
    { ext: 'RVT', kind: 'Revit', href: '/viewer/ifc' },
    { ext: 'NWD', kind: 'Navisworks', href: '/viewer/ifc' },
    { ext: 'DWG', kind: 'CAD', href: '/viewer/cad' },
    { ext: 'E57', kind: 'Point Cloud', href: '/viewer/point-cloud' },
    { ext: 'OBJ', kind: 'Mesh', href: '/viewer/mesh' },
  ],
  [
    { ext: 'IFC4x3', kind: 'BIM', href: '/viewer/ifc' },
    { ext: 'NWC', kind: 'Navisworks', href: '/viewer/ifc' },
    { ext: 'DXF', kind: 'CAD', href: '/viewer/cad' },
    { ext: 'LAS', kind: 'Point Cloud', href: '/viewer/point-cloud' },
    { ext: 'FBX', kind: 'Mesh', href: '/viewer/mesh' },
    { ext: 'BCF', kind: 'Issues', href: '/analysis/clash' },
  ],
  [
    { ext: 'RCP', kind: 'ReCap', href: '/viewer/point-cloud' },
    { ext: 'LAZ', kind: 'Point Cloud', href: '/viewer/point-cloud' },
    { ext: 'PTS', kind: 'Point Cloud', href: '/viewer/point-cloud' },
    { ext: 'glTF', kind: 'Mesh', href: '/viewer/mesh' },
    { ext: 'STEP', kind: 'CAD', href: '/viewer/cad' },
    { ext: 'DGN', kind: 'MicroStation', href: '/viewer/cad' },
  ],
  [
    { ext: 'RCS', kind: 'ReCap', href: '/viewer/point-cloud' },
    { ext: 'PTX', kind: 'Point Cloud', href: '/viewer/point-cloud' },
    { ext: 'XYZ', kind: 'Point Cloud', href: '/viewer/point-cloud' },
    { ext: 'PLY', kind: 'Mesh', href: '/viewer/mesh' },
    { ext: 'GLB', kind: 'Mesh', href: '/viewer/mesh' },
    { ext: 'STL', kind: 'Mesh', href: '/viewer/mesh' },
  ],
];

@Component({
  selector: 'app-formats-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './formats-section.html',
  styleUrl: './formats-section.scss',
})
export class FormatsSectionComponent {
  readonly columns = COLUMNS;

  /** The track is rendered twice so the loop can wrap without a seam. */
  loop(items: FormatItem[]): FormatItem[] {
    return [...items, ...items];
  }
}
