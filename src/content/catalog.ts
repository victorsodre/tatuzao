const machine = 'https://www.robbinstbm.com/products/tunnel-boring-machines/earth-pressure-balance/';
const brochure = 'https://www.robbinstbm.com/wp-content/uploads/2017/05/EPB6-7m_March.27.2017.pdf';
const lining = 'https://www.daub-ita.de/fileadmin/documents/daub/gtcrec2/2024-12_Tuebbingdesign_EN_final_web.pdf#page=72';
const operation = 'https://www.emetro.gr/?page_id=4360&lang=en';
export const catalog = [
  { id: 'cutting', label: 'Cabeça de corte', detail: 'A roda gira contra a frente de escavação. Pelas aberturas, o material chega à câmara.', note: 'Ferramentas e proporções ilustrativas de uma EPB para solo; não é uma máquina de rocha dura.', source: brochure },
  { id: 'shield', label: 'Escudo e cauda', detail: 'A estrutura envolve a área de trabalho. Na cauda, há espaço protegido para montar o revestimento.', note: 'A vista em corte remove parte da carcaça para revelar os conjuntos.', source: machine },
  { id: 'chamber', label: 'Câmara frontal', detail: 'O material escavado ocupa a câmara. Sua pressão ajuda a sustentar a frente de escavação.', note: 'A câmara não esvazia a cada ciclo. A experiência não calcula pressão ou estabilidade do solo.', source: machine },
  { id: 'screw', label: 'Rosca transportadora', detail: 'A rosca retira material da câmara e o leva até o sistema de transporte.', note: 'Na operação real, a retirada é coordenada com o avanço para controlar a pressão.', source: machine },
  { id: 'conveyor', label: 'Esteira de retirada', detail: 'Depois da rosca, a terra segue para trás pela esteira, em direção à saída do túnel.', note: 'Partículas indicam o caminho do material; não representam vazão medida.', source: brochure },
  { id: 'thrust', label: 'Cilindros de avanço', detail: 'Os apoios empurram contra o revestimento já montado, deslocando a máquina para a frente.', note: 'Seis grupos ilustram a troca de apoio. Quantidade, pressão e sequência de acionamento dependem da máquina e do anel.', source: operation },
  { id: 'erector', label: 'Eretor de segmentos', detail: 'Com o avanço parado, o braço posiciona os segmentos para construir o próximo anel.', note: 'Trajetos simplificados; alimentação, fixações e juntas não são reproduzidos em detalhe.', source: lining },
  { id: 'lining', label: 'Anéis de revestimento', detail: 'Os segmentos de concreto formam o túnel atrás da máquina. A peça final fecha o anel.', note: 'Cinco segmentos e uma chave ilustram a montagem. A quantidade e a forma variam entre projetos.', source: lining },
] as const;
export type PartId = typeof catalog[number]['id'];
