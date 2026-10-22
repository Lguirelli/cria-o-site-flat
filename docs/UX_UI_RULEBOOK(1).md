# COMANDO DE UX/UI

# SISTEMA GLOBAL DE REGRAS DE INTERFACE, INTERAÇÃO, ACESSIBILIDADE E EXPERIÊNCIA

A partir deste momento, trate as regras abaixo como normas permanentes de UX/UI para todo o projeto.

Estas regras devem ser consideradas durante:

- criação de páginas;
- criação de componentes;
- refatorações;
- correções;
- responsive design;
- interações;
- animações;
- formulários;
- filtros;
- menus;
- navegação;
- cards;
- modais;
- drawers;
- bottom sheets;
- configurações;
- dashboards;
- áreas administrativas;
- fluxos de cadastro;
- fluxos de reserva;
- fluxos de roteiro;
- páginas de parceiros;
- páginas de pontos turísticos;
- componentes futuros.

Não aplicar uma regra mecanicamente quando ela não fizer sentido.

Interpretar sempre:

- objetivo da interface;
- contexto;
- importância da informação;
- dispositivo;
- método de entrada;
- tamanho do viewport;
- risco da ação;
- quantidade de informação;
- necessidade real do usuário.

A prioridade é criar interfaces:

- simples;
- consistentes;
- claras;
- rápidas;
- previsíveis;
- acessíveis;
- responsivas;
- recuperáveis;
- visualmente equilibradas;
- fáceis de compreender;
- fáceis de operar.

---

# 1. PRINCÍPIO DE SIMPLICIDADE

## UX-SIMPLE-001
Remover elementos que não contribuam diretamente para:

- compreensão;
- decisão;
- navegação;
- execução da tarefa atual.

Não adicionar controles apenas porque existe espaço disponível.

## UX-SIMPLE-002
Evitar expor complexidade antes de ela ser necessária.

Preferir:

ação principal
→ opções essenciais
→ opções secundárias
→ opções avançadas

em vez de apresentar tudo simultaneamente.

## UX-SIMPLE-003
Aplicar progressive disclosure.

Controles avançados devem aparecer somente:

- quando solicitados;
- quando necessários;
- quando o contexto justificar;
- depois das opções primárias.

## UX-SIMPLE-004
Não confundir quantidade de controles com qualidade da experiência.

Antes de adicionar qualquer elemento, verificar:

1. ajuda o usuário a decidir?
2. reduz alguma dúvida?
3. é necessário neste momento?
4. reduz etapas?
5. evita erro?

Se não houver benefício claro, remover ou adiar.

## UX-SIMPLE-005
Priorizar conclusão de tarefa sobre exposição de funcionalidades.

A interface não deve funcionar como catálogo de recursos.

Ela deve conduzir o usuário para seu objetivo.

---

# 2. CONSISTÊNCIA

## UI-CONSISTENCY-001
Mesma função deve possuir:

- aparência equivalente;
- comportamento equivalente;
- estados equivalentes;
- feedback equivalente.

## UI-CONSISTENCY-002
Não criar uma nova variante visual quando um componente existente já resolve o problema.

Evitar variantes específicas como:

- botão-home-azul;
- botão-card-especial;
- botão-pontos-v2;

quando poderiam ser:

- primary;
- secondary;
- tertiary;
- ghost;
- destructive.

## UI-CONSISTENCY-003
Componentes devem derivar de um sistema compartilhado.

Centralizar:

- cores;
- spacing;
- radius;
- tipografia;
- sombras;
- ícones;
- motion;
- estados;
- breakpoints;
- z-index.

## UI-CONSISTENCY-004
Não aplicar estilos isolados arbitrários se existe um token ou padrão global equivalente.

## UI-CONSISTENCY-005
Manter comportamento semelhante em páginas diferentes.

Se um card abre de determinada forma em uma página, evitar comportamento completamente diferente em outra sem motivo funcional.

---

# 3. ICONOGRAFIA

## UI-ICON-001
Usar ícones pertencentes à mesma linguagem visual.

Manter consistência de:

- stroke;
- peso;
- proporção;
- bounding box;
- tamanho aparente;
- estilo de cantos;
- preenchimento.

## UI-ICON-002
Não misturar aleatoriamente:

- filled;
- outline;
- duotone;
- ícones customizados;
- emojis;

sem intenção visual ou semântica clara.

## UI-ICON-003
Ícone pequeno não significa área clicável pequena.

Manter o desenho visual compacto, mas ampliar a hit area quando necessário.

---

# 4. SPACING

## UI-SPACING-001
Usar uma escala consistente de espaçamento.

Evitar valores arbitrários espalhados pelo projeto.

Preferir uma progressão previsível como:

4
8
12
16
24
32
48
64

ou outra escala definida pelo projeto.

## UI-SPACING-002
Usar proximidade para comunicar relação.

Elementos semanticamente relacionados devem ficar mais próximos.

## UI-SPACING-003
Usar distância para separar grupos conceituais.

Não depender exclusivamente de divisores e borders.

## UI-SPACING-004
Manter ritmo vertical coerente.

Evitar alternâncias aleatórias de:

12px
37px
19px
52px

sem necessidade visual comprovada.

---

# 5. HIERARQUIA VISUAL

## UI-HIERARCHY-001
A importância da informação deve determinar seu peso visual.

Usar de forma controlada:

- tamanho;
- posição;
- contraste;
- peso tipográfico;
- cor;
- espaço;
- imagem;
- movimento.

## UI-HIERARCHY-002
A interface deve deixar claro:

1. onde estou;
2. o que estou vendo;
3. por que isso importa;
4. o que posso fazer agora.

## UI-HIERARCHY-003
Não dar o mesmo peso visual para elementos com prioridades diferentes.

## UI-HIERARCHY-004
CTA principal deve dominar visualmente os CTAs secundários.

Evitar múltiplos botões primários competindo dentro do mesmo contexto.

## UI-HIERARCHY-005
A ordem visual deve acompanhar a ordem mental necessária para a decisão.

Preferir:

contexto
→ benefício
→ informação
→ decisão
→ ação

## UI-HIERARCHY-006
Evitar fragmentar títulos, textos, imagens e ações de maneira que obrigue o usuário a reconstruir mentalmente a relação entre eles.

## UI-HIERARCHY-007
Usar whitespace como ferramenta ativa de hierarquia.

Espaço vazio não deve ser interpretado automaticamente como espaço desperdiçado.

---

# 6. BALANCEAMENTO VISUAL

## UI-BALANCE-001
Toda composição deve possuir equilíbrio de peso visual.

O peso pode vir de:

- tamanho;
- contraste;
- saturação;
- imagem;
- tipografia;
- densidade;
- posição;
- movimento.

## UI-BALANCE-002
Equilíbrio não exige simetria.

## UI-BALANCE-003
Usar simetria quando o objetivo for comunicar:

- estabilidade;
- ordem;
- previsibilidade;
- comparação;
- estrutura.

## UI-BALANCE-004
Usar assimetria quando o objetivo for comunicar:

- descoberta;
- movimento;
- dinamismo;
- storytelling;
- experiência.

## UI-BALANCE-005
Assimetria não significa aleatoriedade.

Elementos desiguais devem produzir peso perceptivo equilibrado.

---

# 7. COR COMO PESO VISUAL

## UI-COLOR-001
Tratar cor como elemento de hierarquia.

Quanto maior:

- saturação;
- contraste;
- brilho diferencial;

maior tende a ser o peso visual.

## UI-COLOR-002
Reservar cores de maior peso para elementos prioritários.

Exemplos:

- CTA principal;
- estado selecionado;
- alerta;
- indicador ativo;
- ação importante.

## UI-COLOR-003
Usar tons neutros para elementos estruturais e secundários.

## UI-COLOR-004
Não aplicar a cor primária indiscriminadamente em:

- títulos;
- botões;
- links;
- ícones;
- backgrounds;
- borders;
- badges;

pois isso destrói a hierarquia.

## UI-COLOR-005
Manter semântica de cor consistente.

Uma cor usada para erro não deve aparecer aleatoriamente como cor decorativa de ação positiva.

## UI-COLOR-006
Nunca usar somente cor para comunicar estado.

Combinar cor com:

- texto;
- ícone;
- forma;
- label;
- estado visual.

---

# 8. AFFORDANCE

## UX-AFFORDANCE-001
Todo elemento interativo deve parecer interativo.

O usuário não deve precisar experimentar para descobrir se algo pode ser clicado.

## UX-AFFORDANCE-002
Elementos clicáveis devem possuir sinais adequados como:

- cursor;
- hover quando suportado;
- focus;
- mudança de estado;
- iconografia;
- affordance visual.

## UX-AFFORDANCE-003
Não transformar elementos estáticos e interativos em objetos visualmente indistinguíveis.

---

# 9. TARGETS DE INTERAÇÃO

## A11Y-TARGET-001
Manter área interativa mínima próxima de:

44 × 44 px

para controles acionados por touch sempre que aplicável.

## A11Y-TARGET-002
O ícone visual pode ter 16, 20 ou 24 px.

A área interativa pode e deve ser maior.

## A11Y-TARGET-003
Não aproximar excessivamente múltiplos targets pequenos.

Evitar taps acidentais.

---

# 10. HOVER

## UX-HOVER-001
Nunca depender de hover para uma ação primária.

## UX-HOVER-002
Hover pode revelar:

- contexto;
- decoração;
- preview;
- informação complementar;
- ações secundárias.

## UX-HOVER-003
No touch, qualquer funcionalidade disponível apenas em hover deve receber alternativa apropriada.

Possibilidades:

- ação explícita;
- card;
- menu;
- swipe;
- bottom sheet;
- botão;
- tap.

## UX-HOVER-004
Detectar capacidade do dispositivo usando media queries relacionadas a:

hover
pointer

e não apenas tamanho de tela ou device sniffing.

## UX-HOVER-005
Um tablet com mouse deve poder receber hover.

Um desktop touch não deve ser tratado apenas pela largura da tela.

---

# 11. DROPDOWNS

## UX-DROPDOWN-001
Tornar o trigger explicitamente reconhecível.

Usar quando apropriado:

- caret;
- label;
- borda;
- background;
- affordance;
- hover;
- focus.

## UX-DROPDOWN-002
Manter área interativa adequada.

Preferir aproximadamente 44 px de target mínimo.

## UX-DROPDOWN-003
Nunca deixar o dropdown escapar do viewport.

## UX-DROPDOWN-004
Quando não houver espaço abaixo, abrir para cima.

Implementar flip/placement adaptativo.

## UX-DROPDOWN-005
Nenhuma opção importante deve ficar inacessível fora da tela.

## UX-DROPDOWN-006
Suportar navegação por teclado.

Obrigatório quando aplicável:

ArrowUp
ArrowDown
Enter
Escape

## UX-DROPDOWN-007
Adicionar busca/filtro para listas suficientemente longas.

Referência:

mais de aproximadamente 10 itens
→ considerar filtro.

## UX-DROPDOWN-008
Para listas muito extensas, considerar virtualização.

Referência:

mais de aproximadamente 100 itens.

## MOTION-DROPDOWN-001
Abertura e fechamento devem parecer praticamente instantâneos.

Referência aproximada:

até 150 ms.

---

# 12. SWITCHES E TOGGLES

## UX-SWITCH-001
Switch deve comunicar claramente:

ON
OFF

## UX-SWITCH-002
Não alterar o componente abruptamente quando uma transição curta pode comunicar melhor a mudança.

## MOTION-SWITCH-001
Coordenar quando aplicável:

- rail color;
- knob slide;
- shadow;
- label;
- crossfade.

## MOTION-SWITCH-002
Referência de duração:

aproximadamente 250 ms.

## MOTION-SWITCH-003
Preferir ease-out para a finalização do movimento quando adequado.

## A11Y-SWITCH-001
Permitir ativação pelo teclado.

Space deve alternar o switch quando semanticamente apropriado.

## A11Y-SWITCH-002
Fornecer focus ring claramente visível.

## UX-SWITCH-003
Comunicar a mudança de estado para tecnologias assistivas quando necessário.

## UX-SWITCH-004
Quando seguro, considerar atualização otimista:

ação do usuário
→ feedback visual imediato
→ request
→ confirmação

Se houver falha:
→ rollback
→ feedback de erro.

---

# 13. FORMULÁRIOS

## UX-FORM-001
Não mostrar erro prematuramente enquanto o usuário ainda está formando a resposta.

## UX-FORM-002
Não validar um e-mail como inválido após a primeira letra digitada.

## UX-FORM-003
Para a primeira validação de um campo, preferir blur quando apropriado.

Fluxo:

digitação
→ saída do campo
→ validação.

## UX-FORM-004
Depois que um campo apresentar erro, mudar aquele campo para validação live.

## UX-FORM-005
Assim que o erro for corrigido, removê-lo imediatamente.

## UX-FORM-006
Não exigir novo submit somente para informar que o campo agora está correto.

## UX-FORM-007
Fornecer feedback positivo quando ele ajudar na confiança do usuário.

Exemplo:

✓ informação válida.

## UX-FORM-008
Não usar apenas vermelho como feedback de erro.

Fornecer mensagem clara.

## UX-FORM-009
Mensagem de erro deve informar preferencialmente:

- o que está errado;
- por que;
- como corrigir.

## UX-FORM-010
Ao submeter formulário com erros, conduzir o usuário ao primeiro problema relevante.

Não exigir que ele procure manualmente pela página.

---

# 14. FEEDBACK

## UX-FEEDBACK-001
Toda ação importante deve produzir feedback perceptível.

## UX-FEEDBACK-002
Feedback pode comunicar:

- processamento;
- sucesso;
- erro;
- mudança;
- seleção;
- salvamento;
- remoção.

## UX-FEEDBACK-003
Não comunicar apenas erros.

Sucesso também é informação.

## UX-FEEDBACK-004
O timing do feedback importa tanto quanto a mensagem.

Evitar:

- cedo demais;
- tarde demais;
- feedback duplicado;
- feedback persistente desnecessário.

---

# 15. AÇÕES REVERSÍVEIS

## UX-UNDO-001
Para ações facilmente reversíveis, preferir:

executar
→ mostrar Undo

em vez de:

perguntar
→ confirmar
→ executar.

## UX-UNDO-002
Evitar "Tem certeza?" para operações de baixo risco e fácil recuperação.

## UX-UNDO-003
Quando possível, disponibilizar Undo por toast ou interface equivalente.

## UX-UNDO-004
Quando adequado, manter histórico de ações para permitir recuperação sequencial.

---

# 16. EXCLUSÃO

## UX-DELETE-001
Quando possível, tratar exclusão inicialmente como estado.

Exemplo:

active
→ deleted
→ trash
→ permanent deletion.

## UX-DELETE-002
Evitar exclusão física imediata quando recuperação for tecnicamente possível e fizer sentido para o produto.

## UX-DELETE-003
Aumentar a fricção proporcionalmente à irreversibilidade.

## UX-DELETE-004
Ações recuperáveis:

baixa fricção.

Ações irreversíveis:

alta fricção.

## UX-DELETE-005
Para ações realmente destrutivas, pode ser apropriado exigir confirmação explícita.

## UX-DELETE-006
Em ações de impacto extremo, considerar confirmação textual.

Exemplo:

Digite o nome do projeto para excluir.

## UX-DELETE-007
Enquanto o valor digitado não corresponder ao valor exigido, manter a ação destrutiva desabilitada.

---

# 17. DANGER ZONE

## UX-DANGER-001
Ações altamente destrutivas devem ficar separadas visualmente das configurações rotineiras.

## UX-DANGER-002
Posicionar operações destrutivas em área claramente identificável.

## UX-DANGER-003
Evitar colocar:

Salvar
Editar
Excluir permanentemente

com o mesmo peso e proximidade.

---

# 18. CONFIGURAÇÕES

## UX-SETTINGS-001
O mecanismo de salvamento deve acompanhar o impacto da configuração.

## UX-SETTINGS-002
Toggles simples podem ser aplicados imediatamente quando seguro.

## UX-SETTINGS-003
Campos de identidade ou grupos complexos podem exigir:

Salvar
Cancelar.

## UX-SETTINGS-004
Agrupar configurações por tarefa ou domínio.

Exemplos:

- conta;
- equipe;
- billing;
- pagamentos;
- integrações;
- privacidade;
- avançado.

## UX-SETTINGS-005
Não criar uma lista contínua gigantesca de configurações.

## UX-SETTINGS-006
Esconder configurações avançadas atrás de uma camada adicional quando isso reduzir ruído.

## UX-SETTINGS-007
Em sistemas grandes, fornecer busca de configurações.

## UX-SETTINGS-008
Resultados da busca devem mostrar:

- termo correspondente;
- configuração;
- caminho/localização.

## UX-SETTINGS-009
Destacar configurações alteradas em relação ao padrão.

## UX-SETTINGS-010
Fornecer reset quando apropriado.

## UX-SETTINGS-011
Facilitar experimentação quando a recuperação for simples.

---

# 19. BORDER RADIUS

## UI-RADIUS-001
Tratar radius como sistema geométrico.

Não como decoração isolada.

## UI-RADIUS-002
Não aplicar o mesmo radius em todos os componentes.

## UI-RADIUS-003
O radius deve acompanhar a escala do elemento.

Referência:

small → 4px
medium → 8px
large → 16px

Adaptar à escala real do projeto.

## UI-RADIUS-004
Para componentes aninhados, manter curvas visualmente concêntricas.

Regra de referência:

inner radius =
outer radius − padding.

## UI-RADIUS-005
Exemplo:

outer radius = 12
padding = 8

inner radius ≈ 4.

## UI-RADIUS-006
Não usar pill radius indiscriminadamente.

## UI-RADIUS-007
Pill funciona principalmente para elementos compactos de uma linha, como:

- chips;
- tags;
- toggles;
- avatars;
- badges.

## UI-RADIUS-008
Cards grandes e conteúdo multilinha devem normalmente usar radius convencional.

## UI-RADIUS-009
Quando um elemento encosta diretamente na borda da viewport, avaliar se aquele canto realmente precisa de radius.

## UI-RADIUS-010
Exemplo de bottom sheet:

top-left → rounded
top-right → rounded
bottom-left → 0
bottom-right → 0.

## UI-RADIUS-011
Focus rings devem acompanhar a geometria do componente.

## UI-RADIUS-012
Se o focus ring estiver externamente deslocado, adaptar seu radius à distância em relação ao elemento.

## UI-RADIUS-013
Imagens edge-to-edge dentro de cards arredondados devem respeitar clipping do container.

## UI-RADIUS-014
Evitar cantos quadrados da imagem atravessando visualmente o radius do card.

---

# 20. MOTION

## MOTION-001
Toda animação deve ter função.

## MOTION-002
Usar motion para comunicar:

- mudança;
- continuidade;
- entrada;
- saída;
- expansão;
- contração;
- seleção;
- foco;
- hierarquia;
- relação espacial.

## MOTION-003
Não adicionar movimento apenas para tornar a interface "mais animada".

## MOTION-004
Microinterações devem responder rapidamente.

## MOTION-005
Quanto menor e mais frequente a interação, menor tende a ser sua duração.

## MOTION-006
Preferir animar principalmente:

transform
opacity

quando possível.

## MOTION-007
Evitar animações que causem layout shift ou reflow desnecessário.

## MOTION-008
Evitar animações excessivamente longas em:

- menus;
- dropdowns;
- switches;
- tooltips;
- hover.

## MOTION-009
A animação nunca deve atrasar artificialmente a tarefa do usuário.

## MOTION-010
Respeitar prefers-reduced-motion.

Criar alternativa reduzida ou sem movimento para usuários que solicitarem isso.

---

# 21. ESTADOS

## UI-STATE-001
Todo componente interativo relevante deve considerar estados como:

default
hover
focus
active
selected
disabled
loading
success
error.

Aplicar somente os que fizerem sentido.

## UI-STATE-002
Estados devem ser visualmente distinguíveis.

## UI-STATE-003
Disabled não deve parecer simplesmente "quebrado".

## UI-STATE-004
Loading deve preservar contexto sempre que possível.

## UI-STATE-005
Evitar trocar completamente a estrutura de um componente durante loading se isso causar layout shift.

---

# 22. LOADING

## UX-LOADING-001
Não bloquear a interface desnecessariamente enquanto uma operação simples acontece.

## UX-LOADING-002
Usar optimistic UI quando:

- a operação possuir grande probabilidade de sucesso;
- houver rollback seguro;
- o impacto for baixo.

## UX-LOADING-003
Para operações demoradas ou críticas, fornecer feedback explícito de processamento.

---

# 23. RESPONSIVIDADE

## UX-RESPONSIVE-001
Responsive design não significa apenas reduzir dimensões.

A interface pode mudar:

- ordem;
- layout;
- agrupamento;
- interação;
- navegação;
- quantidade de informação visível.

## UX-RESPONSIVE-002
Priorizar tarefa e conteúdo em cada breakpoint.

## UX-RESPONSIVE-003
Não transportar automaticamente uma interação desktop para mobile.

## UX-RESPONSIVE-004
Adaptar controles para:

mouse
touch
keyboard.

## UX-RESPONSIVE-005
Não esconder funcionalidade essencial simplesmente porque não cabe horizontalmente.

Reorganizar.

---

# 24. ACESSIBILIDADE

## A11Y-001
Toda função importante deve possuir interação alternativa ao mouse quando semanticamente aplicável.

## A11Y-002
Manter focus visível.

## A11Y-003
Não remover outline sem substituir por indicador equivalente ou melhor.

## A11Y-004
Garantir ordem de tabulação coerente com a ordem visual e lógica.

## A11Y-005
Componentes customizados devem preservar semântica correta.

## A11Y-006
Usar elementos HTML nativos quando eles resolverem adequadamente a função.

Preferir:

button
input
select
details
dialog
nav

em vez de reconstruir comportamento nativo desnecessariamente.

## A11Y-007
Não depender exclusivamente de:

- hover;
- cor;
- animação;
- posição;

para comunicar informação.

---

# 25. CARDS

## UI-CARD-001
Cada card deve possuir uma hierarquia interna clara.

## UI-CARD-002
Não mostrar todas as informações disponíveis apenas porque existem.

Mostrar primeiro o necessário para:

- reconhecimento;
- decisão;
- próxima ação.

## UI-CARD-003
Informações avançadas podem aparecer:

- na página de detalhe;
- em expansão;
- em modal;
- em drawer;
- em bottom sheet;
- após interação.

## UI-CARD-004
O CTA primário do card deve ser facilmente identificável.

## UI-CARD-005
Ações secundárias não devem competir visualmente com a ação principal.

## UI-CARD-006
Evitar card dentro de card quando não houver hierarquia semântica real.

---

# 26. CTA

## UX-CTA-001
Cada contexto deve possuir uma ação principal claramente reconhecível.

## UX-CTA-002
Não transformar todas as ações em primary buttons.

## UX-CTA-003
Hierarquia recomendada:

Primary
Secondary
Tertiary/Ghost
Text action

conforme necessidade.

## UX-CTA-004
Labels de CTA devem descrever ação.

Preferir:

Montar meu roteiro
Ver experiência
Reservar visita

em vez de:

Clique aqui
Continuar
Saiba mais

quando houver oportunidade de ser específico.

---

# 27. DENSIDADE

## UI-DENSITY-001
Não confundir aproveitamento de espaço com preenchimento de espaço.

## UI-DENSITY-002
Interfaces com muita informação devem criar hierarquia e agrupamento, não apenas reduzir fontes e gaps.

## UI-DENSITY-003
Conteúdo secundário pode ser progressivamente revelado.

---

# 28. CARGA COGNITIVA

## UX-COGNITIVE-001
Reduzir quantidade de decisões simultâneas.

## UX-COGNITIVE-002
Evitar apresentar muitas alternativas com o mesmo peso.

## UX-COGNITIVE-003
Usar agrupamento, hierarquia e progressive disclosure para simplificar decisões.

## UX-COGNITIVE-004
Não obrigar o usuário a memorizar informação apresentada anteriormente quando ela pode permanecer visível.

---

# 29. DESCOBERTA

## UX-DISCOVERY-001
Interfaces de exploração podem usar composição mais visual e assimétrica.

## UX-DISCOVERY-002
Ainda assim, preservar:

- orientação;
- hierarquia;
- affordance;
- acesso às ações principais.

## UX-DISCOVERY-003
Descoberta não deve significar confusão.

---

# 30. NAVEGAÇÃO

## UX-NAV-001
O usuário deve sempre conseguir entender:

onde está
e
como prosseguir.

## UX-NAV-002
Itens de navegação devem manter comportamento consistente entre páginas.

## UX-NAV-003
Não esconder navegação crítica atrás de interações pouco descobríveis.

## UX-NAV-004
Estados ativos devem ser perceptíveis.

---

# 31. ERROS

## UX-ERROR-001
Prevenir erro quando possível.

## UX-ERROR-002
Quando o erro acontecer, facilitar recuperação.

## UX-ERROR-003
Não culpar o usuário com mensagens genéricas ou agressivas.

## UX-ERROR-004
Fornecer caminho claro para correção.

## UX-ERROR-005
Preservar dados já preenchidos sempre que possível após erro.

---

# 32. RECUPERAÇÃO

## UX-RECOVERY-001
Sempre que tecnicamente viável, projetar ações pensando em recuperação.

## UX-RECOVERY-002
Preferir:

Undo
Reset
Restore
Trash
History

a perda imediata e irreversível.

---

# 33. REGRA DE FRICÇÃO

## UX-FRICTION-001
Fricção deve ser proporcional ao risco.

## UX-FRICTION-002
Ação frequente + baixo risco:

baixa fricção.

## UX-FRICTION-003
Ação rara + alto impacto:

maior confirmação.

## UX-FRICTION-004
Não colocar confirmação em todas as ações apenas por segurança aparente.

---

# 34. DESIGN TOKENS

Centralizar valores recorrentes em tokens.

Criar ou preservar sistemas equivalentes a:

--space-*
--radius-*
--color-*
--text-*
--shadow-*
--duration-*
--ease-*
--z-*
--breakpoint-*

---

# 35. REGRA DE IMPLEMENTAÇÃO

Antes de criar CSS específico para um novo componente:

1. verificar tokens existentes;
2. verificar componente semelhante;
3. verificar variante existente;
4. reutilizar o sistema;
5. criar novo padrão apenas se necessário.

---

# 36. REGRA DE NÃO DUPLICAÇÃO

Não criar componentes visualmente ou funcionalmente equivalentes em locais diferentes.

Quando detectar duplicação:

- consolidar;
- componentizar;
- compartilhar tokens;
- preservar comportamento existente.

Não refatorar agressivamente sem necessidade.

---

# 37. REGRA DE PRIORIDADE VISUAL

Para cada seção, identificar explicitamente:

P1 = principal
P2 = secundário
P3 = suporte
P4 = contexto

O design deve refletir esta prioridade.

Não permitir que P3 ou P4 dominem visualmente P1.

---

# 38. REGRA DE AUDITORIA DE SEÇÃO

Para cada seção analisada, responder internamente:

### Simplicidade
Tudo que está aqui precisa estar aqui?

### Consistência
Os componentes seguem o sistema?

### Hierarquia
Está claro o que olhar primeiro?

### Balanceamento
O peso visual está distribuído?

### Cor
A atenção está sendo direcionada corretamente?

### Spacing
Os agrupamentos estão claros?

### Affordance
Está claro o que é interativo?

### Motion
O movimento possui função?

### Touch
Funciona sem hover?

### Keyboard
Funciona sem mouse quando aplicável?

### Feedback
Toda ação relevante comunica resultado?

### Recovery
É possível recuperar erros?

### Responsive
Funciona corretamente em diferentes larguras e métodos de entrada?

---

# 39. CHECKLIST OBRIGATÓRIO PARA COMPONENTES INTERATIVOS

Antes de considerar um componente concluído, validar:

[ ] default
[ ] hover quando suportado
[ ] focus
[ ] keyboard
[ ] touch
[ ] active
[ ] disabled quando necessário
[ ] loading quando necessário
[ ] error quando necessário
[ ] success quando necessário
[ ] responsive
[ ] hit area adequada
[ ] contraste adequado
[ ] reduced motion
[ ] sem layout shift desnecessário
[ ] feedback perceptível

---

# 40. CHECKLIST DE MOBILE

Validar:

[ ] nenhuma ação primária depende de hover
[ ] targets adequados
[ ] sem ações inacessíveis
[ ] menus cabem no viewport
[ ] dropdowns reposicionam corretamente
[ ] conteúdo não depende de desktop layout
[ ] cards continuam legíveis
[ ] CTAs continuam acessíveis
[ ] textos mantêm hierarquia
[ ] não existe overflow horizontal acidental

---

# 41. CHECKLIST DE FORMULÁRIO

Validar:

[ ] labels claros
[ ] keyboard navigation
[ ] focus visível
[ ] validação inicial no momento adequado
[ ] erro não aparece prematuramente
[ ] erro desaparece quando corrigido
[ ] feedback positivo quando útil
[ ] submit preserva dados
[ ] primeiro erro é localizável
[ ] mensagens explicam correção
[ ] estado loading existe quando necessário
[ ] sucesso é comunicado

---

# 42. CHECKLIST DE AÇÕES DESTRUTIVAS

Antes de implementar confirmação, perguntar:

1. A ação é reversível?
2. Pode existir Undo?
3. Pode existir Trash?
4. Pode existir Restore?
5. Existe histórico?

Se for reversível:

preferir recuperação.

Se for realmente irreversível:

adicionar fricção proporcional.

---

# 43. ORDEM DE DECISÃO DE UX

Ao projetar ou refatorar qualquer componente, seguir:

1. definir tarefa;
2. remover o desnecessário;
3. estabelecer hierarquia;
4. selecionar componente correto;
5. aplicar tokens;
6. definir estados;
7. garantir affordance;
8. garantir touch;
9. garantir keyboard;
10. adicionar feedback;
11. adicionar recovery;
12. definir motion;
13. validar responsive;
14. validar acessibilidade;
15. validar consistência com o restante do projeto.

---

# 44. PRINCÍPIOS-MÃE

Todo trabalho de UX/UI deve respeitar os seguintes princípios:

1. simplicidade antes de excesso;
2. clareza antes de decoração;
3. consistência antes de novidade;
4. hierarquia antes de densidade;
5. função antes de animação;
6. feedback antes de silêncio;
7. recuperação antes de confirmação excessiva;
8. acessibilidade antes de dependência do mouse;
9. contexto antes de regra mecânica;
10. sistema antes de exceção;
11. conteúdo antes de ornamento;
12. tarefa antes de recurso;
13. comportamento antes de aparência;
14. peso visual proporcional à importância;
15. fricção proporcional ao risco.

---

# 45. REGRA FINAL

Nenhuma melhoria visual deve piorar:

- clareza;
- performance;
- acessibilidade;
- responsividade;
- navegação;
- legibilidade;
- previsibilidade;
- recuperação de erro;
- conclusão da tarefa.

Nenhuma animação deve existir apenas para chamar atenção.

Nenhum componente deve ser criado isoladamente sem considerar o sistema.

Nenhuma ação primária deve depender de hover.

Nenhum estado crítico deve depender somente de cor.

Nenhuma operação reversível deve receber fricção desnecessária.

Nenhuma operação irreversível deve acontecer de forma casual.

Nenhuma interface deve mostrar complexidade apenas porque o sistema possui essa complexidade.

A interface deve apresentar ao usuário apenas a complexidade necessária para a decisão atual.

---

# 46. PROCEDIMENTO DE AUDITORIA DO REPOSITÓRIO

Ao receber um repositório:

1. mapear páginas e componentes;
2. identificar padrões compartilhados;
3. identificar inconsistências;
4. localizar duplicações;
5. localizar estilos arbitrários;
6. identificar problemas de hierarquia;
7. verificar densidade;
8. verificar excesso de controles;
9. avaliar navegação;
10. testar dropdowns;
11. testar switches;
12. testar formulários;
13. testar hover;
14. testar touch;
15. testar keyboard;
16. testar focus;
17. testar ações destrutivas;
18. testar feedback;
19. testar estados;
20. testar responsividade;
21. testar motion;
22. verificar reduced motion;
23. verificar overflow;
24. verificar layout shift;
25. verificar tokens;
26. verificar radius;
27. verificar spacing;
28. verificar iconografia;
29. verificar uso de cor;
30. verificar contraste;
31. verificar CTAs;
32. verificar recuperação de erros.

Não modificar automaticamente tudo que for diferente.

Primeiro determinar se existe um problema real.

---

# 47. CLASSIFICAÇÃO DOS PROBLEMAS

Classificar achados como:

CRITICAL
Impede tarefa, acesso ou operação.

HIGH
Gera erro relevante, confusão ou bloqueio.

MEDIUM
Reduz qualidade de UX ou consistência.

LOW
Refinamento visual ou técnico.

COSMETIC
Não afeta significativamente a experiência.

---

# 48. REGRA DE CORREÇÃO

Priorizar:

1. funcionalidade;
2. acessibilidade;
3. tarefa;
4. clareza;
5. responsive;
6. feedback;
7. consistência;
8. performance;
9. motion;
10. refinamento visual.

Nunca inverter essa prioridade apenas para deixar a página mais "bonita".

---

# 49. CRITÉRIO DE CONCLUSÃO

Uma interface só deve ser considerada concluída quando:

- a tarefa principal estiver clara;
- a ação principal estiver clara;
- os componentes seguirem o sistema;
- o layout possuir hierarquia;
- a composição estiver equilibrada;
- a cor comunicar prioridade;
- o touch funcionar;
- o teclado funcionar quando aplicável;
- o focus estiver visível;
- os estados estiverem implementados;
- o feedback estiver implementado;
- erros forem recuperáveis quando possível;
- ações destrutivas possuírem proteção proporcional;
- o responsive estiver funcional;
- motion tiver função;
- reduced motion for respeitado;
- não houver complexidade desnecessária.

---

# 50. DIRETRIZ CENTRAL

O objetivo não é produzir uma interface com mais efeitos.

O objetivo é produzir uma interface que pareça simples porque o sistema resolveu a complexidade por trás dela.

O usuário deve conseguir:

entender
→ decidir
→ agir
→ receber feedback
→ continuar

com o mínimo de esforço cognitivo e operacional possível.

Use este documento como regra permanente para todas as decisões futuras de UX/UI.
