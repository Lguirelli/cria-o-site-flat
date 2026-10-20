# Análise e reconstrução dos rodapés

A imagem enviada apresenta quatro rodapés visíveis, apesar do título mencionar “10+”. Foram reconstruídas as quatro opções mostradas; o fundo verde e o título da apresentação não fazem parte dos blocos.

| Bloco | Estrutura e hierarquia | Direção visual | Reconstrução |
| --- | --- | --- | --- |
| Solitude Press | Marca e apresentação à esquerda; três colunas Explore, Company e Support; linha divisória; copyright e links legais | Creme, marrom, marca editorial, espaçamento generoso | Quatro colunas no desktop, apresentação em largura total e navegação em duas colunas no celular. Logo tipográfico e símbolo de livro via Google Fonts. |
| TechFlow | Apresentação compacta e redes sociais; Products, Company e Resources; direitos, status e políticas na base | Carvão, cinza e amarelo; títulos destacados com ícones | Paleta escura preservada; ícones de produtos, empresa e documentação em Material Symbols. Indicador de status demonstrativo e textos editáveis. |
| TravelCo | Apresentação com endereço, telefone, e-mail e redes; Quick Links, Top Destinations, Support; selos; políticas e pagamentos | Fundo claro com tonalidade verde, acentos turquesa, maior densidade de informação | Contatos com links tel/mailto, selos como componentes editáveis e pagamentos como etiquetas de texto. No mobile, colunas reorganizadas e faixa inferior empilhada. |
| AI Platform | Marca e apresentação; Products, Company e Resources; redes; divisão legal e selos de segurança | Azul-marinho, branco e turquesa; linhas discretas | Quatro colunas, navegação clara, links sociais de texto e símbolos Google Fonts para segurança e marca. Selos reproduzidos como conteúdo demonstrativo. |

## Elementos editáveis

Nome, assinatura da marca, apresentação, títulos das colunas, itens de navegação, contatos, redes, políticas, copyright, status e selos. Cores e espaçamentos podem ser alterados no inspetor. Os links podem receber URLs ou ser ligados visualmente a pranchetas pelo modo Protótipo.

## Wireframes SVG

Cada rodapé tem uma miniatura própria em `thumbnails/footer-*.svg`, com área de marca, apresentação, colunas de links e faixa inferior. TravelCo inclui a densidade extra de contatos e selos; AI Platform inclui a faixa de segurança. Os arquivos são vetoriais, sem fotografias incorporadas.

## Aproximações

A imagem tem resolução limitada, principalmente nos textos pequenos. Títulos e estrutura foram preservados; textos secundários foram transcritos quando legíveis e completados de forma coerente quando necessário. Fontes são aproximações usando as famílias já presentes no projeto. Ícones sociais e logotipos de pagamento não foram redesenhados: foram substituídos por nomes editáveis, mantendo os ícones de interface no Google Fonts.

## Integração

Os quatro blocos usam a categoria `footer` e temas independentes. As pranchetas permanecem separadas para edição. Uma conexão verde a partir do bloco anterior incorpora o rodapé ao HTML da página na exportação. As conexões roxas dos links permanecem funcionais entre páginas ou seções. O código inclui estilos responsivos; a inspeção visual no navegador continua pendente neste ambiente.
