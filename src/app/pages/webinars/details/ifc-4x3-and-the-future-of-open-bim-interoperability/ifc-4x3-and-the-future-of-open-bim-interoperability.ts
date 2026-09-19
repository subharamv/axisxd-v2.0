import { Component } from '@angular/core';
import { WebinarDetailPageComponent } from '../../webinar-detail-page/webinar-detail-page';

@Component({
  selector: 'app-ifc-4x3-and-the-future-of-open-bim-interoperability',
  standalone: true,
  imports: [WebinarDetailPageComponent],
  templateUrl: './ifc-4x3-and-the-future-of-open-bim-interoperability.html',
  styleUrl: './ifc-4x3-and-the-future-of-open-bim-interoperability.scss',
})
export class Ifc4x3AndTheFutureOfOpenBimInteroperabilityComponent {
  readonly webinarId = 'wb2';
}
