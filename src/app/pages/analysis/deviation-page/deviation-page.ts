import { Component } from '@angular/core';
import { ViewerProductPageComponent } from '../../viewer/viewer-product-page/viewer-product-page';

@Component({
  selector: 'app-deviation-page',
  standalone: true,
  imports: [ViewerProductPageComponent],
  templateUrl: './deviation-page.html',
  styleUrl: './deviation-page.scss',
})
export class DeviationPageComponent {}
