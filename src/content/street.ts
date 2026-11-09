import type { GuideTarget } from '../scene/types.ts';
import { sampleCycle } from '../simulation/cycle.ts';

export const sources = {
  herrenknecht: 'https://www.herrenknecht.com/en/products/productdetail/epb-shield/',
  monitoring: 'https://anptrilhos.org.br/wp-content/uploads/2024/11/1-820_artigo_remanejamentodeadutora.pdf',
};

/** "Sem a rua afundar": the three places of the episode plus the measurement on the street. `at` is a cycle position that shows the step; the cycle jumps there unless it is already in that phase. */
export const streetGuide: readonly {place: string; short: string; title: string; text: string; target: GuideTarget; source: string; sourceLabel: string; at?: number}[] = [
  {place: 'NA FRENTE', short: 'Frente', title: 'A câmara cheia segura a frente', target: 'chamber', at: .3,
    text: 'A roda corta e a terra fica presa na câmara, empurrando a frente com a força do terreno. A rosca tira só a terra que entrou: a velocidade dela decide quanto sai e, com isso, a pressão.',
    source: sources.herrenknecht, sourceLabel: 'Herrenknecht, EPB Shield'},
  {place: 'NO MEIO', short: 'Meio', title: 'O escudo segura o terreno', target: 'erector', at: .62,
    text: 'O escudo de aço segura a terra em volta. Lá dentro, o eretor monta um anel de concreto, peça por peça.',
    source: sources.herrenknecht, sourceLabel: 'Herrenknecht, EPB Shield'},
  {place: 'ATRÁS', short: 'Atrás', title: 'A fresta recebe argamassa', target: 'grout', at: .45,
    text: 'Entre o anel e a terra sobra uma fresta. Ela é preenchida com argamassa enquanto a máquina avança. O trecho claro é a argamassa deste avanço.',
    source: sources.herrenknecht, sourceLabel: 'Herrenknecht, EPB Shield'},
  {place: 'LÁ EM CIMA', short: 'Rua', title: 'A rua é medida sem parar', target: 'street',
    text: 'Marcos no asfalto e pinos nos prédios são medidos o tempo todo. Se a rua começar a descer, a equipe ajusta a pressão.',
    source: sources.monitoring, sourceLabel: 'Metrô de São Paulo, ANPTrilhos 2024'},
];

/** Cycle position for a guide step: keep the user's position if it already shows the step, else jump to `at`. */
export function guideProgress(progress: number, at?: number) {
  if (at === undefined) return progress;
  const want = sampleCycle(at).phase, now = sampleCycle(progress);
  // At the very start of the excavation nothing has moved yet (no screw flow, no fresh grout).
  return now.phase === want && (want !== 'excavating' || now.progress >= .15) ? progress : at;
}
