# Adaptação do blog com referência em blog-template-main e imagens Lummi

Este patch mantém o projeto atual em HTML/CSS/JS puro, mas aplica ao blog alguns padrões visuais do repositório de referência:

- listagem em grid com bordas finas, sem cards arredondados pesados;
- imagem no topo de cada card;
- área superior com malha visual suave, título editorial e filtros;
- imagem hero nos artigos internos;
- responsivo com 3 colunas no desktop, 2 no tablet e 1 no mobile.

## Imagens aplicadas por pilar

| Pilar | URL Lummi aplicada | Uso |
|---|---|---|
| Atendimento | `https://assets.lummi.ai/assets/QmSx1XSuYEEyKWSvYLHKxddksup4kCfHhGgdJf18Jr9sV1?auto=format&w=1200` | Cards e artigos de atendimento |
| Conversão | `https://www.lummi.ai/api/pro/image/0d73cd40-9d86-4c56-b165-c5dd1d6cf6f2?asset=original&auto=format&cb=EyAbRM&w=1200` | Cards e artigos de conversão |
| Automação | `https://assets.lummi.ai/assets/QmR5NcFcaU9jQGdPkcxipSad7XRyPSAxt78arDVM9JaudH?auto=format&w=1200` | Cards e artigos de automação |
| Dados | `https://assets.lummi.ai/assets/QmNfrqqBzeX2DLVp9ns8FzjQW9jRpd73XtBm8aekrpogq6?auto=format&w=1200` | Cards e artigos de dados |
| Conteúdo | `https://assets.lummi.ai/assets/QmbPrK6T1umi46S6bc2DTcMmmVcAUc4WjCojpybU2ShZ8k?auto=format&w=1200` | Cards e artigos de conteúdo |

## Observação para produção

As imagens foram mantidas como URLs externas para seguir a lista anterior e evitar aumentar o peso do patch. Para produção, baixe os arquivos no Lummi, salve em `assets/images/blog/` e substitua os `src` por caminhos locais.
