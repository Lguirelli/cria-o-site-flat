# Forma Studio 1.16.8 — seção Folioblox dividida e CSS por sequência

## Folioblox

A composição antiga `Manifesto e três projetos` foi separada em duas seções reutilizáveis:

1. `Manifesto / posicionamento` — texto, posicionamento e CTA.
2. `Projetos selecionados` — três cards com três slots/nodes de imagem independentes.

O preset Folioblox insere as duas em sequência. Projetos antigos com a composição combinada são migrados automaticamente, preservando sequência, links de protótipo e bindings dos três nodes de imagem.

## CSS / Estilos

O node `CSS · Estilos` agora possui propriedade de componente conectado:

- ao conectar o CSS a qualquer seção de uma sequência, todas as seções conectadas recebem o mesmo contexto;
- um segundo CSS conectado ao mesmo componente substitui o anterior para a sequência inteira;
- não há dois nodes CSS competindo dentro da mesma sequência;
- Google Fonts e a paleta Huemint continuam sendo a fonte dos tokens;
- tokens são aplicados também às variáveis visuais das seções (`--nr-*` e `--forma-*`);
- texto, headings, superfícies, formulários, links, botões e ações recebem overrides com prioridade para sobrescrever estilos locais comuns;
- imagens e máscaras não são alteradas pelo CSS do tema.

## Validação

- sintaxe do editor e runtime validada;
- 86/86 testes aprovados;
- catálogo: 90 blocos totais;
- referências 20/10: 57 seções em 14 referências.
