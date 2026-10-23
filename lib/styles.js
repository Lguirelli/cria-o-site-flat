export const STYLE_FIELDS={titleFont:'Fonte do título',subtitleFont:'Fonte do subtítulo',bodyFont:'Fonte do corpo',titleSize:'Título (px)',subtitleSize:'Subtítulo (px)',bodySize:'Corpo (px)',background:'Fundo',surface:'Superfícies',text:'Texto',heading:'Títulos',primary:'Botões / destaque',accent:'Acento',onPrimary:'Texto dos botões'};

export function connectedSectionIds(project,pageId){
 const edges=project.styleSourceSequences||project.sequences||[],known=(project.pages||[]).map(p=>p.id);for(const e of edges)known.push(e.from,e.to);for(const n of project.styleNodes||[])known.push(...(n.targets||[]));const ids=new Set(known);if(!ids.has(pageId))return[];
 const queue=[pageId],seen=new Set();
 while(queue.length){const id=queue.shift();if(seen.has(id)||!ids.has(id))continue;seen.add(id);for(const e of edges){if(e.from===id&&!seen.has(e.to))queue.push(e.to);if(e.to===id&&!seen.has(e.from))queue.push(e.from)}}
 return[...seen];
}
function componentStyleNodes(project,pageId){const component=new Set(connectedSectionIds(project,pageId));return(project.styleNodes||[]).filter(n=>(n.targets||[]).some(id=>component.has(id)))}

export function validateStyles(project){
 const ids=new Set();if(project.styleNodes!==undefined&&!Array.isArray(project.styleNodes))throw Error('Nodes CSS inválidos');
 for(const n of project.styleNodes||[]){if(!n||typeof n.id!=='string'||ids.has(n.id)||typeof n.name!=='string'||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!n.values||typeof n.values!=='object'||!Array.isArray(n.targets)||n.targets.some(id=>!project.pages.some(p=>p.id===id)))throw Error('Node CSS inválido');ids.add(n.id);for(const [k,v] of Object.entries(n.values)){if(!(k in STYLE_FIELDS)||typeof v!=='string'||v.length>150)throw Error('Valor de estilo inválido')}}
 const assigned=new Set();for(const n of project.styleNodes||[])for(const id of n.targets){if(assigned.has(id))throw Error('Uma seção só pode ter um node CSS');assigned.add(id)}
 // A connected sequence is one visual CSS context. This avoids ambiguous cascades when
 // two different style nodes are attached to different sections of the same chain.
 const checked=new Set();for(const page of project.pages||[]){if(checked.has(page.id))continue;const component=connectedSectionIds(project,page.id);component.forEach(id=>checked.add(id));const owners=new Set();for(const n of project.styleNodes||[])if((n.targets||[]).some(id=>component.includes(id)))owners.add(n.id);if(owners.size>1)throw Error('Seções conectadas devem compartilhar um único node CSS.')}
}
export function styleNodeForPage(project,pageId){
 const direct=(project.styleNodes||[]).find(n=>(n.targets||[]).includes(pageId));if(direct)return direct;
 return componentStyleNodes(project,pageId)[0]||null;
}
export function stylesForBlock(project,block){const page=(project.styleSourcePages||project.pages).find(p=>p.blocks.some(b=>b.id===block.id));return page?styleNodeForPage(project,page.id)?.values||{}:{}}
export function styleCSS(v,scope){
 const rules=[];const font=x=>typeof x==='string'&&/^[a-zA-Z0-9 ,"'-]+$/.test(x)?x:'';const color=x=>/^#[0-9a-f]{6}$/i.test(x||'')?x:'';const size=x=>Number(x)>=8&&Number(x)<=240?Number(x)+'px':'';
 const value={bodyFont:font(v.bodyFont),titleFont:font(v.titleFont),subtitleFont:font(v.subtitleFont),bodySize:size(v.bodySize),titleSize:size(v.titleSize),subtitleSize:size(v.subtitleSize),background:color(v.background),surface:color(v.surface),text:color(v.text),heading:color(v.heading),primary:color(v.primary),accent:color(v.accent),onPrimary:color(v.onPrimary)};
 const declarations=(pairs)=>Object.entries(pairs).filter(([,val])=>val).map(([prop,val])=>`${prop}:${val}!important`).join(';');
 const add=(sel,pairs)=>{const body=declarations(pairs);if(body)rules.push(`${sel}{${body}}`)};const select=s=>s.split(',').map(x=>scope+' '+x.trim()).join(',');
 // Expose the palette as tokens and also overwrite the variable systems used by the
 // reference sections. Applying a style node therefore themes the complete connected section,
 // rather than only a few hand-picked labels/buttons.
 add(`${scope},${select('.nr-section')}`,{
  '--forma-color-background':value.background,'--forma-color-surface':value.surface,'--forma-color-text':value.text,'--forma-color-primary':value.primary,'--forma-color-accent':value.accent,
  '--forma-font-heading':value.titleFont,'--forma-font-body':value.bodyFont,
  '--nr-bg':value.background,'--nr-fg':value.text,'--nr-muted':value.text,'--nr-card':value.surface,'--nr-accent':value.primary,'--nr-line':value.accent
 });
 add(scope,{'background-color':value.background,'color':value.text,'font-family':value.bodyFont});
 add(select('section,header,footer,main'),{'background-color':value.background,'color':value.text});
 add(select('*'),{'color':value.text});
 add(select('*:not(.icon):not([class*="material-symbols"])'),{'font-family':value.bodyFont});
 add(select('p,li,label,input,textarea,select,button,a,small'),{'font-size':value.bodySize});
 add(select('h1,h2,[data-style-role="title"]'),{'font-family':value.titleFont,'font-size':value.titleSize,'color':value.heading||value.text});
 add(select('h3,h4,h5,h6,.subtitle,[data-style-role="subtitle"]'),{'font-family':value.subtitleFont||value.titleFont,'font-size':value.subtitleSize,'color':value.heading||value.text});
 add(select('.card,article,.panel,[data-style-role="surface"],input,textarea,select'),{'background-color':value.surface});
 add(select('button,.btn,[role="button"],.nr-button'),{'background-color':value.primary,'border-color':value.primary,'color':value.onPrimary});
 add(select('button *,.btn *,.nr-button *'),{'color':value.onPrimary});
 add(select('a:not(.btn):not(.nr-button),[data-style-role="accent"]'),{'color':value.accent});
 return rules.join('\n');
}
