import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleCycle, advanceCycle, RING_WIDTH, SEGMENTS, OLD_RING_FACE } from './cycle.ts';

test('excavation advances one ring width and stops before assembly', () => {
  assert.equal(sampleCycle(0).advance, 0);
  assert.equal(sampleCycle(.25).advance, RING_WIDTH / 2);
  for (const p of [.5, .6, .8, 1]) assert.equal(sampleCycle(p).advance, RING_WIDTH);
  assert.equal(sampleCycle(.25).phase, 'excavating');
  assert.equal(sampleCycle(.65).phase, 'ringAssembly');
  assert.equal(sampleCycle(1).phase, 'complete');
});

test('excavated face matches advance; lining cannot precede excavation', () => {
  for (let i = 0; i <= 1000; i++) {
    const s = sampleCycle(i / 1000);
    assert.ok(Math.abs(s.faceX - (3.7 + s.advance)) < 1e-8);
    assert.ok(s.liningLength <= s.advance + 1e-8);
    assert.ok(s.installed >= 0 && s.installed <= SEGMENTS.length);
    if (i < 500) assert.equal(s.installed, 0);
  }
  assert.equal(sampleCycle(1).liningLength, RING_WIDTH);
});

test('six segments close exactly one ring; one support retracts at a time', () => {
  assert.ok(Math.abs(SEGMENTS.reduce((sum, s) => sum + s.span, 0) - Math.PI * 2) < 1e-8);
  for (const p of [.53, .61, .69, .77, .85, .93]) {
    const s = sampleCycle(p);
    assert.ok(s.padX.filter(x => x > OLD_RING_FACE + RING_WIDTH).length <= 1);
    assert.ok(s.padX.every(Number.isFinite));
  }
  assert.ok(sampleCycle(1).padX.every(x => x === OLD_RING_FACE + RING_WIDTH));
});

test('sampling is reversible and placement has deterministic final pose', () => {
  const before = sampleCycle(.7);
  sampleCycle(1); sampleCycle(.1);
  assert.deepEqual(sampleCycle(.7), before);
  assert.equal(sampleCycle(1).installed, 6);
  assert.equal(sampleCycle(0).installed, 0);
  assert.equal(sampleCycle(NaN).progress, 0);
  assert.equal(sampleCycle(-1).progress, 0);
  assert.equal(sampleCycle(2).progress, 1);
});

test('clock clamps deltas and pauses in hidden or stopped state', () => {
  assert.equal(advanceCycle(.3, 1, false, true), .3);
  assert.equal(advanceCycle(.3, 1, true, false), .3);
  assert.equal(advanceCycle(1, 1, true, true), 1);
  assert.equal(advanceCycle(.3, -1, true, true), .3);
  assert.equal(advanceCycle(.3, Infinity, true, true), .3);
  assert.ok(advanceCycle(.3, 100, true, true) < .31);
});

test('key is aligned radially before sliding axially into the closed ring', () => {
  const at = (placement: number) => sampleCycle(.5 + (5 + placement) * .08);
  const aligned = at(.68), inserting = at(.76), seated = at(.84);
  assert.equal(aligned.radius, 2);
  assert.ok(Math.abs(aligned.segmentX - (OLD_RING_FACE + RING_WIDTH + .65)) < 1e-8);
  assert.equal(inserting.radius, 2);
  assert.ok(inserting.segmentX < aligned.segmentX);
  assert.ok(Math.abs(seated.segmentX - (OLD_RING_FACE + RING_WIDTH / 2)) < 1e-8);
});
