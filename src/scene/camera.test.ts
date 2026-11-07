import test from 'node:test';
import assert from 'node:assert/strict';
import { Box3, PerspectiveCamera, Vector3 } from 'three';
import { fit } from './camera.ts';

test('landscape and portrait exports frame all bounds, including a vertical view', () => {
  const bounds = new Box3(new Vector3(-9, -3, -3.4), new Vector3(7.9, 3.3, 2.4));
  for (const aspect of [1920 / 830, 1080 / 1570]) for (const direction of [new Vector3(8, 5.5, 13), new Vector3(0, 1, 0)]) {
    const camera = new PerspectiveCamera(38, aspect, .01, 200);
    fit(camera, bounds, direction); camera.updateMatrixWorld();
    for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y]) for (const z of [bounds.min.z, bounds.max.z]) {
      const p = new Vector3(x, y, z).project(camera);
      assert.ok(Math.abs(p.x) < 1 && Math.abs(p.y) < 1 && p.z > -1 && p.z < 1);
    }
  }
});
