import { Component } from '@angular/core';
import { ViewerProductPageComponent } from '../viewer-product-page/viewer-product-page';

@Component({
  selector: 'app-pano-page',
  standalone: true,
  imports: [ViewerProductPageComponent],
  templateUrl: './pano-page.html',
  styleUrl: './pano-page.scss',
})
export class PanoPageComponent {}
