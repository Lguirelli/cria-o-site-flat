# Forma Studio — pranchetas e globais

Execute `npm run dev` e abra `http://localhost:4173`. Não é necessário instalar dependências.

- As 96 pranchetas ficam disponíveis por padrão. **Organizar todas as pranchetas** mostra as ocultas e distribui por referência; depois do carregamento, pode ser usado novamente para considerar as alturas medidas.
- Em **Header e footer globais**, escolha os blocos compartilhados. **Editar header/footer** abre sua prancheta de origem. As alterações são aplicadas em **Testar** e **Exportar**, substituindo outros blocos da mesma categoria. As pranchetas de seção continuam isoladas para edição.
- Em **Protótipo**, selecione um elemento. Os dois conectores laterais aparecem alinhados a ele, com uma linha indicando sua origem. Arraste até a página de destino. Também é possível escolher destino e lado em Propriedades.
- Para desconectar, arraste a ponta da ligação para o espaço vazio do mapa ou escolha **Sem ligação**. O conector verde inferior continua unindo seções da mesma página.
- Painéis recolhíveis em telas estreitas, controles acessíveis sem hover, largura livre entre 320 e 1920 px e CSS compartilhado entre landing, seções e site exportado.
- **Desfazer** recupera alterações, exclusões e reorganização. Salve o JSON para levar o projeto a outro navegador.

Validação: 32 testes automatizados aprovados; ZIP extraído e comparado byte a byte. A inspeção visual e gestual em navegador, zoom de texto e a matriz completa de larguras/alturas dos documentos de regras permanecem pendentes. As regras originais estão em `docs/`.

A entrada `forma-studio/` redireciona ao editor principal para evitar duas versões de interface. Nenhuma publicação GitHub foi realizada.

---

# Forma Studio — construtor principal

Este pacote corrige a organização da entrega anterior. O `index.html` da raiz é o **Forma Studio**. A landing enviada é material de origem, guardado em `fontes/landing/`, e suas **14 seções foram integradas como blocos editáveis**.

## Abrir

Execute `npm run dev` nesta pasta e abra `http://localhost:4173/`. O endereço `/COMECE-AQUI.html` também abre o construtor. Requer Node.js 20 ou superior e não precisa instalar dependências.

## Encontrar as seções da landing enviada

Na aba **Blocos**, escolha **Landing IA · Repositório enviado** no filtro de referência. São 14 opções: cabeçalho, abertura com pato amarelo, guias editoriais, problema, benefícios, processo, caso de uso, comparação, serviços, diagnóstico, FAQ, chamada final, rodapé e pilares do blog.

Para inserir a landing completa, selecione a prancheta e escolha **Landing IA · Repositório decomposto** em **Inserir modelo completo**. O modelo reúne as 13 seções da página inicial; os pilares do blog são uma opção adicional.

Também é possível importar `examples/landing-ia.forma.json`, já com as 13 pranchetas conectadas em uma página. A primeira aparece no mapa; as demais ficam guardadas no menu e podem ser abertas pelo nome.

O construtor mantém os ajustes de conexão lateral por elemento, desconexão por arraste e ocultação de pranchetas no menu. No total há **96 blocos e 19 modelos**, incluindo as dez referências visuais reconstruídas anteriormente.

## Estrutura

- `index.html`, `editor.js`, `editor.css`: construtor principal.
- `blocks/landing-ia-*.html`: 14 seções decompostas do repositório enviado.
- `landing-sections.css`: CSS da landing adaptado e limitado a `.lp-section`, incluindo suporte aos IDs renomeados durante a exportação.
- `landing-runtime.js`: interações adaptadas de menu, pilares e formulário. O conteúdo é incorporado em `runtime.js` para funcionar na exportação local.
- `fontes/landing/`: cópia do repositório de origem para consulta e para os links de páginas de serviço/blog.
- `biblioteca/`: galeria opcional das dez referências visuais; a entrada principal continua sendo o construtor.

As fotografias do pato e o SVG original acompanham os blocos. Os pilares do blog conservam as URLs externas já presentes no repositório; podem ser trocadas por arquivos enviados pelo editor. O formulário integrado é demonstrativo e não transmite dados. O menu recebe links estáticos editáveis em vez de depender da montagem global do JavaScript original.

## Validação

`npm run check`: 22 testes, incluindo entrada principal, registro dos 14 blocos, arquivos da exportação e montagem das 13 seções em uma página. Também foram conferidas a sintaxe do código novo e a estrutura dos SVGs. A inspeção visual no navegador permanece pendente neste ambiente.

Para publicar o construtor no GitHub Pages, use o conteúdo desta pasta na raiz do repositório. O workflow existente prepara o editor em `dist/`; a landing de referência não substitui a página inicial do construtor.
