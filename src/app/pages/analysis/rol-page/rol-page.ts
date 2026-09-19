import { Component } from '@angular/core';
import { ViewerProductPageComponent } from '../../viewer/viewer-product-page/viewer-product-page';

@Component({
  selector: 'app-rol-page',
  standalone: true,
  imports: [ViewerProductPageComponent],
  templateUrl: './rol-page.html',
  styleUrl: './rol-page.scss',
})
export class RolPageComponent {}
