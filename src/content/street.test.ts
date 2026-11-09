import test from 'node:test';
import assert from 'node:assert/strict';
import { guideProgress, streetGuide } from './street.ts';
import { sampleCycle } from '../simulation/cycle.ts';

test('guide covers front, middle, back and street, each with a source', () => {
  assert.deepEqual(streetGuide.map(s => s.target), ['chamber', 'erector', 'grout', 'street']);
  for (const step of streetGuide) assert.match(step.source, /^https:\/\//);
});

test('guide moves the cycle only when the current phase does not show the step', () => {
  const [front, middle, , street] = streetGuide;
  assert.equal(guideProgress(.4, front!.at), .4, 'already excavating');
  assert.equal(guideProgress(0, front!.at), front!.at, 'nothing moves at the very start');
  assert.equal(guideProgress(.8, front!.at), front!.at);
  assert.equal(guideProgress(.2, middle!.at), middle!.at);
  assert.equal(guideProgress(.7, middle!.at), .7);
  assert.equal(guideProgress(1, street!.at), 1, 'the street step works in any phase');
  assert.equal(sampleCycle(front!.at!).phase, 'excavating');
  assert.equal(sampleCycle(middle!.at!).phase, 'ringAssembly');
});
