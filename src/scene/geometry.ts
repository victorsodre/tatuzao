import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export const materials = () => ({
  yellow: new T.MeshStandardMaterial({ color: '#f4bf24', roughness: .36, metalness: .18 }),
  ivory: new T.MeshStandardMaterial({ color: '#dce0de', roughness: .42, metalness: .28 }),
  steel: new T.MeshStandardMaterial({ color: '#526273', roughness: .38, metalness: .65 }),
  silver: new T.MeshStandardMaterial({ color: '#b0bdc5', roughness: .27, metalness: .8 }),
  dark: new T.MeshStandardMaterial({ color: '#18212c', roughness: .62, metalness: .38 }),
  rubber: new T.MeshStandardMaterial({ color: '#11151b', roughness: .9 }),
  glass: new T.MeshStandardMaterial({ color: '#183040', roughness: .18, metalness: .55 }),
  orange: new T.MeshStandardMaterial({ color: '#ef7d42', roughness: .4, metalness: .18 }),
  light: new T.MeshStandardMaterial({ color: '#eff7e2', roughness: .18, emissive: '#c4d1b1', emissiveIntensity: .4 }),
  red: new T.MeshStandardMaterial({ color: '#a8322e', roughness: .28 }),
});

export function mesh(parent: T.Object3D, geometry: T.BufferGeometry, material: T.Material, x = 0, y = 0, z = 0) {
  const item = new T.Mesh(geometry, material);
  item.position.set(x, y, z); item.castShadow = true; item.receiveShadow = true;
  parent.add(item); return item;
}

export function box(parent: T.Object3D, dimensions: [number, number, number], position: [number, number, number], material: T.Material, radius = 0) {
  const geometry = radius ? new RoundedBoxGeometry(...dimensions, 2, radius) : new T.BoxGeometry(...dimensions);
  return mesh(parent, geometry, material, ...position);
}

export function rod(parent: T.Object3D, radius: number, material: T.Material) {
  return mesh(parent, new T.CylinderGeometry(radius, radius, 1, 12), material);
}

const up = new T.Vector3(0, 1, 0);
export function connect(item: T.Mesh, a: T.Vector3, b: T.Vector3) {
  const direction = b.clone().sub(a);
  item.position.copy(a).add(b).multiplyScalar(.5);
  item.scale.y = Math.max(.001, direction.length());
  item.quaternion.setFromUnitVectors(up, direction.normalize());
}

export function disposeTree(root: T.Object3D) {
  const geometries = new Set<T.BufferGeometry>(), mats = new Set<T.Material>();
  root.traverse(object => { if (object instanceof T.Mesh) {
    geometries.add(object.geometry);
    for (const m of Array.isArray(object.material) ? object.material : [object.material]) mats.add(m);
  }});
  for (const g of geometries) g.dispose();
  for (const m of mats) {
    for (const v of Object.values(m)) if (v instanceof T.Texture) v.dispose();
    m.dispose();
  }
}

/** Batch only static siblings. Moving meshes and independently hidden panels stay separate. */
export function mergeStatic(group: T.Group) {
  const batches = new Map<T.Material, T.Mesh[]>();
  for (const child of group.children) if (child instanceof T.Mesh && !Array.isArray(child.material)) {
    const items = batches.get(child.material) ?? []; items.push(child); batches.set(child.material, items);
  }
  for (const [material, items] of batches) {
    if (items.length < 2) continue;
    const geometries = items.map(item => {
      item.updateMatrix();
      const geometry = item.geometry.index ? item.geometry.toNonIndexed() : item.geometry.clone();
      return geometry.applyMatrix4(item.matrix);
    });
    const merged = mergeGeometries(geometries, false);
    if (!merged) throw new Error('Não foi possível combinar a geometria estática.');
    for (const item of items) { group.remove(item); item.geometry.dispose(); }
    for (const geometry of geometries) geometry.dispose();
    mesh(group, merged, material);
  }
}
