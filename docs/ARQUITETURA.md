# Arquitetura implementada

Aplicação estática React 19.2.6, TypeScript 5.9.3, Three.js 0.187.0 e Vite 8.3.6. Versões exatas no package-lock.json. Node >=22.18. A cena é construída no navegador; não há modelo externo, backend ou LLM.

## Responsabilidades

| Arquivo | Contrato |
|---|---|
| src/App.tsx | Estado da interface, seleção, tour, pausa, teclado e fallback |
| src/simulation/cycle.ts | Amostra pura do ciclo a partir de progresso 0–1; avanço, anel, apoios e transporte |
| src/scene/model.ts | Geometria autoral e oito grupos semânticos; corte dos materiais |
| src/scene/rig.ts | Transforms derivados da amostra; nunca acumular deslocamentos |
| src/scene/runtime.ts | Renderização sob demanda, câmera, raycast, isolamento, contexto WebGL e descarte |
| src/scene/camera.ts | Enquadramento por limites e projeção, incluindo orientação vertical |
| src/scene/capture.ts | PNG 1920×1080 ou 1080×1920; restaura câmera e renderizador |
| src/content/ | Catálogo, fontes primárias, vídeo e limites educativos |
| src/ui/ | Controles HTML, marca oficial e diálogo de fontes |
| src/styles.css | Identidade e layout responsivo; modo de fluxo até 900 px |
| public/licenses/ | Licenças das bibliotecas distribuídas e das fontes locais |

## Invariantes

- X positivo é avanço. A face do terreno acompanha a cabeça, sem remover solo antecipadamente.
- Um avanço vale exatamente uma largura de anel (1,2 unidades ilustrativas). A montagem ocorre com a máquina parada.
- Os anéis existentes ficam no mundo; a máquina avança. Os segmentos novos ocupam o espaço dentro da cauda.
- Os seis grupos visuais de apoio mudam contato entre anel antigo e novo. Não são uma distribuição calculada de cargas.
- A chave atinge a posição radial antes da inserção axial. Seu encaixe não simula juntas, conicidade ou tolerâncias.
- Todos os transforms vêm do progresso: voltar, avançar e resetar produzem a mesma pose.
- Somente os oito conjuntos capturam seleção; partículas e terreno são auxiliares.
- Isolar salva a câmera anterior, remove o corte e oculta o contexto; sair restaura a câmera.

## Desempenho e falhas

Geometria estática é agrupada por material; cilindros, segmentos, eretor, cabeça e rosca ficam independentes. DPR limitado a 1,5. Renderização até 30 atualizações/s e desligada em repouso; sem amortecimento contínuo da órbita. Pausa por visibilidade; delta limitado a 0,1 s para não saltar o ciclo ao retornar.

Falha na criação ou perda de contexto mostra uma explicação e botão de recarga. Catálogo e fontes HTML permanecem utilizáveis. Imagens PNG são criadas localmente; não há upload ou serviço externo.

O build tem base `./`; subpasta foi testada em `/tatuzao/`. Tamanhos e draw calls em VALIDACAO.md. Sem deploy automático. Referências de interação: Fusquinha e os projetos anteriores da coleção; não há dependência em tempo de execução desses repositórios.
