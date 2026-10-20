# Análise das 14 referências e reconstrução

Foram analisadas as imagens originais, retirando da reconstrução molduras de navegador, dispositivos e fundos de apresentação. Resultado: 56 seções novas, preservando os 28 blocos anteriores.

## Critérios comuns

- HTML semântico separado por seção; textos e botões editáveis.
- Tradução PT-BR de 259 textos. Nomes de marcas, pessoas e produtos preservados. Textos ilegíveis não foram apresentados como transcrição exata: são indicados como demonstrativos.
- Imagens visuais usam janelas CSS sobre os arquivos de referência originais. Não são imagens independentes de alta resolução. Substituir a imagem pelo inspetor remove a janela de recorte. Rótulos incorporados às fotografias e embalagens permanecem na imagem original.
- Ícones funcionais usam Material Symbols, do Google Fonts. Os SVGs são diagramas estruturais, sem redesenhar os ícones.
- Estrutura do SVG aproxima hierarquia e proporções; não é uma cópia fotográfica.
- Grades adaptam colunas, tipografia usa limites fluidos; tabelas e galerias têm rolagem intencional.
- Conteúdo de navegação sem destino visível na captura permanece configurável no editor; não foram inventadas páginas externas.
- FAQ e abas funcionam; lista de produtos é demonstração local; a capa de vídeo não simula um vídeo inexistente.

## Fulfillix

Imagem: `image(20261020-190533).png`. Tema light; destaque `#d1ff8e`.

Página longa branca, painéis pretos arredondados e destaque verde-lima. Quatro dores, benefícios em lista, prova social e duas chamadas finais.

- **Mapa e promessa de fulfillment** — composição `map`; HTML em `blocks/r20-fulfillix-hero.html`; wireframe em `wireframes/r20-fulfillix-hero.svg`.
- **Quatro dores de operação** — composição `cards4`; HTML em `blocks/r20-fulfillix-problems.html`; wireframe em `wireframes/r20-fulfillix-problems.svg`.
- **Proposta e três soluções** — composição `splitlist`; HTML em `blocks/r20-fulfillix-solutions.html`; wireframe em `wireframes/r20-fulfillix-solutions.svg`.
- **Por que Fulfillix — imagem e lista** — composição `splitlist`; HTML em `blocks/r20-fulfillix-why.html`; wireframe em `wireframes/r20-fulfillix-why.svg`.
- **Depoimentos em três cartões** — composição `cards3`; HTML em `blocks/r20-fulfillix-reviews.html`; wireframe em `wireframes/r20-fulfillix-reviews.svg`.
- **Processo de onboarding** — composição `steps`; HTML em `blocks/r20-fulfillix-steps.html`; wireframe em `wireframes/r20-fulfillix-steps.svg`.
- **FAQ em quatro colunas** — composição `faq`; HTML em `blocks/r20-fulfillix-faq.html`; wireframe em `wireframes/r20-fulfillix-faq.svg`.
- **Conversão com duas opções** — composição `cards2`; HTML em `blocks/r20-fulfillix-journey.html`; wireframe em `wireframes/r20-fulfillix-journey.svg`.
- **Chamada final de operação** — composição `cta`; HTML em `blocks/r20-fulfillix-cta.html`; wireframe em `wireframes/r20-fulfillix-cta.svg`.
- **Footer Fulfillix** — composição `footer`; HTML em `blocks/r20-fulfillix-footer.html`; wireframe em `wireframes/r20-fulfillix-footer.svg`.

## Design · Escultura

Imagem: `image(20261020-190546).png`. Tema dark; destaque `#ef4049`.

Hero horizontal em duas metades; texto à esquerda, escultura vermelha à direita, navegação superior e indicador 01/03.

- **Navegação Design** — composição `nav`; HTML em `blocks/r20-statue-header.html`; wireframe em `wireframes/r20-statue-header.svg`.
- **Hero escultura vermelha** — composição `split`; HTML em `blocks/r20-statue-hero.html`; wireframe em `wireframes/r20-statue-hero.svg`.

## Apex · Bloodhound

Imagem: `image(20261020-190611).png`. Tema light; destaque `#b63725`.

Navegação no topo e composição em três colunas: nome, personagem central e descrição com três habilidades.

- **Navegação Apex** — composição `nav`; HTML em `blocks/r20-apex-header.html`; wireframe em `wireframes/r20-apex-header.svg`.
- **Personagem e habilidades em três colunas** — composição `triple`; HTML em `blocks/r20-apex-hero.html`; wireframe em `wireframes/r20-apex-hero.svg`.

## Folioblox

Imagem: `image(20261020-190617).png`. Tema dark; destaque `#ff6b19`.

Abertura com retrato e título sobreposto, quatro especialidades, faixa de marcas e apresentação com três projetos. O título promocional externo não pertence à página.

- **Navegação Folioblox** — composição `nav`; HTML em `blocks/r20-folio-header.html`; wireframe em `wireframes/r20-folio-header.svg`.
- **Diretor criativo com retrato central** — composição `portrait`; HTML em `blocks/r20-folio-hero.html`; wireframe em `wireframes/r20-folio-hero.svg`.
- **Faixa de marcas** — composição `strip`; HTML em `blocks/r20-folio-brands.html`; wireframe em `wireframes/r20-folio-brands.svg`.
- **Manifesto e três projetos** — composição `gallery3`; HTML em `blocks/r20-folio-about.html`; wireframe em `wireframes/r20-folio-about.svg`.

## Kianro

Imagem: `image(20261020-190636).png`. Tema dark; destaque `#e4fca1`.

Identidade em escala grande, seis miniaturas, texto manifesto e quatro métricas assimétricas. A captura termina antes do fim da página.

- **Navegação Kianro** — composição `nav`; HTML em `blocks/r20-kianro-header.html`; wireframe em `wireframes/r20-kianro-header.svg`.
- **Identidade e seis projetos** — composição `gallery6`; HTML em `blocks/r20-kianro-hero.html`; wireframe em `wireframes/r20-kianro-hero.svg`.
- **Manifesto e métricas assimétricas** — composição `stats`; HTML em `blocks/r20-kianro-about.html`; wireframe em `wireframes/r20-kianro-about.svg`.

## Onepoint Design

Imagem: `image(20261020-190716).png`. Tema dark; destaque `#add34f`.

Duas pranchetas editoriais: galeria com colunas de alturas diferentes e composição de resultados com imagem central. Serifada condensada aproximada por Instrument Serif.

- **Editorial Graphic Design** — composição `editorial`; HTML em `blocks/r20-onepoint-gallery.html`; wireframe em `wireframes/r20-onepoint-gallery.svg`.
- **Projeto em números** — composição `triple`; HTML em `blocks/r20-onepoint-numbers.html`; wireframe em `wireframes/r20-onepoint-numbers.svg`.

## Francesco Gioia

Imagem: `image(20261020-190723).png`. Tema dark; destaque `#ffffff`.

Duas telas: abertura tipográfica sobre pilha fotográfica e galeria horizontal com contador e setas. As molduras cinzas externas não fazem parte do conteúdo.

- **Navegação do fotógrafo** — composição `nav`; HTML em `blocks/r20-gioia-header.html`; wireframe em `wireframes/r20-gioia-header.svg`.
- **Tipografia sobre fotografia** — composição `overlay`; HTML em `blocks/r20-gioia-hero.html`; wireframe em `wireframes/r20-gioia-hero.svg`.
- **Galeria horizontal do fotógrafo** — composição `carousel`; HTML em `blocks/r20-gioia-gallery.html`; wireframe em `wireframes/r20-gioia-gallery.svg`.

## Bruno Grazina

Imagem: `image(20261020-190729).png`. Tema dark; destaque `#ff0060`.

Sobre em duas colunas, retrato com colagem à esquerda e apresentação à direita; contato em linha inferior. Grafismos originais ficam no recorte da imagem, ícones funcionais usam fonte.

- **Sobre com colagem e retrato** — composição `split`; HTML em `blocks/r20-bruno-about.html`; wireframe em `wireframes/r20-bruno-about.svg`.
- **Contato do portfólio** — composição `footer`; HTML em `blocks/r20-bruno-contact.html`; wireframe em `wireframes/r20-bruno-contact.svg`.

## Orbit CRM

Imagem: `image(20261020-190810).png`. Tema dark; destaque `#ffffff`.

Hero assimétrico, seis recursos em grade 3×2 e tabela comparativa com coluna central clara. A captura está cortada no início e no final.

- **Hero CRM com IA** — composição `split`; HTML em `blocks/r20-orbit-hero.html`; wireframe em `wireframes/r20-orbit-hero.svg`.
- **Seis recursos de CRM** — composição `cards6`; HTML em `blocks/r20-orbit-features.html`; wireframe em `wireframes/r20-orbit-features.svg`.
- **Tabela CRM inteligente e tradicional** — composição `table`; HTML em `blocks/r20-orbit-comparison.html`; wireframe em `wireframes/r20-orbit-comparison.svg`.

## Onion AI

Imagem: `image(20261020-190818).png`. Tema dark; destaque `#ffffff`.

Hero central imersivo, três benefícios, processo em quatro cards e recursos em grade. Reconstruída apenas a área visível; cards finais parcialmente cortados não foram inventados.

- **Hero modular CORA** — composição `center`; HTML em `blocks/r20-onion-hero.html`; wireframe em `wireframes/r20-onion-hero.svg`.
- **Introdução com três benefícios** — composição `cards3`; HTML em `blocks/r20-onion-intro.html`; wireframe em `wireframes/r20-onion-intro.svg`.
- **Processo em quatro cards** — composição `cards4`; HTML em `blocks/r20-onion-process.html`; wireframe em `wireframes/r20-onion-process.svg`.
- **Recursos CORA** — composição `cards3`; HTML em `blocks/r20-onion-features.html`; wireframe em `wireframes/r20-onion-features.svg`.

## Vellum

Imagem: `image(20261020-190825).png`. Tema dark; destaque `#f1de00`.

Cabeçalho editorial cortado, faixa amarela, projetos 2×2, serviços em linhas e manifesto com métricas. A faixa amarela final aparece parcialmente.

- **Manifesto editorial Vellum** — composição `split`; HTML em `blocks/r20-vellum-hero.html`; wireframe em `wireframes/r20-vellum-hero.svg`.
- **Faixa de especialidades** — composição `strip`; HTML em `blocks/r20-vellum-services-strip.html`; wireframe em `wireframes/r20-vellum-services-strip.svg`.
- **Projetos em grade 2×2** — composição `gallery4`; HTML em `blocks/r20-vellum-work.html`; wireframe em `wireframes/r20-vellum-work.svg`.
- **Serviços em linhas** — composição `rows`; HTML em `blocks/r20-vellum-services.html`; wireframe em `wireframes/r20-vellum-services.svg`.
- **Equipe e quatro números** — composição `stats`; HTML em `blocks/r20-vellum-metrics.html`; wireframe em `wireframes/r20-vellum-metrics.svg`.

## August

Imagem: `image(20261020-190831).png`. Tema dark; destaque `#b3d551`.

Navegação, composição sobre com três fotos e texto gigante, manifesto central e processo vertical alternado. O fio do processo é um diagrama, não um ícone.

- **Navegação August** — composição `nav`; HTML em `blocks/r20-august-header.html`; wireframe em `wireframes/r20-august-header.svg`.
- **Sobre com colagem tipográfica** — composição `collage`; HTML em `blocks/r20-august-about.html`; wireframe em `wireframes/r20-august-about.svg`.
- **Manifesto do coletivo** — composição `statement`; HTML em `blocks/r20-august-manifesto.html`; wireframe em `wireframes/r20-august-manifesto.svg`.
- **Processo vertical alternado** — composição `timeline`; HTML em `blocks/r20-august-process.html`; wireframe em `wireframes/r20-august-process.svg`.

## Pro Peptide

Imagem: `image(20261020-190837).png`. Tema light; destaque `#08b6b0`.

Hero com navegação sobre fotografia, faixa de quatro benefícios, produtos horizontais e prova técnica em duas colunas. Peças são exemplos visuais; não validam alegações científicas.

- **Navegação Pro Peptide** — composição `nav`; HTML em `blocks/r20-peptide-header.html`; wireframe em `wireframes/r20-peptide-header.svg`.
- **Hero de produto e benefícios** — composição `split`; HTML em `blocks/r20-peptide-hero.html`; wireframe em `wireframes/r20-peptide-hero.svg`.
- **Produtos em carrossel** — composição `products`; HTML em `blocks/r20-peptide-products.html`; wireframe em `wireframes/r20-peptide-products.svg`.
- **Qualidade com abas e produto** — composição `quality`; HTML em `blocks/r20-peptide-quality.html`; wireframe em `wireframes/r20-peptide-quality.svg`.

## GeneX

Imagem: `image(20261020-190849).png`. Tema light; destaque `#234674`.

Header, hero, áreas de pesquisa, vídeo, tecnologias, visita, estudos e CTA. O telefone lateral ilustra a adaptação mobile e não é uma segunda seção da página.

- **Navegação GeneX** — composição `nav`; HTML em `blocks/r20-genex-header.html`; wireframe em `wireframes/r20-genex-header.svg`.
- **Hero pesquisa e longevidade** — composição `split`; HTML em `blocks/r20-genex-hero.html`; wireframe em `wireframes/r20-genex-hero.svg`.
- **Áreas de pesquisa e terapia** — composição `cards4`; HTML em `blocks/r20-genex-research.html`; wireframe em `wireframes/r20-genex-research.svg`.
- **Ciência — capa de vídeo** — composição `video`; HTML em `blocks/r20-genex-science.html`; wireframe em `wireframes/r20-genex-science.svg`.
- **Três tecnologias de pesquisa** — composição `gallery3`; HTML em `blocks/r20-genex-technologies.html`; wireframe em `wireframes/r20-genex-technologies.svg`.
- **Visita ao instituto** — composição `video`; HTML em `blocks/r20-genex-visit.html`; wireframe em `wireframes/r20-genex-visit.svg`.
- **Estudos em dois cards** — composição `cards2`; HTML em `blocks/r20-genex-trials.html`; wireframe em `wireframes/r20-genex-trials.svg`.
- **CTA final GeneX** — composição `cta`; HTML em `blocks/r20-genex-cta.html`; wireframe em `wireframes/r20-genex-cta.svg`.

## Verificação

Validação estrutural, SVG/XML, dados de projeto, arquivos de exportação e integridade ZIP. Verificação visual em navegador bloqueada: o ambiente gerenciado não disponibiliza o skill control-browser. Não se declara equivalência pixel a pixel nem aprovação de QA visual.
