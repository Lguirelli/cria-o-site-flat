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
- Fotografias e arte usam recortes visuais por CSS das referências; podem ser substituídas pelo inspetor. Palavras integradas às imagens originais não são texto HTML e permanecem na língua original.
- O catálogo antigo foi preservado, incluindo seus textos originais. A tradução desta entrega cobre as 14 novas referências.
- Menus com destinos não mostrados nas imagens precisam ser ligados às páginas desejadas no editor. Produtos, formulário e números são demonstrativos; nenhum pedido é enviado.
- QA visual pendente por indisponibilidade de control-browser; detalhes em design-qa.md.

## Verificar

`npm run check`
`node scripts/generate-reference-previews.mjs`
`node scripts/package-site.mjs`
