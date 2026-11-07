import { useEffect, useRef } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { project } from '../content/project.ts';
export function Sources({ open, onClose }: {open: boolean; onClose: () => void}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {if (open) dialog.current?.showModal();else dialog.current?.close();}, [open]);
  return <dialog ref={dialog} className="sources-dialog" aria-label="Fontes e créditos" onClose={onClose}>
    <div className="dialog-top"><span className="eyebrow">POR TRÁS DO EXPERIMENTO</span><button className="icon-button" aria-label="Fechar fontes" onClick={onClose}><X size={18}/></button></div>
    <h2>Uma máquina, um ciclo.</h2><p>{project.disclosure}</p>
    {project.sources.map(source => <a className="source-link" key={source.url} href={source.url} target="_blank" rel="noreferrer"><div><strong>{source.title}</strong><small>{source.detail}</small></div><ArrowUpRight size={16}/></a>)}
    <p className="credits">Direção e geometria: Victor Sodré / ovictorlab. Identidade do site oficial. Referência de exploração: Fusquinha. Sem modelo, foto ou áudio de terceiros incorporado.</p>
    <p className="credits">Licenças: {['bibliotecas', 'anton', 'archivo', 'archivo-black', 'jetbrains-mono'].map((file, i) => <span key={file}>{i > 0 && ' · '}<a href={`${import.meta.env.BASE_URL}licenses/${file}.txt`} target="_blank" rel="noreferrer">{file}</a></span>)}</p>
  </dialog>;
}
