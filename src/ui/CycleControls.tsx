import { Pause, Play, RotateCcw } from 'lucide-react';
import { sampleCycle, RING_WIDTH } from '../simulation/cycle.ts';
export function CycleControls({ progress, playing, disabled, setProgress, setPlaying, reset }: {
  progress: number; playing: boolean; disabled: boolean;
  setProgress: (n: number) => void; setPlaying: (b: boolean) => void; reset: () => void;
}) {
  const s = sampleCycle(progress);
  const title = progress === 0 ? 'Um avanço, um novo anel' : s.phase === 'excavating' ? 'Escavar e retirar o material' : s.phase === 'ringAssembly' ? `Montar o anel · peça ${Math.min(s.installed + 1, 6)} de 6` : 'Mais um anel de túnel';
  const description = s.phase === 'excavating' ? 'A roda corta e a terra que enche a câmara segura a frente. A rosca tira só o que entrou.' : s.phase === 'ringAssembly' ? 'O avanço parou. O eretor posiciona os segmentos.' : 'O próximo avanço se apoiaria no novo revestimento.';
  const jump = (n: number) => {setPlaying(false);setProgress(n);};
  return <section className="control-dock tbm-dock" aria-label="Controlar o ciclo da tuneladora">
    <div className="dock-top"><button className="primary" disabled={disabled} onClick={() => {if (progress >= 1) setProgress(0);setPlaying(!playing);}}>{playing ? <Pause size={15}/> : <Play size={15}/>} {playing ? 'Pausar' : progress >= 1 ? 'Repetir ciclo' : 'Avançar um ciclo'}</button>
      <div className="phase-copy" aria-live="polite"><strong>{title}</strong><span>{description}</span></div><button className="icon-button" aria-label="Reiniciar experiência" onClick={reset}><RotateCcw size={18}/></button></div>
    <div className="cycle-metrics"><span>AVANÇO <strong>{(s.advance / RING_WIDTH).toFixed(2).replace('.', ',')} anel</strong></span><span>MONTAGEM <strong>{s.installed}/6 peças</strong></span><span>EPB <strong>ciclo ilustrativo</strong></span></div>
    <div className="timeline"><label htmlFor="cycle-progress">PROGRESSO DO CICLO <span>{Math.round(progress * 100)}%</span></label><input id="cycle-progress" aria-label="Progresso do ciclo" type="range" min="0" max="1000" value={Math.round(progress * 1000)} onChange={e => jump(Number(e.target.value) / 1000)}/></div>
    <div className="phase-markers"><button className={s.phase === 'excavating' ? 'current' : ''} onClick={() => jump(0)}><span>01</span> Escavar</button><button className={s.phase === 'ringAssembly' ? 'current' : ''} onClick={() => jump(.5)}><span>02</span> Montar anel</button><button className={s.phase === 'complete' ? 'current' : ''} onClick={() => jump(1)}><span>03</span> Anel pronto</button></div>
  </section>;
}
