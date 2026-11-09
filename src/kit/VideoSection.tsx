import { useRef, useState } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import { FollowCTA } from './FollowCTA.tsx';
import { InstagramIcon } from './icons.tsx';
import { reelUrl } from './social.ts';
import { track } from './track.ts';
import './video.css';

export type LabVideo = {
  id: string;
  title: string;
  context: string;
  related: boolean;
  format: 'portrait' | 'landscape';
  duration: string;
  /** Reel do mesmo tema no Instagram (rede principal), só o código da URL. */
  reel?: string;
  reelLabel?: string;
  /** Troca agendada: a partir de `from` (ISO), usar este vídeo (ex.: Short que ainda vai ao ar). */
  next?: Omit<LabVideo, 'next' | 'reel' | 'reelLabel'> & { from: string; thumbnail: string };
};

/** Escolhe o vídeo vigente; se houver troca agendada e a data passou, usa a nova. */
export function currentVideo(video: LabVideo, now = new Date()): LabVideo & { thumbnail: string } {
  if (video.next && now >= new Date(video.next.from)) {
    const { from: _from, ...next } = video.next;
    return { ...next, reel: video.reel, reelLabel: video.reelLabel };
  }
  return { ...video, thumbnail: './video-thumbnail.jpg' };
}

export function VideoSection({ video: source }: { video: LabVideo }) {
  const video = currentVideo(source);
  const [active, setActive] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const watchUrl = `https://www.youtube.com/watch?v=${video.id}`;
  const portrait = video.format === 'portrait';
  return <section id="video" className={'video-section' + (portrait ? ' video-section--portrait' : '')} aria-labelledby="video-title" tabIndex={-1}>
    <div className="video-inner">
      <div className="video-copy">
        <p className="video-eyebrow">OVICTORLAB <span>/</span> {video.related ? 'VÍDEO RELACIONADO' : 'ENTENDA NO VÍDEO'}</p>
        <h2 id="video-title">{video.title.replace(/ #.*/, '')}</h2>
        <p className="video-context">{video.context}</p>
        <div className="video-links">
          {video.reel && <a className="video-external" href={reelUrl(video.reel)} target="_blank" rel="noreferrer" onClick={() => track('out', 'reel')}><InstagramIcon size={16}/>{video.reelLabel ?? 'Ver o Reel no Instagram'} <ArrowUpRight size={16}/></a>}
          <a className="video-external" href={watchUrl} target="_blank" rel="noreferrer" onClick={() => track('out', 'youtube')}>Assistir no YouTube <ArrowUpRight size={16}/></a>
        </div>
        {active && <p className="video-help">Se o player não abrir, use o link acima.</p>}
        <FollowCTA/>
      </div>
      <div className="video-media">
        {active ? <iframe ref={frame}
          title={'Vídeo do ovictorlab: ' + video.title}
          src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&playsinline=1&rel=0&hl=pt-BR`}
          allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => { if (frame.current) { frame.current.dataset.loaded = 'true'; frame.current.focus(); } }}/>
          : <button className="video-cover" aria-label={'Tocar vídeo: ' + video.title} onClick={() => { setActive(true); track('video', video.id); }}>
            <img src={video.thumbnail} alt="" loading="lazy" decoding="async" width={portrait ? 540 : 960} height={portrait ? 960 : 540}/>
            <span className="video-cover-shade"/>
            <span className="video-play"><Play size={25} fill="currentColor"/></span>
            <span className="video-cover-caption"><strong>Tocar vídeo</strong><span>YouTube · {video.duration}</span></span>
          </button>}
      </div>
    </div>
  </section>;
}
