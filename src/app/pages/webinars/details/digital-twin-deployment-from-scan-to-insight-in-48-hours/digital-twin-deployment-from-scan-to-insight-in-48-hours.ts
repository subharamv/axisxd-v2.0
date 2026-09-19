import { Component } from '@angular/core';
import { WebinarDetailPageComponent } from '../../webinar-detail-page/webinar-detail-page';

@Component({
  selector: 'app-digital-twin-deployment-from-scan-to-insight-in-48-hours',
  standalone: true,
  imports: [WebinarDetailPageComponent],
  templateUrl: './digital-twin-deployment-from-scan-to-insight-in-48-hours.html',
  styleUrl: './digital-twin-deployment-from-scan-to-insight-in-48-hours.scss',
})
export class DigitalTwinDeploymentFromScanToInsightIn48HoursComponent {
  readonly webinarId = 'wb1';
}
