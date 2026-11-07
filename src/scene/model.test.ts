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
