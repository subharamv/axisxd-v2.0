import { Component } from '@angular/core';
import { CaseStudyDetailPageComponent } from '../../case-study-detail-page/case-study-detail-page';

@Component({
  selector: 'app-hudson-yards-complex-digital-twin-at-scale',
  standalone: true,
  imports: [CaseStudyDetailPageComponent],
  templateUrl: './hudson-yards-complex-digital-twin-at-scale.html',
  styleUrl: './hudson-yards-complex-digital-twin-at-scale.scss',
})
export class HudsonYardsComplexDigitalTwinAtScaleComponent {
  readonly caseStudyId = 'cs1';
}
