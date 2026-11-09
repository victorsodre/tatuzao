import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createModel } from './model.ts';
import { applyCycle } from './rig.ts';
import { sampleCycle } from '../simulation/cycle.ts';
import { fit, keepOrbit } from './camera.ts';
import { saveSceneImage } from './capture.ts';
import type { GuideTarget, SceneHandle, ViewState } from './types.ts';

/** Parts that are visible from outside; anything else needs the shield to turn see-through. */
const OUTSIDE = new Set(['shield', 'cutting']);
const TAP_DISTANCE = 6, TAP_TIME = 450;
/** The cut view, street included. */
const SECTION = new T.Box3(new T.Vector3(-9, -3, -3.4), new T.Vector3(7.9, 5, 2.4));

export function createScene(host: HTMLElement, onSelect: (id: string) => void, onError: (text: string) => void): SceneHandle {
  const renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));renderer.localClippingEnabled = true;
  renderer.toneMapping = T.ACESFilmicToneMapping;renderer.toneMappingExposure = 1;renderer.shadowMap.enabled = true;renderer.shadowMap.type = T.PCFShadowMap;
  const canvas = renderer.domElement;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Tuneladora EPB em corte sob uma rua, em 3D. Arraste para girar ou selecione um conjunto na lista.');
  host.append(canvas);
  const scene = new T.Scene(), camera = new T.PerspectiveCamera(38, 1, .01, 200);
  const controls = new OrbitControls(camera, canvas);controls.enableDamping = false;controls.minDistance = 2;controls.maxDistance = 75;
  // OrbitControls blocks every touch gesture; vertical swipes must keep scrolling the page.
  canvas.style.touchAction = 'pan-y';
  const room = new RoomEnvironment(), pmrem = new T.PMREMGenerator(renderer), env = pmrem.fromScene(room, .04);scene.environment = env.texture;scene.environmentIntensity = .5;room.dispose();pmrem.dispose();
  scene.add(new T.HemisphereLight('#dbe8ff', '#483d30', 1.15));
  const key = new T.DirectionalLight('#fff1d2', 2.5);key.position.set(4, 10, 8);key.castShadow = true;key.shadow.mapSize.set(1024, 1024);key.shadow.camera.left = -15;key.shadow.camera.right = 15;key.shadow.camera.top = 10;key.shadow.camera.bottom = -10;key.shadow.camera.far = 45;key.shadow.bias = -.0005;scene.add(key);
  const rim = new T.DirectionalLight('#b4d3ff', 1.9);rim.position.set(-6, 5, -5);scene.add(rim);
  const model = createModel();scene.add(model.root);
  const highlight = new T.BoxHelper(new T.Object3D(), '#ffd21f');highlight.visible = false;scene.add(highlight);
  let state: ViewState = { progress: 0, cut: true, selected: null, isolated: false, wireframe: false, screw: 'balanced', guide: null };
  let disposed = false, active = false, contextLost = false, framed = false, last = -Infinity;
  let previousPose: {position: T.Vector3; target: T.Vector3} | null = null;
  const homeDirection = new T.Vector3(8, 5.5, 13), guideDirection = new T.Vector3(2.5, 1.8, 8);
  const selectedPart = () => model.parts.find(p => p.id === state.selected);
  // The street step points at the markers with its own yellow indicators instead of a bounding box.
  const guideObject = (target: GuideTarget | null) => target === 'grout' ? model.grout : target === 'chamber' || target === 'erector' ? model.parts.find(p => p.id === target)!.group : null;
  const bounds = () => {
    if (state.isolated && selectedPart()) return new T.Box3().setFromObject(selectedPart()!.group);
    if (state.cut) return SECTION.clone();
    const b = new T.Box3();for (const part of model.parts) b.expandByObject(part.group);return b;
  };
  const invalidate = () => {if (disposed || active || document.hidden || contextLost) return;active = true;renderer.setAnimationLoop(frame);};
  function frame(time: number) {
    if (time - last < 1000 / 30) return;last = time;
    renderer.render(scene, camera);
    const data = canvas.dataset;data.renderCount = String(Number(data.renderCount ?? 0) + 1);
    data.drawCalls = String(renderer.info.render.calls);data.triangles = String(renderer.info.render.triangles);
    data.cameraPose = JSON.stringify([...camera.position.toArray(), ...controls.target.toArray()]);
    renderer.setAnimationLoop(null);active = false;
  }
  /** Frame a box along a direction: the default one for "Reenquadrar", the user's current one otherwise. */
  const frameBox = (box: T.Box3, direction = camera.position.clone().sub(controls.target)) => {
    controls.target.copy(fit(camera, box, direction.lengthSq() > 1e-8 ? direction : homeDirection));controls.update();framed = true;invalidate();
  };
  const home = () => frameBox(bounds(), homeDirection);
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();if (width < 1 || height < 1) return;
    const aspect = width / height, previous = camera.aspect, current = renderer.getSize(new T.Vector2());
    if (current.x !== width || current.y !== height) renderer.setSize(width, height);
    // Resize and fullscreen keep the user's orbit: only the distance follows the new aspect.
    if (framed && Math.abs(previous - aspect) > 1e-4) camera.position.copy(keepOrbit(camera.position, controls.target, bounds(), previous, aspect, camera.fov));
    camera.aspect = aspect;camera.updateProjectionMatrix();controls.update();invalidate();
  };
  const observer = new ResizeObserver(resize);observer.observe(host);controls.addEventListener('change', invalidate);
  // Plain wheel scrolls the page; Ctrl/⌘ + wheel (and trackpad pinch) still zoom.
  const wheel = (e: WheelEvent) => {if (!e.ctrlKey && !e.metaKey) e.stopPropagation();};
  host.addEventListener('wheel', wheel, {capture: true, passive: true});
  // Only a short, still tap selects. Drags, scrolls and taps on empty space change nothing.
  let tap: {id: number; x: number; y: number; time: number} | null = null;
  const pointerDown = (e: PointerEvent) => {tap = e.isPrimary ? {id: e.pointerId, x: e.clientX, y: e.clientY, time: performance.now()} : null;};
  const pointerCancel = () => {tap = null;};
  const pointerUp = (e: PointerEvent) => {
    const start = tap;tap = null;
    if (!start || start.id !== e.pointerId || Math.hypot(e.clientX - start.x, e.clientY - start.y) > TAP_DISTANCE || performance.now() - start.time > TAP_TIME) return;
    const rect = canvas.getBoundingClientRect(), ray = new T.Raycaster(), candidates: T.Mesh[] = [];
    ray.setFromCamera(new T.Vector2((e.clientX - rect.left) / rect.width * 2 - 1, -(e.clientY - rect.top) / rect.height * 2 + 1), camera);
    for (const part of model.parts) part.group.traverseVisible(o => {if (o instanceof T.Mesh) candidates.push(o);});
    const hits = ray.intersectObjects(candidates, false).filter(hit => {
      const material = (hit.object as T.Mesh).material, materials = Array.isArray(material) ? material : [material];
      return !materials.some(m => m.clippingPlanes?.some(p => p.distanceToPoint(hit.point) < 0));
    });
    let current: T.Object3D | undefined = hits[0]?.object;
    while (current && !current.userData.partId) current = current.parent ?? undefined;
    if (current) onSelect(current.userData.partId);
  };
  canvas.addEventListener('pointerdown', pointerDown);canvas.addEventListener('pointerup', pointerUp);canvas.addEventListener('pointercancel', pointerCancel);
  const visibility = () => {if (document.hidden) {renderer.setAnimationLoop(null);active = false;} else {last = -Infinity;invalidate();}};
  document.addEventListener('visibilitychange', visibility);
  const lost = (e: Event) => {e.preventDefault();contextLost = true;renderer.setAnimationLoop(null);active = false;onError('A cena 3D foi interrompida. Recarregue para restaurá-la. As explicações e fontes continuam disponíveis.');};
  canvas.addEventListener('webglcontextlost', lost);
  applyCycle(model, sampleCycle(0), true);resize();home();
  return {
    parts: model.parts,
    update(next) {
      const before = state;state = next;
      const section = state.cut && !state.isolated;
      applyCycle(model, sampleCycle(state.progress), section, state.screw, section && state.guide === 'chamber');
      model.terrain.visible = section;model.survey.visible = section && state.guide === 'street';
      for (const part of model.parts) part.group.visible = !state.isolated || part.id === state.selected;
      if (state.wireframe !== before.wireframe) model.root.traverse(o => {if (o instanceof T.Mesh) for (const m of Array.isArray(o.material) ? o.material : [o.material]) if (m instanceof T.MeshStandardMaterial) m.wireframe = state.wireframe;});
      model.setXray(!state.cut && !state.isolated && state.selected !== null && !OUTSIDE.has(state.selected));
      const target = state.isolated ? null : selectedPart()?.group ?? guideObject(state.guide);
      highlight.visible = Boolean(target);
      if (target) highlight.setFromObject(target);
      if (!before.isolated && state.isolated) {previousPose = {position: camera.position.clone(), target: controls.target.clone()};frameBox(bounds());}
      if (before.isolated && !state.isolated && previousPose) {camera.position.copy(previousPose.position);controls.target.copy(previousPose.target);controls.update();previousPose = null;}
      canvas.dataset.progress = state.progress.toFixed(4);invalidate();
    },
    home,
    focus(id) {const part = model.parts.find(p => p.id === id);if (part) frameBox(new T.Box3().setFromObject(part.group));},
    // Every guide step uses the same locked view of the whole section, from street to tunnel: the
    // highlight moves, the camera does not, and nothing is cropped while the panel changes steps.
    frame() {frameBox(SECTION.clone(), guideDirection);},
    zoom(factor) {camera.position.sub(controls.target).multiplyScalar(factor).add(controls.target);controls.update();invalidate();},
    capture(portrait = false) {saveSceneImage(renderer, scene, camera, bounds(), portrait);invalidate();},
    dispose() {
      disposed = true;renderer.setAnimationLoop(null);observer.disconnect();controls.removeEventListener('change', invalidate);controls.dispose();
      host.removeEventListener('wheel', wheel, {capture: true});
      canvas.removeEventListener('pointerdown', pointerDown);canvas.removeEventListener('pointerup', pointerUp);canvas.removeEventListener('pointercancel', pointerCancel);canvas.removeEventListener('webglcontextlost', lost);document.removeEventListener('visibilitychange', visibility);
      model.dispose();env.dispose();highlight.geometry.dispose();(highlight.material as T.Material).dispose();renderer.dispose();canvas.remove();
    },
  };
}
