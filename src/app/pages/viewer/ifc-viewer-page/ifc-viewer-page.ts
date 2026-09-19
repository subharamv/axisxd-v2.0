import { Component } from '@angular/core';
import { ViewerProductPageComponent } from '../viewer-product-page/viewer-product-page';

@Component({
  selector: 'app-ifc-viewer-page',
  standalone: true,
  imports: [ViewerProductPageComponent],
  templateUrl: './ifc-viewer-page.html',
  styleUrl: './ifc-viewer-page.scss',
})
export class IfcViewerPageComponent {}
