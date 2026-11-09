// Lista canônica da coleção. Um lab novo entra aqui e `npm run sync` leva a
// lista a todos os labs.
export type Experiment = { slug: string; title: string; description: string };

// Ordem: temas com mais audiência no canal primeiro.
export const EXPERIMENTS: Experiment[] = [
  { slug: 'amazonas-em-camadas', title: 'Amazonas em camadas', description: 'Tire a água da vista e veja o que há sob o rio.' },
  { slug: 'radar-placas', title: 'Como uma placa é lida', description: 'Captura, recorte, leitura e o clone em dois lugares.' },
  { slug: 'caminhao-lixo', title: 'Caminhão de lixo', description: 'Abra a carroceria e veja onde cabe o lixo de uma rua.' },
  { slug: 'voyager', title: 'Voyager 1', description: 'Explore a sonda da NASA e os marcos da viagem.' },
  { slug: 'oleoduto', title: 'Oleoduto', description: 'Siga dois combustíveis e a interface entre os lotes.' },
  { slug: 'motor-navio', title: 'Motor de navio', description: 'Siga o pistão gigante até a hélice.' },
  { slug: 'motor-por-dentro', title: 'Motor por dentro', description: 'Controle as quatro fases e desmonte os conjuntos.' },
  { slug: 'tatuzao', title: 'Tatuzão', description: 'Escave e monte um anel do túnel, etapa por etapa.' },
  { slug: 'itaipu-por-dentro', title: 'Itaipu por dentro', description: 'Separe o caminho da geração do vertedouro.' },
  { slug: 'ponte-sob-carga', title: 'Ponte sob carga', description: 'Mova a carga e compare a deformação ampliada.' },
];

export const labUrl = (slug: string) => `https://victorsodre.github.io/${slug}/`;
