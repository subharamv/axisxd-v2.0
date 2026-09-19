import { Component } from '@angular/core';
import { BlogDetailPageComponent } from '../../blog-detail-page/blog-detail-page';

/**
 * Thin wrapper mirroring src/pages/blog/details/ifc-viewers-you-should-try-today.tsx,
 * which pins BlogDetailPage to blogId="b1". Not referenced by app.routes.ts —
 * same orphaned status as in the original React app (the app navigates via the
 * dynamic blog/:id route + BLOG_DATA lookup instead).
 */
@Component({
  selector: 'app-ifc-viewers-you-should-try-today',
  standalone: true,
  imports: [BlogDetailPageComponent],
  templateUrl: './ifc-viewers-you-should-try-today.html',
  styleUrl: './ifc-viewers-you-should-try-today.scss',
})
export class IfcViewersYouShouldTryTodayComponent {
  readonly blogId = 'b1';
}
