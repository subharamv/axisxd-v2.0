import { Component } from '@angular/core';
import { BlogDetailPageComponent } from '../../blog-detail-page/blog-detail-page';

/**
 * Thin wrapper mirroring src/pages/blog/details/iso-19650-compliance-with-digital-twin-platforms.tsx,
 * which pins BlogDetailPage to blogId="b6". Not referenced by app.routes.ts —
 * same orphaned status as in the original React app.
 */
@Component({
  selector: 'app-iso-19650-compliance-with-digital-twin-platforms',
  standalone: true,
  imports: [BlogDetailPageComponent],
  templateUrl: './iso-19650-compliance-with-digital-twin-platforms.html',
  styleUrl: './iso-19650-compliance-with-digital-twin-platforms.scss',
})
export class Iso19650ComplianceWithDigitalTwinPlatformsComponent {
  readonly blogId = 'b6';
}
