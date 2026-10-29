# Forma Studio 1.17.1 — Publicação conectada ao Prototype Preview

- **Exportar site** utiliza somente a sequência de seções conectada ao **Prototype Preview**. O site pode incluir outras sequências apenas quando são alcançáveis por conexões de navegação do protótipo, mantendo subpáginas e seus links funcionais.
- Seções, grupos, imagens e CSS sem ligação com a estrutura publicada **não entram no HTML nem no `projeto.forma.json` da exportação**. Nodes de imagem compartilhados têm as conexões externas removidas somente na cópia exportada.
- A seção conectada define a página inicial da exportação (`index.html`), mesmo quando não é a página inicial do editor. A sequência anterior até essa seção continua incluída.
- **Sem uma conexão ativa ao Prototype Preview, a exportação é impedida** com uma mensagem orientando a conexão. A mini prévia e a prévia ampliada também são limitadas às páginas do site publicado.
- **Salvar projeto** e o salvamento automático na aba **Projetos** continuam guardando **todo o canvas**, inclusive seções soltas e testes. **Exportar backup JSON**, separado da exportação do site, também preserva o projeto inteiro.
- Os arquivos de CSS/JS e os assets necessários ao funcionamento do catálogo são mantidos no pacote estático. Os arquivos HTML exportados e o JSON de publicação são filtrados. Use `npm run check` para validar o comportamento.

---

# Atualização 1.16.9 — Exclusão de imagens e salvamento

- Os nodes de imagem agora têm botões de **Propriedades** e **Excluir** visíveis no cabeçalho, no mesmo padrão dos nodes de seção. O botão Excluir remove o node e suas ligações sem excluir a seção e permite desfazer com **Ctrl+Z**.
- Quando a imagem excluída estava conectada a um espaço da seção, a máscara permanece e volta ao wireframe com X. A exclusão não recria automaticamente o node removido.
- **Salvar projeto** (**Ctrl+S**) grava o projeto editável `.forma.json` inteiro, incluindo imagens, conexões, layout, CSS e textos. Em navegadores compatíveis e contexto seguro, usa o diálogo de arquivo do sistema; nos demais, inicia o download do JSON. **Ctrl+Shift+S** permite salvar como novo arquivo.
- **Abrir projeto** importa o arquivo `.forma.json` para continuar editando. Rascunhos locais permanecem disponíveis quando o navegador permite; salvar o arquivo protege contra limites de armazenamento local.

Para uso offline com as fontes originais, restaure os arquivos binários de fonte do ZIP original enviado. Nesta distribuição, `assets/fonts.css` referencia as mesmas famílias por URL pública e utiliza fontes de sistema caso a rede esteja indisponível.

---

# Forma Studio 1.16.9

Nesta versão, **seção é a unidade nodal do editor**. Cada item visual no canvas representa uma única seção; páginas contínuas são montadas conectando seções em sequência. A biblioteca usa skeleton previews estáticos por tipo de seção.


## 1.16.6 — Nodes tipados, Protótipo e estilos

- O box de cada slot de imagem funciona como máscara: imagem conectada usa preenchimento `cover`; ao desconectar, o mesmo box volta ao wireframe com X.
- Nodes de imagem ficam separados à esquerda no Design e recolhem automaticamente no modo Protótipo.
- No Protótipo, todos os elementos visuais normalizados podem enviar e receber conexões. O conector esquerdo aparece por proximidade e permite remover rapidamente conexões de entrada; o direito cria a saída.
- O snap de sequência foi ampliado e prioriza o socket real da seção.
- `Shift+A` pesquisa também `Prototype Preview` e `CSS · Estilos`. O Viewer é opcional e só aparece quando adicionado.
- O node CSS usa Google Fonts para tipografia e Huemint para paleta, mantendo a conexão teal tipada às seções.
- Conectores permanecem separados por função: sequência (verde), imagem (laranja), CSS (teal) e protótipo/output (roxo).

## Navegação e nodes de seção

- Scroll na área de edição: zoom em torno do cursor.
- Botão do meio + arrastar: pan.
- Delete/Backspace: exclui a seção selecionada/ativa.
- Mute e Collapse pertencem à seção.
- O socket verde conecta uma seção à próxima; `link_off` desconecta sem iniciar o drag da seção.
- Shift+A abre o menu pesquisável de seções.
- Soltar uma conexão no vazio abre o Add e cria a nova seção já conectada.
- Prototype Output continua como saída especial do fluxo.
- Menu lateral é minimizável e as miniaturas em **Blocos** são skeletons estruturais.
- Modo escuro afeta o editor, sem alterar o conteúdo real das seções.


Base: Forma Studio reconstruído a partir de Com Rodapés. Os 28 blocos originais continuam disponíveis. Foram adicionadas **56 seções**, totalizando **84 blocos e 22 modelos**.

## Abrir

Execute `npm run dev` e abra http://localhost:4173. O index é o construtor. `previews/index.html` reúne as 14 páginas de referência em português, montadas com as mesmas seções editáveis. `wireframes/` contém um SVG por nova seção.

Use o filtro de referência em Blocos para localizar cada família. Também há um JSON por referência em `examples/`. Ao abrir um rascunho antigo que possua várias seções dentro da mesma prancheta, o editor separa essas seções em unidades nodais individuais e preserva a ordem com conexões de sequência.

Mantidos os globais, conexão por elemento dos dois lados, sequência entre seções, Prototype Output e regras de UX/responsividade.

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

## 1.10 — Área livre e prévia fixa

A área usa uma câmera livre, sem bordas artificiais: arraste o fundo, use Espaço + arraste ou o botão central para navegar. A roda aplica zoom no ponto do cursor. As seções podem ocupar coordenadas positivas ou negativas; o botão Centralizar recupera a seção ativa. A posição das seções é preservada no JSON.

A prévia no canto superior direito mostra o site montado com as conexões, cabeçalho e rodapé globais. Atualiza após alterações, permite trocar de página, navegar pelos links, recolher e ampliar.

Cada miniatura usa o wireframe vetorial específico da seção como skeleton, com brilho suave e respeito à preferência por movimento reduzido.

Foram recompostos index.html, package.json e server.mjs, ausentes no ZIP recebido. Para executar, use npm run dev. Para preparar GitHub Pages: node scripts/package-site.mjs.


## Forma Studio 1.17.0 — projetos internos e desconexões

- Na lateral, abra **Projetos** para **criar, abrir, duplicar, renomear ou excluir** projetos. Cada projeto é armazenado de forma independente em **IndexedDB**, neste navegador e nesta origem/domínio. É possível salvar manualmente no botão **Salvar projeto** (`Ctrl+S`), e há salvamento automático após alterações. O editor restaura o último projeto aberto após atualizar a página. Projetos não são enviados a um servidor.
- **Importar JSON** cria um novo projeto na biblioteca local e não substitui os já salvos. **Exportar backup** (`Ctrl+Shift+S`) baixa um `.forma.json` para transferência/recuperação. Não confunda o backup com o salvamento interno. Como qualquer dado local, projetos podem ser perdidos se o usuário apagar os dados do navegador; mantenha backups importantes.
- Os nodes de **imagem** agora oferecem botão **Desconectar** (ícone de corrente cortada), separado de **Excluir**; a imagem continua disponível no canvas após desconectar e a seção retoma o placeholder. Também há desconexão direta nos nodes **CSS**, nas **sequências de seções** e no **Prototype Preview**. Todas as ações permanecem no histórico de desfazer.
- A versão mantém a execução por `npm run dev` (Node >= 20) ou hospedagem estática. Não execute o editor diretamente por `file://`.
- Os arquivos binários de fonte não são distribuídos no ZIP; o CSS utiliza fontes remotas e alternativas de sistema.
