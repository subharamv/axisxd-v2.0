import { Component } from '@angular/core';
import { BlogDetailPageComponent } from '../../blog-detail-page/blog-detail-page';

/**
 * Thin wrapper mirroring src/pages/blog/details/clash-detection-best-practices-in-modern-bim.tsx,
 * which pins BlogDetailPage to blogId="b4". Not referenced by app.routes.ts —
 * same orphaned status as in the original React app.
 */
@Component({
  selector: 'app-clash-detection-best-practices-in-modern-bim',
  standalone: true,
  imports: [BlogDetailPageComponent],
  templateUrl: './clash-detection-best-practices-in-modern-bim.html',
  styleUrl: './clash-detection-best-practices-in-modern-bim.scss',
})
export class ClashDetectionBestPracticesInModernBimComponent {
  readonly blogId = 'b4';
}
