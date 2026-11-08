# Publicação no GitHub Pages

- Site: https://victorsodre.github.io/tatuzao/
- Código: https://github.com/victorsodre/tatuzao
- Repositório público; branch de desenvolvimento e publicação: `main`.
- Build estático de `index.html`, React e Three.js. `dist/` é o artefato; não se abre `index.html` diretamente por `file://`.
- `package.json` mantém `private: true` para impedir publicação acidental no npm; isso não define a visibilidade no GitHub.

## Atualizar

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run check:pages
```

Após revisão e push autorizado em `main`, o workflow `pages.yml` testa, compila e publica. Pull requests apenas validam o build. Dependências e Actions têm versões/SHAs fixados; Node 22 recebe atualizações da linha suportada. O deploy usa o ambiente `github-pages` e permissões `pages: write`/`id-token: write` somente no job de publicação.

Nas configurações do repositório, Pages usa **GitHub Actions** (`build_type: workflow`). Não apontar para uma branch com código-fonte: os navegadores precisam do artefato compilado. O projeto mantém `base: './'` para assets relativos em `/tatuzao/`. Canonical, sitemap, prévia social, 404 e menu da coleção usam URLs públicas explícitas.

## Conferir após cada deploy

1. Aguardar o workflow terminar com sucesso e abrir a URL acima sem autenticação.
2. Conferir título, canvas, ação principal, pausa/reset, fontes e exportação PNG.
3. Em desktop e celular, abrir **Explorar os 10 experimentos**, seguir um link e voltar. `Escape` fecha o diálogo e devolve o foco ao botão.
4. Conferir assets, modelo/decodificador quando existentes, fontes locais e `share.png` sem 404. O site depende de JavaScript e WebGL; há mensagens de fallback.
5. Conferir `404.html`, canonical e links para código, vídeos e site oficial. Recarga na raiz do projeto deve funcionar.

## Reverter

Reverter o commit da mudança em um novo commit, validar e publicar novamente. Não forçar o histórico. Um workflow com teste/build falho não substitui a versão publicada. Desabilitar Pages ou tornar o repositório privado é uma ação de acesso separada; exige pedido vigente.

## Direção desta revisão — 08/11/2026

Tese visual: laboratório azul-noite, modelo 3D dominante e amarelo oficial para ações. Conteúdo: marca e vídeo no topo, mecanismo no espaço central, controles abaixo e coleção no rodapé. Interação: preservar movimento didático por gesto, revelar detalhes ao selecionar e navegar por um diálogo discreto com foco e teclado nativos. Movimento reduzido e renderização sob demanda permanecem ativos.

Marca, Anton/Archivo, cores e símbolo foram comparados com ovictorlab.com e a fonte canônica. A prévia social é uma exportação real do aplicativo, com créditos originais. Não foram adicionados rastreadores, backend, chamadas de IA ou publicação social.

## Vídeo incorporado

Configuração em `src/content/video.ts`; player em `src/ui/VideoSection.tsx`. Vídeo do canal: https://www.youtube.com/watch?v=KV6RWi8-zE8. Thumbnail original de `https://i.ytimg.com/vi/KV6RWi8-zE8/sardefault.jpg`, consultada em 08/11/2026 e servida localmente em `public/video-thumbnail.jpg`; não foi recriada ou alterada.

Antes do clique, não há iframe ou requisição ao YouTube. Após **Carregar vídeo**, o iframe usa `youtube-nocookie.com`, `autoplay=0`, `playsinline=1` e `referrerPolicy="strict-origin-when-cross-origin"`. Não remover o referrer: o YouTube exige identificar a origem do embed. Dimensões mínimas de 200×200 px e controles nativos preservados. Thumbnail e embed usam o mesmo ID; o README usa imagem com link porque o GitHub filtra iframes.

Ao trocar o vídeo: confirmar autoria, disponibilidade/incorporação, duração, orientação e relação com o experimento; atualizar a configuração, thumbnail, README e este registro. O link direto fica visível como alternativa para bloqueio de rede, extensão, região ou restrição do vídeo. A disponibilidade do player é controlada pelo YouTube.

Referências: [Player e parâmetros](https://developers.google.com/youtube/player_parameters) · [Incorporação, privacidade e referrer](https://support.google.com/youtube/answer/171780?hl=pt-BR).
