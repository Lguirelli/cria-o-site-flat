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
