import { useRef } from 'react';
import { ArrowUpRight, Grid2X2, X } from 'lucide-react';
import { EXPERIMENTS, labUrl } from './collection.ts';
import { FollowCTA } from './FollowCTA.tsx';
import { SITE } from './social.ts';
import { track } from './track.ts';
import './collection.css';

export function CollectionNav({ current }: { current: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const items = EXPERIMENTS;
  return <>
    <button ref={trigger} className="collection-trigger" aria-haspopup="dialog" onClick={() => { dialog.current?.showModal(); track('menu'); }}><Grid2X2 size={15}/>Explorar os {items.length} experimentos</button>
    <dialog ref={dialog} className="collection-dialog" aria-labelledby="collection-title" onClose={() => trigger.current?.focus()} onKeyDown={event => event.stopPropagation()}>
      <div className="collection-top"><span>OVICTORLAB / LABORATÓRIO</span><button autoFocus className="icon-button" aria-label="Fechar coleção" onClick={() => dialog.current?.close()}><X size={22}/></button></div>
      <h2 id="collection-title">Engenharia por dentro.</h2>
      <p>{items.length} experiências para abrir, mover e descobrir.</p>
      <nav aria-label="Experimentos do ovictorlab">
        {items.map((item, index) => <a key={item.slug} href={labUrl(item.slug)} aria-current={item.slug === current ? 'page' : undefined} onClick={() => track('nav', item.slug)}>
          <span className="experiment-number">{String(index + 1).padStart(2, '0')}</span>
          <span><strong>{item.title}</strong><small>{item.description}</small></span>
          {item.slug === current ? <span className="experiment-current">AQUI</span> : <ArrowUpRight size={17}/>}
        </a>)}
      </nav>
      <FollowCTA compact/>
      <div className="collection-bottom"><a href={SITE + '?ref=lab'}>Visitar ovictorlab.com <ArrowUpRight size={14}/></a><a href={`https://github.com/victorsodre/${current}`}>Ver código <ArrowUpRight size={14}/></a></div>
    </dialog>
  </>;
}
