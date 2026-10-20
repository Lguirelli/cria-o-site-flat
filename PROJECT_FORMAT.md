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
