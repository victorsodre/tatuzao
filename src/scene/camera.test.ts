import test from 'node:test';
import assert from 'node:assert/strict';
import { Box3, PerspectiveCamera, Vector3 } from 'three';
import { fit, keepOrbit } from './camera.ts';

const bounds = new Box3(new Vector3(-9, -3, -3.4), new Vector3(7.9, 4.8, 2.4));

test('landscape and portrait exports frame all bounds, including a vertical view', () => {
  for (const aspect of [1920 / 830, 1080 / 1570]) for (const direction of [new Vector3(8, 5.5, 13), new Vector3(0, 1, 0)]) {
    const camera = new PerspectiveCamera(38, aspect, .01, 200);
    fit(camera, bounds, direction); camera.updateMatrixWorld();
    for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y]) for (const z of [bounds.min.z, bounds.max.z]) {
      const p = new Vector3(x, y, z).project(camera);
      assert.ok(Math.abs(p.x) < 1 && Math.abs(p.y) < 1 && p.z > -1 && p.z < 1);
    }
  }
});

test('resizing keeps the orbit direction, the target and the relative zoom', () => {
  const target = new Vector3(1, .5, -.2), position = new Vector3(-14, 9, 11);
  const next = keepOrbit(position, target, bounds, 2.2, .7);
  const before = position.clone().sub(target), after = next.clone().sub(target);
  assert.ok(after.clone().normalize().distanceTo(before.clone().normalize()) < 1e-9);
  assert.ok(after.length() > before.length(), 'a narrower viewport moves the camera back');
  const back = keepOrbit(next, target, bounds, .7, 2.2);
  assert.ok(back.distanceTo(position) < 1e-9, 'resizing back restores the same pose');
  assert.ok(keepOrbit(position, target, bounds, 1.5, 1.5).distanceTo(position) < 1e-9);
  assert.ok(keepOrbit(target, target, bounds, 1, 2).equals(target), 'degenerate pose is left alone');
});
