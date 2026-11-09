import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Box, ChevronRight, Download, Focus, Layers3, Maximize, Minus, Plus, Search, X } from 'lucide-react';
import { video } from './content/video.ts';
import { VideoSection } from './kit/VideoSection.tsx';
import { CollectionNav } from './kit/CollectionNav.tsx';
import { Brand } from './kit/Brand.tsx';
import { Sources } from './ui/Sources.tsx';
import { CycleControls } from './ui/CycleControls.tsx';
import { StreetGuide } from './ui/StreetGuide.tsx';
import { createScene } from './scene/runtime.ts';
import { advanceCycle, sampleCycle } from './simulation/cycle.ts';
import type { ScrewRate } from './simulation/balance.ts';
import { project } from './content/project.ts';
import { catalog } from './content/catalog.ts';
import { guideProgress, streetGuide } from './content/street.ts';
import type { Part, SceneHandle } from './scene/types.ts';

// The cycle re-renders the app at 30 Hz; the video and the collection do not depend on it.
const Video = memo(VideoSection), Collection = memo(CollectionNav);

export function App() {
  const host = useRef<HTMLDivElement>(null), scene = useRef<SceneHandle | null>(null), inspector = useRef<HTMLElement>(null), dialog = useRef<HTMLDialogElement>(null);
  const [parts, setParts] = useState<Part[]>([]), [progress, setProgress] = useState(0), [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState<string | null>(null), [isolated, setIsolated] = useState(false), [cut, setCut] = useState(true), [wireframe, setWireframe] = useState(false);
  const [sources, setSources] = useState(false), [drawer, setDrawer] = useState(false), [search, setSearch] = useState(''), [tour, setTour] = useState<number | null>(null);
  const [guide, setGuide] = useState<number | null>(null), [screw, setScrew] = useState<ScrewRate>('balanced');
  const [error, setError] = useState<string | null>(null), [notice, setNotice] = useState('');
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const closeGuide = useCallback(() => {setGuide(null);setScrew('balanced');}, []);
  // Selecting a part never pauses the cycle: the highlight follows the animation.
  const select = useCallback((id: string) => {setSelected(id);setIsolated(false);setTour(null);closeGuide();}, [closeGuide]);
  const deselect = useCallback(() => {setSelected(null);setIsolated(false);setTour(null);}, []);
  const current = catalog.find(p => p.id === selected), cycle = sampleCycle(progress), guideTarget = guide === null ? null : streetGuide[guide]!.target;
  const normalize = (value: string) => value.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/\p{Diacritic}/gu, '');
  const ready = parts.length > 0 && !error;
  useEffect(() => {
    if (!host.current) return;
    try {scene.current = createScene(host.current, select, text => {setError(text);setPlaying(false);});setParts(scene.current.parts);}
    catch {setError('Seu navegador não conseguiu abrir a cena 3D. As explicações e fontes continuam disponíveis.');}
    return () => {scene.current?.dispose();scene.current = null;};
  }, [select]);
  useEffect(() => {scene.current?.update({progress, cut, selected, isolated, wireframe, screw, guide: guideTarget});}, [progress, cut, selected, isolated, wireframe, screw, guideTarget]);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => {setReduced(media.matches);if (media.matches) setPlaying(false);};
    media.addEventListener('change', change);return () => media.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    if (!playing) return;let id = 0, last = performance.now();
    const tick = (now: number) => {if (now - last >= 32) {const dt = (now - last) / 1000;last = now;setProgress(p => advanceCycle(p, dt, true, !document.hidden));}id = requestAnimationFrame(tick);};
    id = requestAnimationFrame(tick);return () => cancelAnimationFrame(id);
  }, [playing]);
  useEffect(() => {if (progress >= 1) setPlaying(false);}, [progress]);
  useEffect(() => {if (drawer) dialog.current?.showModal();else dialog.current?.close();}, [drawer]);
  useEffect(() => {if ((selected || guide !== null) && innerWidth <= 900) {const id = requestAnimationFrame(() => inspector.current?.scrollIntoView({block: 'nearest', behavior: reduced ? 'instant' : 'smooth'}));return () => cancelAnimationFrame(id);}}, [selected, guide, reduced]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (document.querySelector('dialog[open]') || e.ctrlKey || e.metaKey || e.altKey || e.target instanceof HTMLInputElement || sources || drawer) return;
      if (e.key.toLowerCase() === 'r') scene.current?.home();
      if (e.key === 'Escape') {deselect();closeGuide();}
    };
    document.addEventListener('keydown', key);return () => document.removeEventListener('keydown', key);
  }, [deselect, closeGuide, sources, drawer]);
  function reset() {setProgress(0);setPlaying(false);setSelected(null);setIsolated(false);setWireframe(false);setCut(true);setTour(null);setSearch('');closeGuide();requestAnimationFrame(() => scene.current?.home());setNotice('Experiência reiniciada.');}
  function tourTo(index: number) {const p = parts[index];if (!p) return;closeGuide();setTour(index);setSelected(p.id);setIsolated(false);setPlaying(false);requestAnimationFrame(() => scene.current?.focus(p.id));}
  function guideTo(index: number) {
    const step = streetGuide[index];if (!step) return;
    deselect();setCut(true);setGuide(index);setPlaying(false);setProgress(p => guideProgress(p, step.at));
    if (step.target !== 'chamber') setScrew('balanced');
    requestAnimationFrame(() => scene.current?.frame(step.target));
  }
  async function fullscreen() {try {if (document.fullscreenElement) await document.exitFullscreen();else await document.documentElement.requestFullscreen();} catch {setNotice('Tela cheia não disponível neste navegador.');}}
  const matches = catalog.filter(p => normalize(p.label).includes(normalize(search)));
  const list = () => <><label className="search"><Search size={16}/><input aria-label="Encontrar conjunto" placeholder="Encontrar conjunto" value={search} onChange={e => setSearch(e.target.value)}/><span>08</span></label><div className="parts-list">{matches.map(p => <button className={'part-row' + (p.id === selected ? ' selected' : '')} key={p.id} aria-pressed={p.id === selected} onClick={() => {select(p.id);setDrawer(false);}}><span>{String(catalog.indexOf(p) + 1).padStart(2, '0')}</span><strong>{p.label}</strong><ChevronRight size={14}/></button>)}{!matches.length && <small className="search-hint">Nenhum conjunto encontrado.</small>}</div></>;
  const note = cycle.phase === 'ringAssembly' ? 'AVANÇO PARADO · MONTAGEM DO REVESTIMENTO' : cycle.phase === 'complete' ? 'CICLO COMPLETO · UM NOVO ANEL' : 'CÂMARA CHEIA SEGURA A FRENTE · A ROSCA DOSA A SAÍDA';
  const footer = <footer><span>UM EXPERIMENTO DO OVICTORLAB <i>© 2026</i></span><button onClick={() => setSources(true)}>Como funciona · Fontes e créditos <ArrowUpRight size={13}/></button><Collection current="tatuzao"/></footer>;
  const footerHost = document.getElementById('site-footer');
  return <div className="app"><header className="header"><Brand/><div className="collection-label">ENGENHARIA SOB A CIDADE <span>/</span> LAB 04</div><a className="video-link" href="#video">Assistir ao vídeo <ArrowUpRight size={16}/></a></header>
    <main className="workspace tbm-workspace"><div className="heading"><p className="eyebrow"><span/> EXPERIMENTO 04 <i>—</i> POR DENTRO DA CIDADE</p><h1>TATUZÃO<span>.</span></h1><p className="intro">{project.intro}</p><button className="question-button" aria-pressed={guide !== null} disabled={!ready} onClick={() => guide === null ? guideTo(0) : closeGuide()}>Por que a rua não afunda? <ArrowRight size={15}/></button></div>
      <div className="canvas-region"><div className="scene-host" ref={host}/>{error && <div className="scene-error" role="alert"><Box size={28}/><h2>Cena indisponível</h2><p>{error}</p><button className="primary" onClick={() => location.reload()}>Tentar novamente</button></div>}<div className="scene-mode"><span className={'status-dot' + (playing ? ' active' : '')}/>{isolated ? 'CONJUNTO ISOLADO' : cut ? 'CORTE SOB A RUA' : 'VISTA DA MÁQUINA'}<span className="mode-divider"/>EPB</div><div className="orbit-hint"><span className="hint-mouse">Arraste para girar · Ctrl + rolagem aproxima</span><span className="hint-touch">Deslize para os lados para girar</span><i>·</i>Modelo educativo</div></div>
      {guide === null && <aside className="sidebar"><div className="sidebar-label">OITO CONJUNTOS. UM CAMINHO.</div>{list()}<div className="sidebar-foot"><span className="mini-line"/><p>Na frente, escavação.<br/>Atrás, mais um trecho de túnel.</p><button className="text-button" disabled={!ready} onClick={() => tourTo(0)}>Conhecer a máquina <ArrowRight size={15}/></button></div></aside>}
      <nav className="view-switch" aria-label="Vista da tuneladora"><button aria-pressed={!cut} className={!cut ? 'active' : ''} onClick={() => {setCut(false);closeGuide();}}>Máquina</button><button aria-pressed={cut} className={cut ? 'active' : ''} onClick={() => setCut(true)}>Corte do terreno</button></nav>
      <div className="camera-tools"><button aria-label="Aproximar" disabled={!parts.length} onClick={() => scene.current?.zoom(.85)}><Plus size={18}/></button><button aria-label="Afastar" disabled={!parts.length} onClick={() => scene.current?.zoom(1.15)}><Minus size={18}/></button><span/><button aria-label="Reenquadrar" onClick={() => scene.current?.home()}><Focus size={18}/></button><button className="wire-button" aria-label="Mostrar malha" aria-pressed={wireframe} onClick={() => setWireframe(v => !v)}><Box size={18}/></button><span/><button aria-label="Salvar imagem PNG" disabled={!ready} onClick={() => scene.current?.capture()}><Download size={18}/></button><button className="format-button" aria-label="Salvar imagem vertical 9 por 16" disabled={!ready} onClick={() => scene.current?.capture(true)}>9:16</button>{Boolean(document.documentElement.requestFullscreen) && <button className="fullscreen-button" aria-label="Tela cheia" onClick={fullscreen}><Maximize size={17}/></button>}</div>
      {guide !== null && <StreetGuide ref={inspector} step={guide} setStep={guideTo} screw={screw} setScrew={setScrew} close={closeGuide}/>}
      {current && <section className="inspector" ref={inspector} aria-label="Conjunto selecionado"><div className="inspector-top"><span className="eyebrow">{tour === null ? 'EM DETALHE' : `CONHEÇA A MÁQUINA · ${tour + 1}/8`}</span><button className="icon-button" aria-label="Fechar detalhe" onClick={deselect}><X size={16}/></button></div><h2 aria-live="polite">{current.label}</h2><p>{current.detail}</p><small>{current.note}</small><a className="part-source" href={current.source} target="_blank" rel="noreferrer">Consultar a fonte <ArrowUpRight size={12}/></a><div className="inspector-actions"><button disabled={!ready} aria-pressed={isolated} onClick={() => {setIsolated(v => !v);setPlaying(false);}}><Layers3 size={14}/>{isolated ? 'Ver máquina inteira' : 'Isolar'}</button><button disabled={!ready} onClick={() => scene.current?.focus(current.id)}><Focus size={14}/>Aproximar</button></div>{tour !== null && <div className="inspector-actions"><button disabled={tour === 0} onClick={() => tourTo(tour - 1)}><ArrowLeft size={14}/>Anterior</button><button onClick={() => tour < 7 ? tourTo(tour + 1) : setTour(null)}>{tour < 7 ? 'Próximo conjunto' : 'Concluir'}<ArrowRight size={14}/></button></div>}</section>}
      <div className="mobile-actions"><button onClick={() => setDrawer(true)}><Layers3 size={16}/>Conjuntos <span>8</span></button><button disabled={!ready} onClick={() => tourTo(0)}>Conhecer a máquina <ArrowRight size={16}/></button></div>
      <CycleControls progress={progress} playing={playing} disabled={!ready} setProgress={setProgress} setPlaying={setPlaying} reset={reset}/>
      <p className="mechanism-note">{note}</p>
    </main><Video video={video}/>{footerHost ? createPortal(footer, footerHost) : footer}
    <Sources open={sources} onClose={() => setSources(false)}/><dialog ref={dialog} className="parts-dialog" aria-label="Conjuntos da tuneladora" onClose={() => setDrawer(false)}><div className="dialog-top"><span className="eyebrow">CONHEÇA A MÁQUINA</span><button className="icon-button" aria-label="Fechar conjuntos" onClick={() => setDrawer(false)}><X size={18}/></button></div>{drawer && list()}</dialog><span className="sr-only" role="status" aria-live="polite">{notice}</span>
  </div>;
}
