import test from 'node:test';
import assert from 'node:assert/strict';
import { Box3, Mesh } from 'three';
import { createModel } from './model.ts';
import { applyCycle } from './rig.ts';
import { sampleCycle, OLD_RING_FACE, RING_WIDTH } from '../simulation/cycle.ts';

test('rig matches excavation, lining placement and preserves existing rings', () => {
  const model = createModel();
  assert.equal(new Set(model.parts.map(p => p.id)).size, 8);
  const old = new Box3().setFromObject(model.existingLining);
  for (let i = 0; i <= 100; i++) {
    const s = sampleCycle(i / 100); applyCycle(model, s, true);
    assert.equal(model.machine.position.x, s.advance);
    assert.equal(model.soilFace.position.x, s.faceX);
    assert.ok(new Box3().setFromObject(model.existingLining).equals(old));
    model.root.traverse(o => assert.ok([...o.position.toArray(), ...o.scale.toArray(), ...o.quaternion.toArray()].every(Number.isFinite)));
    for (let j = 0; j < s.installed; j++) {
      const segment = model.segments[j]!;
      assert.equal(segment.visible, true);
      assert.equal(segment.position.x, OLD_RING_FACE + RING_WIDTH / 2);
    }
  }
  applyCycle(model, sampleCycle(0), true);
  assert.equal(model.segments.filter(s => s.visible).length, 0);
  model.root.traverse(o => { if (o instanceof Mesh) assert.ok(o.geometry.getAttribute('position').count > 0); });
  model.dispose();
});

test('grout fills the gap from the oldest ring up to the tail as the machine advances', () => {
  const model = createModel();
  const rings = new Box3().setFromObject(model.existingLining);
  for (let i = 0; i <= 50; i++) {
    const s = sampleCycle(i / 50); applyCycle(model, s, true);
    const grout = new Box3().setFromObject(model.grout), shield = new Box3().setFromObject(model.shield);
    assert.ok(Math.abs(grout.max.x - s.tailX) < .002, `grout ends at the tail (${grout.max.x} vs ${s.tailX})`);
    assert.ok(Math.abs(shield.min.x - s.tailX) < 1e-6, 'tailX matches the shield geometry');
    assert.ok(grout.min.x <= rings.min.x + .02, 'no ring outside the tail is left without grout');
  }
  assert.ok(sampleCycle(1).tailX <= OLD_RING_FACE, 'the new ring is still inside the tail when the cycle ends');
  model.dispose();
});

test('street stays fixed above the ground and the screw rate only scales the illustrative arrows', () => {
  const model = createModel();
  const street = new Box3().setFromObject(model.street), soil = new Box3().setFromObject(model.soilBore);
  assert.ok(street.min.y >= soil.max.y - 1e-6, 'street sits on top of the soil');
  const lengths: number[] = [];
  for (const rate of ['slow', 'balanced', 'fast'] as const) for (const p of [0, .3, .7, 1]) {
    applyCycle(model, sampleCycle(p), true, rate, true);
    assert.ok(new Box3().setFromObject(model.street).equals(street), 'the street never moves');
    if (p === .3) lengths.push(model.pressure.children[0]!.scale.x);
  }
  assert.ok(lengths[0]! > lengths[1]! && lengths[1]! > lengths[2]!);
  applyCycle(model, sampleCycle(.3), true);
  assert.equal(model.pressure.visible, false, 'arrows only appear in the front step');
  model.dispose();
});
