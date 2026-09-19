import { Component } from '@angular/core';
import { ViewerProductPageComponent } from '../../viewer/viewer-product-page/viewer-product-page';

@Component({
  selector: 'app-clash-page',
  standalone: true,
  imports: [ViewerProductPageComponent],
  templateUrl: './clash-page.html',
  styleUrl: './clash-page.scss',
})
export class ClashPageComponent {}
