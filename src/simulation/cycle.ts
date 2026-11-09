export const RING_WIDTH = 1.2;
export const OLD_RING_FACE = -3;
/** Rings already built behind the machine at the start of the cycle. */
export const OLD_RINGS = 4;
/** Tail of the shield (machine coordinates): rings behind it touch the ground. */
export const TAIL_X = -4.4;
const radians = (degrees: number) => degrees * Math.PI / 180;
export const SEGMENTS = [180, 112, 248, 44, 316, 0].map((angle, i) => ({
  id: i === 5 ? 'key' : `segment-${i + 1}`,
  angle: radians(angle), span: radians(i === 5 ? 20 : 68),
}));
const clamp = (n: number) => Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0;
export const smooth = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t); };
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function sampleCycle(value: number) {
  const progress = clamp(value), advance = Math.min(1, progress / .5) * RING_WIDTH;
  const assembly = clamp((progress - .5) / .48) * SEGMENTS.length;
  const activeIndex = progress >= .5 && progress < .98 ? Math.min(5, Math.floor(assembly)) : null;
  const placement = activeIndex === null ? 0 : assembly - activeIndex;
  const installed = progress >= .98 ? 6 : Math.floor(assembly) + (placement >= .88 ? 1 : 0);
  const phase = progress >= .98 ? 'complete' : progress >= .5 ? 'ringAssembly' : 'excavating';
  const padX = SEGMENTS.map((_, i) => {
    if (i < Math.floor(assembly) || progress >= .98) return OLD_RING_FACE + RING_WIDTH;
    if (i !== activeIndex) return OLD_RING_FACE;
    const clearance = OLD_RING_FACE + RING_WIDTH + .38;
    if (placement < .18) return lerp(OLD_RING_FACE, clearance, smooth(placement / .18));
    if (placement < .88) return clearance;
    return lerp(clearance, OLD_RING_FACE + RING_WIDTH, smooth((placement - .88) / .12));
  });
  const angle = activeIndex === null ? Math.PI : SEGMENTS[activeIndex]!.angle;
  const turn = Math.atan2(Math.sin(angle - Math.PI), Math.cos(angle - Math.PI));
  const erectorAngle = Math.PI + turn * smooth((placement - .18) / .32);
  const isKey = activeIndex === 5;
  // The key reaches the crown first, then enters along the tunnel axis.
  const seating = smooth((placement - (isKey ? .68 : .5)) / (isKey ? .16 : .32));
  const radial = isKey ? smooth((placement - .5) / .16) : seating;
  const radius = lerp(1.22, 2, radial);
  const coverage = SEGMENTS.slice(0, installed).reduce((sum, s) => sum + s.span, 0) / (Math.PI * 2);
  return {
    progress, phase, advance, faceX: 3.7 + advance, tailX: TAIL_X + advance, activeIndex, placement,
    installed, padX, erectorAngle, radius, seating,
    segmentX: lerp(OLD_RING_FACE + RING_WIDTH + .65, OLD_RING_FACE + RING_WIDTH / 2, seating),
    liningLength: installed === 6 ? RING_WIDTH : coverage * RING_WIDTH,
    cutterAngle: Math.min(progress, .5) * Math.PI * 12,
    screwAngle: Math.min(progress, .5) * Math.PI * 30,
    transport: progress > 0 && progress < .5,
  } as const;
}
export type Cycle = ReturnType<typeof sampleCycle>;
export function advanceCycle(progress: number, seconds: number, playing: boolean, visible: boolean) {
  const dt = Number.isFinite(seconds) ? Math.min(.1, Math.max(0, seconds)) : 0;
  return clamp(clamp(progress) + (playing && visible ? dt / 28 : 0));
}
