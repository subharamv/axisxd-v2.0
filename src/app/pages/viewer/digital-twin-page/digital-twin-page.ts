import { Component } from '@angular/core';
import { ViewerProductPageComponent } from '../viewer-product-page/viewer-product-page';

@Component({
  selector: 'app-digital-twin-page',
  standalone: true,
  imports: [ViewerProductPageComponent],
  templateUrl: './digital-twin-page.html',
  styleUrl: './digital-twin-page.scss',
})
export class DigitalTwinPageComponent {}
