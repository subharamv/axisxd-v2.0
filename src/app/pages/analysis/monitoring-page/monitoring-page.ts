import { Component } from '@angular/core';
import { ViewerProductPageComponent } from '../../viewer/viewer-product-page/viewer-product-page';

@Component({
  selector: 'app-monitoring-page',
  standalone: true,
  imports: [ViewerProductPageComponent],
  templateUrl: './monitoring-page.html',
  styleUrl: './monitoring-page.scss',
})
export class MonitoringPageComponent {}
