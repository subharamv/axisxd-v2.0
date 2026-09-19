import { Component } from '@angular/core';
import { BlogDetailPageComponent } from '../../blog-detail-page/blog-detail-page';

/**
 * Thin wrapper mirroring src/pages/blog/details/construction-progress-monitoring-the-digital-twin-advantage.tsx,
 * which pins BlogDetailPage to blogId="construction-monitoring". Not referenced
 * by app.routes.ts — same orphaned status as in the original React app.
 */
@Component({
  selector: 'app-construction-progress-monitoring-the-digital-twin-advantage',
  standalone: true,
  imports: [BlogDetailPageComponent],
  templateUrl: './construction-progress-monitoring-the-digital-twin-advantage.html',
  styleUrl: './construction-progress-monitoring-the-digital-twin-advantage.scss',
})
export class ConstructionProgressMonitoringTheDigitalTwinAdvantageComponent {
  readonly blogId = 'construction-monitoring';
}
