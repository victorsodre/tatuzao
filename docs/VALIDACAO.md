# Validação — 07/11/2026

Desenvolvimento concluído dentro do recorte educativo. Sem deploy público, envio social ou uso da GPU de produção.

## Ambiente e comandos

Mac de desenvolvimento; Node 26.7.0, npm 11.19.0 e Chrome via sessão Playwright isolada. Viewports 1440×980, 390×844 e 844×390. Não houve teste em celular físico nem medição de FPS em hardware móvel.

- `npm ci --ignore-scripts`: instalação reproduzível do lockfile.
- `npm test`: **8 testes aprovados**. Casos do ciclo, terreno/revestimento, fechamento do anel, apoios, reversibilidade, pausa/delta, chave axial, rig e enquadramento.
- `npm run check`: TypeScript sem erros.
- `npm run build`: aprovado. Vite informa o tamanho do chunk principal acima de 500 kB; não é falha de build. Mantida a composição simples, com tamanho total abaixo do orçamento inicial.

Os testes da chave e da câmera vertical reproduziram falhas antes das correções. Não são apenas comparação de texto da interface.

## Navegador

**91 verificações explícitas aprovadas:** 62 de interação, 16 de entrada/fallback e 13 de produção. Scripts e logs locais em `output/`, ignorados pelo Git; evidência durável resumida aqui.

- Um canvas após StrictMode; oito conjuntos selecionáveis por lista, clique na geometria e busca sem depender de acentos.
- Avanço, pausa, busca temporal em seis posições, montagem, conclusão automática e reset. O terreno acompanha a cabeça e os anéis anteriores permanecem no lugar.
- Isolamento dos oito conjuntos e restauração da câmera; tour completo, órbita sem seleção acidental, zoom, R, Escape e tela cheia.
- Corte/máquina, malha, cinco fontes primárias, diálogo de peças no celular e preferência de movimento reduzido.
- Renderização parada em repouso. Handler de visibilidade testado com `document.hidden` controlado: relógio e renderer param e retomam. Trocar de aba na sessão automatizada não alterou a visibilidade nativa; essa integração do navegador não foi confirmada por esse teste.
- WebGL indisponível e contexto perdido: fallback, controles incompatíveis desabilitados, catálogo preservado e recuperação por recarga.
- Produção em `http://127.0.0.1:4312/tatuzao/`: abertura e recarga, fontes, cinco licenças, nenhum erro de execução ou resposta HTTP com falha. URL local temporária, não um endereço público.
- PNG horizontal **1920×1080** e vertical **1080×1920** conferidos visualmente; câmera e renderer restaurados após cada captura.

## Revisão visual

Capturas reais de desktop, celular retrato/paisagem, rosca e eretor isolados, montagem em 55%, 69% e 94%, anel pronto e os dois PNGs foram abertas e inspecionadas. Corrigidos luz/sombra, dica atrás do painel, margem da cena no celular e sobreposição da barra de ferramentas em paisagem. A chave foi corrigida para alinhamento radial seguido de entrada axial.

`output/playwright/`: desktop-luz.png, assembly-550.png, assembly-690.png, assembly-940.png, isolated-3.png, isolated-6.png, mobile-final.png, landscape-final.png, export-horizontal.png, export-vertical.png e capturas de produção. Capturas finais devem esperar a transição inicial de 450 ms; a primeira captura de produção pegou essa transição e foi refeita.

## Medidas

| Item | Resultado |
|---|---|
| JavaScript minificado | 831.984 bytes; 225,57 kB gzip |
| CSS | 18.533 bytes; 4,68 kB gzip |
| Recursos observados no carregamento | JS, CSS, seis WOFF2 locais e ícone; cerca de 952 kB sem compressão HTTP |
| Modelo, texturas, áudio externos | Nenhum |
| Cena inicial | 160 chamadas; 75.984 triângulos processados |
| Escavação a 25% | 216 chamadas; 77.104 triângulos processados |
| Montagem a 69% | 166 chamadas; 77.064 triângulos processados |
| Anel completo | 172 chamadas; 77.904 triângulos processados |

Contadores incluem a passagem de sombras. São amostras locais, não benchmark de celular ou máximo formal. Renderização limitada a 30 atualizações/s, DPR máximo 1,5; repouso sem loop de render contínuo. Cache local não permite inferir tempo de carregamento em rede móvel.

## Limites e próxima etapa

Dimensões, duração, seis grupos de apoio e trajetos são ilustrativos. Sem pressão, estabilidade geotécnica, orientação do escudo, fixações, vedações ou logística completa. Geometria autoral; não é réplica da Cora Coralina ou da máquina descrita no metrô de Atenas. Fontes e limites em APURACAO.md.

Aparelho físico, Safari/Firefox e homologação de engenharia não foram testados. Lançamento, domínio, métricas e publicação no X permanecem posteriores. Para alterar a versão, seguir MANUTENCAO.md e registrar nova evidência proporcional ao risco.

## Revisão para publicação — 08/11/2026

Testes automatizados do projeto, TypeScript/build e `check:pages` aprovados. O último verifica assets relativos em subpasta, canonical, prévia social, 404, sitemap e fallback sem JavaScript. O conjunto mantém 76 testes dos mecanismos.

Chrome real em janela dedicada: build servido sob a subpasta do projeto, canvas e catálogo carregados, seleção, ação principal quando presente no dock, diálogo da coleção com dez destinos corretos, indicação da página atual, fechamento por Escape, foco devolvido e seleção preservada. Viewports 1440×1000 e 390×844, sem transbordamento horizontal, erros de JavaScript ou respostas HTTP de erro durante o fluxo. Capturas reais em `output/publish-local-*.png` (ignoradas pelo Git).

A publicação usa o procedimento em [PUBLICACAO.md](PUBLICACAO.md). Verificação local não substitui conferir a URL após o deploy. Celular físico e Safari permanecem fora da amostra; o modelo mantém os limites educativos descritos acima.

## Embed do canal — 08/11/2026

Vídeo e autoria confirmados pelo oEmbed público do YouTube. Os 76 testes da coleção continuam aprovados; TypeScript/build e check de Pages aprovados em cada projeto. Capas originais de maior resolução servidas localmente, com mesmo ID do player e link do README.

Fluxo a conferir após cada publicação: abrir pelo cabeçalho, capa legível, zero requisições ao YouTube antes do clique, Enter no botão Carregar vídeo, iframe correto sem autoplay, controles nativos, foco e link direto. Viewports 1440×1000 e 390×844; largura/altura úteis do player de ao menos 200 px, descontando bordas. Limites: telefone físico/Safari fora da amostra e disponibilidade do vídeo depende do YouTube. Evidências desta rodada em `output/video-*`.

Nesta rodada, os dez players foram carregados no Chrome em estado pronto (`5` / cued), com o ID esperado e sem reprodução automática. Navegação pelo cabeçalho, clique/Enter, dimensões mínimas, thumbnail local e link direto aprovados; nenhuma requisição ao YouTube antes do clique ou erro JavaScript nos fluxos.
