import test from 'node:test';
import assert from 'node:assert/strict';
import { SCREW_RATES, screwRates } from './balance.ts';

test('faster screw removes more soil and lowers the illustrative push on the face', () => {
  const [slow, balanced, fast] = SCREW_RATES.map(rate => screwRates[rate]);
  assert.equal(balanced!.speed, 1);
  assert.equal(balanced!.push, 1);
  assert.ok(slow!.speed < balanced!.speed && balanced!.speed < fast!.speed);
  assert.ok(slow!.push > balanced!.push && balanced!.push > fast!.push && fast!.push > 0);
});
