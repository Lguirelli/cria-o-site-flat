# Forma Studio

Editor visual de páginas e subpáginas baseado nos 24 blocos das oito referências de landing pages. A interface usa pranchetas, modos Design/Protótipo e conexões visuais, em um fluxo inspirado no Adobe XD. O resultado é um site estático responsivo que pode ser publicado no GitHub Pages.

## Começar

Requer Node.js 20 ou superior. Não há dependências para instalar.

```bash
npm run dev
```

Abra **http://localhost:4173**. O editor precisa de HTTP; não funciona abrindo `index.html` por duplo clique. O site exportado pode ser aberto localmente.

Na primeira abertura, os **24 blocos aparecem como pranchetas flutuantes independentes**, em uma grade no mapa. Use **Abrir todos os blocos** para recriar esse mapa a qualquer momento. Depois de editar, o rascunho desta versão é restaurado ao reabrir. O exemplo de três páginas continua disponível em `examples/hotel.forma.json`, para importar se desejar.

## Criar e editar visualmente

1. Escolha uma prancheta na lista **Páginas**.
2. Na aba **Blocos**, selecione uma seção para adicioná-la à página atual. Busque pelo nome ou filtre pela categoria.
3. Clique em um texto, imagem, botão ou área de fundo na prancheta. Edite pelo painel à direita. Para textos, também é possível dar duplo clique e escrever diretamente.
4. Troque imagens por arquivo local ou URL. Imagens enviadas ficam incorporadas ao projeto JSON; arquivos locais de até 5 MB são aceitos.
5. Altere cores, tamanho de fonte, espaçamento interno e alinhamento. Os controles aparecem conforme o elemento selecionado.
6. Arraste as seções na lista para reordenar; as setas também permitem essa operação. Clique no nome do bloco para duplicar ou excluir.
7. Arraste o título da prancheta para organizar o mapa. Use zoom e a rolagem da área de trabalho; espaço + arrastar no fundo movimenta a área visível.
8. Teste a largura desktop, tablet ou mobile. O fluxo dos blocos permanece responsivo; a posição da prancheta no mapa não altera a ordem do conteúdo exportado.

## Ligar partes a subpáginas

1. Selecione **Protótipo**.
2. Clique no botão, texto ou imagem que iniciará a navegação.
3. Arraste o ponto roxo até a prancheta de destino, ou escolha **Ao clicar, navegar para** no painel direito.
4. Use **Criar subpágina e conectar** para criar uma página vazia já conectada ao elemento.
5. Clique em **Testar** para navegar pelas ligações. A prévia também mantém as interações demonstrativas dos blocos.

As conexões são por elemento e permanecem salvas no JSON. Ao exportar, a página inicial vira `index.html`; as demais usam o nome de arquivo configurado. Duplicar uma página copia suas ligações. Excluí-la remove as ligações relacionadas.

## Conectar blocos dentro da mesma página

Cada prancheta tem um **conector verde na parte inferior** e uma lista **Conectar próximo bloco**. Arraste o conector para outra prancheta ou escolha o destino na lista. A linha verde representa a continuação vertical da página, não um clique de navegação. A mesma opção aparece no painel direito quando a prancheta inteira está selecionada.

Por exemplo: **Hero → Quartos → Comodidades → Rodapé**. Essas quatro pranchetas continuam soltas no mapa para edição, mas **Testar** e **Exportar site** juntam os quatro blocos em um único HTML, na ordem das conexões. A posição física das pranchetas não define essa ordem.

- **Roxo:** um botão ou outro elemento abre a prancheta de destino. Se ela faz parte de uma sequência, o link aponta para o bloco correto dentro da página montada.
- **Verde:** uma prancheta é seguida por outra no mesmo documento.
- Escolha **Fim da página** ou a primeira opção vazia para desfazer uma conexão verde.
- Cada prancheta tem no máximo uma entrada e uma saída verde. O editor impede ciclos e duas entradas concorrentes. Para usar o mesmo conteúdo em outra página, duplique a prancheta.
- O primeiro bloco da sequência determina o nome do arquivo. A sequência que contém a prancheta inicial é exportada como `index.html`.
- Pranchetas não conectadas continuam sendo páginas independentes.

## Salvar o formato de trabalho e o resultado final

- **Rascunho automático:** armazenamento local deste navegador; não sincroniza com GitHub nem entre dispositivos. Arquivos de imagem grandes podem exceder a cota do navegador; a interface avisa quando é necessário baixar o JSON.
- **Salvar projeto:** baixa `nome.forma.json`, contendo páginas, blocos editados, posições, imagens enviadas e conexões. Este é o formato editável para versionar no GitHub.
- **Abrir JSON:** restaura um projeto salvo. Uma importação substitui o projeto aberto e pode ser desfeita.
- **Exportar site:** baixa um ZIP com todos os HTMLs, CSS, interações, fontes e imagens da biblioteca, além do JSON editável. As imagens inseridas por URL continuam dependendo dessa URL; envie um arquivo local para incorporá-lo.
- **Desfazer/refazer:** botões da barra superior; `Ctrl/Cmd+Z` e `Ctrl/Cmd+Shift+Z` quando o foco está no editor. `Ctrl/Cmd+S` baixa o JSON.

O ZIP final não exige o construtor, npm ou servidor de aplicação para funcionar. Os formulários e reservas continuam sendo demonstrações; não há backend, envio de e-mail ou cobrança.

## Publicar o construtor no GitHub

1. Crie um repositório e coloque **o conteúdo desta pasta na raiz**, incluindo `.github/workflows/pages.yml` e `.nojekyll`.
2. Use a branch `main`, ou ajuste o nome em `pages.yml`.
3. Em **Settings → Pages → Build and deployment**, escolha **GitHub Actions**.
4. Faça push ou execute o workflow **Publish Forma Studio** pela aba Actions.
5. O workflow valida o código, prepara `dist/` e publica o editor. O endereço aparece no ambiente `github-pages`.

O workflow publica o **construtor**. Para publicar o **site criado**, extraia o ZIP exportado em outro repositório e publique a raiz da branch em GitHub Pages. Os projetos JSON são salvos por download; o editor não grava commits nem pede token do GitHub.

Documentação utilizada: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## Organização do repositório

| Caminho | Conteúdo |
| --- | --- |
| `index.html`, `editor.css`, `editor.js` | Interface do editor, pranchetas e painel de propriedades |
| `blocks/*.html` | 24 blocos HTML independentes |
| `catalog.json` | Metadados, categorias, temas, oito modelos e arquivos exportáveis |
| `lib/project.js` | Formato de projeto, validação e ligações |
| `lib/document.js` | Montagem do HTML de prévia e exportação |
| `lib/bridge.js` | Seleção, edição e medidas dentro das pranchetas isoladas |
| `lib/zip.js` | Exportação ZIP no navegador, sem biblioteca externa |
| `page.css`, `runtime.js` | Visual e interações dos blocos no site final |
| `assets/` | Fotografias e fontes locais, incluindo Material Symbols do Google Fonts |
| `examples/hotel.forma.json` | Projeto inicial com três páginas conectadas |
| `tests/` | Verificações automatizadas de projetos, ligações e exportação |
| `.github/workflows/pages.yml` | Publicação do editor no GitHub Pages |

## Adicionar novos blocos

Crie o HTML em `blocks/` e adicione um registro em `catalog.json` com `id`, `name`, `source`, `theme`, `category` e `file`. Os caminhos de imagem devem ser relativos à raiz, como `assets/foto.webp`. Cadastre novos arquivos no array `assets` para incluí-los na exportação. Use seletores CSS limitados ao tema do bloco para preservar a composição com outros modelos.

Categorias aceitas pela interface: `hero`, `header`, `content`, `rooms`, `features` e `booking`. O HTML de novos blocos deve conter somente conteúdo; scripts externos e handlers HTML são removidos ao importá-lo para o editor. Comportamentos novos devem ser implementados em `runtime.js`.

## Escopo e validação

Esta é uma primeira versão funcional do editor de blocos. Tem pranchetas, edição de conteúdo/estilo, ordenação de seções, subpáginas, conexões, undo/redo e exportação. Não implementa todas as ferramentas do Adobe XD: não há desenho vetorial livre, edição por coordenadas de cada elemento, colaboração em tempo real ou animações de transição entre páginas.

Execute `npm run check` para verificar sintaxe e os quinze testes de integridade. O gerador de ZIP também foi conferido com extração independente. A validação visual e de gestos em navegador ainda está pendente; não foi possível executá-la no ambiente de criação. O workflow de publicação está preparado, mas este pacote não foi enviado nem publicado em uma conta GitHub.
