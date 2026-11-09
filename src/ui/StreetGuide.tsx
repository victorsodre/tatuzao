import type { Ref } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { streetGuide } from '../content/street.ts';
import { SCREW_RATES, screwRates, type ScrewRate } from '../simulation/balance.ts';

/** "Por que a rua não afunda?": the episode's three places plus the measurement on the street. */
export function StreetGuide({ ref, step, setStep, screw, setScrew, close }: {
  ref?: Ref<HTMLElement>; step: number; setStep: (n: number) => void; screw: ScrewRate; setScrew: (rate: ScrewRate) => void; close: () => void;
}) {
  const current = streetGuide[step]!, last = streetGuide.length - 1;
  return <section ref={ref} className="inspector street-guide" aria-label="Por que a rua não afunda">
    <div className="inspector-top"><span className="eyebrow">SEM A RUA AFUNDAR · {step + 1}/{streetGuide.length}</span><button className="icon-button" aria-label="Fechar explicação" onClick={close}><X size={16}/></button></div>
    <nav className="guide-steps" aria-label="Lugares da máquina">{streetGuide.map((item, i) => <button key={item.place} aria-pressed={i === step} onClick={() => setStep(i)}><span>{String(i + 1).padStart(2, '0')}</span>{item.short}</button>)}</nav>
    <div aria-live="polite"><p className="guide-place">{current.place}</p><h2>{current.title}</h2><p>{current.text}</p></div>
    {current.target === 'chamber' && <fieldset className="screw-control">
      <legend>Velocidade da rosca</legend>
      <div className="screw-options">{SCREW_RATES.map(rate => <button key={rate} aria-pressed={rate === screw} onClick={() => setScrew(rate)}>{screwRates[rate].label}</button>)}</div>
      <p aria-live="polite"><strong>{screwRates[screw].gauge}.</strong> {screwRates[screw].text}</p>
      <small>Indicador qualitativo: as setas mostram a tendência, sem cálculo de pressão.</small>
    </fieldset>}
    {current.target === 'street' && <small>Profundidade e prédios fora de escala.</small>}
    <a className="part-source" href={current.source} target="_blank" rel="noreferrer">Fonte: {current.sourceLabel} <ArrowUpRight size={12}/></a>
    <div className="inspector-actions"><button disabled={step === 0} onClick={() => setStep(step - 1)}><ArrowLeft size={14}/>Anterior</button><button onClick={() => step < last ? setStep(step + 1) : close()}>{step < last ? 'Próximo lugar' : 'Concluir'}<ArrowRight size={14}/></button></div>
  </section>;
}
