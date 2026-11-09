import type { Ref } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { streetGuide } from '../content/street.ts';
import { SCREW_RATES, screwRates, type ScrewRate } from '../simulation/balance.ts';

/**
 * "Por que a rua não afunda?": the episode's three places plus the measurement on the street.
 * Every step is rendered in the same grid cell, so the panel keeps the height of the tallest one
 * and "Próximo lugar" stays under the pointer from step to step.
 */
export function StreetGuide({ ref, step, setStep, screw, setScrew, close }: {
  ref?: Ref<HTMLElement>; step: number; setStep: (n: number) => void; screw: ScrewRate; setScrew: (rate: ScrewRate) => void; close: () => void;
}) {
  const current = streetGuide[step]!, last = streetGuide.length - 1;
  return <section ref={ref} className="inspector street-guide" aria-label="Por que a rua não afunda">
    <div className="inspector-top"><span className="eyebrow">SEM A RUA AFUNDAR · {step + 1}/{streetGuide.length}</span><button className="icon-button" aria-label="Fechar explicação" onClick={close}><X size={16}/></button></div>
    <nav className="guide-steps" aria-label="Lugares da máquina">{streetGuide.map((item, i) => <button key={item.place} aria-pressed={i === step} onClick={() => setStep(i)}><span>{String(i + 1).padStart(2, '0')}</span>{item.short}</button>)}</nav>
    <p className="sr-only" aria-live="polite">{current.place}: {current.title}</p>
    <div className="guide-body">{streetGuide.map((item, i) => <div key={item.place} className="guide-card" aria-hidden={i !== step} inert={i !== step}>
      <p className="guide-place">{item.place}</p><h2>{item.title}</h2><p>{item.text}</p>
      {item.target === 'chamber' && <fieldset className="screw-control">
        <legend>Velocidade da rosca</legend>
        <div className="screw-options">{SCREW_RATES.map(rate => <button key={rate} aria-pressed={rate === screw} onClick={() => setScrew(rate)}>{screwRates[rate].label}</button>)}</div>
        <p aria-live={i === step ? 'polite' : 'off'}><strong>{screwRates[screw].gauge}.</strong> {screwRates[screw].text}</p>
        <small>Indicador qualitativo: as setas mostram a tendência, sem cálculo de pressão.</small>
      </fieldset>}
      {item.target === 'street' && <small>Os marcadores amarelos apontam os marcos no asfalto e os pinos nos prédios. Profundidade e prédios fora de escala.</small>}
      <a className="part-source" href={item.source} target="_blank" rel="noreferrer">Fonte: {item.sourceLabel} <ArrowUpRight size={12}/></a>
    </div>)}</div>
    <div className="inspector-actions"><button disabled={step === 0} onClick={() => setStep(step - 1)}><ArrowLeft size={14}/>Anterior</button><button onClick={() => step < last ? setStep(step + 1) : close()}>{step < last ? 'Próximo lugar' : 'Concluir'}<ArrowRight size={14}/></button></div>
  </section>;
}
