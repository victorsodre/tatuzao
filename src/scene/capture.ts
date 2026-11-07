import * as T from 'three';
import { fit } from './camera.ts';

export function saveSceneImage(renderer: T.WebGLRenderer, scene: T.Scene, camera: T.PerspectiveCamera, bounds: T.Box3, portrait = false) {
  const width = portrait ? 1080 : 1920, height = portrait ? 1920 : 1080;
  const heading = portrait ? 250 : 150, footer = 100, sceneHeight = height - heading - footer;
  const size = renderer.getSize(new T.Vector2()), ratio = renderer.getPixelRatio(), aspect = camera.aspect;
  const position = camera.position.clone(), quaternion = camera.quaternion.clone();
  const direction = camera.getWorldDirection(new T.Vector3()).negate();
  const output = document.createElement('canvas'); output.width = width; output.height = height;
  const ctx = output.getContext('2d'); if (!ctx) throw new Error('Não foi possível preparar a imagem.');
  try {
    renderer.setPixelRatio(1); renderer.setSize(width, sceneHeight, false);
    camera.aspect = width / sceneHeight; fit(camera, bounds, direction);
    renderer.render(scene, camera);
    ctx.fillStyle = '#0b0d1a'; ctx.fillRect(0, 0, width, height);
    const gradient = ctx.createRadialGradient(width * .5, height * .45, 20, width * .5, height * .45, width * .7);
    gradient.addColorStop(0, '#182033'); gradient.addColorStop(1, '#0b0d1a'); ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height);
    ctx.drawImage(renderer.domElement, 0, heading);
    ctx.save(); ctx.translate(50, 38); ctx.scale(.42, .42); ctx.strokeStyle = '#ffd21f'; ctx.fillStyle = '#ffd21f'; ctx.lineWidth = 14;
    ctx.stroke(new Path2D('M50 12 A38 38 0 1 0 88 50')); ctx.beginPath(); ctx.arc(50, 50, 13, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.fillStyle = '#f1f2f8'; ctx.font = '34px "Archivo Black", sans-serif'; ctx.fillText('ovictorlab', 108, 72);
    ctx.font = `${portrait ? 56 : 44}px Anton, sans-serif`; ctx.fillText('TATUZÃO · UM ANEL POR VEZ', 50, portrait ? 174 : 130);
    ctx.fillStyle = '#a9aecb'; ctx.font = '22px Archivo, sans-serif'; ctx.fillText('Geometria autoral · EPB ilustrativa', 50, height - 53);
    ctx.textAlign = 'right'; ctx.fillStyle = '#ffd21f'; ctx.fillText('ovictorlab.com', width - 50, height - 53);
    output.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob), link = document.createElement('a');
      link.href = url; link.download = `ovictorlab-tatuzao${portrait ? '-vertical' : ''}.png`; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  } finally {
    renderer.setPixelRatio(ratio); renderer.setSize(size.x, size.y, false);
    camera.aspect = aspect; camera.position.copy(position); camera.quaternion.copy(quaternion); camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  }
}
