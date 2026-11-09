import type * as T from 'three';
import type { PartId } from '../content/catalog.ts';
import type { ScrewRate } from '../simulation/balance.ts';
export type Part = { id: PartId; label: string; detail: string; note: string; source: string; group: T.Group };
/** Places the "sem a rua afundar" guide points at. */
export type GuideTarget = 'chamber' | 'erector' | 'grout' | 'street';
export type ViewState = { progress: number; cut: boolean; selected: string | null; isolated: boolean; wireframe: boolean; screw: ScrewRate; guide: GuideTarget | null };
export type SceneHandle = {
  parts: Part[]; update: (state: ViewState) => void;
  home: () => void; focus: (id: string) => void; frame: (target: GuideTarget) => void; zoom: (factor: number) => void;
  capture: (portrait?: boolean) => void; dispose: () => void;
};
