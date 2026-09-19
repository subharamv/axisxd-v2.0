import { Component } from '@angular/core';
import { WebinarDetailPageComponent } from '../../webinar-detail-page/webinar-detail-page';

@Component({
  selector: 'app-lidar-at-scale-managing-petabytes-of-point-cloud-data',
  standalone: true,
  imports: [WebinarDetailPageComponent],
  templateUrl: './lidar-at-scale-managing-petabytes-of-point-cloud-data.html',
  styleUrl: './lidar-at-scale-managing-petabytes-of-point-cloud-data.scss',
})
export class LidarAtScaleManagingPetabytesOfPointCloudDataComponent {
  readonly webinarId = 'wb3';
}
