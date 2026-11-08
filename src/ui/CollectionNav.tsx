import { useRef } from 'react';
import { ArrowUpRight, Grid2X2, X } from 'lucide-react';
import './collection.css';

const experiments = [
  {
    "slug": "caminhao-lixo",
    "title": "Caminhão de lixo",
    "description": "Abra a carroceria e acompanhe a compactação."
  },
  {
    "slug": "oleoduto",
    "title": "Oleoduto",
    "description": "Siga dois combustíveis e a interface entre os lotes."
  },
  {
    "slug": "voyager",
    "title": "Voyager 1",
    "description": "Explore a sonda da NASA e os marcos da viagem."
  },
  {
    "slug": "tatuzao",
    "title": "Tatuzão",
    "description": "Escave e monte um anel do túnel, etapa por etapa."
  },
  {
    "slug": "motor-por-dentro",
    "title": "Motor por dentro",
    "description": "Controle as quatro fases e desmonte os conjuntos."
  },
  {
    "slug": "amazonas-em-camadas",
    "title": "Amazonas em camadas",
    "description": "Retire a água da vista e explore um corte de Óbidos."
  },
  {
    "slug": "radar-placas",
    "title": "Como uma placa é lida",
    "description": "Explore captura, recorte e leitura ilustrativa."
  },
  {
    "slug": "motor-navio",
    "title": "Motor de navio",
    "description": "Siga o movimento do pistão até a hélice."
  },
  {
    "slug": "itaipu-por-dentro",
    "title": "Itaipu por dentro",
    "description": "Separe o caminho da geração do vertedouro."
  },
  {
    "slug": "ponte-sob-carga",
    "title": "Ponte sob carga",
    "description": "Mova a carga e compare a deformação ampliada."
  }
];

export function CollectionNav({ current }: { current: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  return <>
    <button ref={trigger} className="collection-trigger" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}><Grid2X2 size={15}/>Explorar os 10 experimentos</button>
    <dialog ref={dialog} className="collection-dialog" aria-labelledby="collection-title" onClose={() => trigger.current?.focus()} onKeyDown={event => event.stopPropagation()}>
      <div className="collection-top"><span>OVICTORLAB / LABORATÓRIO</span><button autoFocus className="icon-button" aria-label="Fechar coleção" onClick={() => dialog.current?.close()}><X size={22}/></button></div>
      <h2 id="collection-title">Engenharia por dentro.</h2>
      <p>Dez experiências para abrir, mover e descobrir.</p>
      <nav aria-label="Experimentos do ovictorlab">
        {experiments.map((item, index) => <a key={item.slug} href={`https://victorsodre.github.io/${item.slug}/`} aria-current={item.slug === current ? 'page' : undefined}>
          <span className="experiment-number">{String(index + 1).padStart(2, '0')}</span>
          <span><strong>{item.title}</strong><small>{item.description}</small></span>
          {item.slug === current ? <span className="experiment-current">AQUI</span> : <ArrowUpRight size={17}/>}
        </a>)}
      </nav>
      <div className="collection-bottom"><a href="https://ovictorlab.com/">Visitar ovictorlab.com <ArrowUpRight size={14}/></a><a href={`https://github.com/victorsodre/${current}`}>Ver código <ArrowUpRight size={14}/></a></div>
    </dialog>
  </>;
}
