import { Component } from '@angular/core';
import { BlogDetailPageComponent } from '../../blog-detail-page/blog-detail-page';

/**
 * Thin wrapper mirroring src/pages/blog/details/rights-of-light-analysis-a-digital-twin-approach.tsx,
 * which pins BlogDetailPage to blogId="b3". Not referenced by app.routes.ts —
 * same orphaned status as in the original React app.
 */
@Component({
  selector: 'app-rights-of-light-analysis-a-digital-twin-approach',
  standalone: true,
  imports: [BlogDetailPageComponent],
  templateUrl: './rights-of-light-analysis-a-digital-twin-approach.html',
  styleUrl: './rights-of-light-analysis-a-digital-twin-approach.scss',
})
export class RightsOfLightAnalysisADigitalTwinApproachComponent {
  readonly blogId = 'b3';
}
