import * as T from 'three';
import { connect } from './geometry.ts';
import { SEGMENTS, OLD_RING_FACE, RING_WIDTH } from '../simulation/cycle.ts';
import { screwRates, type ScrewRate } from '../simulation/balance.ts';
import type { Cycle } from '../simulation/cycle.ts';
import type { MachineModel } from './model.ts';

// Scratch vectors: applyCycle runs every frame while the cycle plays.
const from = new T.Vector3(), to = new T.Vector3(), pivot = new T.Vector3(), end = new T.Vector3(), exit = new T.Vector3(-8.9, .2, .35);

export function applyCycle(model: MachineModel, state: Cycle, cut: boolean, screw: ScrewRate = 'balanced', showPressure = false) {
  const rate = screwRates[screw];
  model.machine.position.x = state.advance;
  model.cutter.rotation.x = state.cutterAngle;model.auger.rotation.y = state.screwAngle * rate.speed;
  model.applySection(cut);
  model.soilBore.scale.x = state.faceX + 8.8;
  model.soilFace.position.x = state.faceX;model.soilFace.scale.x = 7.9 - state.faceX;
  model.freshGrout.visible = state.advance > 0;model.freshGrout.scale.x = Math.max(.001, state.advance);
  model.pressure.visible = showPressure;
  for (const arrow of model.pressure.children) arrow.scale.x = .8 * rate.push;
  for (let i = 0; i < SEGMENTS.length; i++) {
    const segment = SEGMENTS[i]!, y = Math.cos(segment.angle) * 1.98, z = Math.sin(segment.angle) * 1.98;
    const contactX = state.padX[i]! - state.advance;
    model.pads[i]!.position.x = contactX;
    connect(model.rods[i]!, from.set(-1, y, z), to.set(contactX, y, z));
    const part = model.segments[i]!;
    const placed = i < state.installed;
    part.visible = placed || i === state.activeIndex && state.placement >= .18;
    if (placed) {part.position.set(OLD_RING_FACE + RING_WIDTH / 2, 0, 0);part.rotation.x = segment.angle;}
    else if (i === state.activeIndex) {
      const offset = state.radius - 2;
      part.rotation.x = state.erectorAngle;
      part.position.set(state.segmentX, offset * Math.cos(state.erectorAngle), offset * Math.sin(state.erectorAngle));
    }
  }
  const active = state.activeIndex !== null && state.placement >= .18 && state.placement < .88;
  const angle = active ? state.erectorAngle : Math.PI, reach = active ? state.radius - .22 : .7;
  const x = active ? state.segmentX - state.advance : -1.45;
  pivot.set(x, 0, 0);end.set(x, Math.cos(angle) * reach, Math.sin(angle) * reach);
  connect(model.carriage, from.set(-1.45, 0, 0), pivot);
  connect(model.arm, pivot, end);model.gripper.position.copy(end);model.gripper.rotation.x = angle;
  // A slower screw lets fewer grains out; a faster one moves them quicker.
  const every = Math.max(1, Math.round(1 / rate.speed));
  for (let i = 0; i < model.grains.length; i++) {
    const grain = model.grains[i]!;grain.visible = state.transport && i % every === 0;
    const p = (state.progress * 7 * rate.speed + i / model.grains.length) % 1;
    if (p < .6) grain.position.lerpVectors(model.intake, model.discharge, p / .6);
    else grain.position.lerpVectors(model.discharge, exit, (p - .6) / .4);
    grain.position.z += Math.sin(i * 3) * .13;
  }
  model.root.updateMatrixWorld(true);
}
