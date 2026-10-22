final result: blocked

Verificação de código concluída: 32 testes aprovados, incluindo arraste no modelo de dados, preservação das conexões e navegação por texto em prévia/exportação com clique, Enter e Espaço. As 28 imagens geradas foram inspecionadas individualmente. Todos os caminhos de imagens foram verificados e não restam recortes de capturas nos blocos.

Validação visual do editor e gestos reais de arraste pendente: control-browser indisponível no ambiente gerenciado. Não foi executado navegador alternativo. Conferir o fluxo completo em desktop, zoom e rolagem; resoluções 347/529/713/887/1113/1371 px e texto a 200%.

1.8.1: testes adicionais da seleção de botões sem edição e da posição dos conectores junto aos elementos em dois níveis de zoom.

1.8.2: biblioteca agrupada por tipo, pan com botão do meio atravessando iframes, drop com atualização incremental de uma única prancheta, bloqueio de clique-adicionar quando há seção selecionada e remoção em uma única ação. Validação de código concluída. A tentativa de smoke test headless foi bloqueada pela política do ambiente para acesso do navegador ao servidor local; a validação funcional automatizada permanece em 32/32 testes.

1.8.3: scroll/rodinha no canvas convertido em zoom in/out ancorado no cursor, inclusive sobre conteúdo das pranchetas em iframe; botão do meio continua dedicado ao pan e painéis laterais preservam rolagem normal.

1.8.4: pranchetas tratadas como nodes. Inspector lateral direito removido da interface; ações de página migradas para ícones no cabeçalho do node; ações de seção aparecem contextualmente no node selecionado. Adicionados Mute, Collapse, menu Add pesquisável (Shift+A), criação automática de destino ao soltar conexões no vazio, socket compacto para sequência de seções e node especial Prototype Output/Viewer. Mute preserva o node no mapa e omite seu conteúdo da composição de saída. Zoom baixo aplica compactação visual automática aos nodes não selecionados.

1.8.5: menu lateral esquerdo minimizável no desktop; a aba Prancheta deixou de listar páginas/modelos e agora mostra apenas controles do node selecionado, seções e configurações globais. A biblioteca de modelos permanece exclusivamente na aba Blocos. O gesto antigo de arrastar um node para o menu para ocultá-lo foi removido, e nodes ocultos por versões anteriores voltam ao canvas na migração inicial.

1.8.7: Delete/Backspace exclui o node de página quando o node (e não uma seção/elemento interno) está selecionado; modo escuro persistente adicionado ao chrome do editor; conexões de sequência ganharam endpoint próprio arrastável/teclável para reconectar ou desconectar sem iniciar drag da seção.

1.10: 44 testes automatizados aprovados; build estático gerado. Câmera sem limites de posição, prévia fixa e 84 skeletons vetoriais específicos. Validação de gestos e apresentação em navegador permanece pendente.

1.10.1: diagnóstico pela captura do usuário — botão de expandir sem classe ocupava uma célula da grade. Classes recuperadas; menu e canvas agora têm linha/coluna explícitas e auxiliares ficam fora do fluxo. Validação visual no navegador ainda pendente.

1.12.1: centralizar usa limites das seções visíveis; switch desktop/mobile altera só as prévias; botão de recolher contido no menu. 57 testes aprovados; validação visual no navegador pendente.

1.14.0: nodes compactos, exemplos originais, sockets individuais por imagem e grupos recolhíveis. 60 testes aprovados; validação visual no navegador pendente.
