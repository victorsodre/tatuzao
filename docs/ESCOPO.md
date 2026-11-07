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

Esses grupos são uma proposta semântica; validar sua correspondência com a geometria e as fontes antes de nomear peças como reais.

## Ações principais

| Controle | Comportamento planejado |
|---|---|
| Avançar um ciclo | Mostra a sequência validada do tipo de máquina escolhido. |
| Cortar o terreno | Revela a relação entre máquina, solo e túnel revestido. |
| Montar anel | Destaca segmentos e a etapa de instalação do revestimento. |

Base de exploração: órbita, zoom, seleção por lista ou clique, isolamento, reenquadrar e reset. Desmontagem e corte só se aplicam aos conjuntos para os quais forem úteis e tecnicamente coerentes. Som, malha e captura são complementos, posteriores à clareza do mecanismo.

## Estado do mecanismo

`ready → excavating → ringAssembly → ready; etapas simultâneas só serão representadas se confirmadas para a variante escolhida.`

## Critérios específicos de conclusão

- Escolher EPB ou outra variante documentada; não combinar componentes incompatíveis.
- O terreno removido e o revestimento instalado acompanham a distância percorrida no modelo ilustrativo.
- O usuário consegue pausar e distinguir corte, retirada de material e montagem dos segmentos.

- A pergunta inicial é respondida por uma interação observável, com texto curto e fontes acessíveis.
- O modelo funciona no desktop e no celular de referência, com reset e fallback conferidos.
- Nenhum botão visível é apenas decorativo ou promete função pendente.

## Fora da primeira versão

- Simulação geotécnica e segurança de escavação.
- Cidade completa, túneis quilométricos e catálogo de todas as tuneladoras.

Ampliações entram no backlog após o piloto, com evidência de uso e esforço. Não incluir funcionalidades só para repetir todas as opções do Fusquinha.
