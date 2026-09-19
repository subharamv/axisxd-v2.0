import { Component } from '@angular/core';
import { ViewerProductPageComponent } from '../viewer-product-page/viewer-product-page';

@Component({
  selector: 'app-mesh-page',
  standalone: true,
  imports: [ViewerProductPageComponent],
  templateUrl: './mesh-page.html',
  styleUrl: './mesh-page.scss',
})
export class MeshPageComponent {}
