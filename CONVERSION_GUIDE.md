# React → Angular conversion conventions

Source app root: `../src` (relative to this `Angular_Template` folder), a React 19 + Vite + Tailwind v4 app.
Target app root: `Angular_Template/src/app` (Angular 19, standalone components, Tailwind v3 via `tailwind.config.js`).

## File layout (MANDATORY)

Every component/page gets its own folder with three files, kebab-case:

```
src/app/<components|pages>/<feature>/<name>/
  <name>.component.ts
  <name>.component.html
  <name>.component.scss
```

Pages that are children of a section (e.g. blog detail articles) nest under that section's folder, mirroring the React `src/pages/<section>/...` tree. Example:
`src/pages/blog/BlogDetailPage.tsx` → `src/app/pages/blog/blog-detail-page/blog-detail-page.component.*`
`src/pages/blog/details/ifc-viewers-you-should-try-today.tsx` → `src/app/pages/blog/details/ifc-viewers-you-should-try-today/ifc-viewers-you-should-try-today.component.*`

Never put HTML or styles inline in the `.ts` file (no `template:`/`styles:` literals) — always use `templateUrl` + `styleUrl` pointing at the sibling files, even if the `.scss` ends up empty (Tailwind utility classes live in the `.html`).

## Component pattern

```ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-thing',
  standalone: true,
  imports: [CommonModule, RouterLink /* + LucideAngularModule, other child components used in the template */],
  templateUrl: './thing.component.html',
  styleUrl: './thing.component.scss',
})
export class ThingComponent {
  @Input() someProp!: string;
  @Output() someEvent = new EventEmitter<void>();
}
```

- React `props` → `@Input()`. React callback props (`onBack`, `onNavigate`, etc.) → `@Output() EventEmitter` **or**, where the callback was only ever used to navigate to a fixed route in the original `App.tsx`, replace it with a direct `routerLink`/`Router.navigate` call inside the component instead of plumbing an output through every parent. Prefer direct Angular Router navigation over event-emitter chains — it is more idiomatic and this codebase has no need for the React app's single-state-machine router.
- React `useState` → component field (plain field for simple cases, or `signal()` if the template needs fine-grained reactivity/animations keyed off it).
- React `useEffect` → `ngOnInit`/`ngOnDestroy` (implement `OnInit`/`OnDestroy`), or `effect()` for signal-driven side effects.
- React `useMemo`/`useCallback` → plain getter methods or `computed()` signals; Angular's change detection makes most memoization unnecessary — don't over-engineer.
- React conditional rendering (`{cond && <X/>}`, ternaries) → `*ngIf` / `@if` (new control-flow syntax is fine and preferred: `@if`, `@for`, `@switch`).
- React `.map()` lists → `@for (item of items; track item.id) { ... }`.
- `framer-motion`/`motion/react` (`motion.div`, `AnimatePresence`) → `@angular/animations` `trigger`/`transition`/`style`/`animate` in the `@Component({ animations: [...] })` array, matched as closely as possible to the original easing/duration/transform values. For simple entrance fades/slides, a CSS `@keyframes` in the component's `.scss` is also acceptable and often simpler — use judgement.
- GSAP usage (ScrollTrigger pins, timelines) → keep using the `gsap` package directly (already a dependency); initialize in `ngAfterViewInit`, clean up (`ScrollTrigger.kill()` / `gsap.context().revert()`) in `ngOnDestroy`. Use `ViewChild`/template refs instead of DOM refs.
- `lucide-react` icons → `lucide-angular`. Import `LucideAngularModule` in the component's `imports`, and render icons as `<lucide-icon [img]="IconName" [size]="18" />`. Where the source stores icon *components* inside a data array (see `src/data/shared-data.ts`), the Angular data file should store the same `lucide-angular` icon objects — the pattern translates directly, no restructuring needed.
- Tailwind utility classes in JSX `className` → copy verbatim into the Angular template's `class` attribute. Do not rewrite them into SCSS unless the original used a template literal / conditional class list, in which case use Angular's `[class.foo]="cond"` or `[ngClass]="{...}"`.
- `react-leaflet` maps → `leaflet` directly (already a dependency), initialized in `ngAfterViewInit` against a template `<div #mapEl>`.
- Do not use React Router — this app uses `provideRouter` (see `app.routes.ts`). Use `routerLink` in templates and `Router.navigate` in code.
- Preserve all copy, data, numbers, and imagery paths exactly. This is a faithful port, not a rewrite — don't "improve" the design or content.
- Image/asset paths referencing `/assets/...` stay the same string (Angular serves `public/` at root, same as the React app's `public/`).

## Shared infra already set up (reuse, do not re-create)

- `src/app/models/types.ts` — ported from `src/types.ts`.
- `src/app/data/*.ts` — ported 1:1 from `src/data/*.ts` and `src/presetData.ts`.
- `src/app/core/seo.service.ts` — replaces `<Seo />` (react-helmet). Call `this.seo.set({ title, description, canonicalPath, noindex })` in the page's `ngOnInit`.
- `src/app/core/consultation.service.ts` — replaces the `consultationOpen` state + `onOpenConsultation` prop drilling in `App.tsx`. Any component with a "Book a Consultation"/"Get a Demo" button should `inject(ConsultationService)` and call `.open()` instead of taking an `@Output()`.
- `src/app/components/footer/footer.component.*`, `card-navbar/`, `glass-navbar/`, `card-nav/`, `nav-style-toggle/`, `cookie-consent/`, `chat-widget/`, `animated-theme-toggler/`, `rotating-text/` — shared layout, already converted; import and reuse, don't duplicate.

## What NOT to do

- Don't invent new features or restructure component boundaries beyond what's needed for the React→Angular mapping.
- Don't add NgModules — everything is standalone.
- Don't skip the `.scss` file even if you think it's unnecessary — create it empty rather than omitting it, to match the required file layout.
- Don't leave `TODO`/stub content — convert the full component faithfully, including all sub-sections, animations, and data.
