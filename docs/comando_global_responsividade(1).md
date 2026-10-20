# COMANDO GLOBAL DE RESPONSIVIDADE
## SISTEMA DE REGRAS DE LAYOUT ADAPTATIVO, REFLOW, REDIMENSIONAMENTO E MULTIDISPOSITIVO

Este documento deve ser tratado como um **sistema permanente de regras de responsividade**.

Aplicar estas regras a todas as:

- páginas;
- interfaces;
- componentes;
- seções;
- grids;
- headers;
- menus;
- navegações;
- formulários;
- cards;
- galerias;
- tabelas;
- imagens;
- vídeos;
- mapas;
- modais;
- drawers;
- toolbars;
- sidebars;
- tabs;
- overlays;
- elementos flutuantes;
- estados;
- interações.

Responsividade não deve ser entendida apenas como adaptação entre:

**desktop → tablet → mobile**

O sistema deve responder continuamente a:

**espaço disponível → conteúdo → contexto → método de entrada → preferências do usuário**

---

# 1. PRINCÍPIO CENTRAL

Toda interface deve funcionar corretamente independentemente da dimensão exata da viewport.

Não projetar páginas para resoluções específicas.

Projetar **sistemas que se reorganizam conforme o espaço disponível**.

---

# 2. RESPONSIVIDADE É CONTÍNUA

Não considerar apenas três estados fixos:

- desktop;
- tablet;
- mobile.

A interface deve funcionar em qualquer largura intermediária.

Exemplos:

- 320 px;
- 375 px;
- 430 px;
- 540 px;
- 768 px;
- 900 px;
- 1024 px;
- 1280 px;
- 1440 px;
- 1920 px;
- janelas redimensionadas;
- split screen;
- picture-in-picture;
- telas externas;
- zoom do navegador.

Nenhum intervalo intermediário pode ser tratado como situação improvável.

---

# 3. BREAKPOINTS DEVEM SEGUIR O CONTEÚDO

Não escolher breakpoints apenas porque correspondem a dispositivos populares.

Criar breakpoint quando:

- conteúdo começa a colidir;
- linha fica excessivamente longa;
- navegação deixa de caber;
- controles ficam comprimidos;
- cards perdem legibilidade;
- grid deixa de funcionar;
- formulário se torna desconfortável;
- hierarquia começa a se degradar.

O breakpoint deve existir porque **o layout precisa mudar**, não porque um aparelho específico existe.

---

# 4. NÃO DETECTAR DISPOSITIVO PARA DEFINIR LAYOUT

Evitar regras como:

- se iPhone;
- se tablet;
- se desktop;
- se orientação landscape;
- se determinado modelo.

Preferir regras baseadas em:

- largura disponível;
- altura disponível;
- aspect ratio;
- capacidade de interação;
- espaço interno do container;
- contexto real do componente.

---

# 5. CONTAINER ANTES DE VIEWPORT

Sempre que possível, componentes devem responder ao espaço que recebem, e não apenas à largura total da tela.

Preferir arquitetura compatível com:

- container queries;
- grids intrínsecos;
- flexbox;
- CSS Grid;
- minmax;
- clamp;
- auto-fit;
- auto-fill.

Um componente deve poder funcionar:

- ocupando a página inteira;
- dentro de uma coluna;
- dentro de sidebar;
- dentro de modal;
- dentro de dashboard.

---

# 6. MESMA FUNCIONALIDADE, APRESENTAÇÃO DIFERENTE

Mudança de largura pode alterar:

- disposição;
- quantidade visível;
- agrupamento;
- ordem visual;
- navegação;
- densidade;
- apresentação.

Não remover funcionalidade essencial apenas porque a tela diminuiu.

---

# 7. PRIORIDADE EM ESPAÇO REDUZIDO

Quando o espaço diminuir, preservar nesta ordem:

1. conteúdo principal;
2. ação principal;
3. navegação essencial;
4. contexto;
5. ações frequentes;
6. ações secundárias;
7. informação auxiliar;
8. decoração.

O primeiro elemento a desaparecer nunca deve ser o que a pessoa mais precisa.

---

# 8. REFLOW ANTES DE REDUÇÃO

Quando elementos deixam de caber:

**reorganizar antes de simplesmente diminuir.**

Preferir:

- quebrar linha;
- empilhar;
- alterar colunas;
- mover controles;
- reorganizar navegação;
- usar overflow;
- reduzir densidade.

Evitar diminuir indefinidamente:

- fontes;
- ícones;
- botões;
- espaços;
- imagens.

---

# 9. NÃO COMPRIMIR ATÉ CABER

Não resolver responsividade transformando todos os elementos em versões minúsculas.

Uma interface responsiva deve reorganizar-se.

Não apenas encolher.

---

# 10. MOBILE NÃO É DESKTOP REDUZIDO

Em telas estreitas, reconsiderar:

- ordem;
- hierarquia;
- agrupamentos;
- largura;
- navegação;
- interação;
- densidade;
- controles;
- imagens.

Não executar apenas:

`transform: scale(...)`.

---

# 11. DESKTOP NÃO É MOBILE ESTICADO

Quando existir espaço adicional:

- melhorar legibilidade;
- permitir visualização simultânea;
- utilizar grids;
- expor ações úteis;
- distribuir informação;
- aumentar contexto.

Não aumentar indefinidamente a largura dos mesmos elementos.

---

# 12. LARGURA MÁXIMA DE CONTEÚDO

Conteúdo textual não deve ocupar automaticamente toda a largura disponível em telas grandes.

Aplicar `max-width` quando necessário.

Grandes monitores devem ganhar:

- espaço;
- estrutura;
- contexto;

e não linhas de texto gigantes.

---

# 13. CENTRALIZAÇÃO EM TELAS MUITO GRANDES

Quando a largura cresce muito, manter conteúdo principal em região visual confortável.

Evitar interfaces importantes espalhadas pelos extremos da tela sem necessidade.

---

# 14. GRID FLUIDO

Preferir grids capazes de adaptar quantidade de colunas automaticamente.

Exemplo conceitual:

**4 → 3 → 2 → 1**

A mudança deve ocorrer conforme a largura necessária para preservar qualidade do item.

---

# 15. COLUNAS DEVEM TER LARGURA ÚTIL

Não manter múltiplas colunas apenas para preservar um grid.

Se uma coluna ficar estreita demais para seu conteúdo:

reduzir a quantidade de colunas.

---

# 16. GAP TAMBÉM É RESPONSIVO

Espaçamento entre elementos pode variar conforme o espaço disponível.

Não tratar `gap` como valor fixo universal.

Preferir escalas controladas.

---

# 17. ESPAÇAMENTO FLUIDO

Quando apropriado, utilizar funções como:

`clamp()`

para criar transições suaves entre tamanhos mínimos e máximos.

Aplicável a:

- padding;
- gap;
- margin;
- títulos;
- espaços de seção.

---

# 18. NÃO EXAGERAR EM MEDIA QUERIES

Não criar dezenas de correções isoladas para componentes mal estruturados.

Primeiro construir layout intrinsecamente adaptável.

Usar media queries apenas quando houver mudança real de comportamento.

---

# 19. EVITAR BREAKPOINT HELL

Não criar:

- 767 px;
- 768 px;
- 769 px;
- 800 px;
- 820 px;
- 834 px;

apenas para corrigir exceções locais.

Consolidar regras em um sistema coerente.

---

# 20. ALTURA NÃO É GARANTIDA

Não presumir que uma viewport possui altura específica.

Considerar:

- navegador móvel;
- barras expansíveis;
- teclado virtual;
- split screen;
- landscape;
- dispositivos baixos;
- zoom.

Evitar depender excessivamente de `100vh`.

Quando apropriado, considerar unidades modernas como:

- `svh`;
- `dvh`;
- `lvh`.

---

# 21. HERO NÃO DEVE QUEBRAR EM TELAS BAIXAS

Um hero de tela cheia precisa considerar não apenas largura, mas também altura disponível.

Se o conteúdo não couber:

- permitir scroll;
- reduzir espaçamento;
- reorganizar composição.

Não cortar CTA ou conteúdo essencial.

---

# 22. SAFE AREAS

Interfaces próximas às bordas devem considerar áreas não utilizáveis.

Evitar colocar conteúdo essencial diretamente junto a:

- recortes;
- barras;
- áreas de gestos;
- controles do sistema;
- bordas físicas.

---

# 23. EDGE-TO-EDGE COM RESPONSABILIDADE

Imagens, fundos e elementos decorativos podem ocupar toda a tela.

Conteúdo e controles precisam continuar respeitando regiões seguras.

---

# 24. ORIENTAÇÃO NÃO DEFINE A EXPERIÊNCIA

Portrait e landscape devem ser tratados como diferentes relações de espaço.

Não assumir:

portrait = mobile  
landscape = desktop

Uma janela estreita pode estar em landscape.

Uma janela larga pode estar em portrait.

---

# 25. MUDANÇA DE ORIENTAÇÃO NÃO PODE QUEBRAR CONTEXTO

Ao mudar orientação:

- preservar posição;
- preservar tarefa;
- preservar estado;
- preservar seleção;
- preservar navegação.

Não reinicializar a página.

---

# 26. JANELAS REDIMENSIONÁVEIS

Assumir que interfaces podem ser redimensionadas continuamente.

O layout deve reagir durante o redimensionamento sem:

- sobreposição;
- clipping;
- elementos inacessíveis;
- flickering;
- mudanças incoerentes.

---

# 27. DEFINIR LIMITES SOMENTE QUANDO NECESSÁRIO

`min-width` e `max-width` podem proteger componentes.

Não utilizá-los para impedir adaptação apenas porque determinado layout é mais fácil de implementar.

---

# 28. TEXTO É PARTE DA RESPONSIVIDADE

Responsividade também deve considerar mudanças de tamanho de fonte.

A interface deve continuar funcionando quando texto aumentar significativamente.

---

# 29. TESTAR TEXTO EM 200% OU MAIS

Aumentar textos durante validação.

Verificar:

- sobreposição;
- clipping;
- truncamento;
- botões;
- menus;
- tabelas;
- cards;
- navegação;
- formulários.

---

# 30. TEXTO NÃO DEVE DEPENDER DE ALTURA FIXA

Containers textuais devem poder crescer.

Evitar:

```css
height: 40px;
```

quando conteúdo pode ocupar mais de uma linha.

Preferir:

- `min-height`;
- height automática;
- layout flexível.

---

# 31. PERMITIR WRAP

Textos devem poder quebrar linha quando necessário.

Não usar `white-space: nowrap` indiscriminadamente.

---

# 32. NÃO TRUNCAR CONTEÚDO ESSENCIAL

Ellipsis pode ser útil para informações secundárias.

Não truncar:

- títulos essenciais;
- erros;
- instruções;
- ações críticas;
- informações necessárias à decisão.

---

# 33. TEXTO PODE ALTERAR O LAYOUT

Quando fonte aumenta, aceitar que:

- linhas aumentem;
- cards cresçam;
- controles empilhem;
- navegação mude;
- tabelas reorganizem.

Não tentar preservar visual original à força.

---

# 34. TIPOGRAFIA FLUIDA COM LIMITES

Tamanhos de fonte podem variar de maneira fluida.

Sempre definir:

- mínimo legível;
- valor adaptativo;
- máximo controlado.

Não permitir crescimento indefinido.

---

# 35. LOCALIZAÇÃO É RESPONSIVIDADE

Textos podem crescer significativamente quando traduzidos.

Nunca projetar controles exclusivamente para o comprimento do texto original.

---

# 36. PREVER TEXTOS LONGOS

Testar:

- nomes extensos;
- títulos extensos;
- botões maiores;
- endereços;
- valores;
- mensagens de erro.

---

# 37. SUPORTAR DIREÇÃO DE LEITURA

Layouts devem funcionar quando a direção do texto for invertida.

Evitar lógica baseada desnecessariamente em:

- left;
- right.

Preferir conceitos de:

- início;
- fim;
- inline-start;
- inline-end.

---

# 38. NAVEGAÇÃO DEVE ADAPTAR-SE

A navegação pode mudar de apresentação conforme o espaço.

Exemplo conceitual:

**sidebar ampla → navegação compacta → menu móvel**

Mantendo os mesmos destinos principais.

---

# 39. NÃO ALTERAR ARQUITETURA AO ALTERAR LARGURA

A forma de apresentação pode mudar.

A arquitetura mental deve permanecer reconhecível.

O usuário não deve reaprender a navegação ao mudar de dispositivo.

---

# 40. DESTINOS PRINCIPAIS DEVEM PERMANECER

Ao compactar navegação, preservar:

- principais destinos;
- ação de retorno;
- contexto atual.

Itens secundários podem migrar para menus.

---

# 41. OVERFLOW DEVE SER INTENCIONAL

Quando controles deixam de caber:

1. preservar essenciais;
2. mover secundários para overflow;
3. manter acesso a todos.

Não simplesmente ocultar elementos com `display: none`.

---

# 42. TOOLBARS DEVEM TER PRIORIDADES

Classificar ações como:

- essenciais;
- frequentes;
- secundárias;
- raras.

Em espaços menores, recolher primeiro as menos importantes.

---

# 43. NÃO CRIAR TOOLBAR INFINITA

Se uma barra não cabe:

não diminuir indefinidamente seus elementos.

Utilizar:

- agrupamento;
- overflow;
- menu secundário;
- reorganização.

---

# 44. HEADER DEVE SOBREVIVER A LARGURAS INTERMEDIÁRIAS

Não validar header apenas em:

1440 px e 390 px.

Testar principalmente larguras intermediárias, onde menus frequentemente quebram.

---

# 45. MENU MOBILE É UMA APRESENTAÇÃO ALTERNATIVA

Não tratar menu mobile como outro sistema de navegação.

Ele deve representar a mesma arquitetura principal do desktop.

---

# 46. SIDEBARS DEVEM PODER RECOLHER

Quando sidebar competir com conteúdo principal:

- reduzir;
- colapsar;
- transformar apresentação;
- permitir abertura contextual.

Não comprimir indefinidamente o conteúdo principal.

---

# 47. FORMULÁRIOS DEVEM REFLOW

Campos lado a lado podem tornar-se verticais quando o espaço diminuir.

Exemplo:

**nome + sobrenome**

pode funcionar horizontalmente em espaço amplo e empilhado em espaço reduzido.

---

# 48. FORMULÁRIOS NÃO DEVEM DEPENDER DE GRID RÍGIDO

Inputs precisam crescer e reduzir sem:

- clipping;
- labels sobrepostos;
- mensagens cortadas;
- controles inacessíveis.

---

# 49. LABELS DEVEM ACOMPANHAR OS CAMPOS

Nunca separar visualmente label e input durante reflow.

O relacionamento deve permanecer evidente em qualquer largura.

---

# 50. TECLADO VIRTUAL É PARTE DO LAYOUT

Em mobile, abertura do teclado pode reduzir drasticamente a área visível.

Garantir que:

- campo ativo permaneça visível;
- CTA relevante possa ser acessado;
- modal não seja cortado;
- conteúdo possa rolar.

---

# 51. TABELAS PRECISAM DE ESTRATÉGIA RESPONSIVA

Não tentar sempre encaixar todas as colunas.

Dependendo do conteúdo, considerar:

- scroll horizontal;
- ocultação controlada;
- prioridade de colunas;
- expansão por linha;
- transformação em lista;
- cards;
- tabela compacta.

---

# 52. NÃO TRANSFORMAR TABELA AUTOMATICAMENTE EM CARD

Escolher representação conforme o objetivo.

Se comparação horizontal for importante, preservar a relação entre colunas.

---

# 53. CARDS DEVEM SER INTRÍNSECOS

Cards devem adaptar-se ao conteúdo.

Não depender de:

- altura fixa;
- título sempre curto;
- quantidade fixa de linhas;
- imagem sempre perfeita.

---

# 54. CARD GRID DEVE RESPONDER AO CARD

A quantidade de colunas deve ser definida pela largura mínima aceitável do card.

Não apenas pela largura da tela.

---

# 55. CARDS NÃO DEVEM FICAR GIGANTES EM DESKTOP

Quando houver poucos cards, não expandi-los automaticamente até dimensões excessivas.

Aplicar largura máxima quando necessário.

---

# 56. IMAGENS DEVEM PRESERVAR PROPORÇÃO

Nunca distorcer imagem para preencher um espaço.

Usar estratégias de:

- contain;
- cover;
- crop;
- focal point;

conforme finalidade.

---

# 57. CROP PRECISA SER RESPONSIVO

Uma imagem pode precisar de enquadramento diferente conforme a proporção disponível.

Preservar o assunto principal.

---

# 58. NÃO CORTAR INFORMAÇÃO IMPORTANTE DA IMAGEM

Se uma imagem contém informação indispensável:

preferir `contain` ou composição adaptativa.

Não usar crop destrutivo.

---

# 59. BACKGROUNDS PRECISAM DE ESTRATÉGIA

Uma imagem de fundo pode sofrer:

- crop;
- letterboxing;
- perda do foco;
- conflito com texto.

Validar em diferentes aspect ratios.

---

# 60. VÍDEOS DEVEM PRESERVAR ASPECT RATIO

Nunca deformar vídeos.

O container deve adaptar-se à mídia ou usar crop intencional.

---

# 61. MAPAS PRECISAM REORGANIZAR CONTROLES

Em telas pequenas:

- diminuir sobreposições;
- priorizar mapa;
- reorganizar filtros;
- mover painéis para drawers ou sheets quando adequado.

Não cobrir o mapa inteiro com interface.

---

# 62. ELEMENTOS ABSOLUTOS EXIGEM CUIDADO

Evitar posicionamentos absolutos dependentes de coordenadas fixas para elementos estruturais.

Utilizar `absolute` principalmente quando a relação espacial realmente exigir.

---

# 63. NÃO POSICIONAR CONTEÚDO POR PIXEL

Evitar:

```css
left: 347px;
top: 182px;
```

para definir estruturas responsivas.

Preferir relações entre containers.

---

# 64. Z-INDEX NÃO RESOLVE RESPONSIVIDADE

Se elementos começam a se sobrepor em telas menores, corrigir layout.

Não aumentar `z-index` para esconder o problema.

---

# 65. SCROLL VERTICAL É NATURAL

Não tentar encaixar toda página dentro da viewport.

Quando conteúdo cresce, permitir scroll vertical.

---

# 66. SCROLL HORIZONTAL PRECISA SER INTENCIONAL

Scroll horizontal pode ser válido para:

- carrosséis;
- timelines;
- tabelas;
- galerias.

Não deve surgir por acidente.

---

# 67. ZERO OVERFLOW ACIDENTAL

Nenhuma página deve produzir scroll horizontal causado por:

- width fixa;
- transform;
- imagem;
- margem;
- componente;
- pseudo-elemento;
- texto.

---

# 68. DETECTAR OVERFLOW EM TESTES

Validar programaticamente quando possível:

```js
document.documentElement.scrollWidth >
document.documentElement.clientWidth
```

Overflow inesperado deve ser tratado como defeito.

---

# 69. ALVOS DE INTERAÇÃO NÃO DEVEM ENCOLHER DEMAIS

Em telas pequenas, preservar área confortável para interação.

Não compactar controles até ficarem difíceis de tocar.

---

# 70. DENSIDADE VISUAL PODE MUDAR

Telas pequenas podem precisar de:

- menos elementos simultâneos;
- agrupamento;
- disclosure;
- menus;
- navegação contextual.

Telas maiores podem expor mais contexto.

---

# 71. DENSIDADE FUNCIONAL NÃO PODE DESAPARECER

Reduzir densidade visual não significa remover capacidades.

A funcionalidade pode migrar para outro nível da interface.

---

# 72. TOUCH E POINTER SÃO DIFERENTES

Não presumir que tela grande significa mouse.

Não presumir que tela pequena significa touch.

Adaptar comportamentos quando necessário à capacidade de entrada.

---

# 73. HOVER NÃO DEFINE RESPONSIVIDADE

Qualquer informação mostrada em hover precisa de alternativa para dispositivos sem hover.

---

# 74. DRAG PRECISA DE ALTERNATIVA QUANDO ESSENCIAL

Se arrastar é necessário para completar uma tarefa, considerar alternativa acessível.

---

# 75. MODAIS PRECISAM ADAPTAR-SE

Modal desktop pode transformar-se em:

- modal compacto;
- sheet;
- drawer;
- tela dedicada;

se isso melhorar a experiência.

---

# 76. MODAIS NÃO PODEM ULTRAPASSAR VIEWPORT

Sempre permitir:

- scroll interno adequado;
- acesso ao fechar;
- acesso às ações;
- uso com teclado virtual.

---

# 77. DRAWERS NÃO DEVEM BLOQUEAR CONTEÚDO ESSENCIAL SEM NECESSIDADE

A dimensão do drawer deve considerar o espaço real disponível.

---

# 78. ELEMENTOS FIXOS PRECISAM DE TESTE DE ALTURA

Headers, barras inferiores e CTAs fixos podem consumir uma grande porcentagem da tela em dispositivos baixos.

Verificar a área de conteúdo restante.

---

# 79. STICKY DEVE PRESERVAR ESPAÇO ÚTIL

Não acumular:

- header sticky;
- subnav sticky;
- filtros sticky;
- banner sticky;
- CTA sticky;

até deixar pouca área útil.

---

# 80. OVERLAYS NÃO DEVEM COLIDIR

Garantir que:

- cookie banner;
- chat;
- CTA flutuante;
- acessibilidade;
- menu;
- notificações;

não se sobreponham em viewports pequenas.

---

# 81. CONTEÚDO DEVE PRESERVAR ORDEM SEMÂNTICA

Não usar CSS para criar uma ordem visual completamente diferente da ordem semântica sem necessidade.

Responsividade visual e navegação por teclado devem permanecer coerentes.

---

# 82. NÃO DUPLICAR CONTEÚDO SEM NECESSIDADE

Evitar manter uma versão desktop e outra mobile inteiramente duplicadas apenas para alterar layout.

Preferir a mesma estrutura adaptativa quando possível.

---

# 83. PRESERVAR ESTADO ENTRE MUDANÇAS

Redimensionar não deve apagar:

- campo preenchido;
- filtro;
- seleção;
- etapa;
- scroll;
- conteúdo expandido.

---

# 84. EVITAR REMOUNT DESNECESSÁRIO

Mudanças de breakpoint não devem destruir e reconstruir componentes sem necessidade.

Preservar estado interno sempre que possível.

---

# 85. RESPONSIVIDADE NÃO DEVE CAUSAR LAYOUT SHIFT

Mudanças previsíveis não devem provocar saltos desnecessários.

Reservar espaço para conteúdo assíncrono quando possível.

---

# 86. SKELETON DEVE TER GEOMETRIA COMPATÍVEL

O estado de loading deve aproximar-se da estrutura final.

Não utilizar skeleton desktop que causa grandes saltos ao virar layout mobile.

---

# 87. PERFORMANCE TAMBÉM É RESPONSIVIDADE

Dispositivos menores podem possuir menos recursos.

Não carregar assets gigantes quando versões menores são suficientes.

---

# 88. USAR IMAGENS RESPONSIVAS

Quando apropriado, fornecer versões adequadas ao tamanho e densidade da tela.

Evitar baixar uma imagem de vários megabytes para exibição pequena.

---

# 89. NÃO CARREGAR O QUE NÃO É NECESSÁRIO

Conteúdo abaixo da dobra pode utilizar:

- lazy loading;
- renderização progressiva;
- carregamento sob demanda.

---

# 90. ANIMAÇÕES DEVEM ADAPTAR-SE

Uma animação que funciona em tela ampla pode ocupar espaço demais em tela pequena.

Adaptar:

- distância;
- escala;
- duração;
- intensidade.

---

# 91. TRANSIÇÕES ENTRE LAYOUTS DEVEM SER COERENTES

Quando o componente muda estruturalmente:

- preservar relação espacial;
- evitar teleportes;
- evitar flashes;
- evitar estados intermediários quebrados.

---

# 92. RESPEITAR REDUCED MOTION

Responsividade não deve depender de grandes transições animadas.

A mudança de layout precisa continuar compreensível sem movimento.

---

# 93. NÃO ANIMAR REDIMENSIONAMENTO CONTÍNUO SEM NECESSIDADE

Durante resize, animações complexas podem produzir atraso e instabilidade.

Priorizar resposta imediata.

---

# 94. COMPONENTES DEVEM SER TESTADOS ISOLADAMENTE

Não validar apenas páginas completas.

Testar cada componente em:

- largura mínima;
- largura média;
- largura máxima;
- conteúdo curto;
- conteúdo longo.

---

# 95. TESTAR OS EXTREMOS PRIMEIRO

Uma estratégia eficiente de validação é começar por:

- menor largura suportada;
- maior largura esperada;
- menor altura;
- maior texto;
- conteúdo mais longo.

Depois testar valores intermediários.

---

# 96. NÃO TESTAR APENAS VIEWPORTS POPULARES

Testar larguras aleatórias.

Exemplos:

- 347 px;
- 529 px;
- 713 px;
- 887 px;
- 1113 px;
- 1371 px.

Isso revela layouts dependentes demais de breakpoints específicos.

---

# 97. REDIMENSIONAR LENTAMENTE DURANTE QA

Arrastar continuamente a largura da janela do mínimo ao máximo.

Observar:

- saltos;
- clipping;
- elementos desaparecendo;
- colunas ruins;
- menus quebrados;
- overflow.

---

# 98. TESTAR ALTURA TAMBÉM

Responsividade não é apenas largura.

Testar:

- 480 px;
- 600 px;
- 720 px;
- 900 px;

de altura quando relevante.

---

# 99. TESTAR LANDSCAPE MOBILE

Landscape em dispositivos pequenos frequentemente revela:

- headers altos demais;
- modais cortados;
- heros impossíveis;
- CTAs inacessíveis.

Deve fazer parte da validação.

---

# 100. TESTAR SPLIT SCREEN

Simular a aplicação ocupando apenas parte da tela.

Ela deve responder ao espaço disponível como qualquer outra viewport.

---

# 101. TESTAR ZOOM

Validar zoom do navegador e ampliação de texto.

A interface deve continuar utilizável.

---

# 102. TESTAR CONTEÚDO REAL

Utilizar:

- títulos reais;
- descrições grandes;
- endereços extensos;
- nomes longos;
- números;
- imagens variadas.

Não validar responsividade apenas com placeholders ideais.

---

# 103. TESTAR ESTADOS

Cada breakpoint deve considerar:

- default;
- loading;
- empty;
- error;
- expanded;
- selected;
- disabled;
- conteúdo máximo.

---

# 104. NÃO CRIAR CORREÇÕES ESPECÍFICAS SEM INVESTIGAÇÃO

Antes de adicionar uma media query corretiva:

1. identificar causa;
2. verificar componente pai;
3. verificar largura intrínseca;
4. verificar min-width;
5. verificar overflow;
6. verificar flex/grid;
7. somente então adicionar breakpoint.

---

# 105. CSS RESPONSIVO DEVE SER PREVISÍVEL

Evitar acumular regras contraditórias espalhadas pelo projeto.

Centralizar comportamento responsivo no componente ou camada apropriada.

---

# 106. NÃO USAR `!important` PARA RESPONSIVIDADE

Se breakpoints dependem repetidamente de `!important`, provavelmente existe problema de arquitetura ou especificidade.

Corrigir a causa.

---

# 107. PREFERIR LAYOUT INTRÍNSECO

Sempre que possível, deixar o próprio conteúdo determinar:

- largura;
- altura;
- quebra;
- quantidade de colunas.

Menos regras arbitrárias produzem interfaces mais resistentes.

---

# 108. `MINMAX()` É PREFERÍVEL A COLUNAS RÍGIDAS

Grids devem ser capazes de responder ao conteúdo.

Exemplo conceitual:

```css
grid-template-columns:
  repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
```

Preferir padrões equivalentes quando adequados.

---

# 109. `CLAMP()` DEVE SER USADO COM LIMITES REAIS

Fluidez não significa ausência de controle.

Todo valor fluido deve possuir:

- mínimo;
- comportamento intermediário;
- máximo.

---

# 110. PREFERIR `min()`, `max()` E `clamp()` QUANDO REDUZIREM BREAKPOINTS

Utilizar CSS moderno para evitar media queries desnecessárias.

---

# 111. CONTAINER QUERIES PARA COMPONENTES REUTILIZÁVEIS

Quando um componente pode aparecer em diferentes regiões da página, preferir comportamento baseado no próprio container.

Isso reduz dependência da viewport global.

---

# 112. MOBILE-FIRST NÃO SIGNIFICA MOBILE-ONLY

É válido começar pela restrição menor.

Mas a experiência precisa evoluir conscientemente ao ganhar espaço.

Não apenas adicionar margens maiores.

---

# 113. DESKTOP-FIRST NÃO DEVE GERAR REMENDOS

Se o projeto parte de desktop, adaptar arquitetura estruturalmente.

Não acumular dezenas de regras apenas para “fazer caber” em mobile.

---

# 114. O CONTEÚDO DEFINE O BREAKPOINT

Repetir como regra estrutural:

**breakpoints existem onde o conteúdo quebra, não onde uma lista de dispositivos manda.**

---

# 115. PRESERVAR HIERARQUIA EM TODAS AS LARGURAS

O elemento principal no desktop deve continuar sendo reconhecível como principal no mobile.

Responsividade não pode inverter prioridades acidentalmente.

---

# 116. PRESERVAR IDENTIDADE SEM PRESERVAR GEOMETRIA

A aparência geral pode continuar coerente mesmo quando:

- grid muda;
- navegação muda;
- elementos empilham;
- sidebar desaparece;
- controles migram.

Não exigir geometria idêntica entre dispositivos.

---

# 117. ADAPTAR, NÃO COPIAR

Cada largura deve parecer uma expressão natural do mesmo sistema.

Evitar sensação de:

“site desktop espremido no celular”

ou:

“site mobile ampliado no desktop”.

---

# 118. RESPONSIVIDADE DEVE SER COMPONENTIZADA

Cada componente deve conhecer suas próprias restrições.

Não depender de centenas de ajustes globais na página para funcionar.

---

# 119. DOCUMENTAR LIMITES IMPORTANTES

Quando um componente possuir:

- largura mínima;
- largura máxima;
- quantidade máxima de colunas;
- comportamento de colapso;

documentar no design system.

---

# 120. REGRA DE DECISÃO RESPONSIVA

Quando o espaço diminuir, seguir esta ordem:

1. permitir que conteúdo flexível se ajuste;
2. reduzir espaços excessivos;
3. permitir quebra de linha;
4. reorganizar distribuição;
5. reduzir quantidade de colunas;
6. empilhar elementos;
7. compactar controles;
8. mover ações secundárias para overflow;
9. mudar padrão de navegação;
10. utilizar scroll intencional quando necessário;
11. ocultar apenas conteúdo realmente secundário;
12. nunca remover função essencial apenas para fazer o layout caber.

---

# REGRA-MÃE DA RESPONSIVIDADE

Aplicar permanentemente:

**adaptar antes de encolher;  
reorganizar antes de ocultar;  
conteúdo antes de breakpoint;  
espaço disponível antes de tipo de dispositivo;  
reflow antes de scale;  
função antes de geometria;  
largura útil antes de quantidade de colunas;  
legibilidade antes de densidade;  
texto real antes de layout ideal;  
overflow intencional antes de clipping;  
container antes de viewport quando possível;  
continuidade antes de reconstrução;  
estado preservado antes de remount;  
navegação consistente antes de apresentação idêntica;  
limites fluidos antes de valores arbitrários;  
adaptação contínua antes de três layouts fixos.**

---

# COMANDO DE EXECUÇÃO

Ao criar, analisar, corrigir ou refatorar qualquer interface:

1. não assumir resoluções fixas;
2. não assumir dispositivo pelo tamanho da tela;
3. não usar orientação como única regra de layout;
4. testar redimensionamento contínuo;
5. identificar breakpoints pelo conteúdo;
6. preservar funcionalidade em todas as larguras;
7. permitir reflow antes de reduzir elementos;
8. preservar legibilidade;
9. permitir expansão de texto;
10. validar textos em tamanhos elevados;
11. testar localização com textos maiores;
12. testar safe areas;
13. testar largura e altura;
14. testar portrait e landscape;
15. testar split screen;
16. testar teclado virtual;
17. testar zoom;
18. testar navegação por teclado;
19. testar touch;
20. testar pointer;
21. testar imagens em proporções diferentes;
22. preservar aspect ratio;
23. eliminar overflow horizontal acidental;
24. validar sticky e fixed;
25. validar overlays simultâneos;
26. testar formulários estreitos;
27. testar tabelas;
28. testar grids;
29. testar cards com conteúdo longo;
30. testar estados de loading;
31. testar empty states;
32. testar erros;
33. testar conteúdo máximo;
34. testar menor viewport suportada;
35. testar viewport muito ampla;
36. testar larguras intermediárias aleatórias;
37. preferir CSS intrinsecamente responsivo;
38. evitar excesso de media queries;
39. utilizar container queries quando apropriado;
40. preservar contexto ao mudar layout.

---

# CRITÉRIO FINAL DE ACEITAÇÃO

Uma interface só deve ser considerada responsiva quando:

- não depende de resolução específica;
- não possui overflow acidental;
- não possui clipping;
- não sobrepõe conteúdo;
- mantém conteúdo legível;
- mantém controles utilizáveis;
- preserva funcionalidade;
- aceita texto ampliado;
- aceita conteúdo variável;
- aceita mudança de orientação;
- aceita redimensionamento contínuo;
- funciona com diferentes métodos de entrada;
- preserva hierarquia;
- preserva estado;
- mantém navegação reconhecível;
- reorganiza-se naturalmente;
- utiliza espaço adicional de maneira útil;
- reduz densidade sem remover capacidades;
- mantém qualidade visual entre extremos.

A responsividade final deve parecer **natural e inevitável**, e não uma coleção de correções para diferentes tamanhos de tela.
