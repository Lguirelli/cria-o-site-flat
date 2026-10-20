# Forma Studio — blocos originais, regras atuais

Execute `npm run dev` e abra http://localhost:4173. Não é necessário instalar dependências.

O catálogo contém **28 blocos e 8 modelos** da versão anterior. Os 68 blocos exclusivos da versão mais recente foram removidos, junto com seus modelos e arquivos exclusivos. A comparação completa está em `docs/COMPARACAO.md`.

Mantidos:
- Pranchetas flutuantes e organização de todos os blocos.
- Header e footer globais, editados na origem e compartilhados em Testar/Exportar.
- Conexões dos lados esquerdo e direito vinculadas ao elemento selecionado.
- Desconexão por arraste, seleção de destino pelo painel e sequência inferior de seções.
- Painéis recolhíveis, largura livre de 320 a 1920 px, foco visível e movimento reduzido.
- Regras de UX e responsividade em `docs/`, CSS aplicado a seções e páginas exportadas.

Esta revisão usa um novo rascunho local para não reabrir as 68 seções removidas. O rascunho anterior não é apagado. Projetos JSON com apenas os blocos originais continuam importáveis; projetos que usam blocos removidos precisam ser ajustados antes da importação.

Verificação: `npm run check`. A validação visual em navegador permanece pendente.
