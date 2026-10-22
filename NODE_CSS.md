# Nodes — Forma Studio 1.12.0

## CSS compartilhado
Adicione um node CSS e conecte sua saída verde à entrada CSS da seção. Uma ligação aplica o estilo à sequência inteira de seções da mesma página. Não afeta páginas independentes. Uma conexão direta na seção tem prioridade; nos demais casos vale o node conectado mais próximo na sequência. Desconectar a sequência interrompe a herança.

Campos vazios preservam o original. Fontes devem estar disponíveis no site ou dispositivo. Cores usam #RRGGBB. O seletor no node também permite conectar sem arrastar.

## Imagens
As fotos e fundos de imagem aparecem por padrão como wireframes cinza com diagonais. Adicione um node de imagem, escolha um arquivo (PNG, JPEG, WebP, GIF ou AVIF, até 8 MB) ou informe uma URL. Arraste sua saída amarela até a entrada Imagem da seção. Se houver várias imagens, escolha o espaço no diálogo. Também é possível escolher seção e espaço diretamente no node.

Uma imagem pode ser reutilizada em vários espaços. As imagens importadas são incorporadas ao JSON e à exportação; URLs externas precisam continuar acessíveis. Desconectar ou excluir o node restaura o wireframe. As fotografias originais continuam nos arquivos do catálogo.

## Prototype Output
Começa sem conexão. Arraste a entrada roxa do node até uma seção ou a saída roxa da seção até o node. Para trocar, arraste novamente a entrada até outra seção. Solte no espaço vazio para desconectar. O seletor e o botão de desconectar oferecem as mesmas ações. O botão Testar fica desativado sem conexão. Na primeira abertura desta versão, a ligação automática das versões antigas é removida uma única vez; novas escolhas são salvas.

## Navegação
Botão do meio + arraste usa movimento da tela, sem multiplicar o deslocamento pelo zoom. Arrastar o fundo também navega. A roda usa zoom mais suave, com limite por evento para evitar saltos. O botão Centralizar página recupera a seção ativa.

## Verificação
56 testes automatizados aprovados, incluindo herança de CSS, slots de imagem, desconexão, navegação e exportação. Validação visual no navegador pendente.

## 1.13.0 — Imagens conectadas automaticamente
Cada espaço de imagem descoberto nas seções recebe um node já conectado e inicialmente vazio, preservando o wireframe. Basta selecionar um arquivo ou URL. Nodes existentes e desconexões manuais são preservados. Novos espaços recebem nodes novos. Os nodes são posicionados fora das áreas estimadas das seções.

## 1.14.0 — Imagens compactas e grupos
As imagens de exemplo originais passam a ser o padrão, substituindo o wireframe das versões anteriores. Imagens personalizadas são preservadas. O node mostra apenas nome e miniatura: clique na miniatura para trocar o arquivo. Clique direito no node ou duplo clique no nome abre as opções de URL, nome e exclusão em um diálogo separado.
Cada espaço tem seu próprio conector numerado na seção. Arraste diretamente até o espaço desejado. Recolher a seção também oculta seus nodes de imagem e as linhas internas; expandir restaura tudo. Ao mover um grupo recolhido, seus nodes exclusivos acompanham o deslocamento. Uma imagem compartilhada continua visível quando outra seção conectada permanece expandida.
