import * as T from 'three';
import { catalog } from '../content/catalog.ts';
import { SEGMENTS, OLD_RING_FACE, RING_WIDTH } from '../simulation/cycle.ts';
import { box, mesh, rod, mergeStatic, disposeTree } from './geometry.ts';
import type { Part } from './types.ts';

/** Annular sector in the YZ plane; the machine advances along X. */
function sector(inner: number, outer: number, span: number, depth: number) {
  const points: T.Vector2[] = [], steps = Math.ceil(span * 18);
  for (let i = 0; i <= steps; i++) {
    const a = -span / 2 + i / steps * span;
    points.push(new T.Vector2(-outer * Math.sin(a), outer * Math.cos(a)));
  }
  for (let i = steps; i >= 0; i--) {
    const a = -span / 2 + i / steps * span;
    points.push(new T.Vector2(-inner * Math.sin(a), inner * Math.cos(a)));
  }
  const g = new T.ExtrudeGeometry(new T.Shape(points), { depth, bevelEnabled: false, steps: 1 });
  return g.rotateY(Math.PI / 2).translate(-depth / 2, 0, 0);
}
function cylinderX(parent: T.Object3D, radius: number, length: number, material: T.Material, x: number, y = 0, z = 0) {
  const m = mesh(parent, new T.CylinderGeometry(radius, radius, length, 40), material, x, y, z);
  m.rotation.z = Math.PI / 2; return m;
}
function flight(length: number) {
  const positions: number[] = [], indices: number[] = [], steps = 240;
  for (let i = 0; i <= steps; i++) {
    const a = i / steps * Math.PI * 18;
    for (const radius of [.085, .31]) positions.push(Math.cos(a) * radius, (i / steps - .5) * length, Math.sin(a) * radius);
    if (i < steps) { const n = i * 2; indices.push(n, n + 1, n + 2, n + 1, n + 3, n + 2); }
  }
  const g = new T.BufferGeometry();g.setAttribute('position', new T.Float32BufferAttribute(positions, 3));g.setIndex(indices);g.computeVertexNormals();return g;
}
function soilSection() {
  // Back half of a rectangular ground volume, with a semicircular excavated opening.
  const points = [new T.Vector2(3.4, -2.8), new T.Vector2(0, -2.8), new T.Vector2(0, -2.27)];
  for (let i = 0; i <= 48; i++) {
    const a = -Math.PI / 2 + i / 48 * Math.PI;
    points.push(new T.Vector2(Math.cos(a) * 2.27, Math.sin(a) * 2.27));
  }
  points.push(new T.Vector2(0, 3.2), new T.Vector2(3.4, 3.2));
  return new T.ExtrudeGeometry(new T.Shape(points), {depth: 1, bevelEnabled: false}).rotateY(Math.PI / 2);
}
export function createModel() {
  const root = new T.Group(), machine = new T.Group(); root.add(machine);
  const parts: Part[] = catalog.map(info => ({...info, group: new T.Group()}));
  for (const part of parts) {
    part.group.name = part.id; part.group.userData.partId = part.id;
    (part.id === 'lining' ? root : machine).add(part.group);
  }
  const group = (id: string) => parts.find(p => p.id === id)!.group;
  const material = (color: string, metalness = .2, roughness = .5) => new T.MeshStandardMaterial({color, metalness, roughness});
  const yellow = material('#e8b82d', .38, .35), dark = material('#273344', .6, .4), steel = material('#a5b2bd', .8, .28);
  const pale = material('#d3d8d2', .15, .7), concrete = material('#b6b5a7', 0, .9), newConcrete = material('#eee0ae', .05, .75);
  const soil = material('#6d4935', 0, .95), soilLight = material('#94704b', 0, .95), rubber = material('#19232b', .1, .8);
  const orange = material('#ef7d42', .25, .4), bolt = material('#d4dce3', .75, .28);
  const sectionPlane = new T.Plane(new T.Vector3(0, 0, -1), 0);
  const sectionMaterials: T.MeshStandardMaterial[] = [];

  const cutter = new T.Group(); group('cutting').add(cutter);cutter.position.x = 3.55;
  mesh(cutter, sector(1.84, 2.24, Math.PI * 2 - .002, .3), yellow);
  cylinderX(cutter, .48, .4, steel, .04);
  for (let i = 0; i < 6; i++) {
    const arm = new T.Group(); arm.rotation.x = i * Math.PI / 3; cutter.add(arm);
    box(arm, [.22, 1.58, .25], [0, 1.07, 0], yellow, .03);
    for (let j = 0; j < 4; j++) box(arm, [.16, .12, .32], [.18, .62 + j * .38, .1], steel, .025);
  }
  for (let i = 0; i < 30; i++) {
    const a = i / 30 * Math.PI * 2;
    box(cutter, [.12, .1, .1], [.19, Math.cos(a) * 2.04, Math.sin(a) * 2.04], bolt, .015);
  }
  mergeStatic(cutter);

  const shield = group('shield'), frontShell = new T.Group(); shield.add(frontShell);
  for (const [start, length, color] of [[-.45, 7.9, yellow], [2.9, .65, dark]] as const) {
    const back = mesh(shield, sector(2.13, 2.21, Math.PI, length), color, start); back.rotation.x = -Math.PI / 2;
    const front = mesh(frontShell, sector(2.13, 2.21, Math.PI, length), color, start); front.rotation.x = Math.PI / 2;
  }
  for (const x of [-4.35, -4.1, -.9, 2.55]) {
    const back = mesh(shield, sector(2.08, 2.24, Math.PI, .09), steel, x); back.rotation.x = -Math.PI / 2;
    const front = mesh(frontShell, sector(2.08, 2.24, Math.PI, .09), steel, x); front.rotation.x = Math.PI / 2;
  }
  // Platform and drive are fixed to the machine, independent of the lining behind it.
  box(shield, [5.6, .12, 1.05], [-.4, -1.48, -.72], dark, .03);
  cylinderX(shield, .7, 1.45, dark, 1.55);
  for (let i = 0; i < 5; i++) {
    const a = i * Math.PI * 2 / 5;
    cylinderX(shield, .24, .9, steel, 1.3, Math.cos(a) * 1.05, Math.sin(a) * 1.05);
  }
  mergeStatic(shield); mergeStatic(frontShell);

  const chamber = group('chamber');
  const chamberSoil = soil.clone(), bulkhead = dark.clone();
  sectionMaterials.push(chamberSoil, bulkhead);
  cylinderX(chamber, 2.1, .76, chamberSoil, 2.98);
  const plateShape = new T.Shape();plateShape.absarc(0, 0, 2.12, 0, Math.PI * 2, false);
  for (const [u, v, radius] of [[0, 0, .5], [-.35, -1.35, .36]]) {const hole = new T.Path();hole.absarc(u!, v!, radius!, 0, Math.PI * 2, true);plateShape.holes.push(hole);}
  const plate = new T.ExtrudeGeometry(plateShape, {depth: .12, bevelEnabled: false}).rotateY(Math.PI / 2);
  mesh(chamber, plate, bulkhead, 2.52);

  const intake = new T.Vector3(2.9, -1.35, .35), discharge = new T.Vector3(-3.7, .38, .35), screwLength = intake.distanceTo(discharge);
  const screwAxis = new T.Group();group('screw').add(screwAxis);screwAxis.position.copy(intake).add(discharge).multiplyScalar(.5);screwAxis.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), discharge.clone().sub(intake).normalize());
  const auger = new T.Group();screwAxis.add(auger);
  mesh(auger, new T.CylinderGeometry(.085, .085, screwLength, 16), steel);
  const flightMaterial = steel.clone();flightMaterial.side = T.DoubleSide;mesh(auger, flight(screwLength), flightMaterial);
  const tubeMaterial = pale.clone();tubeMaterial.transparent = true;tubeMaterial.opacity = .2;tubeMaterial.depthWrite = false;
  mesh(screwAxis, new T.CylinderGeometry(.35, .35, screwLength, 32, 1, true), tubeMaterial);
  mesh(screwAxis, new T.CylinderGeometry(.42, .42, .55, 32), dark, 0, screwLength / 2 + .3);

  const conveyor = group('conveyor');
  box(conveyor, [5.3, .12, .85], [-6.25, .02, .35], rubber, .025);
  for (const z of [-.15, .85]) box(conveyor, [5.5, .16, .08], [-6.25, .14, z], yellow, .025);
  for (const x of [-8.4, -6.5, -4.6]) {
    for (const z of [-.17, .87]) box(conveyor, [.1, 1.7, .1], [x, -.85, z], steel, .02);
    box(conveyor, [.65, .12, 1.3], [x, -1.72, .35], dark, .02);
  }
  for (let i = 0; i < 20; i++) box(conveyor, [.04, .04, .8], [-8.7 + i * .26, .1, .35], steel);
  mergeStatic(conveyor);
  const grains: T.Mesh[] = [];
  for (let i = 0; i < 28; i++) {const grain = mesh(conveyor, new T.IcosahedronGeometry(.08 + i % 3 * .015, 0), soilLight);grain.raycast = () => {};grains.push(grain);}

  const thrust = group('thrust');
  const rods: T.Mesh[] = [], pads: T.Mesh[] = [];
  for (const segment of SEGMENTS) {
    const y = Math.cos(segment.angle) * 1.98, z = Math.sin(segment.angle) * 1.98;
    cylinderX(thrust, .14, 1.5, yellow, -.25, y, z);
    const piston = rod(thrust, .075, steel);rods.push(piston);
    const pad = box(thrust, [.15, .22, .34], [OLD_RING_FACE, y, z], dark, .025);pad.rotation.x = segment.angle;pads.push(pad);
  }

  const erector = group('erector'), arm = rod(erector, .1, orange), gripper = box(erector, [.4, .16, .48], [0, 0, 0], steel, .03);
  cylinderX(erector, .36, .55, dark, -1.45);
  mesh(erector, sector(.43, .56, Math.PI * 2 - .002, .22), orange, -1.45);
  const carriage = rod(erector, .12, steel);
  box(erector, [1.9, .12, .15], [-1.6, -.4, -.35], steel, .03);

  const lining = group('lining'), existingLining = new T.Group();lining.add(existingLining);
  const oldMaterial = concrete.clone();sectionMaterials.push(oldMaterial);
  for (let ring = 0; ring < 4; ring++) for (const segment of SEGMENTS) {
    const m = mesh(existingLining, sector(1.83, 2.15, segment.span - .014, RING_WIDTH - .025), oldMaterial, OLD_RING_FACE - RING_WIDTH * (ring + .5));m.rotation.x = segment.angle;
  }
  mergeStatic(existingLining);
  const segments = SEGMENTS.map((segment, i) => {
    const m = mesh(lining, sector(1.83, 2.15, segment.span - .014, RING_WIDTH - .025), i === 5 ? orange : newConcrete, OLD_RING_FACE + RING_WIDTH / 2);m.rotation.x = segment.angle;m.name = segment.id;return m;
  });
  const groutMaterial = material('#837e70', 0, .95);sectionMaterials.push(groutMaterial);
  mesh(existingLining, sector(2.16, 2.27, Math.PI * 2 - .002, 3.3), groutMaterial, -6.15);

  const terrain = new T.Group(), soilBore = new T.Group(), soilFace = new T.Group();terrain.add(soilBore, soilFace);root.add(terrain);
  mesh(soilBore, soilSection(), soil);soilBore.position.x = -8.8;
  box(soilFace, [1, 6, 3.4], [.5, .2, -1.7], soil);
  box(soilBore, [1, .13, 3.4], [.5, 3.17, -1.7], soilLight);
  box(soilFace, [1, .13, 3.4], [.5, 3.17, -1.7], soilLight);
  // Quiet layer boundaries on the section face; no geological data is implied.
  for (const y of [-2.65, 2.65, 2.9]) box(soilBore, [1, .025, .015], [.5, y, .008], soilLight);
  const floor = box(terrain, [16.7, .2, 7], [-.45, -2.92, -.1], soil);
  floor.receiveShadow = true;

  const applySection = (cut: boolean) => {
    terrain.visible = cut;frontShell.visible = !cut;
    for (const m of sectionMaterials) {m.clippingPlanes = cut ? [sectionPlane] : [];m.clipShadows = true;}
  };
  return {root, machine, parts, cutter, auger, grains, intake, discharge, rods, pads, arm, gripper, carriage, segments, existingLining, soilBore, soilFace, terrain, applySection, dispose: () => disposeTree(root)};
}
export type MachineModel = ReturnType<typeof createModel>;
