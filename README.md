# Forma Studio — 14 novas referências em português

Base: Forma Studio reconstruído a partir de Com Rodapés. Os 28 blocos originais continuam disponíveis. Foram adicionadas **56 seções**, totalizando **84 blocos e 22 modelos**.

## Abrir

Execute `npm run dev` e abra http://localhost:4173. O index é o construtor. `previews/index.html` reúne as 14 páginas de referência em português, montadas com as mesmas seções editáveis. `wireframes/` contém um SVG por nova seção.

Use o filtro de referência em Blocos para localizar cada família. Em Inserir modelo completo, escolha a referência de 20/10. Também há um JSON por referência em examples. Rascunhos existentes recebem as novas pranchetas até o limite de 120; acima disso os blocos continuam na biblioteca.

Mantidos os globais, conexão por elemento dos dois lados, sequência inferior, organização das pranchetas e regras de UX/responsividade.

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

Na aba **Blocos**, arraste qualquer cartão para o mapa. Solte no espaço vazio para criar uma prancheta na posição indicada, ou sobre uma prancheta destacada para adicionar a seção ao final. O catálogo continua disponível para reutilização. Use as camadas para reordenar as seções e **Desfazer** para reverter uma inclusão. Clicar no cartão adiciona a seção à página ativa somente quando nenhuma seção estiver selecionada. Com uma seção selecionada, use arrastar e soltar; isso evita inclusão duplicada acidental.

Os rascunhos antigos recebem a tradução e as imagens novas somente quando o conteúdo corresponde exatamente ao original. Textos alterados e imagens substituídas pelo usuário permanecem. Os arquivos JSON exportados anteriormente podem ser reabertos para receber a mesma atualização.

Prompts e origem: `docs/imagens-geradas.json`. As imagens foram criadas com a ferramenta integrada de geração de imagens e convertidas para WebP, sem redimensionamento. Alguns arquivos são reutilizados intencionalmente em seções relacionadas.

## Textos clicáveis no Protótipo

Abra **Protótipo**, selecione um título, parágrafo, legenda ou outro texto e arraste o ponto lateral até a página de destino. Também é possível escolher o destino no painel **Interações**. A navegação é ativada em **Testar** e na exportação por clique, Enter ou Espaço. No modo Design, o texto continua editável e os controles de conexão ficam ocultos. Para remover uma ligação, puxe sua ponta e solte no espaço vazio do mapa.

### Protótipo 1.8.2
Selecione textos, botões, links, imagens ou campos. Os conectores aparecem junto às bordas esquerda e direita do próprio elemento e acompanham zoom e posição da prancheta. Arraste até a prancheta de destino. Duplo clique apenas seleciona; digitação, colagem e alteração dos campos são bloqueadas. Para editar conteúdo, volte a Design.

A biblioteca de blocos é agrupada por tipo de seção. O botão do meio do mouse + arrastar navega pelo mapa inclusive sobre as pranchetas. Ao soltar um bloco, apenas a prancheta afetada é reconstruída; as demais não recarregam.
