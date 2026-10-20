# Landing Page Modular — GitHub Pages

Repositório preparado para publicação como site estático no GitHub Pages.

## Estrutura esperada

O arquivo `index.html` deve ficar na raiz do repositório, junto com as pastas principais:

```txt
index.html
blog.html
.nojekyll
assets/
blog/
css/
js/
sections/
servicos/
```

## Como publicar

1. Suba todos os arquivos para a branch `main`.
2. No GitHub, acesse `Settings > Pages`.
3. Em `Build and deployment`, selecione:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
4. Salve e aguarde o link do GitHub Pages.

## Observações

- O projeto não depende de React, Vite ou npm.
- Não é necessário rodar build.
- As seções são carregadas dinamicamente por `js/include-sections.js`.
- A seção Problema usa o SVG do pato em `assets/icons/pato.svg`.


## Biblioteca das dez referências

Foram acrescentadas 54 seções HTML, com SVGs locais, galeria de opções e integração ao Forma Studio. A landing original continua em `index.html`.

Execute `npm run dev` (Node.js 20+; sem instalação adicional para esse servidor) e abra `http://localhost:4173/COMECE-AQUI.html`.

- `biblioteca/index.html`: opções, prévias, código e composição por seções.
- `forma-studio/index.html`: editor com 82 blocos e 18 modelos completos.
- `docs/ANALISE_REFERENCIAS.md`: análise de cada imagem, inventário e aproximações.
- `npm run check`: 25 testes e checagens de sintaxe.

Ao publicar a raiz no GitHub Pages, a biblioteca e o editor ficam disponíveis em suas respectivas subpastas. Os scripts de desenvolvimento e testes não são necessários na hospedagem estática.
