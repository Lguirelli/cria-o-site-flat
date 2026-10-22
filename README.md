# Forma Studio 1.9.3

Nesta versão, **seção é a unidade nodal do editor**. Cada item visual no canvas representa uma única seção; páginas contínuas são montadas conectando seções em sequência. A biblioteca usa skeleton previews estáticos por tipo de seção.

## Navegação e nodes de seção

- Scroll na área de edição: zoom em torno do cursor.
- Botão do meio + arrastar: pan.
- Delete/Backspace: exclui a seção selecionada/ativa.
- Mute e Collapse pertencem à seção.
- O socket verde conecta uma seção à próxima; `link_off` desconecta sem iniciar o drag da seção.
- Shift+A abre o menu pesquisável de seções.
- Soltar uma conexão no vazio abre o Add e cria a nova seção já conectada.
- O snap de sequência usa uma área magnética ampliada ao redor da entrada da seção.
- No modo Protótipo, um conector aparece no lado esquerdo do item quando o cursor se aproxima, sem exigir seleção prévia.
- **Prototype Preview** é um node especial opcional: ele só aparece depois de ser adicionado pelo menu `Add > Sistema`.
- Menu lateral é minimizável e as miniaturas em **Blocos** são skeletons estruturais.
- Modo escuro afeta o editor, sem alterar o conteúdo real das seções.


Base: Forma Studio reconstruído a partir de Com Rodapés. Os 28 blocos originais continuam disponíveis. Foram adicionadas **56 seções**, totalizando **84 blocos e 22 modelos**.

## Abrir

Execute `npm run dev` e abra http://localhost:4173. O index é o construtor. `previews/index.html` reúne as 14 páginas de referência em português, montadas com as mesmas seções editáveis. `wireframes/` contém um SVG por nova seção.

Use o filtro de referência em Blocos para localizar cada família. Também há um JSON por referência em `examples/`. Ao abrir um rascunho antigo que possua várias seções dentro da mesma prancheta, o editor separa essas seções em unidades nodais individuais e preserva a ordem com conexões de sequência.

Mantidos os globais, conexão por elemento dos dois lados, sequência entre seções, Viewer/Prototype Preview opcional e regras de UX/responsividade.

## Entregáveis e limites

- `docs/ANALISE_REFERENCIAS_PT_BR.md`: análise individual e mapa das seções.
- `docs/traducoes-pt-br.json`: 259 traduções aplicadas aos novos textos de interface.
- `blocks/r20-*.html`: 56 seções independentes.
- `wireframes/r20-*.svg`: diagramas vetoriais editáveis.
- `previews/`: 14 páginas e índice de consulta.
- 28 imagens independentes geradas para as novas seções, em `assets/generated/`. As interfaces CORA e o fluxo logístico usam componentes editáveis. Nenhum bloco depende de recortes das capturas originais. Imagens inspiradas nos temas; não são fotos reais das marcas ou pessoas citadas.
- Os 84 blocos estão em português, incluindo os 28 anteriores e os diálogos de reserva. Marcas e nomes próprios foram preservados.
- Menus com destinos não mostrados nas imagens precisam ser ligados às páginas desejadas no editor. Produtos, formulário e números são demonstrativos; nenhum pedido é enviado.
- QA visual pendente por indisponibilidade de control-browser; detalhes em design-qa.md.

## Verificar

`npm run check`
`node scripts/generate-reference-previews.mjs`
`node scripts/package-site.mjs`

## Arrastar seções do menu

Na área de edição, use a **rodinha/scroll do mouse para zoom in e zoom out**. O zoom mantém o ponto sob o cursor como referência. Para navegar pelo mapa sem alterar o zoom, pressione o **botão do meio** e arraste. A rolagem dos painéis laterais continua independente.

Na aba **Blocos**, cada cartão usa um skeleton estático que representa a estrutura da seção. Arraste um cartão para o espaço vazio para criar uma seção independente. Solte sobre outra seção para criar a nova unidade e inseri-la logo depois na sequência, sem reconstruir as demais seções do canvas. Clicar no cartão cria uma seção independente somente quando nenhum elemento interno estiver selecionado.

Os rascunhos antigos recebem a tradução e as imagens novas somente quando o conteúdo corresponde exatamente ao original. Textos alterados e imagens substituídas pelo usuário permanecem. Os arquivos JSON exportados anteriormente podem ser reabertos para receber a mesma atualização.

Prompts e origem: `docs/imagens-geradas.json`. As imagens foram criadas com a ferramenta integrada de geração de imagens e convertidas para WebP, sem redimensionamento. Alguns arquivos são reutilizados intencionalmente em seções relacionadas.

## Textos clicáveis no Protótipo

Abra **Protótipo**, selecione um título, parágrafo, legenda ou outro elemento e arraste o ponto lateral até a seção de destino. A navegação é ativada em **Testar** e na exportação por clique, Enter ou Espaço. No modo Design, o texto continua editável e os controles de navegação ficam ocultos. Para remover uma ligação, puxe sua ponta e solte no espaço vazio do mapa.

Selecione textos, botões, links, imagens ou campos. Os conectores aparecem junto às bordas esquerda e direita do próprio elemento e acompanham zoom e posição da seção. Arraste até a seção de destino. Duplo clique apenas seleciona no Protótipo; para editar conteúdo, volte a Design.

A biblioteca é agrupada por tipo de seção. O botão do meio do mouse + arrastar navega pelo mapa inclusive sobre o conteúdo renderizado. Ao criar ou conectar uma seção, apenas as unidades afetadas são atualizadas; as demais não recarregam.

## 1.9.3

- O item `CSS · Estilos` continua disponível no menu rápido `Shift + A`, mas não é mais um editor de CSS livre.
- **Google Fonts** controla a família de títulos e a família de corpo. A exportação usa a Google Fonts CSS2 API; a chave opcional da Webfonts Developer API serve apenas para carregar o catálogo completo no editor e nunca é incluída no projeto/site.
- **Huemint** gera cinco tokens de cor contextuais: fundo, superfície, texto, primária e acento. É possível travar cores antes de regenerar.
- A paleta do Huemint é salva como valores estáticos no `.forma.json`; o site exportado não consulta Huemint.
- Os tokens de cor e tipografia são incorporados à prévia e à exportação como variáveis `--forma-*`.
- CSS livre de projetos 1.9.2 é preservado somente como CSS legado na migração, sem editor dedicado.
