# Identidade visual e sua manutenção

## Fonte e versão

Referência: ovictorlab.com, direção **Laboratório noturno**, adotada no site em 02/11/2026 e consultada em 07/11/2026. Tokens e logo foram lidos no checkout local do site; há alterações ainda não consolidadas no HEAD, portanto o commit antigo não é apresentado como fonte destes tokens.

Fontes canônicas: `src/app/globals.css`, `src/shared/ui/logo.tsx` e `src/app/layout.tsx`, no repositório `victorsodre/ovictorlab-com`. Captura real da página de vídeo de Starlink, feita em 06/11, e captura do Fusquinha foram conferidas visualmente durante a preparação.

## Tokens do site

| Token | Valor | Uso |
|---|---|---|
| fundo | `#0b0d1a` | Base azul-noite |
| cartao | `#12152b` | Painéis |
| cartao-alto | `#1a1e3a` | Superfície elevada |
| borda | `#272c4c` | Separadores e contornos |
| texto | `#f1f2f8` | Conteúdo principal |
| suave | `#a9aecb` | Texto secundário |
| apagado | `#6f7596` | Elementos inativos; verificar contraste antes de usar em leitura |
| amarelo | `#ffd21f` | Ação principal, seleção e foco |
| laranja | `#ef7d42` | Categoria e ênfase secundária |
| radius-cartao | `14px` | Painéis de interface |

Títulos: **Anton**, peso 400, sem negrito sintético; títulos principais em caixa alta. Texto e controles: **Archivo**. Nome da marca: **Archivo Black**, sempre `ovictorlab` em minúsculas. Medidas e dados técnicos: **JetBrains Mono** quando melhorarem a leitura. Confirmar licenças e incluir fontes locais quando o app for implementado.

## Marca oficial

Reutilizar o símbolo em corte de `LogoMark` e a composição de `Logo`; não desenhar uma marca alternativa para cada experiência. O símbolo usa `viewBox="0 0 100 100"`, o caminho `M50 12 A38 38 0 1 0 88 50`, traço 14, sem preenchimento, e círculo central `(50, 50)` de raio 13. Essa descrição identifica o asset; a implementação deve importar ou transpor fielmente o SVG oficial.

O nome do projeto é título editorial, subordinado à marca. Cabeçalho compacto: logo com retorno ao site, nome do experimento e acesso ao vídeo/fontes. Preservar a origem pessoal do ovictorlab, sem misturar outras marcas profissionais.

## Composição do produto

- Objeto 3D ocupa a área principal. A primeira tela mostra o objeto e uma ação compreensível.
- No desktop, catálogo lateral recolhível e controles próximos do objeto. No celular, painel inferior recolhível com espaço livre para toque e rotação.
- Disponibilizar **Explorar**, **Por dentro** e a ação específica do projeto apenas quando cada modo tiver comportamento real.
- Amarelo destaca ação/seleção; não pintar todas as peças de amarelo. O objeto conserva materiais e cores que ajudam a explicação.
- Fundo escuro, luz de recorte, sombras de contato e materiais legíveis. Evitar neon decorativo, brilho sem função e cartões repetidos que disputem atenção com o objeto.
- A garagem clara e verde do Fusquinha é sua direção própria. Reutilizar as possibilidades de interação, mantendo a identidade escura do ovictorlab nesta coleção.

## Acessibilidade e estados

- Texto de leitura com pelo menos 16 px como ponto de partida; controles com alvos de aproximadamente 44 px ou maiores.
- Validar contraste de texto e foco; cor vem acompanhada de rótulo, padrão ou forma.
- Foco visível amarelo, navegação por teclado e controles HTML nomeados. A lista de peças oferece uma alternativa ao clique no canvas.
- Som começa desligado e depende de gesto. Movimento reduzido desativa órbita automática, vibração e transições dispensáveis; ainda permite avançar o mecanismo por etapas.
- Estados de carregamento, falha do modelo e indisponibilidade de WebGL têm mensagem em português e acesso ao vídeo/fontes.

## Manutenção da identidade

1. Ao mudar a identidade do site, comparar os arquivos canônicos com os hashes desta edição.
2. Atualizar primeiro o guia; registrar motivo/data em DECISOES.md e então ajustar os tokens da aplicação.
3. Conferir desktop e celular: capa, cena inicial, peça selecionada, corte, desmontagem, falha e créditos.
4. Preservar o mesmo logo, famílias tipográficas e hierarquia. Cor do objeto e cenário podem variar por projeto.
5. Não declarar qualidade visual só pela leitura do CSS: anexar capturas reais e revisar legibilidade, enquadramento e toque.

Hashes SHA-256 de referência do checkout em 07/11/2026:
- `src/app/globals.css`: `246473dfd6a21e22df2ece56d2927b6107a494989865a7bd8e82d7d14a9e293d`
- `src/shared/ui/logo.tsx`: `a9402cda2a8d8adaa83c1a61e27ef7a1f073d6a78ef9092db2d13220c15a05e2`

## Direção específica deste experimento

Corte longitudinal do subsolo, com terreno fosco e máquina em destaque. A cidade aparece, no máximo, como referência de escala simplificada.

O cenário deve facilitar a leitura de **como o tatuzão cava e deixa o túnel pronto atrás dele?**. Em capturas para redes, preservar a marca e o objeto, reduzir controles secundários e manter rótulos essenciais. Evitar chamar um mockup de aplicação pronta.
