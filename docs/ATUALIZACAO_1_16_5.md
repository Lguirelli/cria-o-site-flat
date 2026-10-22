# Forma Studio 1.16.5

- Restaura a arquitetura de sockets tipados por função.
- Imagens permanecem como nodes auxiliares organizados à esquerda da seção.
- Sockets: sequência (verde), imagem (laranja), CSS (teal) e protótipo/output (roxo).
- Conexões de sequência e CSS usam os sockets reais dos nodes, sem endpoint SVG flutuante.
- Ao desconectar imagem, o slot gerenciado retorna ao placeholder wireframe com X; o node e o asset continuam disponíveis para reconexão.
- No modo Protótipo, nodes de imagem recolhem automaticamente e os elementos renderizados podem ser origem/destino de navegação.
- Destinos de protótipo podem registrar o elemento exato (`toBlock` + `toNode`).
- Botão do meio + arraste restaura navegação livre do canvas, inclusive sobre nodes; Space + arraste continua disponível.
- Scroll/rodinha continua controlando zoom da área de criação.
