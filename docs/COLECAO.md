# Coleção de experiências interativas — ovictorlab

Coleção de 07/11/2026. **Dez projetos implementados e validados localmente**, com 76 testes automatizados aprovados, fluxos Chrome e builds em subpasta. Repositórios privados no GitHub. Estado detalhado: [Aceite da coleção](https://github.com/victorsodre/caminhao-lixo/blob/main/docs/ACEITE-COLECAO.md). Nenhum deploy público ou postagem no X.

O produto combina a identidade de ovictorlab.com com exploração, seleção, isolamento, desmontagem, movimento e som inspirados no Fusquinha. A ordem abaixo foi a prioridade de desenvolvimento.

| Ordem | Projeto | Repositório | Estado |
|---|---|---|---|
| 1 | Caminhão de lixo por dentro | [caminhao-lixo](https://github.com/victorsodre/caminhao-lixo) | Desenvolvimento concluído; modelo autoral e dez testes aprovados. |
| 2 | Oleoduto: combustíveis no mesmo tubo | [oleoduto](https://github.com/victorsodre/oleoduto) | Desenvolvimento concluído; balanço determinístico e nove testes aprovados. |
| 3 | Voyager explorável | [voyager](https://github.com/victorsodre/voyager) | Desenvolvimento concluído; modelo NASA, sete conjuntos e cinco testes aprovados. |
| 4 | Tatuzão construindo o metrô | [tatuzao](https://github.com/victorsodre/tatuzao) | Desenvolvimento concluído; EPB autoral, oito conjuntos e oito testes aprovados. |
| 5 | Motor por dentro | [motor-por-dentro](https://github.com/victorsodre/motor-por-dentro) | Desenvolvimento concluído; ciclo sincronizado, oito conjuntos e oito testes aprovados. |
| 6 | Amazonas em camadas | [amazonas-em-camadas](https://github.com/victorsodre/amazonas-em-camadas) | Desenvolvimento concluído; quatro camadas, vista de poros e sete testes aprovados. |
| 7 | Como o radar lê uma placa | [radar-placas](https://github.com/victorsodre/radar-placas) | Desenvolvimento concluído; captura, recorte, leitura demonstrativa e sete testes aprovados. |
| 8 | Motor de navio gigante | [motor-navio](https://github.com/victorsodre/motor-navio) | Desenvolvimento concluído; dois tempos, cruzeta, hélice 1:1, escala e sete testes aprovados. |
| 9 | Itaipu por dentro | [itaipu-por-dentro](https://github.com/victorsodre/itaipu-por-dentro) | Desenvolvimento concluído; geração/vertedouro independentes, corte e sete testes aprovados. |
| 10 | Ponte sob carga | [ponte-sob-carga](https://github.com/victorsodre/ponte-sob-carga) | Desenvolvimento concluído; carga móvel, apoios, comparação ampliada e oito testes aprovados. |

## Estado da entrega

Os dez escopos foram concluídos. Cada pasta contém aplicação, lockfile, guias de desenvolvimento/manutenção/identidade, apuração e evidência de validação. Publicação web, domínio, analytics e envio ao X são etapas posteriores, fora da entrega atual.

Celulares foram emulados no Chrome do Mac; não houve ensaio em telefone físico/Safari. As experiências são educativas, com limites declarados. Estáticas no navegador, sem LLM, backend ou reserva da GPU de produção.

## Evidência e limites

Consulta de 07/11/2026: 139 Reels e 162 vídeos públicos do YouTube, cruzando métricas, descrições, roteiros selecionados e amostras visuais. Não foi uma reprodução integral de todos os vídeos. Valores acumulados têm idades e distribuições diferentes; não representam estimativa de tráfego orgânico nem previsão de uso dos aplicativos.

O relatório de 06/11 atribuiu 4.685 de 4.797 visualizações do vídeo do Fusquinha a anúncios (97,7%). A referência aqui é sua experiência de produto, não uma conclusão de sucesso orgânico. Nenhum dado de uso do aplicativo foi medido nesta análise.

## Fontes canônicas

- Identidade: [ovictorlab.com](https://ovictorlab.com/) e seu repositório privado `victorsodre/ovictorlab-com`, arquivos `src/app/globals.css` e `src/shared/ui/logo.tsx`.
- Interações: [Fusquinha](https://victorsodre.github.io/fusquinha/) e [código](https://github.com/victorsodre/fusquinha).
- Cada projeto: README → ESCOPO → EXECUCAO → IDENTIDADE-VISUAL → ARQUITETURA → ASSETS-E-FONTES → MANUTENCAO.
- Posts individuais: `POSTAGENS-X.md` de cada repositório. Arquivo único da coleção: [POSTAGENS-X-COLECAO.md no repositório piloto](https://github.com/victorsodre/caminhao-lixo/blob/main/POSTAGENS-X-COLECAO.md).

Os repositórios permanecem privados. Isso não publica uma experiência web. Antes de um lançamento público, verificar acesso, assets e URL de produção; não usar o link privado do código como CTA para o público.

## Desenvolvimento local

Pastas em `/Users/victor/ovictor/<slug>`. Em cada projeto: `npm ci`, `npm run dev`, `npm test`, `npm run check`, `npm run build`. Node ≥22.18. Os comandos e limites específicos estão no README e em `docs/VALIDACAO.md`. Não existe URL pública nova para experimentar nesta entrega.
