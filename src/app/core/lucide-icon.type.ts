import { Home } from 'lucide-angular';

/** lucide-angular doesn't publicly export its `LucideIconData` type via package exports, so we derive it locally. */
export type LucideIconData = typeof Home;
