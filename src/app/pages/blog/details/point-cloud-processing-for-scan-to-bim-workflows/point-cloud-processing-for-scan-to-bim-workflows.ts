import { Component } from '@angular/core';
import { BlogDetailPageComponent } from '../../blog-detail-page/blog-detail-page';

/**
 * Thin wrapper mirroring src/pages/blog/details/point-cloud-processing-for-scan-to-bim-workflows.tsx,
 * which pins BlogDetailPage to blogId="b2". Not referenced by app.routes.ts —
 * same orphaned status as in the original React app.
 */
@Component({
  selector: 'app-point-cloud-processing-for-scan-to-bim-workflows',
  standalone: true,
  imports: [BlogDetailPageComponent],
  templateUrl: './point-cloud-processing-for-scan-to-bim-workflows.html',
  styleUrl: './point-cloud-processing-for-scan-to-bim-workflows.scss',
})
export class PointCloudProcessingForScanToBimWorkflowsComponent {
  readonly blogId = 'b2';
}
