import { Component } from '@angular/core';
import { WebinarDetailPageComponent } from '../../webinar-detail-page/webinar-detail-page';

@Component({
  selector: 'app-construction-progress-monitoring-with-ai-powered-analytics',
  standalone: true,
  imports: [WebinarDetailPageComponent],
  templateUrl: './construction-progress-monitoring-with-ai-powered-analytics.html',
  styleUrl: './construction-progress-monitoring-with-ai-powered-analytics.scss',
})
export class ConstructionProgressMonitoringWithAiPoweredAnalyticsComponent {
  readonly webinarId = 'wb5';
}
