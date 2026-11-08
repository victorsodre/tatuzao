# Escopo — Tatuzão construindo o metrô

## Pergunta e resultado esperado

Como o tatuzão cava e deixa o túnel pronto atrás dele? O visitante deve conseguir explicar o mecanismo depois de explorar a cena e acionar seus controles.

Uma máquina de tipo explicitamente escolhido, um trecho curto de solo e um ciclo ilustrativo de escavação, transporte de material e instalação do revestimento.

## Conjuntos da primeira versão

- Cabeça de corte
- Escudo
- Câmara frontal
- Transporte do material
- Cilindros de avanço
- Eretor e segmentos do anel

Implementado com oito IDs: cutting, shield, chamber, screw, conveyor, thrust, erector e lining. Transporte foi separado em rosca/esteira; eretor e revestimento têm seleção própria. Geometria autoral, sem promessa de fidelidade industrial.

## Ações principais

| Controle | Comportamento entregue |
|---|---|
| Avançar um ciclo | EPB: escavação/retirada simultâneas, parada e montagem sequencial. |
| Cortar o terreno | Revela a relação entre máquina, solo e túnel revestido. |
| Montar anel | Destaca segmentos e a etapa de instalação do revestimento. |

Base de exploração: órbita, zoom, seleção por lista ou clique, isolamento, reenquadrar e reset. Desmontagem e corte só se aplicam aos conjuntos para os quais forem úteis e tecnicamente coerentes. Som, malha e captura são complementos, posteriores à clareza do mecanismo.

## Estado do mecanismo

`excavating → ringAssembly → complete`; repetição reinicia em zero. Progresso 0–0,5: avanço; 0,5–0,98: montagem; 0,98–1: anel completo. Tempos ilustrativos, sem avanço durante montagem.

## Critérios específicos de conclusão

- Escolher EPB ou outra variante documentada; não combinar componentes incompatíveis.
- O terreno removido e o revestimento instalado acompanham a distância percorrida no modelo ilustrativo.
- O usuário consegue pausar e distinguir corte, retirada de material e montagem dos segmentos.

- A pergunta inicial é respondida por uma interação observável, com texto curto e fontes acessíveis.
- Desktop e celular emulado foram validados, com reset/fallback conferidos; teste em telefone físico não integra a evidência disponível.
- Nenhum botão visível é apenas decorativo ou promete função pendente.

## Fora da primeira versão

- Simulação geotécnica e segurança de escavação.
- Cidade completa, túneis quilométricos e catálogo de todas as tuneladoras.

Ampliações entram no backlog após o piloto, com evidência de uso e esforço. Não incluir funcionalidades só para repetir todas as opções do Fusquinha.

## Aceite em 07/11/2026

Critérios específicos atendidos em código, testes e navegador; evidência em [VALIDACAO.md](VALIDACAO.md). Celular foi conferido por emulação de viewport no Chrome do Mac, sem ensaio em aparelho físico. Publicação não faz parte deste aceite.
