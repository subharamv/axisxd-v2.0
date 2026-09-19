import { Component } from '@angular/core';
import { ViewerProductPageComponent } from '../viewer-product-page/viewer-product-page';

@Component({
  selector: 'app-point-cloud-page',
  standalone: true,
  imports: [ViewerProductPageComponent],
  templateUrl: './point-cloud-page.html',
  styleUrl: './point-cloud-page.scss',
})
export class PointCloudPageComponent {}
