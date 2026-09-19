import { Component } from '@angular/core';
import { BlogDetailPageComponent } from '../../blog-detail-page/blog-detail-page';

/**
 * Thin wrapper mirroring src/pages/blog/details/360-photogrammetry-vs-lidar-which-to-choose.tsx,
 * which pins BlogDetailPage to blogId="b5". Not referenced by app.routes.ts —
 * same orphaned status as in the original React app.
 */
@Component({
  selector: 'app-360-photogrammetry-vs-lidar-which-to-choose',
  standalone: true,
  imports: [BlogDetailPageComponent],
  templateUrl: './360-photogrammetry-vs-lidar-which-to-choose.html',
  styleUrl: './360-photogrammetry-vs-lidar-which-to-choose.scss',
})
export class ThreeSixtyPhotogrammetryVsLidarWhichToChooseComponent {
  readonly blogId = 'b5';
}
