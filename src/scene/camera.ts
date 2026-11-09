import { Box3, PerspectiveCamera, Vector3 } from 'three';

export function framing(bounds: Box3, aspect: number, direction: Vector3, fov = 38) {
  const center = bounds.getCenter(new Vector3());
  const forward = direction.clone().normalize();
  // Match lookAt's vertical-view adjustment before measuring projected corners.
  if (Math.abs(forward.y) > .9999) forward.z += .001;
  forward.normalize();
  const right = new Vector3(0, 1, 0).cross(forward).normalize();
  const up = forward.clone().cross(right).normalize();
  const tanV = Math.tan(fov * Math.PI / 360), tanH = tanV * Math.max(.1, aspect);
  let distance = 1;
  for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y]) for (const z of [bounds.min.z, bounds.max.z]) {
    const p = new Vector3(x, y, z).sub(center), toward = p.dot(forward);
    distance = Math.max(distance, Math.abs(p.dot(right)) / tanH + toward, Math.abs(p.dot(up)) / tanV + toward);
  }
  return { center, position: center.clone().addScaledVector(forward, distance * 1.08) };
}

export function fit(camera: PerspectiveCamera, bounds: Box3, direction: Vector3) {
  const pose = framing(bounds, camera.aspect, direction, camera.fov);
  camera.position.copy(pose.position); camera.lookAt(pose.center); camera.updateProjectionMatrix();
  return pose.center;
}

/**
 * New camera position after the viewport aspect changes. Direction, target and the user's zoom
 * relative to a full fit are kept; only the distance follows the new aspect.
 */
export function keepOrbit(position: Vector3, target: Vector3, bounds: Box3, fromAspect: number, toAspect: number, fov = 38) {
  const offset = position.clone().sub(target), length = offset.length();
  if (!(length > 1e-6) || !Number.isFinite(fromAspect) || !Number.isFinite(toAspect)) return position.clone();
  const direction = offset.divideScalar(length);
  const fitted = (aspect: number) => { const pose = framing(bounds, aspect, direction, fov); return pose.position.distanceTo(pose.center); };
  return target.clone().addScaledVector(direction, length * fitted(toAspect) / fitted(fromAspect));
}
