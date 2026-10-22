# Formato `.forma.json` — versão 1

Um projeto descreve a montagem e não depende das posições das pranchetas para gerar o site.

```json
{
  "version": 1,
  "name": "Meu site",
  "home": "home",
  "pages": [
    {
      "id": "home",
      "name": "Início",
      "slug": "inicio",
      "x": 100,
      "y": 130,
      "width": 1200,
      "blocks": [
        {
          "id": "home-hero",
          "blockId": "form-01",
          "html": "<section class=\"hero\"><h1 data-node=\"n1\">Meu título</h1></section>"
        }
      ]
    }
  ],
  "links": []
}
```

`home` referencia a página que será exportada como `index.html`. Cada outra página tem um `slug` exclusivo. `width` aceita 390, 768 ou 1200 e controla a prancheta de edição; o HTML final é responsivo. `x` e `y` são coordenadas do mapa.

Cada instância de bloco tem um `id` próprio. `blockId` referencia o catálogo e `html` armazena o conteúdo editado. Os atributos `data-node` identificam elementos de maneira estável dentro de cada bloco.

Uma conexão em `links` contém `fromPage`, `block`, `node` e `toPage`. Uma origem só pode apontar para um destino; repetir a ligação substitui a anterior. Ao exportar, o destino é convertido no caminho relativo da página. A posição visual das pranchetas não é incorporada ao layout do site.

As imagens enviadas são data URLs. Isso mantém o projeto portátil, mas aumenta o JSON; prefira WebP otimizado. O armazenamento local é um rascunho, enquanto o JSON baixado é o arquivo a guardar e versionar.


## Sequências de pranchetas

O campo opcional `sequences` diferencia montagem de página e navegação. Projetos antigos sem esse campo continuam válidos.

```json
"sequences": [
  {"from": "hero", "to": "quartos"},
  {"from": "quartos", "to": "comodidades"}
]
```

Os IDs são de pranchetas (`pages[].id`). A exportação percorre cada cadeia e concatena seus blocos em um único HTML. Não são permitidos ciclos, saídas múltiplas ou entradas múltiplas. `links` continua descrevendo navegação por clique; os destinos são convertidos em arquivo + âncora quando apontam para uma prancheta dentro de uma cadeia. Excluir uma prancheta remove suas conexões de sequência e navegação.

A edição mantém cada prancheta flutuante. A montagem só é aplicada à prévia navegável e à exportação; o JSON preserva a organização do mapa.

## Estilos globais (1.9.3)

Quando o node `CSS · Estilos` é adicionado, o projeto pode conter `styleTokens`. Ele armazena somente as escolhas de tipografia e os valores de cor; chaves de API não fazem parte do arquivo.

```json
"styleTokens": {
  "headingFont": "Playfair Display",
  "bodyFont": "DM Sans",
  "palette": {
    "background": "#fafafa",
    "surface": "#f0f0f0",
    "text": "#202020",
    "primary": "#6547d8",
    "accent": "#249b7e"
  },
  "locks": {"primary": true},
  "huemintMode": "transformer",
  "temperature": 1.2
}
```

Na prévia/exportação, as fontes são carregadas pela Google Fonts CSS2 API e os valores viram variáveis CSS `--forma-color-*` e `--forma-font-*`. O Huemint é consultado apenas durante a edição; a paleta retornada é salva no JSON e não gera dependência de runtime no site publicado.


## Nodes de imagem e ligações visuais (1.9.4)

O editor pode persistir `imageNodes` e `imageLinks` como metadados do grafo. Cada `imageNode` mantém o asset de uma imagem separado da seção; `imageLinks` associa o node a um slot identificado por `pageId|blockId|data-node`. A desconexão não apaga o asset: o HTML do slot recebe `assets/wireframe-placeholder.png` até o node ser reconectado.

Esses metadados pertencem ao editor. O HTML exportado continua sendo derivado das seções compostas. Sequência de página, navegação de protótipo, imagem e Prototype Preview são representados por fios entre sockets reais no canvas.


## Conexões elemento → elemento (1.9.5)

As ligações de protótipo continuam em `links`, mas agora podem registrar um destino exato:

```json
{
  "fromPage": "secao-a",
  "block": "bloco-a",
  "node": "n12",
  "toPage": "secao-b",
  "toBlock": "bloco-b",
  "toNode": "n7",
  "side": "right"
}
```

`toBlock` e `toNode` são opcionais para compatibilidade com projetos antigos. Quando presentes, Testar e Exportar navegam para o arquivo/seção correta e restauram o elemento alvo. No canvas do Protótipo, o socket esquerdo é entrada e o direito é saída.

Os `imageNodes` continuam persistidos separadamente, mas são apenas dependências de Design. Ao alternar para Protótipo, a camada desses nodes é recolhida visualmente; os assets e posições não são alterados e reaparecem ao retornar a Design.
