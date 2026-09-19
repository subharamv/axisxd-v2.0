import { Component } from '@angular/core';
import { CaseStudyDetailPageComponent } from '../../case-study-detail-page/case-study-detail-page';

@Component({
  selector: 'app-construction-site-reality-capture-360-panorama-vs-lidar',
  standalone: true,
  imports: [CaseStudyDetailPageComponent],
  templateUrl: './construction-site-reality-capture-360-panorama-vs-lidar.html',
  styleUrl: './construction-site-reality-capture-360-panorama-vs-lidar.scss',
})
export class ConstructionSiteRealityCapture360PanoramaVsLidarComponent {
  readonly caseStudyId = 'cs4';
}
