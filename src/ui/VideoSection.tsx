import { useRef, useState } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import { video } from '../content/video.ts';
import './video.css';

export function VideoSection() {
  const [active, setActive] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const watchUrl = `https://www.youtube.com/watch?v=${video.id}`;
  return <section id="video" className={'video-section' + (video.format === 'portrait' ? ' video-section--portrait' : '')} aria-labelledby="video-title" tabIndex={-1}>
    <div className="video-inner">
      <div className="video-copy">
        <p className="video-eyebrow">OVICTORLAB NO YOUTUBE <span>/</span> {video.related ? 'VÍDEO RELACIONADO' : 'ENTENDA NO VÍDEO'}</p>
        <h2 id="video-title">{video.title.replace(/ #.*/, '')}</h2>
        <p className="video-context">{video.context}</p>
        <a className="video-external" href={watchUrl} target="_blank" rel="noreferrer">Assistir no YouTube <ArrowUpRight size={16}/></a>
        {active && <p className="video-help">Se o player não abrir, use o link acima.</p>}
      </div>
      <div className="video-media">
        {active ? <iframe ref={frame}
          title={'Vídeo do ovictorlab: ' + video.title}
          src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=0&playsinline=1&rel=0&hl=pt-BR`}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => { if (frame.current) { frame.current.dataset.loaded = 'true'; frame.current.focus(); } }}/>
          : <button className="video-cover" aria-label={'Carregar vídeo: ' + video.title} onClick={() => setActive(true)}>
            <img src="./video-thumbnail.jpg" alt="" loading="lazy" decoding="async" width="480" height="360"/>
            <span className="video-cover-shade"/>
            <span className="video-play"><Play size={25} fill="currentColor"/></span>
            <span className="video-cover-caption"><strong>Carregar vídeo</strong><span>YouTube · {video.duration}</span></span>
          </button>}
      </div>
    </div>
  </section>;
}
