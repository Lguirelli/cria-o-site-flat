# Responsividade — 1.16.0

Pranchetas do canvas usam 1440 px como referência desktop. A altura acompanha o conteúdo. O zoom só reduz a representação no canvas. As prévias usam 1440 px (desktop) ou 390 px (mobile), enquanto o HTML se adapta continuamente ao espaço disponível.

Colunas usam auto-fit/minmax; fontes e espaçamentos usam clamp; navegação e controles permitem quebra. A barra do editor informa sua altura real ao menu móvel. O arquivo responsive.css acompanha a exportação.

## Verificação
63 testes automatizados aprovados. A revisão Playwright foi tentada, mas o Chromium não está instalado. Os downloads retornaram arquivos inválidos e a inicialização do navegador falhou. Portanto, não há aprovação visual nem garantia de ausência de problemas em todas as larguras.

O script scripts/review-responsive.mjs cobre 89 seções e 22 modelos em 320, 390, 480, 600, 768, 1024, 1280, 1440 e 1920 px, além do editor em seis larguras. Detecta overflow horizontal, verifica as dimensões do editor e registra capturas e resultados em qa-responsive.

## Executar em ambiente com Chromium disponível
1. npm install
2. npx playwright install chromium
3. npm run dev -- --port 4184
4. Em outro terminal: npm run review:responsive

O teste utiliza o servidor local na porta 4184. FORMA_REVIEW_URL permite alterar esse endereço. Nenhuma captura de navegador foi gerada nesta revisão, porque a inicialização falhou.
