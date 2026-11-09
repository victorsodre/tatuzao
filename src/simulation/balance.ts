/**
 * Qualitative earth-pressure balance. The screw speed decides how much soil leaves the
 * chamber, and with it the pressure on the face (Herrenknecht, EPB Shield). Nothing here is
 * a calculation: `push` only scales the illustrative arrows in the chamber.
 */
export const SCREW_RATES = ['slow', 'balanced', 'fast'] as const;
export type ScrewRate = typeof SCREW_RATES[number];

export const screwRates: Record<ScrewRate, {label: string; speed: number; push: number; gauge: string; text: string}> = {
  slow: {label: 'Mais lenta', speed: .5, push: 1.25, gauge: 'Pressão subindo',
    text: 'Sai menos terra do que entra. A câmara fica mais apertada e a pressão na frente sobe.'},
  balanced: {label: 'No ponto', speed: 1, push: 1, gauge: 'Pressão equilibrada',
    text: 'Sai só a terra que entrou. A câmara cheia empurra a frente com a força do terreno.'},
  fast: {label: 'Mais rápida', speed: 1.8, push: .45, gauge: 'Pressão caindo',
    text: 'Sai mais terra do que entra. A pressão cai e a frente perde apoio. Por isso a equipe vigia e ajusta a pressão.'},
};
