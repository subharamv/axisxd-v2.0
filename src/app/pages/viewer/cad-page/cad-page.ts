import { Component } from '@angular/core';
import { ViewerProductPageComponent } from '../viewer-product-page/viewer-product-page';

@Component({
  selector: 'app-cad-page',
  standalone: true,
  imports: [ViewerProductPageComponent],
  templateUrl: './cad-page.html',
  styleUrl: './cad-page.scss',
})
export class CadPageComponent {}
